import { defineChain } from 'viem'

export const eduChain = defineChain({
    id: 656476,
    name: 'Open Campus Codex',
    nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
        public: {
            http: [],
            webSocket: undefined
        }
    },
    blockExplorers: {
        default: { name: 'Open Campus Codex', url: 'https://opencampus-codex.blockscout.com' },
    },
    network: '',
    testnet: true
})