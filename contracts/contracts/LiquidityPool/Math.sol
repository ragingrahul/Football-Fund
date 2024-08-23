//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;


contract Math {
    
    uint256 private constant EXP_SCALE = 1e18;
    uint256 private constant HALF_EXP_SCALE = EXP_SCALE / 2;

    function getExp(uint256 num, uint256 denom)
        internal
        pure
        returns (uint256)
    {
        uint256 scaledNumber = num*EXP_SCALE;
        uint256 rational = scaledNumber/(denom);
        return rational;
    }

    function mulExp(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 doubleScaledProduct = a*b;
        uint256 doubleScaledProductWithHalfScale= HALF_EXP_SCALE*doubleScaledProduct;
        uint256 product = doubleScaledProductWithHalfScale/EXP_SCALE;
        return product;
    }

    function percentage(uint256 _num, uint256 _percentage)
        internal
        pure
        returns (uint256)
    {
        uint256 rational = getExp(_num, 5);
        return mulExp(rational, _percentage);
    }
}