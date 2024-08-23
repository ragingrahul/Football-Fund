import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BondToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bondTokenABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: '_usdc', internalType: 'address', type: 'address' }],
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: '_borrowLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: '_borrowRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: '_depositRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: '_interestMultiplier',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: '_utilizationRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'addCollateral',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'baseRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'bondAsset',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'borrow',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'calculateBorrowFee',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ethTreasury',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeDistributePercentage',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'fixedAnnuBorrowRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getBorrowed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCash',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCollateral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getExchangeRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getLpToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getTotalAmountToRepay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxLTV',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'removeCollateral',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'repay',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalBorrowed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalCollateral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalReserve',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'unbondAsset',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EUSDCToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const eusdcTokenABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__.
 */
export function useBondTokenRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"_borrowLimit"`.
 */
export function useBondTokenBorrowLimit<
  TFunctionName extends '_borrowLimit',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: '_borrowLimit',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"_borrowRate"`.
 */
export function useBondTokenBorrowRate<
  TFunctionName extends '_borrowRate',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: '_borrowRate',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"_depositRate"`.
 */
export function useBondTokenDepositRate<
  TFunctionName extends '_depositRate',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: '_depositRate',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"_interestMultiplier"`.
 */
export function useBondTokenInterestMultiplier<
  TFunctionName extends '_interestMultiplier',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: '_interestMultiplier',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"_utilizationRatio"`.
 */
export function useBondTokenUtilizationRatio<
  TFunctionName extends '_utilizationRatio',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: '_utilizationRatio',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"allowance"`.
 */
export function useBondTokenAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useBondTokenBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"baseRate"`.
 */
export function useBondTokenBaseRate<
  TFunctionName extends 'baseRate',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'baseRate',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"calculateBorrowFee"`.
 */
export function useBondTokenCalculateBorrowFee<
  TFunctionName extends 'calculateBorrowFee',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'calculateBorrowFee',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"decimals"`.
 */
export function useBondTokenDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"ethTreasury"`.
 */
export function useBondTokenEthTreasury<
  TFunctionName extends 'ethTreasury',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'ethTreasury',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"feeDistributePercentage"`.
 */
export function useBondTokenFeeDistributePercentage<
  TFunctionName extends 'feeDistributePercentage',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'feeDistributePercentage',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"fixedAnnuBorrowRate"`.
 */
export function useBondTokenFixedAnnuBorrowRate<
  TFunctionName extends 'fixedAnnuBorrowRate',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'fixedAnnuBorrowRate',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"getBorrowed"`.
 */
export function useBondTokenGetBorrowed<
  TFunctionName extends 'getBorrowed',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'getBorrowed',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"getCash"`.
 */
export function useBondTokenGetCash<
  TFunctionName extends 'getCash',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'getCash',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"getCollateral"`.
 */
export function useBondTokenGetCollateral<
  TFunctionName extends 'getCollateral',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'getCollateral',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"getExchangeRate"`.
 */
export function useBondTokenGetExchangeRate<
  TFunctionName extends 'getExchangeRate',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'getExchangeRate',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"getLpToken"`.
 */
export function useBondTokenGetLpToken<
  TFunctionName extends 'getLpToken',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'getLpToken',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"getTotalAmountToRepay"`.
 */
export function useBondTokenGetTotalAmountToRepay<
  TFunctionName extends 'getTotalAmountToRepay',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'getTotalAmountToRepay',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"maxLTV"`.
 */
export function useBondTokenMaxLtv<
  TFunctionName extends 'maxLTV',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'maxLTV',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"name"`.
 */
export function useBondTokenName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"owner"`.
 */
export function useBondTokenOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"symbol"`.
 */
export function useBondTokenSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"totalBorrowed"`.
 */
export function useBondTokenTotalBorrowed<
  TFunctionName extends 'totalBorrowed',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'totalBorrowed',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"totalCollateral"`.
 */
export function useBondTokenTotalCollateral<
  TFunctionName extends 'totalCollateral',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'totalCollateral',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"totalDeposit"`.
 */
export function useBondTokenTotalDeposit<
  TFunctionName extends 'totalDeposit',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'totalDeposit',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"totalReserve"`.
 */
export function useBondTokenTotalReserve<
  TFunctionName extends 'totalReserve',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'totalReserve',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useBondTokenTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof bondTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: bondTokenABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof bondTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__.
 */
