# Pocket Rehab: Toxic Shock

**High-Volatility Cluster Slot | 6x5 Grid | 50,000x Max Win**

A dark-humor cluster-pays slot game featuring the innovative "Overdose Cycle" mechanic set in a post-apocalyptic world.

## Features

- **6x5 Cluster Pays**: Land 5 or more matching symbols touching horizontally or vertically to win
- **Cascading Wins**: Winning symbols disappear and new ones fall down, with increasing multipliers
- **Overdose Cycle**: Special meter that fills with wins to trigger bonus features
- **High Volatility**: Up to 50,000x max win potential
- **Post-Apocalyptic Theme**: Dark, gritty visuals with CRT monitor aesthetics and glitch effects

## Project Structure

```
Pocket-Rehab/
├── index.html              # Main game file
├── assets/
│   ├── images/
│   │   ├── items/          # Weapon and item sprites
│   │   ├── symbols/        # Slot symbols
│   │   ├── backgrounds/    # Game backgrounds
│   │   └── ui/             # UI elements
│   └── sounds/             # Audio files (future)
├── src/
│   ├── css/
│   │   └── style.css       # Game styling
│   └── js/
│       └── game.js         # Game logic
└── docs/
    └── ASSETS.md           # Asset documentation
```

## Quick Start

### 1. Place Your Assets

Place the provided game assets in the following locations:
- `assets/images/items/taser.png` - Taser weapon sprite
- `assets/images/symbols/brick_angry.png` - Angry brick symbol
- `assets/images/backgrounds/background_city.png` - Post-apocalyptic cityscape
- `assets/images/backgrounds/background_corridor.png` - Dark corridor
- `assets/images/ui/betting_monitors.png` - CRT betting monitors

### 2. Run the Game

Simply open `index.html` in a modern web browser. No build process required!

Supported browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

### 3. Play

- **Click SPIN** or press **SPACEBAR** to spin
- Use **+/-** buttons to adjust bet amount
- Click **?** for game rules
- Fill the **Overdose Meter** to trigger bonus features

## Game Mechanics

### Cluster Pays
Land 5 or more matching symbols connected horizontally or vertically to form a winning cluster.

### Paytable
| Cluster Size | Multiplier |
|--------------|------------|
| 5-6          | 1x - 1.5x  |
| 7-9          | 2x - 4x    |
| 10-14        | 5x - 20x   |
| 15-19        | 30x - 40x  |
| 20-24        | 50x - 80x  |
| 25+          | 100x+      |

### Cascading Reels
After a win, winning symbols are removed and new symbols fall from above. Each cascade increases the multiplier!

### Overdose Cycle
- Fills with each win
- Triggers bonus features at 100%
- Enhanced multipliers and special symbols

## Development

### Technologies Used
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)

### Key Features
- No dependencies or frameworks
- Fully responsive design
- Optimized animations
- Clean, maintainable code

### Customization

#### Adjust Bet Limits
Edit in `src/js/game.js`:
```javascript
this.minBet = 10;
this.maxBet = 1000;
this.betStep = 10;
```

#### Modify Symbols
Edit the symbols array in `src/js/game.js`:
```javascript
this.symbols = [
    { id: 'brick', emoji: '🧱', value: 1 },
    // Add more symbols...
];
```

#### Customize Paytable
Edit in `src/js/game.js`:
```javascript
this.paytable = {
    5: 1,
    10: 5,
    15: 30,
    // Adjust multipliers...
};
```

## Asset Requirements

See `docs/ASSETS.md` for detailed asset specifications.

All assets should use:
- PNG format with transparency
- Post-apocalyptic aesthetic
- Gritty, weathered textures
- Glitch effects where appropriate

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is provided as-is for educational and entertainment purposes.

## Credits

Game design and implementation for the Pocket Rehab: Toxic Shock slot game.

---

**Warning**: This is a simulation game. No real money gambling is involved.
