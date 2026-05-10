# StakeBattle

StakeBattle is a decentralized PvP betting application built on Ethereum-compatible blockchain networks.

Users can create battles by staking ETH, join battles created by other users, and resolve matches directly on-chain. The winning player receives the entire prize pool through the smart contract.

The project was developed as a semester blockchain application using Solidity, Hardhat, Next.js, ethers.js, and MetaMask.

# Live Demo

Frontend:  
https://stakebattle.vercel.app/

Smart Contract Address:  
0xC2b88E7358a931f4A9B45a784d5Ec29CDA7048eA

Network:  
OP Sepolia Testnet

# Features

- MetaMask wallet connection
- ETH-based PvP battles
- Smart contract escrow system
- Join and resolve battle functionality
- Automatic winner payout
- Leaderboard system
- Battle filtering and sorting
- Active and completed battle tabs
- Responsive frontend interface
- Smart contract event support
- Real blockchain transactions

# Technology Stack

## Blockchain

- Solidity
- Hardhat
- ethers.js

## Frontend

- Next.js
- React
- Tailwind CSS

## Deployment

- Vercel
- OP Sepolia Testnet

# Project Structure

```text
block/
├── contracts/
├── scripts/
├── test/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
```

# Smart Contract Overview

The main contract is `StakeBattle.sol`.

## Main Functions

### createBattle()

Creates a new battle and locks ETH inside the smart contract.

### joinBattle()

Allows another player to join the battle by matching the same ETH stake amount.

### resolveBattle()

Selects a winner using pseudo-random on-chain generation and transfers the entire prize pool to the winning address.

# Solidity Events

The contract emits the following events:

- `BattleCreated`
- `BattleJoined`
- `BattleResolved`

These events are used for blockchain activity tracking and frontend synchronization.

# Testing

The project includes unit tests for:

- battle creation
- joining battles
- battle resolution
- revert conditions
- edge cases

## Coverage Results

| Metric | Coverage |
|---|---|
| Statements | 100% |
| Functions | 100% |
| Lines | 100% |
| Branches | 56.25% |

Run tests:

```bash
npx hardhat test
```

Run coverage:

```bash
npx hardhat coverage
```

# Installation

## Clone Repository

```bash
git clone https://github.com/frtndmd/stakebattle.git
```

## Install Backend Dependencies

```bash
npm install
```

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

# Environment Variables

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key
```

# Run Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

# Deploy Smart Contract

```bash
npx hardhat run scripts/deploy.js --network opSepolia
```

# Usage

1. Connect MetaMask wallet
2. Create a battle with ETH stake
3. Another user joins the battle
4. Resolve the battle
5. Winner receives the ETH reward

# Limitations

- Randomness is pseudo-random and generated on-chain
- Application currently supports OP Sepolia only
- No backend database integration
- No matchmaking system

# Learning Outcomes

During development of this project, the following topics were explored:

- Solidity smart contract development
- Smart contract testing
- Blockchain deployment workflows
- MetaMask wallet integration
- Frontend interaction with blockchain using ethers.js
- Next.js decentralized application development
- Smart contract events
- On-chain game logic

# Future Improvements

Potential future improvements include:

- Chainlink VRF integration
- Matchmaking system
- NFT rewards
- User profiles
- Tournament mode
- Improved animations
- Real-time event subscriptions

# License

MIT