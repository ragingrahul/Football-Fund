
## Requirements

- Node.js version [18](https://nodejs.org/en/download/) or higher

## Getting Started

Clone the repo:

```bash
git clone https://github.com/ragingrahul/Football-Fund
```

It contains two separate projects:

- [`contracts`](./contracts/) - the smart contracts
- [`app`](./app/) - the frontend

## Description

FootballFund: Cross-Chain Community-Driven Betting with DeFi Integration FootballFund is an innovative betting platform that combines the excitement of sports gambling with decentralized finance (DeFi) concepts, leveraging cutting-edge blockchain technology. Here's how it works:

Platform Infrastructure:

Primary Deployment: The main smart contracts are deployed on the Open Campus blockchain, providing a robust and scalable foundation.

Cross-Chain Integration: The platform utilizes cross-chain messaging to interact with Arbitrum Sepolia, enabling advanced features and data retrieval.

![Football Fund Workflow](Football%20Prediction%20Workflow.png)

Match Betting: Users can place bets on upcoming football matches, choosing either a home win, away win, or draw. Payout Structure:

For correct home or away win predictions, users receive payouts based on odds and stakes. In case of a draw, betted amounts are redirected to a special liquidity pool.


The Draw Pool: All bets on matches ending in draws accumulate in a smart contract-controlled liquidity pool on Open Campus, growing over time. 

![Football Fund Liquidity Pool](./Football%20Prediction%20Liquidity%20Pool.png)

DeFi Integration: The liquidity pool serves dual purposes:

Borrowing: Users can take short-term loans from this pool. Lending: Liquidity providers earn interest on deposits.

Chainlink Integration:

Chainlink Functions: Used to fetch real-time match data and results from external APIs, ensuring accurate and timely information. Chainlink Automation: Triggers automated processes for result verification, payout distributions, and liquidity pool management.

Cross-Chain Operations:

Open Campus hosts the main contracts and user interactions. Arbitrum Sepolia facilitates interactions with Chainlink services, leveraging its established oracle network. Cross-chain messaging ensures seamless data flow between the two networks.

Risk and Reward:

Bettors have the chance to win big on correct predictions. Even in the case of a draw, their stake contributes to a growing DeFi ecosystem, potentially earning them passive income in the long run.

Responsible Gambling: The platform incorporates features to promote responsible betting, including self-imposed limits and cool-off periods.

FootballFund aims to revolutionize sports betting by introducing DeFi elements and leveraging advanced blockchain technology. It offers users multiple ways to participate and benefit, whether through direct betting, providing liquidity, or engaging in the borrowing/lending ecosystem. The integration of Open Campus and Arbitrum Sepolia, coupled with Chainlink's robust oracle services, ensures a secure, transparent, and efficient betting experience that goes beyond traditional gambling platforms.


