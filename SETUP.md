# Pocket Rehab: Toxic Shock - Setup Guide

## Project Overview

A high-volatility cluster-pays slot game with a 6x5 grid featuring the innovative "Overdose Cycle" mechanic. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility.

## Features Implemented

### Core Mechanics
- ✅ 6x5 grid layout
- ✅ Cluster-pays system (5+ adjacent symbols)
- ✅ Cascade/Avalanche mechanics (Overdose Cycle)
- ✅ Progressive multiplier system (up to 10x)
- ✅ Scatter symbol detection
- ✅ Bonus panel display
- ✅ Bet adjustment system
- ✅ Balance management
- ✅ Win calculation and display

### Visual Features
- ✅ Toxic/dark theme with green neon accents
- ✅ Animated spinning effects
- ✅ Win highlighting and pulsing animations
- ✅ Responsive design for mobile and desktop
- ✅ Modal paytable display
- ✅ Real-time stat updates

### Game Symbols (Currently using emoji placeholders)
1. 🧱 Brick (Low value)
2. 👊 Fist (Low-medium value)
3. ☢️ Toxic (Medium value)
4. 💊 Pill (Medium-high value)
5. 💉 Syringe (High value)
6. 💀 Skull (Very high value)
7. ⚡ Scatter (Bonus trigger)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Pocket-Rehab
   ```

2. Open `index.html` in a web browser:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js
   npx serve

   # Or just open directly
   open index.html
   ```

3. The game should load immediately - no build process required!

## Project Structure

```
Pocket-Rehab/
├── index.html              # Main game HTML
├── css/
│   └── style.css          # All game styling
├── js/
│   └── game.js           # Game logic and mechanics
├── assets/
│   ├── images/
│   │   ├── symbols/      # Game symbols (need actual images)
│   │   ├── ui/           # UI elements (need actual images)
│   │   └── effects/      # Visual effects (need actual images)
│   └── sounds/           # Sound effects (to be added)
├── ASSETS.md             # Asset documentation
├── SETUP.md              # This file
└── README.md             # Project description
```

## Adding Your Assets

### Step 1: Replace Emoji Symbols with Images

The game currently uses emoji as placeholder symbols. To use your actual assets:

1. Save your symbol images to `assets/images/symbols/`:
   - `symbol_sad_brick.png`
   - `symbol_fist.png`
   - Plus additional symbols as needed

2. Update the SYMBOLS object in `js/game.js`:
   ```javascript
   const SYMBOLS = {
       BRICK: {
           image: 'assets/images/symbols/symbol_sad_brick.png',
           value: 10,
           name: 'brick'
       },
       FIST: {
           image: 'assets/images/symbols/symbol_fist.png',
           value: 15,
           name: 'fist'
       },
       // ... etc
   };
   ```

3. Update the `setSymbol` method to use images instead of emoji:
   ```javascript
   setSymbol(row, col, symbol) {
       const cell = this.cells[row][col];
       cell.symbol = symbol;
       cell.symbolElement.style.backgroundImage = `url(${symbol.image})`;
       cell.symbolElement.textContent = ''; // Remove emoji
       cell.symbolElement.title = symbol.name;
   }
   ```

### Step 2: Add UI Elements

1. Save your UI images:
   - `assets/images/ui/bonus_panel.png` (already referenced in HTML)
   - `assets/images/effects/multiplier_x2.png`
   - `assets/images/effects/cluster_effect.png`

2. The bonus panel is already integrated in the HTML

3. For multiplier and cluster effects, you can add them as overlays in the CSS

### Step 3: Add Sound Effects (Optional)

1. Create `assets/sounds/` directory
2. Add sound files:
   - `spin.mp3`
   - `win.mp3`
   - `scatter.mp3`
   - `bonus.mp3`
   - `background.mp3`

3. Update the game to play sounds:
   ```javascript
   function playSound(soundName) {
       if (game.soundEnabled) {
           const audio = new Audio(`assets/sounds/${soundName}.mp3`);
           audio.play();
       }
   }
   ```

## Game Configuration

Edit `CONFIG` object in `js/game.js` to adjust game parameters:

```javascript
const CONFIG = {
    GRID_COLS: 6,           // Grid width
    GRID_ROWS: 5,           // Grid height
    MIN_CLUSTER: 5,         // Minimum cluster size for win
    MAX_MULTIPLIER: 10,     // Maximum cascade multiplier
    SPIN_DURATION: 1000,    // Spin animation duration (ms)
    CASCADE_DELAY: 500,     // Delay between cascades (ms)
    MIN_BET: 0.10,         // Minimum bet amount
    MAX_BET: 100.00,       // Maximum bet amount
    BET_INCREMENT: 0.10,   // Bet adjustment increment
    INITIAL_BALANCE: 1000.00  // Starting balance
};
```

## Symbol Weights

Adjust symbol probabilities in the `SYMBOL_WEIGHTS` array:

```javascript
const SYMBOL_WEIGHTS = [
    { symbol: SYMBOLS.BRICK, weight: 30 },    // Most common
    { symbol: SYMBOLS.FIST, weight: 25 },
    { symbol: SYMBOLS.TOXIC, weight: 20 },
    { symbol: SYMBOLS.PILL, weight: 15 },
    { symbol: SYMBOLS.SYRINGE, weight: 7 },
    { symbol: SYMBOLS.SKULL, weight: 2 },
    { symbol: SYMBOLS.SCATTER, weight: 1 }   // Rarest
];
```

## Win Calculation

The game uses a cluster-based pay system:

- **5-9 symbols**: 2x - 6x base value
- **10-14 symbols**: 5x - 9x base value
- **15-19 symbols**: 10x - 18x base value
- **20+ symbols**: 40x+ base value

**Scatter Wins**:
- 3 Scatters: 100x bet
- 4 Scatters: 200x bet
- 5+ Scatters: 500x bet

**Cascade Multiplier**: Each cascade increases the multiplier by 1x (max 10x)

## Controls

### Mouse/Touch
- Click **SPIN** button to spin
- Click **+/-** buttons to adjust bet
- Click **MAX BET** for maximum bet
- Click **ℹ️** for paytable
- Click **🔊** to toggle sound

### Keyboard
- **SPACE** - Spin the reels

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Tips

1. Optimize images:
   - Use PNG for transparency
   - Compress images (TinyPNG, ImageOptim)
   - Target 200x200px for symbols

2. For better performance on mobile:
   - Reduce animation durations
   - Limit particle effects
   - Use CSS transforms instead of position changes

## Future Enhancements

- [ ] Add sound effects
- [ ] Implement free spins/bonus rounds
- [ ] Add particle effects for big wins
- [ ] Create detailed win animations
- [ ] Add save/load game state
- [ ] Implement autoplay feature
- [ ] Add game statistics/history
- [ ] Create mobile-optimized controls
- [ ] Add multiplayer/leaderboard
- [ ] Implement progressive jackpot

## Troubleshooting

### Symbols not showing
- Check that image paths are correct
- Verify images are in the correct directories
- Check browser console for loading errors

### Game not spinning
- Check browser console for JavaScript errors
- Ensure balance is sufficient for bet
- Verify `game.js` is loaded correctly

### Performance issues
- Reduce `SPIN_DURATION` and `CASCADE_DELAY`
- Optimize images
- Disable complex CSS animations on mobile

## License

See LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Happy Gaming!** 🎰
