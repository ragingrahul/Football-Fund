import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { optimismSepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { eduChain } from './eduChain'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [eduChain],
  [
    jsonRpcProvider({
      rpc:(chain)=>({
        http:chain.rpcUrls.default.http[0]
      })
    }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_OPEN_CAMPUS_RPC! }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'rugby-predictions',
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }
