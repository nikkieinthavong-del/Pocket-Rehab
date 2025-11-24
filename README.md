# Pocket Rehab: Toxic Shock

High-Volatility Cluster Slot | 6x5 Grid | 50,000x Max Win

A dark-humor cluster-pays slot featuring the innovative "Overdose Cycle" mechanic.

## Features

### Core Mechanics
- **6x5 Grid**: Cluster-pays system requiring 8+ matching symbols
- **Cascading Wins**: Winning symbols removed and new symbols drop to fill spaces
- **Max Win**: 50,000x bet multiplier cap

### Overdose Cycle (3-Stage Mechanic)
1. **Stage 1 - Infection**: Winning symbols stick with infection overlay
2. **Stage 2 - Mutation**: If infected symbols win again, they mutate to Wilds
3. **Stage 3 - Explosion**: Wilds explode leaving permanent x2 grid multipliers

### Symbol Types
- Low-paying symbols: LOW1, LOW2, LOW3
- Medium-paying symbols: MED1, MED2
- High-paying symbols: HIGH1, HIGH2
- Special symbols: WILD, SCATTER, DOCTOR

### Bonus Games

#### 3-Reel Shooter (3 Scatters)
Hit targets across 3 reels for multiplier wins (5-15x per hit).

#### Boss Battle (4 Scatters)
Deal damage to the boss - damage dealt = cash won. Defeat the boss for a 1.5x bonus multiplier.

#### Free Spins (5 Scatters)
- 10 free spins awarded
- Pre-infected symbols on the grid
- Sticky multipliers accumulate
- Doctor symbol resets all sticky multipliers

## Technology Stack
- **PixiJS v8**: High-performance WebGL rendering
- **TypeScript**: Strict mode for type safety
- **Spine2D**: Ready for advanced character animations
- **Vite**: Modern build tool for fast development

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Type Check

```bash
npm run type-check
```

## Project Structure

```
src/
├── core/
│   ├── Config.ts           # Game configuration and constants
│   ├── GameEngine.ts       # Main game logic engine
│   ├── GameRenderer.ts     # PixiJS rendering layer
│   ├── ClusterDetector.ts  # Cluster-pays detection algorithm
│   └── WinCalculator.ts    # Win calculation and multipliers
├── mechanics/
│   ├── OverdoseCycle.ts    # 3-stage overdose mechanic
│   └── Cascade.ts          # Cascading/gravity mechanic
├── bonuses/
│   ├── ShooterBonus.ts     # 3-reel shooter bonus
│   ├── BossBattleBonus.ts  # Boss battle bonus
│   └── FreeSpinsBonus.ts   # Free spins with sticky multipliers
├── types/
│   └── GameTypes.ts        # TypeScript type definitions
├── utils/
│   └── Helpers.ts          # Utility functions
└── index.ts                # Application entry point
```

## Game Logic

### Cluster Detection
Uses flood-fill algorithm to detect connected symbols (4-way adjacency). Wild symbols match with any symbol type.

### Win Calculation
- Base win = symbol payout × cluster size × bet
- Applied multipliers from grid positions
- Capped at 50,000x max win

### Cascade Flow
1. Detect clusters
2. Calculate wins
3. Process overdose stages
4. Remove winning symbols
5. Apply gravity
6. Fill empty spaces
7. Repeat until no more wins

## License

MIT
