#!/bin/bash

# Script to create placeholder images for testing
# This creates simple colored rectangles with text labels

echo "Creating placeholder images for Pocket Rehab..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Please install it or manually create placeholder images."
    echo "On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "On Mac: brew install imagemagick"
    exit 1
fi

# Create backgrounds (1920x1080)
echo "Creating backgrounds..."
convert -size 1920x1080 gradient:#1a1a2e-#2d4a3e -font Arial -pointsize 72 -fill white -gravity center -annotate +0+0 "TOXIC ALLEY" assets/backgrounds/bg_main_alley.png
convert -size 1920x1080 gradient:#2e1a1a-#4a2d2d -font Arial -pointsize 72 -fill white -gravity center -annotate +0+0 "FIGHT CLUB" assets/backgrounds/bg_bonus_cage.png
convert -size 1920x1080 gradient:#1a2e1a-#2d4a2d -font Arial -pointsize 72 -fill white -gravity center -annotate +0+0 "CATCH EM" assets/backgrounds/bg_bonus_field.png

# Create UI elements
echo "Creating UI elements..."
convert -size 900x600 xc:none -stroke white -strokewidth 5 -fill none -draw "roundrectangle 0,0 900,600 20,20" assets/ui/ui_container_grid_6x5.png
convert -size 80x300 gradient:#00ff00-#88ff00 -stroke white -strokewidth 3 -fill none -draw "roundrectangle 0,0 80,300 10,10" assets/ui/ui_meter_glass.png
convert -size 150x150 radial-gradient:#ff0000-#8b0000 -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "SPIN" assets/ui/ui_btn_spin.png
convert -size 1200x150 xc:#1a1a2e -stroke white -strokewidth 2 -fill none -draw "rectangle 0,0 1200,150" assets/ui/ui_panel_betwin.png
convert -size 600x400 xc:#2a2a4e -stroke yellow -strokewidth 3 -fill none -draw "roundrectangle 0,0 600,400 20,20" assets/ui/ui_panel_bonusbuy.png

# Create characters (200x200)
echo "Creating character symbols..."
convert -size 200x200 xc:#ffcc00 -font Arial -pointsize 48 -fill black -gravity center -annotate +0+0 "RAT" assets/characters/char_high_sparky.png
convert -size 200x200 xc:#ff8800 -font Arial -pointsize 48 -fill black -gravity center -annotate +0+0 "LIZARD" assets/characters/char_high_zippo.png
convert -size 200x200 xc:#00ff88 -font Arial -pointsize 48 -fill black -gravity center -annotate +0+0 "TURTLE" assets/characters/char_high_squirt.png

# Create symbols (150x150)
echo "Creating low-pay symbols..."
convert -size 150x150 xc:#888888 -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "FISH" assets/symbols/sym_low_fish.png
convert -size 150x150 xc:#aa8888 -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "FINGER" assets/symbols/sym_low_finger.png
convert -size 150x150 xc:#88aa88 -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "NEEDLE" assets/symbols/sym_low_needle.png
convert -size 150x150 xc:#8888aa -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "BAGGIE" assets/symbols/sym_low_baggie.png
convert -size 150x150 xc:#aa88aa -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "PILLS" assets/symbols/sym_low_pills.png
convert -size 150x150 xc:#aaaa88 -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "CAN" assets/symbols/sym_low_can.png

# Create special symbols (150x150)
echo "Creating special symbols..."
convert -size 150x150 gradient:#00ff00-#88ff00 -font Arial -pointsize 48 -fill black -gravity center -annotate +0+0 "WILD" assets/specials/sym_special_wild.png
convert -size 150x150 xc:#ff00ff -font Arial -pointsize 36 -fill white -gravity center -annotate +0+0 "SCATTER" assets/specials/sym_special_scatter.png
convert -size 150x150 xc:#ff0000 -font Arial -pointsize 48 -fill white -gravity center -annotate +0+0 "x2" assets/specials/sym_special_multiplier.png

# Create FX
echo "Creating effects..."
convert -size 150x150 xc:none -fill "rgba(0,255,0,0.3)" -draw "rectangle 0,0 150,150" assets/fx/overlay_infected.png

# Create bonus icons (100x100)
echo "Creating bonus icons..."
convert -size 100x100 xc:#8b4513 -font Arial -pointsize 24 -fill white -gravity center -annotate +0+0 "BRICK" assets/bonus_icons/icon_bonus_brick.png
convert -size 100x100 xc:#ffff00 -font Arial -pointsize 24 -fill black -gravity center -annotate +0+0 "TASER" assets/bonus_icons/icon_bonus_taser.png
convert -size 100x100 xc:#ffc0cb -font Arial -pointsize 24 -fill black -gravity center -annotate +0+0 "FIST" assets/bonus_icons/icon_bonus_fist.png

echo "Placeholder images created successfully!"
echo "You can now open index.html in your browser to test the game."
echo "Replace these placeholders with your actual game images when ready."
