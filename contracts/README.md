# Smart Contracts

This directory contains the smart contracts for Macro Tracker.

## Contracts

### MacroTrackerToken.sol
ERC-20 token for rewards distribution. Features:
- Daily, weekly, and monthly reward claims
- Maximum supply of 1 billion tokens
- Admin minting for challenge payouts

### ChallengePot.sol
Manages fitness challenge pots with staking. Features:
- Create challenges with configurable stake amounts
- Join challenges by staking tokens (ERC20 or native ETH)
- Set adherence scores (backend)
- Distribute pot to top 3 winners (50/30/20 split)

### ProgressNFT.sol
NFTs for milestone achievements. Features:
- Mint NFTs for monthly milestones and challenge completions
- Store metadata (goal type, outcome stats, challenge ID)
- Track user's progress NFTs

## Deployment

1. Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Deploy to Base:
```bash
npx hardhat run scripts/deploy.js --network base
```

## Testing

```bash
npx hardhat test
```

