# Pocket Rehab: Toxic Shock

🎰 **High-Volatility Cluster Slot | 6x5 Grid | 50,000x Max Win**

A dark-humor cluster-pays slot game featuring the innovative "Overdose Cycle" mechanic with toxic aesthetics and glitch effects.

## 🎮 Features

- **Cluster Pays Mechanic**: 5+ adjacent symbols create winning clusters
- **Cascading Wins**: Winning symbols disappear and new symbols drop in
- **6x5 Grid**: 30 symbol positions for maximum win potential
- **Toxic Theme**: Dark, gritty aesthetic with neon green and red accents
- **Overdose Cycle**: Special feature system (to be expanded)
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open your browser to `http://localhost:8080`

### Alternative: No Install Required

Simply open `index.html` in your web browser to play!

## 📁 Project Structure

```
Pocket-Rehab/
├── assets/
│   ├── images/          # Game asset images (add your images here)
│   └── ASSETS.md        # Asset documentation
├── src/
│   ├── css/
│   │   └── style.css    # Game styling
│   └── js/
│       └── game.js      # Game logic
├── index.html           # Main game file
├── package.json         # Project configuration
└── README.md           # This file
```

## 🎨 Adding Game Assets

Place your game asset images in the `assets/images/` directory with these names:

1. **rejected.png** - REJECTED stamp overlay
2. **crt-monitors.png** - CRT display for bet/win counters
3. **cage-container.png** - Metal cage container with biohazard warnings
4. **zombie-hand.png** - Zombie hand middle finger gesture
5. **dead-fish.png** - Dead fish skeleton with toxic slime

See `assets/ASSETS.md` for detailed asset specifications.

## 🎯 How to Play

1. **Set Your Bet**: Use the +/- buttons to adjust your bet amount
2. **Spin**: Click the SPIN button or press SPACE to play
3. **Win**: Match 5+ adjacent symbols to create winning clusters
4. **Cascade**: Winning symbols disappear and new symbols drop
5. **Repeat**: Continue cascading until no more wins occur

## 🎰 Game Symbols

| Symbol | Value | Type |
|--------|-------|------|
| Zombie Hand | 100 | High Value |
| Dead Fish | 80 | High Value |
| Cage | 60 | Medium Value |
| Rejected | 40 | Medium Value |
| Low 1-3 | 10-20 | Low Value |

## 🛠️ Technical Details

- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with custom animations
- **Grid System**: CSS Grid for responsive layout
- **No Framework**: Pure HTML/CSS/JS for maximum performance

## 🎮 Controls

- **Left Click**: Interact with buttons
- **Space Bar**: Spin the reels
- **Info Button**: View game information and paytable
- **Auto Button**: Auto-play feature (coming soon)

## 🔧 Customization

### Adjusting Game Parameters

Edit `src/js/game.js` to modify:

```javascript
this.minClusterSize = 5;  // Minimum symbols for a win
this.betLevels = [0.10, 0.25, 0.50, 1, 2, 5, 10, 25, 50, 100];
```

### Adding New Symbols

Add symbols to the `symbols` array:

```javascript
this.symbols = [
    { id: 'new_symbol', name: 'New Symbol', value: 50, image: 'path/to/image.png' }
];
```

## 🎨 Styling

The game uses a dark, toxic theme with:
- **Primary Color**: Toxic Green (#00ff00)
- **Accent Color**: Red (#ff0000)
- **Background**: Dark gradient (#0a0a0a to #1a1a1a)
- **Effects**: Glitch animations, glow effects, CRT-style displays

Edit `src/css/style.css` to customize the appearance.

## 🐛 Debug Mode

Open browser console to access debug commands:

```javascript
// Adjust balance
game.balance = 10000;

// Change bet
game.bet = 5;

// Force spin
game.spin();
```

## 📝 Roadmap

- [ ] Add sound effects and music
- [ ] Implement Overdose Cycle bonus feature
- [ ] Add auto-play functionality
- [ ] Create win animations
- [ ] Add particle effects
- [ ] Implement progressive jackpot
- [ ] Add save/load game state
- [ ] Create mobile-optimized controls

## 🤝 Contributing

This is an open project. Feel free to add features, improve the code, or suggest enhancements!

## 📄 License

MIT License - Feel free to use and modify for your own projects.

---

**Ready to play? Add your assets and start spinning!** 🎰