export function useBondTokenWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof bondTokenABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, TFunctionName, TMode>({
    abi: bondTokenABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"addCollateral"`.
 */
export function useBondTokenAddCollateral<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'addCollateral'
        >['request']['abi'],
        'addCollateral',
        TMode
      > & { functionName?: 'addCollateral' }
    : UseContractWriteConfig<typeof bondTokenABI, 'addCollateral', TMode> & {
        abi?: never
        functionName?: 'addCollateral'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'addCollateral', TMode>({
    abi: bondTokenABI,
    functionName: 'addCollateral',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"approve"`.
 */
export function useBondTokenApprove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof bondTokenABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'approve', TMode>({
    abi: bondTokenABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"bondAsset"`.
 */
export function useBondTokenBondAsset<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'bondAsset'
        >['request']['abi'],
        'bondAsset',
        TMode
      > & { functionName?: 'bondAsset' }
    : UseContractWriteConfig<typeof bondTokenABI, 'bondAsset', TMode> & {
        abi?: never
        functionName?: 'bondAsset'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'bondAsset', TMode>({
    abi: bondTokenABI,
    functionName: 'bondAsset',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"borrow"`.
 */
export function useBondTokenBorrow<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'borrow'
        >['request']['abi'],
        'borrow',
        TMode
      > & { functionName?: 'borrow' }
    : UseContractWriteConfig<typeof bondTokenABI, 'borrow', TMode> & {
        abi?: never
        functionName?: 'borrow'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'borrow', TMode>({
    abi: bondTokenABI,
    functionName: 'borrow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"burn"`.
 */
export function useBondTokenBurn<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'burn'
        >['request']['abi'],
        'burn',
        TMode
      > & { functionName?: 'burn' }
    : UseContractWriteConfig<typeof bondTokenABI, 'burn', TMode> & {
        abi?: never
        functionName?: 'burn'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'burn', TMode>({
    abi: bondTokenABI,
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"burnFrom"`.
 */
export function useBondTokenBurnFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'burnFrom'
        >['request']['abi'],
        'burnFrom',
        TMode
      > & { functionName?: 'burnFrom' }
    : UseContractWriteConfig<typeof bondTokenABI, 'burnFrom', TMode> & {
        abi?: never
        functionName?: 'burnFrom'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'burnFrom', TMode>({
    abi: bondTokenABI,
    functionName: 'burnFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"removeCollateral"`.
 */
export function useBondTokenRemoveCollateral<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'removeCollateral'
        >['request']['abi'],
        'removeCollateral',
        TMode
      > & { functionName?: 'removeCollateral' }
    : UseContractWriteConfig<typeof bondTokenABI, 'removeCollateral', TMode> & {
        abi?: never
        functionName?: 'removeCollateral'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'removeCollateral', TMode>({
    abi: bondTokenABI,
    functionName: 'removeCollateral',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useBondTokenRenounceOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<
        typeof bondTokenABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'renounceOwnership', TMode>({
    abi: bondTokenABI,
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"repay"`.
 */
export function useBondTokenRepay<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'repay'
        >['request']['abi'],
        'repay',
        TMode
      > & { functionName?: 'repay' }
    : UseContractWriteConfig<typeof bondTokenABI, 'repay', TMode> & {
        abi?: never
        functionName?: 'repay'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'repay', TMode>({
    abi: bondTokenABI,
    functionName: 'repay',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function useBondTokenTransfer<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof bondTokenABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'transfer', TMode>({
    abi: bondTokenABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useBondTokenTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof bondTokenABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'transferFrom', TMode>({
    abi: bondTokenABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useBondTokenTransferOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<
        typeof bondTokenABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'transferOwnership', TMode>({
    abi: bondTokenABI,
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"unbondAsset"`.
 */
export function useBondTokenUnbondAsset<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof bondTokenABI,
          'unbondAsset'
        >['request']['abi'],
        'unbondAsset',
        TMode
      > & { functionName?: 'unbondAsset' }
    : UseContractWriteConfig<typeof bondTokenABI, 'unbondAsset', TMode> & {
        abi?: never
        functionName?: 'unbondAsset'
      } = {} as any,
) {
  return useContractWrite<typeof bondTokenABI, 'unbondAsset', TMode>({
    abi: bondTokenABI,
    functionName: 'unbondAsset',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__.
 */
export function usePrepareBondTokenWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"addCollateral"`.
 */
export function usePrepareBondTokenAddCollateral(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'addCollateral'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'addCollateral',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'addCollateral'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareBondTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"bondAsset"`.
 */
export function usePrepareBondTokenBondAsset(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'bondAsset'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'bondAsset',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'bondAsset'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"borrow"`.
 */
export function usePrepareBondTokenBorrow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'borrow'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'borrow',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'borrow'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"burn"`.
 */
export function usePrepareBondTokenBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'burn'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"burnFrom"`.
 */
export function usePrepareBondTokenBurnFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'burnFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'burnFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'burnFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"removeCollateral"`.
 */
export function usePrepareBondTokenRemoveCollateral(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'removeCollateral'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'removeCollateral',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'removeCollateral'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareBondTokenRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'renounceOwnership'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"repay"`.
 */
export function usePrepareBondTokenRepay(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'repay'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'repay',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'repay'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareBondTokenTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareBondTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareBondTokenTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'transferOwnership'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link bondTokenABI}__ and `functionName` set to `"unbondAsset"`.
 */
export function usePrepareBondTokenUnbondAsset(
  config: Omit<
    UsePrepareContractWriteConfig<typeof bondTokenABI, 'unbondAsset'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: bondTokenABI,
    functionName: 'unbondAsset',
    ...config,
  } as UsePrepareContractWriteConfig<typeof bondTokenABI, 'unbondAsset'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bondTokenABI}__.
 */
export function useBondTokenEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof bondTokenABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: bondTokenABI,
    ...config,
  } as UseContractEventConfig<typeof bondTokenABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bondTokenABI}__ and `eventName` set to `"Approval"`.
 */
export function useBondTokenApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof bondTokenABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bondTokenABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof bondTokenABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bondTokenABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useBondTokenOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof bondTokenABI, 'OwnershipTransferred'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bondTokenABI,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof bondTokenABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link bondTokenABI}__ and `eventName` set to `"Transfer"`.
 */
export function useBondTokenTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof bondTokenABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: bondTokenABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof bondTokenABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link eusdcTokenABI}__.
 */
export function useEusdcTokenRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof eusdcTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: eusdcTokenABI,
    ...config,
  } as UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"allowance"`.
 */
export function useEusdcTokenAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof eusdcTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: eusdcTokenABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useEusdcTokenBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof eusdcTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: eusdcTokenABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"decimals"`.
 */
export function useEusdcTokenDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof eusdcTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: eusdcTokenABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"name"`.
 */
export function useEusdcTokenName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof eusdcTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: eusdcTokenABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"symbol"`.
 */
export function useEusdcTokenSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof eusdcTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: eusdcTokenABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useEusdcTokenTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof eusdcTokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: eusdcTokenABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof eusdcTokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__.
 */
export function useEusdcTokenWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof eusdcTokenABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof eusdcTokenABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof eusdcTokenABI, TFunctionName, TMode>({
    abi: eusdcTokenABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"approve"`.
 */
export function useEusdcTokenApprove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof eusdcTokenABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof eusdcTokenABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof eusdcTokenABI, 'approve', TMode>({
    abi: eusdcTokenABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function useEusdcTokenTransfer<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof eusdcTokenABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof eusdcTokenABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof eusdcTokenABI, 'transfer', TMode>({
    abi: eusdcTokenABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useEusdcTokenTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof eusdcTokenABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof eusdcTokenABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof eusdcTokenABI, 'transferFrom', TMode>({
    abi: eusdcTokenABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__.
 */
export function usePrepareEusdcTokenWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof eusdcTokenABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: eusdcTokenABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof eusdcTokenABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareEusdcTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof eusdcTokenABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: eusdcTokenABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof eusdcTokenABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareEusdcTokenTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof eusdcTokenABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: eusdcTokenABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof eusdcTokenABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link eusdcTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareEusdcTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof eusdcTokenABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: eusdcTokenABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof eusdcTokenABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link eusdcTokenABI}__.
 */
export function useEusdcTokenEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof eusdcTokenABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: eusdcTokenABI,
    ...config,
  } as UseContractEventConfig<typeof eusdcTokenABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link eusdcTokenABI}__ and `eventName` set to `"Approval"`.
 */
export function useEusdcTokenApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof eusdcTokenABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: eusdcTokenABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof eusdcTokenABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link eusdcTokenABI}__ and `eventName` set to `"Transfer"`.
 */
export function useEusdcTokenTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof eusdcTokenABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: eusdcTokenABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof eusdcTokenABI, 'Transfer'>)
}
