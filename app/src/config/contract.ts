import { Address } from 'viem'

export const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const eusdcContractAddress = process.env
  .NEXT_PUBLIC_EUSDC_CONTRACT_ADDRESS as Address

export const liquidityContractAddress = process.env
  .NEXT_PUBLIC_LIQUIDITY_CONTRACT_ADDRESS as Address


export const minWager = 0.5
export const maxWager = 2
export const standardFee = BigInt(584384526681462545)
export const crossChainGasFeeValue = BigInt(150000)
