'use client'

import Image from 'next/image'
import { formatEther, parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { 
    useBondTokenBorrowLimit, 
    useBondTokenGetBorrowed, useBondTokenGetCollateral, 
    useBondTokenGetTotalAmountToRepay,  
} from '@/generatedLiquidityPool'
import { FormEvent, useEffect, useState } from 'react';
import { eusdcContractAddress, liquidityContractAddress } from '@/config/contract'
import { eusdcTokenABI, bondTokenABI } from '@/generatedLiquidityPool'
import { Loader2 } from 'lucide-react'
import {
    prepareWriteContract,
    writeContract,
} from 'wagmi/actions'
import { useAccount } from 'wagmi'
import { Alert, AlertTitle } from './ui/alert'


export default function LiquidityPoolCard() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [collateralValue, setCollateralValue] = useState<string>('');
    const [removecollateralValue, setRemoveCollateralValue] = useState<string>('');
    const [borrowValue,setBorrowValue] = useState<string>('');
    const [repayBorrowValue, setRepayBorrowValue] = useState<string>('');
    const { address } = useAccount()
    const { data: collateralBalance } = useBondTokenGetCollateral({
        address: liquidityContractAddress,
        account: address
    })

    const { data: borrowedBalance } = useBondTokenGetBorrowed({
        address: liquidityContractAddress,
        account: address
    })

    const { data: borrowLimit } = useBondTokenBorrowLimit({
        address: liquidityContractAddress,
        account: address
    })

    const { data: totalAmountToReplay } = useBondTokenGetTotalAmountToRepay({
        address: liquidityContractAddress,
        account: address
    })


    const addCollateral = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null)
        if (parseEther(collateralValue) <= 0) {
            setError(`Collateral amount should be more than 0 EUSDC`)
            setTimeout(() => setError(null), 3000)
            return
        }
        setIsLoading(true)
        try {
            const approveTokenTransferConfig = await prepareWriteContract({
                address: eusdcContractAddress,
                abi: eusdcTokenABI,
                functionName: 'approve',
                args: [
                    liquidityContractAddress,
                    parseEther(collateralValue)
                ],
            })
            let tx = await writeContract(approveTokenTransferConfig)

            const addCollateralConfig = await prepareWriteContract({
                address: liquidityContractAddress,
                abi: bondTokenABI,
                functionName: 'addCollateral',
                args: [
                    parseEther(collateralValue)
                ],
            })
            let tx2 = await writeContract(addCollateralConfig)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    };

    const removeCollateral = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null)
        if (parseEther(removecollateralValue) > (collateralBalance ?? BigInt(0)) || parseEther(removecollateralValue) <= 0) {
            setError(`Removal amount should be more than 0 EUSDC and less than provided Collateral`)
            setTimeout(() => setError(null), 3000)
            return
        }
        setIsLoading(true)
        try {
            const removeCollateralConfig = await prepareWriteContract({
                address: liquidityContractAddress,
                abi: bondTokenABI,
                functionName: 'removeCollateral',
                args: [
                    parseEther(removecollateralValue)
                ],
            })
            let tx2 = await writeContract(removeCollateralConfig)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    };

    const borrowAsset= async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null)
        if (parseEther(borrowValue) >= (borrowLimit ?? BigInt(0))) {
            
            setError(`Cannot borrow more than ${formatEther(borrowLimit ?? BigInt(0))}`)
            setTimeout(() => setError(null), 3000)
            return
        }
        if (parseEther(borrowValue) <= 0) {
            setError(`Borrow amount should be more than 0 Edu Coin`)
            setTimeout(() => setError(null), 3000)
            return
        }
        setIsLoading(true)
        try {
            const borrowConfig = await prepareWriteContract({
                address: liquidityContractAddress,
                abi: bondTokenABI,
                functionName: 'borrow',
                args: [
                    parseEther(borrowValue)
                ],
            })
            let tx = await writeContract(borrowConfig)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const repayAsset=async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null)
        if (parseEther(borrowValue) >= (totalAmountToReplay ?? BigInt(0))) {
            setError(`Cannot repay more than ${formatEther(totalAmountToReplay ?? BigInt(0))}`)
            setTimeout(() => setError(null), 3000)
            return
        }
        if (parseEther(borrowValue) <= 0) {
            setError(`Borrow amount should be more than 0 Edu Coin`)
            setTimeout(() => setError(null), 3000)
            return
        }
        setIsLoading(true)
        try {
            const borrowConfig = await prepareWriteContract({
                address: liquidityContractAddress,
                abi: bondTokenABI,
                functionName: 'repay',
                value: parseEther(repayBorrowValue)
            })
            let tx = await writeContract(borrowConfig)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mb-4 flex flex-col w-full items-start justify-start  rounded-[8px] bg-card py-6 pl-3 pr-4">
            <div>
                <div className="mb-2 flex ">
                    <p className="font-[350] leading-4 pr-1">
                        Collateral Balance:
                    </p>
                    <p className="font-[350] leading-4 px-1">
                        {formatEther(collateralBalance ?? BigInt(0))}
                    </p>
                </div>
                <form onSubmit={addCollateral} className="flex items-center space-x-2 mb-2">
                    <input
                        type="number"
                        value={collateralValue}
                        onChange={(e) => setCollateralValue(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter an integer"
                    />
                    <Button
                        disabled={isLoading}
                        className="w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Add Collateral'
                        )}
                    </Button>
                </form>
                <form onSubmit={removeCollateral} className="flex items-center space-x-2 mb-2">
                    <input
                        type="number"
                        value={removecollateralValue}
                        onChange={(e) => setRemoveCollateralValue(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter an integer"
                    />
                    <Button
                        disabled={isLoading}
                        className="w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Remove Collateral'
                        )}
                    </Button>
                </form>
            </div>
            <div>
                <div className="mb-2 flex ">
                    <p className="font-[350] leading-4 pr-1">
                        Borrowed Amount
                    </p>
                    <p className="font-[350] leading-4 px-1">
                        {formatEther(borrowedBalance ?? BigInt(0))}
                    </p>
                </div>
                <form onSubmit={borrowAsset} className="flex items-center space-x-2 mb-2">
                    <input
                        type="number"
                        value={borrowValue}
                        onChange={(e) => setBorrowValue(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Amount to borrow"
                    />
                    <Button
                        disabled={isLoading}
                        className="w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Borrow Tokens'
                        )}
                    </Button>
                </form>
                <form onSubmit={repayAsset}className="flex items-center space-x-2 mb-2">
                    <input
                        type="number"
                        value={repayBorrowValue}
                        onChange={(e) => setRepayBorrowValue(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter an integer"
                    />
                    <Button
                        disabled={isLoading}
                        className="w-full bg-[#375BD2] text-base font-black leading-4 text-foreground hover:bg-[#375BD2]/90"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Repay Amount'
                        )}
                    </Button>
                </form>
            </div>
            {error ? (
                <Alert
                    variant="destructive"
                    className="mt-4 flex items-center space-x-4 border-0 bg-[#FCCDCD] text-[#DE2624]"
                >
                    <Image src="/alert-diamond.svg" width={24} height={24} alt="alert" />
                    <AlertTitle>{`Error: ${error}`}</AlertTitle>
                </Alert>
            ) : null}
        </div>
    )
}

