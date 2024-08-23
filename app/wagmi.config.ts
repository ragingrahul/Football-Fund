import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generatedLiquidityPool.ts',
  plugins: [
    hardhat({
      project: '../contracts',
      artifacts: '../contracts/build/artifacts',
      include: ['contracts/LiquidityPool/LendingPool.sol/**','contracts/LiquidityPool/EUSDC.sol/**'],
    }),
    react({
      useContractRead: true,
      useContractFunctionRead: true,
    }),
  ],
})
