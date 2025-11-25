# Game Mechanics Documentation

## Pocket Rehab: Toxic Shock

### Overview
A high-volatility 6x5 cluster-pays slot game with an innovative 3-stage "Overdose Cycle" mechanic.

---

## Core Game Mechanics

### Grid & Clusters
- **Grid Size**: 6 columns × 5 rows (30 symbol positions)
- **Win Condition**: 8+ matching symbols connected (4-way adjacency)
- **Wild Behavior**: Wild symbols match with any symbol type
- **Cascades**: Winning symbols removed, gravity applied, new symbols drop from top

### Overdose Cycle (3 Stages)

#### Stage 1: Infection
- Winning symbols become "infected"
- Infected symbols stick on the grid
- Visual: Red infection overlay

#### Stage 2: Mutation
- If infected symbols win again, they mutate to Wilds
- Mutated symbols remain sticky
- Visual: Gold border on Wild symbols

#### Stage 3: Explosion
- If mutated Wilds win again, they explode
- Leaves permanent x2 multiplier at that grid position
- Multipliers stack multiplicatively
- Symbol is removed from grid after explosion

### Symbols

#### Regular Symbols
- **Low-paying**: LOW1, LOW2, LOW3 (0.1x - 0.2x per symbol)
- **Medium-paying**: MED1, MED2 (0.3x - 0.5x per symbol)
- **High-paying**: HIGH1, HIGH2 (1.0x - 2.0x per symbol)

#### Special Symbols
- **WILD**: Substitutes for all regular symbols (2.0x per symbol)
- **SCATTER**: Triggers bonuses (3, 4, or 5 scatters)
- **DOCTOR**: Free spins only - resets all sticky multipliers

---

## Bonus Games

### 3-Reel Shooter (3 Scatters)
- Simple shooting gallery bonus
- 3 reels with targets
- Hit rate: 70%
- Win range: 5x - 15x bet per successful hit
- Quick action bonus for smaller wins

### Boss Battle (4 Scatters)
- Fight a boss with 1000 HP
- Up to 10 attacks
- Each attack deals 50-200 damage
- **Damage = Cash**: Damage dealt converts to win multiplier
- Defeating boss adds 1.5x multiplier to total damage
- Formula: `(totalDamage / 10) × bet = win amount`

### Free Spins (5 Scatters)
- Awards 10 free spins
- **Pre-infected Symbols**: 30% of grid starts infected
- **Sticky Multipliers**: All explosion multipliers persist between spins
- **Doctor Symbol**: Can appear and reset all sticky multipliers
- **Symbol Pool**: Different from base game (includes DOCTOR, excludes SCATTER)
- Multipliers can accumulate to massive values

---

## Win Calculation

### Base Win
```
win = symbolPayout × clusterSize × bet
```

### With Multipliers
```
totalMultiplier = mult1 × mult2 × mult3 × ...
finalWin = baseWin × totalMultiplier
```

### Max Win Cap
- Maximum win per spin: **50,000x bet**
- Applies to total win including all cascades and multipliers

---

## Symbol Weights

### Base Game
- LOW1: 20 (most common)
- LOW2: 18
- LOW3: 16
- MED1: 14
- MED2: 12
- HIGH1: 8
- HIGH2: 6
- SCATTER: 3 (rarest)

### Free Spins
- LOW1-3: 15, 14, 13
- MED1-2: 12, 11
- HIGH1-2: 10, 8
- DOCTOR: 2 (special)

---

## Strategy Tips

1. **Build Multipliers**: Try to trigger multiple cascades to build up permanent grid multipliers
2. **Infection Path**: Winning on infected symbols progresses the Overdose Cycle
3. **Multiplier Stacking**: Grid multipliers multiply together, not add
4. **Doctor Risk/Reward**: In free spins, Doctor symbols reset multipliers but allow fresh builds
5. **Scatter Hunt**: 5 scatters for free spins is the highest value bonus

---

## Technical Notes

- Random number generation uses JavaScript's Math.random()
- Cluster detection: Flood-fill algorithm (BFS)
- Cascade limit: 20 per spin (prevents infinite loops)
- TypeScript strict mode for type safety
- PixiJS v8 for WebGL rendering
