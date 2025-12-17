# SplitKit

Pixel RuneScape-style single-player web game built with Next.js. Wallet optional; Holder Mode perks + Bags token integration.

## Overview

SplitKit is an Old School RuneScape-inspired browser RPG featuring:
- **Free-to-play** core gameplay (no wallet required)
- **Optional Holder Mode** with exclusive zones, cosmetics, daily claims, and extra save slots
- **Epoch-based rewards** (post-launch) proportional to Holding Weight × In-game Renown
- **Bags integration** for token swapping (pre-launch gated)

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Phaser 3** (game engine)
- **Tailwind CSS**
- **Solana Wallet Adapter** (Phantom)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/splitkitfun/SplitKit.git
cd SplitKit

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Token Configuration
NEXT_PUBLIC_TOKEN_LIVE=false                    # Set to "true" when token is live
NEXT_PUBLIC_TOKEN_MINT=                         # SPL token mint address (when live)
NEXT_PUBLIC_BASE_MINT=So11111111111111111111111111111111111111112  # wSOL mint

# Holder Mode
NEXT_PUBLIC_HOLDER_TOKEN_MINT=                  # Token mint for holder verification
NEXT_PUBLIC_HOLDER_MIN_BALANCE=1                # Minimum tokens for holder status
NEXT_PUBLIC_HOLDER_ZONE_ENABLED=true
NEXT_PUBLIC_HOLDER_CHECK_STRATEGY=mock          # "mock" for dev, "rpc" for production

# Solana RPC (for holder check)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Or use Helius/QuickNode

# Bags API (server-side only)
BAGS_API_KEY=                                   # Get from https://bags.fm

# Social Links (optional)
NEXT_PUBLIC_GITHUB_URL=https://github.com/splitkitfun/SplitKit
NEXT_PUBLIC_X_URL=https://x.com/SplitKitFun
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Pre-Launch vs Post-Launch

### Pre-Launch Mode (`NEXT_PUBLIC_TOKEN_LIVE=false`)

- ✅ All gameplay features work
- ✅ Holder Mode can be enabled (with mock/rpc verification)
- ❌ "Buy Token" button is disabled
- ❌ Bags API routes return 403
- ❌ Epoch rewards show "Coming soon"

### Post-Launch Mode (`NEXT_PUBLIC_TOKEN_LIVE=true`)

- ✅ All pre-launch features
- ✅ "Buy Token" button enabled
- ✅ Bags swap flow active
- ✅ Epoch rewards system active (when implemented)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

The project is configured for Vercel's Next.js optimization.

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Self-hosted (Node.js server)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── play/              # Main game page
│   ├── docs/              # Documentation
│   └── api/               # API routes (holder check, Bags proxy)
├── components/            # React components
│   ├── site/             # Header, Footer
│   └── game/             # Game UI components
├── game/                  # Game engine code
│   ├── engine/           # Phaser scenes, camera, map
│   ├── systems/          # Inventory, quests, save/load
│   └── ui/               # In-game UI panels
├── holder/                # Holder Mode logic
├── config/                # Configuration files
└── types.ts              # TypeScript type definitions
```

## Key Features

### Gameplay
- **Skills**: Woodcutting, Fishing, Cooking
- **Quests**: Tutorial quests with rewards
- **World**: Multiple connected areas to explore
- **Inventory & Bank**: Item management and storage
- **Save System**: Browser-local saves (multiple slots for holders)

### Holder Mode
- **Founder's Grove**: Exclusive holder-only zone
- **Cosmetics**: Titles, cape colors, nameplate styles
- **Daily Claim**: Essence and Rations (24h cooldown)
- **Extra Save Slots**: 3 slots vs 1 for guests

### Security
- Bags API key stored server-side only
- Wallet connection is optional and user-initiated
- No auto-connect on page load
- Pre-launch gates prevent accidental transactions

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[Add your license here]

## Links

- **Live Site**: [Add your URL]
- **GitHub**: https://github.com/splitkitfun/SplitKit
- **X/Twitter**: https://x.com/SplitKitFun
