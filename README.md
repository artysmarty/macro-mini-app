# Macro Tracker - Base Fitness & Nutrition Mini App

A fitness and nutrition tracking mini app on Base that lets users track macros, log food, join tokenized challenges, and earn rewards.

## Features

- 📊 **Macro Tracking**: Calculate and track daily macronutrients
- 📝 **Food Diary**: Log foods via library, barcode scanning, or quick-add
- 🤖 **AI Meal Suggestions**: Get meal ideas based on remaining macros and available ingredients
- 📈 **Progress Tracking**: Track weight and body measurements over time
- 📸 **Progress Photos**: Upload photos and generate evolving 3D avatars
- 💰 **Tokenized Challenges**: Join social betting groups with staked tokens
- 🎁 **Rewards**: Earn ERC-20 tokens and NFTs for adherence to goals
- 🔗 **On-Chain**: Fully wallet-native with on-chain rewards, streaks, and challenges

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Base L2
- **Wallet Integration**: MiniKit + OnchainKit
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Base wallet (via Base App)

### Installation

1. Clone the repository:
```bash
cd "Macro Tracker"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your environment variables:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── dashboard/          # Dashboard page
│   ├── diary/              # Food diary page
│   ├── library/            # Library page (center + action)
│   ├── challenges/         # Challenges page
│   ├── settings/           # Settings page
│   └── onboarding/         # Onboarding flow
├── components/             # React components
│   ├── dashboard/          # Dashboard components
│   ├── diary/              # Diary components
│   ├── layout/             # Layout components
│   └── navigation/         # Navigation components
├── lib/                    # Utility functions and configs
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── contracts/              # Smart contracts (future)
```

## Development Roadmap

### MVP (Current)
- ✅ Project setup with Next.js, TypeScript, Tailwind
- ✅ MiniKit + OnchainKit integration
- ✅ Bottom navigation structure
- ✅ Basic dashboard layout
- ✅ Food diary structure
- ⏳ Onboarding flow
- ⏳ API routes and database setup
- ⏳ Smart contracts (ERC-20, Challenge Pots, NFTs)
- ⏳ Reward distribution logic

### Future Enhancements
- Barcode scanning integration
- Health API integrations (Apple Health, Google Fit, etc.)
- 3D avatar generation
- ZK privacy proofs
- Advanced fraud detection

## Contributing

This is a work in progress. See the PRD for full feature specifications.

## License

MIT

