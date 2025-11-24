# 🎨 Animation System Guide
**Pocket Rehab: Relapse Edition**

---

## Overview

The game features a comprehensive animation system with:
- **CSS-based animations** for performance
- **Canvas particle system** for advanced effects
- **Programmatic animation controller** for coordinated effects

---

## 📂 File Structure

```
css/
├── style.css          # Base styles
└── animations.css     # Animation definitions

js/
├── effects.js         # Particle system & animation controller
├── game.js            # Game logic with animation triggers
└── config.js          # Game configuration
```

---

## 🎯 Animation Types

### 1. Symbol Animations

#### **Spin Animation** (`symbolSpin`)
- **Trigger:** During spin cycle
- **Effect:** 3D rotation with blur
- **Duration:** 300ms
- **Class:** `.spinning`

```css
@keyframes symbolSpin {
    /* Rotates symbols with translateY and rotateX */
}
```

#### **Landing Animation** (`symbolLand`)
- **Trigger:** When symbols stop spinning
- **Effect:** Bounce effect on landing
- **Duration:** 400ms
- **Class:** `.landing`

#### **Win Pulse** (`winPulse`)
- **Trigger:** Winning symbols detected
- **Effect:** Scale + glow + rotation
- **Duration:** 600ms (looping)
- **Class:** `.winning`

#### **Disappear** (`symbolDisappear`)
- **Trigger:** Symbols being removed
- **Effect:** Spin and shrink
- **Duration:** 300ms
- **Class:** `.disappearing`

---

### 2. Overdose Cycle Animations

#### **Infection Spread** (`infectionSpread`)
- **Stage:** 1 (First win)
- **Effect:** Green overlay expands
- **Duration:** 500ms
- **Class:** `.infecting`
- **Particles:** 20 green glowing particles

#### **Infection Pulse** (`infectionPulse`)
- **Stage:** Ongoing infected state
- **Effect:** Pulsing green glow
- **Duration:** 1500ms (looping)
- **Class:** `.infected`

#### **Mutation Transform** (`mutationTransform`)
- **Stage:** 2 (Second win on infected symbol)
- **Effect:** Color shift, rotation, scale transformation
- **Duration:** 800ms
- **Class:** `.mutating`
- **Particles:** 30 swirling green particles

#### **Multiplier Crash** (`multiplierCrash`)
- **Stage:** 3 (Third win on mutated symbol)
- **Effect:** Red explosion with radial gradient
- **Duration:** 600ms
- **Class:** `.crashing`
- **Particles:** Large win explosion effect

---

### 3. Tolerance Meter Animations

#### **Bubble Rise** (`bubbleRise`)
- **Trigger:** Automatic, continuous
- **Effect:** Bubbles float upward in meter
- **Duration:** 3s per bubble
- **System:** `BubbleSystem` class

#### **Meter Fill Pulse** (`meterFillPulse`)
- **Trigger:** Continuous
- **Effect:** Pulsing glow on liquid
- **Duration:** 2s (looping)

#### **Meter Overflow** (`meterOverflow`)
- **Trigger:** When meter reaches 100%
- **Effect:** Rapid brightness pulse
- **Class:** `.overflowing`

---

### 4. Win Celebration Animations

#### **Big Win Popup** (`bigWinCelebrate`)
- **Trigger:** Win ≥ 10x bet
- **Effect:** Scale + rotation entrance
- **Duration:** 600ms

#### **Win Counter Pulse** (`winCounterPulse`)
- **Trigger:** Win popup visible
- **Effect:** Color shift + scale pulse
- **Duration:** 800ms (looping)

#### **Confetti Fall**
- **Trigger:** Huge wins (≥ 20x bet)
- **Effect:** Confetti rains from top
- **Particles:** 40 colored confetti pieces
- **Burst count:** 5 bursts with 200ms delays

---

### 5. Bonus Game Transitions

#### **Bonus Entrance** (`bonusEntrance`)
- **Trigger:** Bonus game starts
- **Effect:** 3D rotation + scale + blur
- **Duration:** 800ms

#### **Background Fade** (`backgroundFade`)
- **Trigger:** Background changes
- **Effect:** Smooth opacity + blur transition
- **Duration:** 500ms

#### **Scatter Highlight** (`scatterHighlight`)
- **Trigger:** 3+ scatter symbols
- **Effect:** Intense glow + rotation + scale
- **Duration:** 800ms × 3 repeats
- **Particles:** 3 bursts of purple particles

---

### 6. Button Animations

#### **Spin Button Glow** (`spinGlow`)
- **Trigger:** Button enabled
- **Effect:** Pulsing drop shadow
- **Duration:** 2s (looping)

#### **Button Ripple** (`buttonRipple`)
- **Trigger:** Any button click
- **Effect:** Expanding circle from click point
- **Duration:** 600ms
- **System:** Programmatic via `AnimationController`

#### **Vomit Button Shake** (`vomitShake`)
- **Trigger:** Hover over xVOMIT button
- **Effect:** Rapid horizontal shake
- **Duration:** 500ms

---

### 7. Multiplier Animations

#### **Multiplier Pop** (`multiplierPop`)
- **Trigger:** New multiplier appears
- **Effect:** Rotation + scale entrance
- **Duration:** 400ms

#### **Multiplier Pulse** (`multiplierPulse`)
- **Trigger:** After pop-in
- **Effect:** Continuous red glow pulse
- **Duration:** 1s (looping)

---

## 🎮 Particle System

### ParticleSystem Class

Located in `js/effects.js`

#### Methods:

**`createParticle(x, y, type, config)`**
Creates a single particle with custom properties.

**`createBurst(x, y, count, config)`**
Creates a circular burst of particles.

**`createConfetti(x, y, count)`**
Creates colorful confetti particles.

