# 🎰 Pocket Rehab: Toxic Shock

**High-Volatility Cluster Slot | 6x5 Grid | 50,000x Max Win**

A dark-humor cluster-pays slot featuring the innovative "Overdose Cycle" mechanic.

![Game Status](https://img.shields.io/badge/status-playable-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

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

**High Pay (The Addicts):**
- 🐀 Sparky (The Rat) - 1.0x per symbol
- 🦎 Zippo (The Lizard) - 1.5x per symbol
- 🐢 Squirt (The Turtle) - 2.0x per symbol

**Low Pay (The Paraphernalia):**
- 🦴 Skeleton Fish - 0.1x
- 🖕 Middle Finger - 0.12x
- 💉 Syringe - 0.15x
- 💊 Baggie - 0.18x
- 💊 Spilled Pills - 0.2x
- 🥫 Crushed Can - 0.25x

**Special Symbols:**
- 🤮 Neon Puke Wild - 2.5x per symbol
- ✉️ Scatter (Rejected Letter) - Triggers bonuses
- 💉 Doctor - Resets multipliers in free spins

### Bonus Games

#### 🎣 3 Scatters: "Catch 'Em... If You Can"
Carnival shooting game - throw bricks at hallucinations in a dead field. Hit targets for cash, crit for extra lives, miss and lose a life.

#### 🥊 4 Scatters: "Alleyway Beatdown"
Boss battle in a rusty cage. 5 guaranteed spins dealing damage. Every damage point = cash. Beat the boss for +3 spins and doubled multipliers.

#### ☢️ 5 Scatters: "Detox Ward" (Free Spins)
- 10 free spins with pre-infected symbols
- Sticky multipliers that DON'T RESET between spins (x2 → x4 → x8 → x16...)
- Doctor symbol resets all multipliers (the buzzkill!)
- **Max win potential: 50,000x**

### 💰 Bonus Buy Menu

Purchase features instantly:
- **Catch 'Em:** 100x bet (Medium Risk)
- **Alleyway Beatdown:** 200x bet (High Risk)
- **Detox Ward:** 500x bet (Extreme Risk, Max Potential)

## Technology Stack
- **PixiJS v8**: High-performance WebGL rendering
- **TypeScript**: Strict mode for type safety
- **Spine2D**: Ready for advanced character animations
- **Vite**: Modern build tool for fast development

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Game Assets

**IMPORTANT:** Place your downloaded PNG images in the `/public/assets/` folder structure:

```
public/assets/
├── backgrounds/     # Place bg_main_alley.png, bg_bonus_cage.png, bg_bonus_field.png
├── ui/             # Place ui_container_grid_6x5.png, ui_btn_spin.png, etc.
├── characters/     # Place char_high_sparky.png, char_high_zippo.png, char_high_squirt.png
├── symbols/        # Place sym_low_fish.png, sym_low_finger.png, etc.
├── specials/       # Place sym_special_wild.png, sym_special_scatter.png, etc.
├── fx/             # Place overlay_infected.png
└── bonus/          # Place icon_bonus_brick.png, icon_bonus_taser.png, icon_bonus_fist.png
```

📁 **See the complete list:** `/public/assets/PLACE_IMAGES_HERE.md`

**Note:** The game will work without images using colored fallback placeholders, but for the full experience, add your PNG files!

### 3. Run Development Server

```bash
npm run dev
```

The game will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `/dist` folder.

### 5. Type Check

```bash
npm run type-check
```

## 📁 Project Structure

```
Pocket-Rehab/
├── public/
│   └── assets/              # 🖼️ PLACE YOUR IMAGES HERE
│       ├── backgrounds/     # Background images
│       ├── ui/             # UI elements
│       ├── characters/     # Character symbols
│       ├── symbols/        # Low-pay symbols
│       ├── specials/       # Special symbols
│       ├── fx/             # Effects
│       └── bonus/          # Bonus icons
├── src/
│   ├── assets/
│   │   ├── AssetManifest.ts    # Asset definitions
│   │   └── AssetLoader.ts      # Asset loading system
│   ├── core/
│   │   ├── Config.ts           # Game configuration
│   │   ├── GameEngine.ts       # Main game logic
│   │   ├── GameRenderer.ts     # Basic renderer (deprecated)
│   │   ├── VisualRenderer.ts   # Enhanced renderer with assets
│   │   ├── ClusterDetector.ts  # Cluster detection
│   │   └── WinCalculator.ts    # Win calculation
│   ├── mechanics/
│   │   ├── OverdoseCycle.ts    # Overdose cycle mechanic
│   │   └── Cascade.ts          # Cascading mechanic
│   ├── bonuses/
│   │   ├── ShooterBonus.ts     # Shooter bonus
│   │   ├── BossBattleBonus.ts  # Boss battle
│   │   └── FreeSpinsBonus.ts   # Free spins
│   ├── ui/
│   │   └── BonusBuyMenu.ts     # Bonus buy interface
│   ├── types/
│   │   └── GameTypes.ts        # Type definitions
│   ├── utils/
│   │   └── Helpers.ts          # Utility functions
│   └── index.ts                # Entry point
├── GAME_GUIDE.md               # 📖 Complete gameplay guide
└── README.md                   # This file
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

## 🎮 Controls

- **Click SPIN:** Trigger a spin
- **Click BONUS BUY:** Open bonus purchase menu
- **ESC:** Close bonus buy menu

## 📖 Documentation

- **[GAME_GUIDE.md](./GAME_GUIDE.md)** - Complete gameplay guide with strategies
- **[MECHANICS.md](./MECHANICS.md)** - Technical mechanics documentation
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Implementation details

## 🎨 Visual Features

- **Asset Loading System:** Automatically loads all PNG images from `/public/assets/`
- **Fallback Graphics:** Colored placeholders when assets are missing
- **Overdose Cycle Effects:**
  - Stage 1 (Infected): Green glitch overlay
  - Stage 2 (Mutated): Yellow glow
  - Stage 3 (Exploded): Red fade with multiplier
- **Bonus Buy Menu:** Full-screen overlay interface
- **Real-time Multipliers:** Displayed on grid positions

## 🛠️ Tech Stack

- **PixiJS 8.0** - WebGL rendering engine
- **TypeScript 5.3** - Type-safe development
- **Vite 7.2** - Fast build tool
- **pixi-spine** - Character animation support (ready for future use)

## 🚧 Coming Soon

- [ ] Sound effects and background music
- [ ] Advanced animation system
- [ ] Mobile/touch controls optimization
- [ ] Autoplay functionality
- [ ] Game history log
- [ ] Settings panel (volume, speed, etc.)
- [ ] Achievement system
- [ ] Statistics tracking

## 🐛 Known Issues

None currently! The game builds and runs successfully.

## 🤝 Contributing

This is a showcase project for the Pocket Rehab: Toxic Shock slot game concept.

## 📄 License

MIT

---

**Built with ❤️ and TypeScript**

*Where recovery meets relapse, one spin at a time.* 🎰
