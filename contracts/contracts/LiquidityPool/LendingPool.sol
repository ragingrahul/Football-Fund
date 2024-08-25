//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./Math.sol";


contract BondToken is ERC20Burnable, Ownable, Math {

    uint256 public totalBorrowed;
    uint256 public totalReserve;
    uint256 public totalDeposit;
    uint256 public maxLTV = 80;
    uint256 public ethTreasury;
    uint256 public totalCollateral;
    uint256 public baseRate = 20000000000000000;
    uint256 public fixedAnnuBorrowRate = 300000000000000000;
    uint256 public constant feeDistributePercentage=80;

    IERC20 private usdc;
        

    mapping(address => uint256) private usersCollateral;
    mapping(address => uint256) private usersBorrowed;

    constructor(address _usdc) ERC20("Liquidity Pool USDC", "lpUSDC") Ownable(msg.sender){
        usdc=IERC20(_usdc);
    }
    function bondAsset() external payable {
        require(msg.value != 0, "Cant send 0 ethers");

        totalDeposit += msg.value;


        uint256 tokensToMint = msg.value * 1000;
       
        _mint(msg.sender, tokensToMint);
    }

    function unbondAsset(uint256 _amount) external {
        require(_amount <= balanceOf(msg.sender), "Not enough bonds!");

        uint256 ethToReturn = (_amount * totalDeposit) / totalSupply();

        uint256 feeAmount = (totalReserve*feeDistributePercentage)/100;
        uint256 additionalValue = (feeAmount * balanceOf(msg.sender))/totalSupply() ;

        uint256 totalRepaymentAmount=ethToReturn+additionalValue;

        totalDeposit -= ethToReturn;
        
        payable(msg.sender).transfer(totalRepaymentAmount);
        _burn(msg.sender, _amount);
    }


    function addCollateral(uint256 _amount) external {
        usdc.transferFrom(msg.sender, address(this), _amount);
        usersCollateral[msg.sender] += _amount;
        totalCollateral += _amount;
    }

    function removeCollateral(uint256 _amount) external {
        uint256 collateral = usersCollateral[msg.sender];
        require(collateral > 0, "Dont have any collateral");
        require(usersBorrowed[msg.sender]==0,"Borrowed amount not repayed");
        usersCollateral[msg.sender] -= _amount;
        totalCollateral -= _amount;
        usdc.approve(address(this), _amount);
        usdc.transferFrom(address(this), msg.sender, _amount);
    }

    function borrow(uint256 _amount) external {
        require(_amount <= _borrowLimit(), "No collateral enough");
        usersBorrowed[msg.sender] += _amount;
        totalBorrowed += _amount;
        payable(msg.sender).transfer(_amount);
    }

    function repay() external payable {
        require(usersBorrowed[msg.sender] > 0, "Doesnt have a debt to pay");
        uint256 amountPayed=msg.value;
        (uint256 fee,) = calculateBorrowFee(usersBorrowed[msg.sender]);
        amountPayed-=fee;
        usersBorrowed[msg.sender] -= amountPayed;
        totalBorrowed -= amountPayed;
        totalReserve += fee;
    }

    function getTotalAmountToRepay() public view returns(uint256){
        (uint256 fee, )=calculateBorrowFee(usersBorrowed[msg.sender]);
        return usersBorrowed[msg.sender]+fee;
    }

    function calculateBorrowFee(uint256 _amount)
        public
        view
        returns (uint256, uint256)
    {
        uint256 borrowRate = _borrowRate();
        uint256 fee = mulExp(_amount, borrowRate);
        uint256 paid = _amount-fee;
        return (fee, paid);
    }

    function getExchangeRate() public view returns (uint256) {
        if (totalSupply() == 0) {
            return 100000;
        }
        uint256 num=totalReserve;
        return getExp(num, totalSupply());
    }

    function getCash() public view returns (uint256) {
        return totalDeposit-totalBorrowed;
    }

    function _borrowLimit() public view returns (uint256) {
        uint256 amountLocked = usersCollateral[msg.sender];
        if(amountLocked==0)return 0;
        uint256 amountBorrowed = usersBorrowed[msg.sender];
        uint256 amountLeft = amountLocked-amountBorrowed;
        return (amountLeft*maxLTV)/100;
    }


    function getCollateral() external view returns (uint256) {
        return usersCollateral[msg.sender];
    }

    function getBorrowed() external view returns (uint256) {
        return usersBorrowed[msg.sender];
    }

    function getLpToken() external view returns (uint256){
        return balanceOf(msg.sender);
    }

    function _utilizationRatio() public view returns (uint256) {
        return getExp(totalBorrowed, totalDeposit);
    }

    function _interestMultiplier() public view returns (uint256) {
        uint256 uRatio = _utilizationRatio();
        uint256 num = fixedAnnuBorrowRate-baseRate;
        return getExp(num, uRatio);
    }

    function _borrowRate() public view returns (uint256) {
        uint256 uRatio = _utilizationRatio();
        uint256 interestMul = _interestMultiplier();
        uint256 product = mulExp(uRatio, interestMul);
        return product+baseRate;
    }

    function _depositRate() public view returns (uint256) {
        uint256 uRatio = _utilizationRatio();
        uint256 bRate = _borrowRate();
        return mulExp(uRatio, bRate);
    }

    receive() external payable {}

    fallback() external payable {}
}