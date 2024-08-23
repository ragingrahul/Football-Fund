// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { MessagingParams, MessagingFee, MessagingReceipt } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import { OApp, Origin, MessagingFee } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract PredictEduChain is OApp {

    using OptionsBuilder for bytes;
    
    uint16 public destChainId;

    uint256 private constant MIN_WAGER=0.5 ether;
    uint256 private constant MAX_WAGER=2 ether;
    uint256 private constant GAME_RESOLVE_DELAY= 2 hours;

    mapping(uint256 => Game) private games;
    mapping(address => mapping(uint256 => Prediction[])) private predictions;

    mapping(uint256 => bytes32) private pendingRequests;

    uint256[] private activeGames;
    uint256[] private resolvedGames;

    struct Game {
        uint256 sportId; 
        uint256 externalId; 
        uint256 timestamp; 
        uint256 homeWagerAmount; 
        uint256 awayWagerAmount; 
        bool resolved; 
        Result result; 
    }

    struct Prediction {
        uint256 gameId; 
        Result result; 
        uint256 amount; 
        bool claimed; 
    }

    enum Result {
        None, 
        Home, 
        Away 
    }

    uint8 public constant FN_PREDICT=1;
    uint8 public constant FN_REGISTER=2;

    error GameAlreadyRegistered();
    error TimestampInPast();
    error GameNotRegistered();
    error GameIsResolved();
    error GameAlreadyStarted();
    error InsufficientValue();
    error ValueTooHigh();
    error InvalidResult();
    error GameNotResolved();
    error GameNotReadyToResolve();
    error ResolveAlreadyRequested();
    error NothingToClaim();

    constructor(address _endpoint) OApp(_endpoint, msg.sender) Ownable(msg.sender) payable{}

    //CROSS_CHAIN SETUP

    function setDestination(uint16 _destChainId) external onlyOwner{
        destChainId = _destChainId;
    }

    function generateOptions(
        uint128 gas,
        uint128 value
    ) public pure returns(bytes memory){
        return OptionsBuilder.newOptions().addExecutorLzReceiveOption(gas, value);
    }

    function quote(
        uint32 _dstEid, 
        bytes memory _payload, 
        bytes calldata _options, 
        bool _payInLzToken 
    ) public view returns (uint256 nativeFee, uint256 lzTokenFee) {
        MessagingFee memory fee = _quote(_dstEid, _payload, _options, _payInLzToken);
        return (fee.nativeFee, fee.lzTokenFee);
    }

    function _lzSend(
        uint32 _dstEid,
        bytes memory _message,
        bytes memory _options,
        MessagingFee memory _fee,
        address _refundAddress
    ) internal override returns (MessagingReceipt memory receipt) {
        require((address(this).balance >= _fee.nativeFee) || (msg.value>=_fee.nativeFee), "Insufficient contract balance");

        return
            endpoint.send{ value: _fee.nativeFee }(
                MessagingParams(_dstEid, _getPeerOrRevert(_dstEid), _message, _options, _fee.lzTokenFee > 0),
                _refundAddress
            );
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata payload,
        address,  
        bytes calldata  
    ) internal override {
        (uint256 gameId, Result result)= abi.decode(payload,(uint256,Result));
        _resolveGame(gameId, result);
    }

    //MAIN FUNCTIONS

    function _registerGame(uint256 sportId, uint256 externalId, uint256 timestamp,uint256 crossChainGas) public payable returns (uint256 gameId) {
        gameId = getGameId(sportId, externalId);

        if (games[gameId].externalId != 0) revert GameAlreadyRegistered();
        if (timestamp < block.timestamp) revert TimestampInPast();

        games[gameId] = Game(sportId, externalId, timestamp, 0, 0, false, Result.None);
        activeGames.push(gameId);

        bytes memory _options=generateOptions(uint128(crossChainGas),0);
        bytes memory payload=abi.encode(FN_REGISTER,abi.encode(gameId,sportId,externalId,timestamp));
        _lzSend(destChainId, payload, _options, MessagingFee(msg.value, 0), payable(msg.sender));
    }

    function predict(uint256 gameId,uint256 amount, Result result,uint256 crossChainGas) public payable {
        Game memory game = games[gameId];
        uint256 wagerAmount = amount;

        if (game.externalId == 0) revert GameNotRegistered();
        if (game.resolved) revert GameIsResolved();
        if (game.timestamp < block.timestamp) revert GameAlreadyStarted();
        if (wagerAmount < MIN_WAGER) revert InsufficientValue();
        if (wagerAmount > MAX_WAGER) revert ValueTooHigh();

        if (result == Result.Home) games[gameId].homeWagerAmount += wagerAmount;
        else if (result == Result.Away) games[gameId].awayWagerAmount += wagerAmount;
        else revert InvalidResult();

        predictions[msg.sender][gameId].push(Prediction(gameId, result, wagerAmount, false));
        
        bytes memory _options=generateOptions(uint128(crossChainGas),0);
        bytes memory payload=abi.encode(FN_PREDICT,abi.encode(gameId, wagerAmount, msg.sender, result));
        _lzSend(destChainId, payload, _options, MessagingFee(msg.value-wagerAmount, 0), payable(msg.sender));
    }

    function claim(uint256 gameId) external payable {
        Game memory game = games[gameId];
        address user = msg.sender;

        if (!game.resolved) revert GameNotResolved();

        
        uint256 totalWinnings = 0;
        Prediction[] memory userPredictions = predictions[user][gameId];
        for (uint256 i = 0; i < userPredictions.length; i++) {
            Prediction memory prediction = userPredictions[i];

            if (prediction.claimed) continue;
            if (prediction.result == game.result) {
                uint256 winnings = calculateWinnings(gameId, prediction.amount, prediction.result);
                totalWinnings += winnings;
            }
            predictions[user][gameId][i].claimed = true;
        }

        if (totalWinnings == 0) revert NothingToClaim();

        payable(user).transfer(totalWinnings);
    }

    //INTERNAL

    function _resolveGame(uint256 gameId, Result result) public {

        games[gameId].result = result;
        games[gameId].resolved = true;
        uint256 length=activeGames.length;
        resolvedGames.push(gameId);
        
        uint256 index;
        for (uint256 i = 0; i < length; i++) {
            if (activeGames[i] == gameId) {
                index = i;
                break;
            }
        }
        activeGames[index] = activeGames[length-1];
        activeGames.pop();
    }

    //GETTERS

    function getGameId(uint256 sportId,uint256 externalId) public pure returns(uint256){
        return(sportId<<128) | externalId;
    }

    function getGame(uint256 gameId) external view returns( Game memory) {
        return games[gameId];
    }

    function getActiveGames() public view returns(Game[] memory){
        Game[] memory activeGamesArray=new Game[](activeGames.length);
        for (uint256 i = 0; i < activeGames.length; i++) {
            activeGamesArray[i] = games[activeGames[i]];
        }
        return activeGamesArray;
    }

    function getActivePredictions(address user) external view returns (Prediction[] memory) {
        uint256 totalPredictions = 0;
        for (uint256 i = 0; i < activeGames.length; i++) {
            totalPredictions += predictions[user][activeGames[i]].length;
        }
        uint256 index = 0;
        Prediction[] memory userPredictions = new Prediction[](totalPredictions);
        for (uint256 i = 0; i < activeGames.length; i++) {
            Prediction[] memory gamePredictions = predictions[user][activeGames[i]];
            for (uint256 j = 0; j < gamePredictions.length; j++) {
                userPredictions[index] = gamePredictions[j];
                index++;
            }
        }
        return userPredictions;
    }

    function getPastPredictions(address user) external view returns (Prediction[] memory) {
        uint256 totalPredictions = 0;
        for (uint256 i = 0; i < resolvedGames.length; i++) {
            totalPredictions += predictions[user][resolvedGames[i]].length;
        }
        uint256 index = 0;
        Prediction[] memory userPredictions = new Prediction[](totalPredictions);
        for (uint256 i = 0; i < resolvedGames.length; i++) {
            Prediction[] memory gamePredictions = predictions[user][resolvedGames[i]];
            for (uint256 j = 0; j < gamePredictions.length; j++) {
                userPredictions[index] = gamePredictions[j];
                index++;
            }
        }
        return userPredictions;
    }

    function isPredictionCorrect(address user, uint256 gameId, uint32 predictionIdx) external view returns (bool) {
        Game memory game = games[gameId];
        if (!game.resolved) return false;
        Prediction memory prediction = predictions[user][gameId][predictionIdx];
        return prediction.result == game.result;
    }

    function calculateWinnings(uint256 gameId, uint256 wager, Result result) public view returns (uint256) {
        Game memory game = games[gameId];
        
        uint256 totalWager = game.homeWagerAmount + game.awayWagerAmount;
       
        uint256 winnings = (wager * totalWager) / (result == Result.Home ? game.homeWagerAmount : game.awayWagerAmount);
        return winnings;
    }

    function readyToResolve(uint256 gameId) public view returns (bool) {
        return games[gameId].timestamp + GAME_RESOLVE_DELAY < block.timestamp;
    }

    receive() external payable {}

    fallback() external payable {}
}