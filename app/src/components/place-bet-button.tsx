'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatEther, parseEther, toHex } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import {
  prepareWriteContract,
  readContract,
  writeContract,
} from 'wagmi/actions'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useLocalStateContext } from '@/app/context'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { contractAddress, maxWager, minWager, standardFee, crossChainGasFeeValue } from '@/config/contract'
import { winnerToResult } from '@/config/api'
import { predictEduChainABI } from '@/generatedEdu'

export default function PlaceBetButton({
  setTab,
}: {
  setTab: (tab: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()
  const { data } = useBalance({ address })
  const { predictions, setPredictions } = useLocalStateContext()

  const searchParams = useSearchParams()
  const testMode = searchParams.get('mode') === 'test'

  const placePredictions = async () => {
    setError(null)
    if (predictions.some((p) => p.wager === undefined || p.wager <= 0)) {
      setError('You must enter a wager amount to continue')
      setTimeout(() => setError(null), 3000)
      return
    }
    if (predictions.some((p) => p.wager! < minWager)) {
      setError(`Minimum bet amount is ${minWager} EDU`)
      setTimeout(() => setError(null), 3000)
      return
    }
    if (predictions.some((p) => p.wager! > maxWager)) {
      setError(`Maximum bet amount is ${maxWager} EDU`)
      setTimeout(() => setError(null), 3000)
      return
    }
    if (
      predictions.reduce((prev, cur) => prev + cur.wager!, 0) >
      Number(formatEther(data?.value ?? BigInt(0)))
    ) {
      setError(`Insufficient Balance`)
      setTimeout(() => setError(null), 3000)
      return
    }
    setIsLoading(true)
    try {
      await Promise.all(
        predictions.map(async (prediction) => {
          let tx
          const gameId = await readContract({
            address: contractAddress,
            abi: predictEduChainABI,
            functionName: 'getGameId',
            args: [BigInt(prediction.game.sportId), BigInt(prediction.game.id)],
          })
          console.log(gameId)
          const newPredictionIdx = (
            await readContract({
              address: contractAddress,
              abi: predictEduChainABI,
              functionName: 'getActivePredictions',
              args: [address!],
            })
          ).filter((p) => p.gameId === gameId).length
          const game = await readContract({
            address: contractAddress,
            abi: predictEduChainABI,
            functionName: 'getGame',
            args: [gameId],
          })
          if (game.externalId === BigInt(0)) {
            const timestamp = BigInt(prediction.game.timestamp)
            console.log("works fine",prediction.wager)
            const registerGameconfig=await prepareWriteContract({
              address: contractAddress,
              abi: predictEduChainABI,
              functionName: '_registerGame',
              args: [
                BigInt(prediction.game.sportId),
                BigInt(prediction.game.id),
                timestamp,
                crossChainGasFeeValue
              ],
              value: standardFee
            })
            
            tx = await writeContract(registerGameconfig)
            
            const predictGameconfig=await prepareWriteContract({
              address: contractAddress,
              abi: predictEduChainABI,
              functionName: 'predict',
              args: [gameId, parseEther(`${prediction.wager ?? 0}`), winnerToResult[prediction.predictedWinner], crossChainGasFeeValue],
              value: parseEther(`${prediction.wager?? 0}`)+standardFee,
            })
            let tx2 = await writeContract(predictGameconfig)
          } else {
            const config = await prepareWriteContract({
              address: contractAddress,
              abi: predictEduChainABI,
              functionName: 'predict',
              args: [gameId,parseEther(`${prediction.wager ?? 0}`), winnerToResult[prediction.predictedWinner],crossChainGasFeeValue],
              value: parseEther(`${prediction.wager ?? 0}`)+standardFee,
            })
            tx = await writeContract(config)
          }
          setPredictions([])
          setTab('my-bets')
          localStorage.setItem(
            `prediction-${gameId}-${newPredictionIdx}`,
            tx.hash,
          )
        }),
      )
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        disabled={isLoading}
        onClick={async () => await placePredictions()}
        className="w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : predictions.length === 1 ? (
          'Place Prediction'
        ) : (
          'Place Predictions'
        )}
      </Button>
      {error ? (
        <Alert
          variant="destructive"
          className="mt-4 flex items-center space-x-4 border-0 bg-[#FCCDCD] text-[#DE2624]"
        >
          <Image src="/alert-diamond.svg" width={24} height={24} alt="alert" />
          <AlertTitle>{`Error: ${error}`}</AlertTitle>
        </Alert>
      ) : null}
    </>
  )
}
