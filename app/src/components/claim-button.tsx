'use client'

import { useEffect } from 'react'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contractAddress } from '@/config/contract'
import { usePreparePredictEduChainClaim } from '@/generatedEdu'
 
const ClaimButton = ({
  gameId,
}: {
  gameId: bigint
  calculatedWinnings: bigint
  onTransfer: (bool: boolean) => void
}) => {
  const { config: withdrawConfig } = usePreparePredictEduChainClaim({
    address: contractAddress,
    args: [gameId],
  })
  const { write: withdraw, data: withdrawData } =
    useContractWrite(withdrawConfig)

  const { isLoading: isLoadingWithdraw } = useWaitForTransaction({
    hash: withdrawData?.hash,
  })

  useEffect(() => {
    if (withdrawData?.hash) {
      localStorage.setItem(`claim-${gameId}`, withdrawData?.hash)
    }
  }, [withdrawData?.hash, gameId])

  return (
    <div className="flex space-x-2">
      <Button
        disabled={!withdraw || isLoadingWithdraw }
        onClick={() => withdraw?.()}
        className="mb-2 w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
      >
        {isLoadingWithdraw ? (
          <Loader2 className="animate-spin" />
        ) : (
          <span>Withdraw</span>
        )}
      </Button>
    </div>
  )
}

export default ClaimButton
