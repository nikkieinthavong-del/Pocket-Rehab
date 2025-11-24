# POCKET REHAB: RELAPSE EDITION

A high-volatility cluster-pays slot game with dark humor and unique mechanics.

**Grid:** 6 Reels × 5 Rows | **Max Win:** 50,000x Bet

## Features

### The Overdose Cycle
1. **Infection** - Winning symbols glow green and stick
2. **Mutation** - Win again with infected symbols → they turn into Wilds
3. **Crash** - Wild wins explode → leave permanent x2 multipliers on grid spots

### Game Mechanics
- **Pay Anywhere** - Match 8+ symbols anywhere on screen (no paylines)
- **Cascading Reels** - Winning symbols disappear and new ones fall
- **Sticky Multipliers** - Multiplier spots boost all future wins

### Bonus Rounds

#### 🎣 Catch 'Em... If You Can (3 Scatters)
A shooting gallery bonus with 3 lives. Use weapons to hit targets:
- Weapon types: Brick, Taser, Fist
- Hit = Cash prize
- Crit = Cash + Extra life
- Miss = Lose a life

#### 🥊 Alleyway Beatdown (4 Scatters)
Boss battle with 5 guaranteed spins:
- Deal damage to deplete Boss HP
- Every damage point = Cash
- Defeat boss = +3 spins + doubled multipliers
- Continue until out of spins

#### ☢️ Detox Ward (5 Scatters or Buy 500x)
10 Free Spins with enhanced mechanics:
- Symbols drop already infected
- Multipliers stick and grow
- BEWARE: Doctor symbol resets all multipliers

### Bonus Buy
- 100x Bet = Catch 'Em
- 200x Bet = Beatdown
- 500x Bet = Detox Ward

## Installation

1. Place your game images in the `assets/` folders (see IMAGE_PLACEMENT_GUIDE.md)
2. Open `index.html` in a web browser
3. No server required - runs completely in browser

## Project Structure

```
Pocket-Rehab/
├── index.html              # Main game page
├── css/
│   └── style.css          # All game styling
├── js/
│   ├── config.js          # Game configuration
│   ├── game.js            # Main game logic
│   └── bonus.js           # Bonus round logic
├── assets/
│   ├── backgrounds/       # Background images
│   ├── ui/               # UI elements
│   ├── characters/       # High-pay character symbols
│   ├── symbols/          # Low-pay symbols
│   ├── specials/         # Wild, Scatter, Multiplier
│   ├── fx/               # Visual effects
│   └── bonus_icons/      # Bonus game icons
├── IMAGE_PLACEMENT_GUIDE.md
└── README.md
```

## Controls

- **SPIN** - Start a new spin (costs current bet)
- **BET** - Cycle through bet amounts
- **xVOMIT** - Open bonus buy menu
- **i** - Show game information

## Configuration

Edit `js/config.js` to modify:
- Symbol payouts
- Bet amounts
- Bonus parameters
- Animation speeds
- Max win cap

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Mature Content Warning

This game contains dark humor and mature themes. 18+ only.

---

Built with vanilla HTML, CSS, and JavaScript - no frameworks required!