**`createWinExplosion(x, y, intensity)`**
Creates a complex win effect with sparks and stars.

**`createInfectionParticles(x, y)`**
Creates green glowing particles for infection.

**`createMutationEffect(x, y)`**
Creates swirling particles for mutation.

#### Particle Types:
- `sparkle` - Simple glowing circle
- `burst` - Radial explosion particle
- `confetti` - Colored rectangles
- `star` - Five-pointed star shape
- `spiral` - Glowing circle with trail
- `glow` - Soft glowing orb

---

## 🎭 AnimationController Class

Coordinates animations between CSS and particles.

### Methods:

**`animateSymbolSpin(cellElement)`**
Triggers spin animation on a cell.

**`animateWin(cells, isHuge)`**
- Adds `.winning` class
- Creates particle burst
- Optionally triggers grid shake for huge wins

**`animateRemoval(cells)`**
- Adds `.disappearing` class
- Creates small particle burst

**`animateInfection(cells)`**
- Adds `.infecting` class
- Creates green infection particles

**`animateMutation(cells)`**
- Adds `.mutating` class
- Creates swirling mutation effect

**`animateCrash(cells)`**
- Adds `.crashing` class
- Creates large explosion

**`animateScatter(cells)`**
- Adds `.scatter-trigger` class
- Creates 3 purple bursts with delays

**`triggerBigWinCelebration()`**
Creates confetti bursts across the screen.

**`addButtonRipple(button, event)`**
Creates ripple effect at click location.

---

## 🔧 Integration with Game Logic

### In `game.js`:

```javascript
// Win detection
if (typeof animationController !== 'undefined') {
    animationController.animateWin(winningElements, isHugeWin);
}

// Infection cycle
animationController.animateInfection(infectedElements);
animationController.animateMutation(mutatedElements);
animationController.animateCrash(crashedElements);

// Scatter trigger
animationController.animateScatter(scatterCells);

// Big win popup
animationController.triggerBigWinCelebration();
```

---

## ⚡ Performance Optimizations

### GPU Acceleration
All animated elements use:
```css
will-change: transform, opacity;
transform: translateZ(0);
backface-visibility: hidden;
```

### Canvas Rendering
- Uses `requestAnimationFrame` for smooth 60fps
- Automatic particle cleanup when life expires
- Efficient rendering with context save/restore

### CSS Animations
- Hardware-accelerated transforms
- No expensive properties (width, height, left, right)
- Uses `transform` and `opacity` only

---

## 🎨 Customization

### Adjusting Animation Speed

**In `css/animations.css`:**
```css
@keyframes symbolSpin {
    /* Change duration in class */
}

.grid-cell.spinning img {
    animation: symbolSpin 0.3s ease-in-out; /* Change 0.3s */
}
```

**In `js/config.js`:**
```javascript
ANIMATION: {
    CASCADE_DELAY: 500,        // Time between cascades
    WIN_FLASH_DURATION: 1000,  // How long wins flash
    SPIN_DURATION: 300         // Symbol spin time
}
```

### Changing Particle Colors

**In `js/effects.js`:**
```javascript
createInfectionParticles(x, y) {
    this.createParticle(x, y, 'glow', {
        color: '#00ff00',  // Change color here
        // ...
    });
}
```

### Adjusting Particle Count

```javascript
// Reduce for better performance
this.createBurst(x, y, 15, config);  // Change count

// Increase for more impact
this.createConfetti(x, y, 40);  // Change count
```

---

## 🐛 Debugging

### Enable Animation Logging

Add to `effects.js`:
```javascript
createParticle(x, y, type, config) {
    console.log(`Creating ${type} particle at (${x}, ${y})`);
    // ... rest of code
}
```

### Slow Motion Mode

In browser console:
```javascript
// Slow down all CSS animations
document.documentElement.style.animationDuration = '5s';

// Slow down particle system
particleSystem.particles.forEach(p => p.life *= 5);
```

### Disable Particles

In browser console:
```javascript
particleSystem.clear();
particleSystem.destroy();
```

---

## 📊 Animation Timing Chart

```
SPIN CYCLE:
0ms    ├─ Spin starts
300ms  ├─ Spin ends, Landing starts
700ms  ├─ Landing ends
       │
WIN DETECTION:
0ms    ├─ Win animation starts
1000ms ├─ Win flash ends
       ├─ Overdose Cycle applies
1500ms ├─ Cascade starts
2000ms ├─ New symbols drop
       │
OVERDOSE:
0ms    ├─ Infection spreads (500ms)
       ├─ OR Mutation transforms (800ms)
       ├─ OR Crash explodes (600ms)
```

---

## 🎯 Best Practices

1. **Always check if animationController exists** before calling
2. **Use CSS animations for simple effects** (better performance)
3. **Use particle system for complex effects** (more flexibility)
4. **Clean up particles** by setting short lifetimes
5. **Test on mobile devices** for performance
6. **Use `will-change` sparingly** (too many hurt performance)

---

## 🚀 Future Enhancements

Potential additions:
- **Sound effects** synchronized with animations
- **Screen shake** on massive wins
- **Symbol trails** during drops
- **Lightning effects** for multipliers
- **Animated backgrounds** (parallax scrolling)
- **Character animations** (sprite sheets)
- **Combo counter** with animations
- **Win multiplier meter** visual

---

## 📝 Notes

- All animations are designed to be non-blocking
- Fallback behavior exists if effects.js fails to load
- Mobile performance tested (should maintain 30fps+)
- Animations can be disabled via CSS if needed

---

**Built with:** CSS3 Animations, Canvas API, RequestAnimationFrame
**Browser Support:** Chrome, Firefox, Safari, Edge (modern versions)
**Performance Target:** 60fps on desktop, 30fps on mobile
