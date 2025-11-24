# Image Placement Guide

## Instructions

Place your game images in the following locations:

### Backgrounds
```
assets/backgrounds/
├── bg_main_alley.png      (Base Game - Toxic Alley)
├── bg_bonus_cage.png      (Bonus - Fight Club)
└── bg_bonus_field.png     (Bonus - Catch 'Em)
```

### UI Elements
```
assets/ui/
├── ui_container_grid_6x5.png    (The 6x5 Reel Frame)
├── ui_meter_glass.png           (Toxicity Meter Tube)
├── ui_btn_spin.png              (Spin Button - Pokéball)
├── ui_panel_betwin.png          (CRT Monitor Panels)
└── ui_panel_bonusbuy.png        (Bonus Buy Menu)
```

### Characters (High Pay Symbols)
```
assets/characters/
├── char_high_sparky.png    (The Rat - High Pay)
├── char_high_zippo.png     (The Lizard - High Pay)
└── char_high_squirt.png    (The Turtle - High Pay)
```

### Regular Symbols (Low Pay)
```
assets/symbols/
├── sym_low_fish.png       (Skeleton Fish)
├── sym_low_finger.png     (Middle Finger)
├── sym_low_needle.png     (Syringe)
├── sym_low_baggie.png     (Baggie)
├── sym_low_pills.png      (Spilled Pills)
└── sym_low_can.png        (Crushed Can)
```

### Special Symbols
```
assets/specials/
├── sym_special_wild.png         (Neon Puke Wild)
├── sym_special_scatter.png      (Rejected Letter)
└── sym_special_multiplier.png   (x2 Spray Paint)
```

### Effects
```
assets/fx/
└── overlay_infected.png    (Green Glitch Texture)
```

### Bonus Icons
```
assets/bonus_icons/
├── icon_bonus_brick.png    (Brick Weapon)
├── icon_bonus_taser.png    (Taser Weapon)
└── icon_bonus_fist.png     (Fist Icon)
```

## Quick Copy Commands

If your images are in a download folder, you can use these commands:

```bash
# From your downloads folder, copy all backgrounds
cp bg_main_alley.png bg_bonus_cage.png bg_bonus_field.png /home/user/Pocket-Rehab/assets/backgrounds/

# Copy UI elements
cp ui_container_grid_6x5.png ui_meter_glass.png ui_btn_spin.png ui_panel_betwin.png ui_panel_bonusbuy.png /home/user/Pocket-Rehab/assets/ui/

# Copy characters
cp char_high_sparky.png char_high_zippo.png char_high_squirt.png /home/user/Pocket-Rehab/assets/characters/

# Copy symbols
cp sym_low_*.png /home/user/Pocket-Rehab/assets/symbols/

# Copy specials
cp sym_special_*.png /home/user/Pocket-Rehab/assets/specials/

# Copy FX
cp overlay_infected.png /home/user/Pocket-Rehab/assets/fx/

# Copy bonus icons
cp icon_bonus_*.png /home/user/Pocket-Rehab/assets/bonus_icons/
```

## Using Placeholder Images

If you don't have the images yet, you can create placeholder images using this script:

```bash
# Run this from the project root
./create_placeholders.sh
```

Or manually create simple colored squares as placeholders for testing.
