// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ResultsConsumer} from "./ResultsConsumer.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import { OApp, Origin, MessagingFee } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { MessagingParams, MessagingFee, MessagingReceipt } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

struct Config {
  address oracle; 
  address ccipRouter; 
  address link; 
  address weth9Token; 
  address exchangeToken; 
  address uniswapV3Router;
  uint64 subscriptionId; 
  bytes32 donId; 
  bytes secrets; 
  string source; 
}


contract PredictArbChain is ResultsConsumer, AutomationCompatibleInterface, OApp {

  using OptionsBuilder for bytes;

  uint16 public destChainId;

  uint256 private constant MIN_WAGER = 0.5 ether;
  uint256 private constant MAX_WAGER = 2 ether;
  uint256 private constant GAME_RESOLVE_DELAY = 2 hours;

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



  // EVENTS

  event GameRegistered(uint256 indexed gameId);
  event GameResolved(uint256 indexed gameId, Result result);
  event Predicted(address indexed user, uint256 indexed gameId, Result result, uint256 amount);
  event Claimed(address indexed user, uint256 indexed gameId, uint256 amount);

  // ERRORS

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

  // CONSTRUCTOR

  constructor(
    address _lzEndpoint,
    Config memory config
  )
    OApp(_lzEndpoint, msg.sender) 
    Ownable(msg.sender)
    ResultsConsumer(config.oracle, config.donId, config.subscriptionId, config.source, config.secrets)
    payable
  {}

  //CROSS-CHAIN
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
    bytes memory _options, 
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
      (uint8 functionSelector, bytes memory functionPayload) = abi.decode(payload, (uint8, bytes));
      
      if(functionSelector==FN_PREDICT){
            (uint256 gameId,uint256 amount,address sender,Result result)=abi.decode(functionPayload, (uint256,uint256,address,Result));
            predict(gameId, amount, sender, result);
        }
        else if(functionSelector==FN_REGISTER){
            (uint256 gameId,uint256 sportId, uint256 externalId, uint256 timestamp)=abi.decode(functionPayload,(uint256,uint256,uint256,uint256));
            _registerGame(gameId,sportId,externalId,timestamp);
        }
  }


  //MAIN

  function _registerGame(uint256 gameId,uint256 sportId, uint256 externalId, uint256 timestamp) internal  {
    games[gameId] = Game(sportId, externalId, timestamp, 0, 0, false, Result.None);
    activeGames.push(gameId);
  }

  function predict(uint256 gameId,uint256 amount, address sender, Result result) internal  {
    uint256 wagerAmount = amount;

    if (result == Result.Home) games[gameId].homeWagerAmount += wagerAmount;
    else if (result == Result.Away) games[gameId].awayWagerAmount += wagerAmount;
    else revert InvalidResult();

    predictions[sender][gameId].push(Prediction(gameId, result, wagerAmount, false));
  }



  // INTERNAL


  function _requestResolve(uint256 gameId) internal {
    Game memory game = games[gameId];

    if (pendingRequests[gameId] != 0) revert ResolveAlreadyRequested();
    if (game.externalId == 0) revert GameNotRegistered();
    if (game.resolved) revert GameIsResolved();
    if (!readyToResolve(gameId)) revert GameNotReadyToResolve();

    pendingRequests[gameId] = _requestResult(game.sportId, game.externalId);
  }

  function _processResult(uint256 sportId, uint256 externalId, bytes memory response) internal override {
    uint256 gameId = getGameId(sportId, externalId);
    Result result = Result(uint256(bytes32(response)));
    _resolveGame(gameId, result);
  }

  function _resolveGame(uint256 gameId, Result result) public {

    games[gameId].result = result;
    games[gameId].resolved = true;

    resolvedGames.push(gameId);
    _removeFromActiveGames(gameId);

    emit GameResolved(gameId, result);

    bytes memory payload=abi.encode(gameId, result);
    bytes memory _options=generateOptions(150000, 0);
    (uint256 nativeFee,)=quote(destChainId,payload,_options,false);
    _lzSend(destChainId, payload, _options, MessagingFee(nativeFee, 0), payable(msg.sender));
  }

  function _removeFromActiveGames(uint256 gameId) internal {
    uint256 index;
    for (uint256 i = 0; i < activeGames.length; i++) {
      if (activeGames[i] == gameId) {
        index = i;
        break;
      }
    }
    for (uint256 i = index; i < activeGames.length - 1; i++) {
      activeGames[i] = activeGames[i + 1];
    }
    activeGames.pop();
  }

  // GETTERS


  function getGameId(uint256 sportId, uint256 externalId) public pure returns (uint256) {
    return (sportId << 128) | externalId;
  }

  function getGame(uint256 gameId) external view returns (Game memory) {
    return games[gameId];
  }

  function getActiveGames() public view returns (Game[] memory) {
    Game[] memory activeGamesArray = new Game[](activeGames.length);
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

  // CHAINLINK AUTOMATION


  function checkUpkeep(bytes memory) public view override returns (bool, bytes memory) {

    Game[] memory activeGamesArray = getActiveGames();

    for (uint256 i = 0; i < activeGamesArray.length; i++) {
      uint256 gameId = getGameId(activeGamesArray[i].sportId, activeGamesArray[i].externalId);
      if (readyToResolve(gameId) && pendingRequests[gameId] == 0) {
        return (true, abi.encodePacked(gameId));
      }
    }
    return (false, "");
  }

  function performUpkeep(bytes calldata data) external override {
    uint256 gameId = abi.decode(data, (uint256));
    _requestResolve(gameId);
  }

  // OWNER

  function deletePendingRequest(uint256 gameId) external onlyOwner {
    delete pendingRequests[gameId];
  }

  function getRefund() public onlyOwner {
      payable(msg.sender).transfer(address(this).balance);
  }

    // Function to allow the contract to receive Ether
  receive() external payable {}

  // Fallback function - called when Ether is sent to the contract without data
  fallback() external payable {}
}
