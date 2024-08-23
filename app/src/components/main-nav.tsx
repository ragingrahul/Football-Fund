import Link from 'next/link'
import Image from 'next/image'
import { Card } from './ui/card'
import LiquidityPoolCard from './liquidity-pool-card'
import UserBalance from '@/components/user-balance'
import { ScrollArea } from './ui/scroll-area'

export default function MainNav() {
  return (
    <ScrollArea className="h-[100dvh]">
      <div className="flex h-[calc(100dvh-104px)] flex-1 flex-col justify-between px-4 pb-4 md:h-[calc(100vh-32px)] md:px-0 md:pb-0">
        <div className="border-b border-b-border pb-6">
          <Link href="/">
            <Image
              src="/logo2.png"
              width={400}
              height={60}
              alt="logo"
              className="mx-auto mt-1 hidden md:block"
            />
          </Link>
          <div className="flex items-center space-x-[16px] border-b border-b-border py-6 text-base font-bold">
            Balance:
            <UserBalance />
          </div>
          <LiquidityPoolCard />
          <Card />
          <a
            href="https://open-campus-docs.vercel.app/build/faucet"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center space-x-[8px] text-base font-bold leading-4 hover:underline hover:brightness-125"
          >
            <Image src="/open-campus.svg" width={16} height={16} alt="open-campus" />
            <span>Get testnet ETH</span>
            <Image
              src="/external-link.svg"
              width={12}
              height={12}
              alt="external"
            />
          </a>
          <a
            href="https://github.com/ragingrahul/Football-Prediction"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center space-x-[8px] text-base font-bold leading-4 hover:underline hover:brightness-125"
          >
            <Image src="/github.svg" width={16} height={16} alt="github" />
            <span>Go To Repository</span>
            <Image
              src="/external-link.svg"
              width={12}
              height={12}
              alt="external"
            />
          </a>
        </div>
      </div>
    </ScrollArea>
  )
}
