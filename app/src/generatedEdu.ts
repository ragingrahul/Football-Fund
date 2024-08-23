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
// PredictEduChain
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const predictEduChainABI = [
  {
    stateMutability: 'payable',
    type: 'constructor',
    inputs: [{ name: '_endpoint', internalType: 'address', type: 'address' }],
  },
  { type: 'error', inputs: [], name: 'GameAlreadyRegistered' },
  { type: 'error', inputs: [], name: 'GameAlreadyStarted' },
  { type: 'error', inputs: [], name: 'GameIsResolved' },
  { type: 'error', inputs: [], name: 'GameNotReadyToResolve' },
  { type: 'error', inputs: [], name: 'GameNotRegistered' },
  { type: 'error', inputs: [], name: 'GameNotResolved' },
  { type: 'error', inputs: [], name: 'InsufficientValue' },
  { type: 'error', inputs: [], name: 'InvalidDelegate' },
  { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
  {
    type: 'error',
    inputs: [{ name: 'optionType', internalType: 'uint16', type: 'uint16' }],
    name: 'InvalidOptionType',
  },
  { type: 'error', inputs: [], name: 'InvalidResult' },
  { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
  {
    type: 'error',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'NoPeer',
  },
  {
    type: 'error',
    inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
    name: 'NotEnoughNative',
  },
  { type: 'error', inputs: [], name: 'NothingToClaim' },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'OnlyEndpoint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'OnlyPeer',
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
  { type: 'error', inputs: [], name: 'ResolveAlreadyRequested' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  { type: 'error', inputs: [], name: 'TimestampInPast' },
  { type: 'error', inputs: [], name: 'ValueTooHigh' },
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
      { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
      {
        name: 'peer',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'PeerSet',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'FN_PREDICT',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'FN_REGISTER',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'sportId', internalType: 'uint256', type: 'uint256' },
      { name: 'externalId', internalType: 'uint256', type: 'uint256' },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'crossChainGas', internalType: 'uint256', type: 'uint256' },
    ],
    name: '_registerGame',
    outputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    name: 'allowInitializePath',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'uint256', type: 'uint256' },
      { name: 'wager', internalType: 'uint256', type: 'uint256' },
      {
        name: 'result',
        internalType: 'enum PredictEduChain.Result',
        type: 'uint8',
      },
    ],
    name: 'calculateWinnings',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'claim',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'destChainId',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'endpoint',
    outputs: [
      {
        name: '',
        internalType: 'contract ILayerZeroEndpointV2',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'gas', internalType: 'uint128', type: 'uint128' },
      { name: 'value', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'generateOptions',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getActiveGames',
    outputs: [
      {
        name: '',
        internalType: 'struct PredictEduChain.Game[]',
        type: 'tuple[]',
        components: [
          { name: 'sportId', internalType: 'uint256', type: 'uint256' },
          { name: 'externalId', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'homeWagerAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'awayWagerAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'resolved', internalType: 'bool', type: 'bool' },
          {
            name: 'result',
            internalType: 'enum PredictEduChain.Result',
            type: 'uint8',
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getActivePredictions',
    outputs: [
      {
        name: '',
        internalType: 'struct PredictEduChain.Prediction[]',
        type: 'tuple[]',
        components: [
          { name: 'gameId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'result',
            internalType: 'enum PredictEduChain.Result',
            type: 'uint8',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'claimed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'getGame',
    outputs: [
      {
        name: '',
        internalType: 'struct PredictEduChain.Game',
        type: 'tuple',
        components: [
          { name: 'sportId', internalType: 'uint256', type: 'uint256' },
          { name: 'externalId', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'homeWagerAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'awayWagerAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'resolved', internalType: 'bool', type: 'bool' },
          {
            name: 'result',
            internalType: 'enum PredictEduChain.Result',
            type: 'uint8',
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'sportId', internalType: 'uint256', type: 'uint256' },
      { name: 'externalId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getGameId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getPastPredictions',
    outputs: [
      {
        name: '',
        internalType: 'struct PredictEduChain.Prediction[]',
        type: 'tuple[]',
        components: [
          { name: 'gameId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'result',
            internalType: 'enum PredictEduChain.Result',
            type: 'uint8',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'claimed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: '',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '_sender', internalType: 'address', type: 'address' },
    ],
    name: 'isComposeMsgSender',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'gameId', internalType: 'uint256', type: 'uint256' },
      { name: 'predictionIdx', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'isPredictionCorrect',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzReceive',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'nextNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'oAppVersion',
    outputs: [
      { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
      { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'peers',
    outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'gameId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'result',
        internalType: 'enum PredictEduChain.Result',
        type: 'uint8',
      },
      { name: 'crossChainGas', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'predict',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_dstEid', internalType: 'uint32', type: 'uint32' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_options', internalType: 'bytes', type: 'bytes' },
      { name: '_payInLzToken', internalType: 'bool', type: 'bool' },
    ],
    name: 'quote',
    outputs: [
      { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
      { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    name: 'readyToResolve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
    name: 'setDelegate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_destChainId', internalType: 'uint16', type: 'uint16' }],
    name: 'setDestination',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setPeer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__.
 */
export function usePredictEduChainRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"FN_PREDICT"`.
 */
export function usePredictEduChainFnPredict<
  TFunctionName extends 'FN_PREDICT',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'FN_PREDICT',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"FN_REGISTER"`.
 */
export function usePredictEduChainFnRegister<
  TFunctionName extends 'FN_REGISTER',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'FN_REGISTER',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"allowInitializePath"`.
 */
export function usePredictEduChainAllowInitializePath<
  TFunctionName extends 'allowInitializePath',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'allowInitializePath',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"calculateWinnings"`.
 */
export function usePredictEduChainCalculateWinnings<
  TFunctionName extends 'calculateWinnings',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'calculateWinnings',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"destChainId"`.
 */
export function usePredictEduChainDestChainId<
  TFunctionName extends 'destChainId',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'destChainId',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"endpoint"`.
 */
export function usePredictEduChainEndpoint<
  TFunctionName extends 'endpoint',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'endpoint',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"generateOptions"`.
 */
export function usePredictEduChainGenerateOptions<
  TFunctionName extends 'generateOptions',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'generateOptions',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"getActiveGames"`.
 */
export function usePredictEduChainGetActiveGames<
  TFunctionName extends 'getActiveGames',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'getActiveGames',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"getActivePredictions"`.
 */
export function usePredictEduChainGetActivePredictions<
  TFunctionName extends 'getActivePredictions',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'getActivePredictions',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"getGame"`.
 */
export function usePredictEduChainGetGame<
  TFunctionName extends 'getGame',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'getGame',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"getGameId"`.
 */
export function usePredictEduChainGetGameId<
  TFunctionName extends 'getGameId',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'getGameId',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"getPastPredictions"`.
 */
export function usePredictEduChainGetPastPredictions<
  TFunctionName extends 'getPastPredictions',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'getPastPredictions',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"isComposeMsgSender"`.
 */
export function usePredictEduChainIsComposeMsgSender<
  TFunctionName extends 'isComposeMsgSender',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'isComposeMsgSender',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"isPredictionCorrect"`.
 */
export function usePredictEduChainIsPredictionCorrect<
  TFunctionName extends 'isPredictionCorrect',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'isPredictionCorrect',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"nextNonce"`.
 */
export function usePredictEduChainNextNonce<
  TFunctionName extends 'nextNonce',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'nextNonce',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"oAppVersion"`.
 */
export function usePredictEduChainOAppVersion<
  TFunctionName extends 'oAppVersion',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'oAppVersion',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"owner"`.
 */
export function usePredictEduChainOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"peers"`.
 */
export function usePredictEduChainPeers<
  TFunctionName extends 'peers',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'peers',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"quote"`.
 */
export function usePredictEduChainQuote<
  TFunctionName extends 'quote',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'quote',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"readyToResolve"`.
 */
export function usePredictEduChainReadyToResolve<
  TFunctionName extends 'readyToResolve',
  TSelectData = ReadContractResult<typeof predictEduChainABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof predictEduChainABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: predictEduChainABI,
    functionName: 'readyToResolve',
    ...config,
  } as UseContractReadConfig<
    typeof predictEduChainABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__.
 */
export function usePredictEduChainWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof predictEduChainABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, TFunctionName, TMode>({
    abi: predictEduChainABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"_registerGame"`.
 */
export function usePredictEduChainRegisterGame<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          '_registerGame'
        >['request']['abi'],
        '_registerGame',
        TMode
      > & { functionName?: '_registerGame' }
    : UseContractWriteConfig<
        typeof predictEduChainABI,
        '_registerGame',
        TMode
      > & {
        abi?: never
        functionName?: '_registerGame'
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, '_registerGame', TMode>({
    abi: predictEduChainABI,
    functionName: '_registerGame',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"claim"`.
 */
export function usePredictEduChainClaim<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'claim'
        >['request']['abi'],
        'claim',
        TMode
      > & { functionName?: 'claim' }
    : UseContractWriteConfig<typeof predictEduChainABI, 'claim', TMode> & {
        abi?: never
        functionName?: 'claim'
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, 'claim', TMode>({
    abi: predictEduChainABI,
    functionName: 'claim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"lzReceive"`.
 */
export function usePredictEduChainLzReceive<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'lzReceive'
        >['request']['abi'],
        'lzReceive',
        TMode
      > & { functionName?: 'lzReceive' }
    : UseContractWriteConfig<typeof predictEduChainABI, 'lzReceive', TMode> & {
        abi?: never
        functionName?: 'lzReceive'
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, 'lzReceive', TMode>({
    abi: predictEduChainABI,
    functionName: 'lzReceive',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"predict"`.
 */
export function usePredictEduChainPredict<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'predict'
        >['request']['abi'],
        'predict',
        TMode
      > & { functionName?: 'predict' }
    : UseContractWriteConfig<typeof predictEduChainABI, 'predict', TMode> & {
        abi?: never
        functionName?: 'predict'
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, 'predict', TMode>({
    abi: predictEduChainABI,
    functionName: 'predict',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePredictEduChainRenounceOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<
        typeof predictEduChainABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof predictEduChainABI,
    'renounceOwnership',
    TMode
  >({
    abi: predictEduChainABI,
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"setDelegate"`.
 */
export function usePredictEduChainSetDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'setDelegate'
        >['request']['abi'],
        'setDelegate',
        TMode
      > & { functionName?: 'setDelegate' }
    : UseContractWriteConfig<
        typeof predictEduChainABI,
        'setDelegate',
        TMode
      > & {
        abi?: never
        functionName?: 'setDelegate'
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, 'setDelegate', TMode>({
    abi: predictEduChainABI,
    functionName: 'setDelegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"setDestination"`.
 */
export function usePredictEduChainSetDestination<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'setDestination'
        >['request']['abi'],
        'setDestination',
        TMode
      > & { functionName?: 'setDestination' }
    : UseContractWriteConfig<
        typeof predictEduChainABI,
        'setDestination',
        TMode
      > & {
        abi?: never
        functionName?: 'setDestination'
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, 'setDestination', TMode>({
    abi: predictEduChainABI,
    functionName: 'setDestination',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"setPeer"`.
 */
export function usePredictEduChainSetPeer<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'setPeer'
        >['request']['abi'],
        'setPeer',
        TMode
      > & { functionName?: 'setPeer' }
    : UseContractWriteConfig<typeof predictEduChainABI, 'setPeer', TMode> & {
        abi?: never
        functionName?: 'setPeer'
      } = {} as any,
) {
  return useContractWrite<typeof predictEduChainABI, 'setPeer', TMode>({
    abi: predictEduChainABI,
    functionName: 'setPeer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePredictEduChainTransferOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof predictEduChainABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<
        typeof predictEduChainABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof predictEduChainABI,
    'transferOwnership',
    TMode
  >({
    abi: predictEduChainABI,
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__.
 */
export function usePreparePredictEduChainWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof predictEduChainABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"_registerGame"`.
 */
export function usePreparePredictEduChainRegisterGame(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, '_registerGame'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: '_registerGame',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof predictEduChainABI,
    '_registerGame'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"claim"`.
 */
export function usePreparePredictEduChainClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, 'claim'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'claim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof predictEduChainABI, 'claim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"lzReceive"`.
 */
export function usePreparePredictEduChainLzReceive(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, 'lzReceive'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'lzReceive',
    ...config,
  } as UsePrepareContractWriteConfig<typeof predictEduChainABI, 'lzReceive'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"predict"`.
 */
export function usePreparePredictEduChainPredict(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, 'predict'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'predict',
    ...config,
  } as UsePrepareContractWriteConfig<typeof predictEduChainABI, 'predict'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePreparePredictEduChainRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof predictEduChainABI,
      'renounceOwnership'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof predictEduChainABI,
    'renounceOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"setDelegate"`.
 */
export function usePreparePredictEduChainSetDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, 'setDelegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'setDelegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof predictEduChainABI, 'setDelegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"setDestination"`.
 */
export function usePreparePredictEduChainSetDestination(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, 'setDestination'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'setDestination',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof predictEduChainABI,
    'setDestination'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"setPeer"`.
 */
export function usePreparePredictEduChainSetPeer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof predictEduChainABI, 'setPeer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'setPeer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof predictEduChainABI, 'setPeer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link predictEduChainABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePreparePredictEduChainTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof predictEduChainABI,
      'transferOwnership'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: predictEduChainABI,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof predictEduChainABI,
    'transferOwnership'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link predictEduChainABI}__.
 */
export function usePredictEduChainEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof predictEduChainABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: predictEduChainABI,
    ...config,
  } as UseContractEventConfig<typeof predictEduChainABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link predictEduChainABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function usePredictEduChainOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof predictEduChainABI, 'OwnershipTransferred'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: predictEduChainABI,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<
    typeof predictEduChainABI,
    'OwnershipTransferred'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link predictEduChainABI}__ and `eventName` set to `"PeerSet"`.
 */
export function usePredictEduChainPeerSetEvent(
  config: Omit<
    UseContractEventConfig<typeof predictEduChainABI, 'PeerSet'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: predictEduChainABI,
    eventName: 'PeerSet',
    ...config,
  } as UseContractEventConfig<typeof predictEduChainABI, 'PeerSet'>)
}
