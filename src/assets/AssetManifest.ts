/**
 * Asset Manifest
 * Defines all game assets and their paths
 */

export interface AssetDefinition {
  key: string;
  path: string;
  category: 'background' | 'ui' | 'character' | 'symbol' | 'special' | 'fx' | 'bonus';
}

export const ASSET_MANIFEST: AssetDefinition[] = [
  // Backgrounds
  { key: 'bg_main_alley', path: '/assets/backgrounds/bg_main_alley.png', category: 'background' },
  { key: 'bg_bonus_cage', path: '/assets/backgrounds/bg_bonus_cage.png', category: 'background' },
  { key: 'bg_bonus_field', path: '/assets/backgrounds/bg_bonus_field.png', category: 'background' },

  // UI Elements
  { key: 'ui_container_grid', path: '/assets/ui/ui_container_grid_6x5.png', category: 'ui' },
  { key: 'ui_meter_glass', path: '/assets/ui/ui_meter_glass.png', category: 'ui' },
  { key: 'ui_btn_spin', path: '/assets/ui/ui_btn_spin.png', category: 'ui' },
  { key: 'ui_panel_betwin', path: '/assets/ui/ui_panel_betwin.png', category: 'ui' },
  { key: 'ui_panel_bonusbuy', path: '/assets/ui/ui_panel_bonusbuy.png', category: 'ui' },

  // Characters (High Pay Symbols)
  { key: 'char_sparky', path: '/assets/characters/char_high_sparky.png', category: 'character' },
  { key: 'char_zippo', path: '/assets/characters/char_high_zippo.png', category: 'character' },
  { key: 'char_squirt', path: '/assets/characters/char_high_squirt.png', category: 'character' },

  // Low Pay Symbols
  { key: 'sym_fish', path: '/assets/symbols/sym_low_fish.png', category: 'symbol' },
  { key: 'sym_finger', path: '/assets/symbols/sym_low_finger.png', category: 'symbol' },
  { key: 'sym_needle', path: '/assets/symbols/sym_low_needle.png', category: 'symbol' },
  { key: 'sym_baggie', path: '/assets/symbols/sym_low_baggie.png', category: 'symbol' },
  { key: 'sym_pills', path: '/assets/symbols/sym_low_pills.png', category: 'symbol' },
  { key: 'sym_can', path: '/assets/symbols/sym_low_can.png', category: 'symbol' },

  // Special Symbols
  { key: 'sym_wild', path: '/assets/specials/sym_special_wild.png', category: 'special' },
  { key: 'sym_scatter', path: '/assets/specials/sym_special_scatter.png', category: 'special' },
  { key: 'sym_multiplier', path: '/assets/specials/sym_special_multiplier.png', category: 'special' },

  // FX
  { key: 'overlay_infected', path: '/assets/fx/overlay_infected.png', category: 'fx' },

  // Bonus Icons
  { key: 'icon_brick', path: '/assets/bonus/icon_bonus_brick.png', category: 'bonus' },
  { key: 'icon_taser', path: '/assets/bonus/icon_bonus_taser.png', category: 'bonus' },
  { key: 'icon_fist', path: '/assets/bonus/icon_bonus_fist.png', category: 'bonus' },
];

/**
 * Symbol type to asset key mapping
 */
export const SYMBOL_TO_ASSET: Record<string, string> = {
  // Low pay symbols (Paraphernalia)
  'FISH': 'sym_fish',
  'FINGER': 'sym_finger',
  'NEEDLE': 'sym_needle',
  'BAGGIE': 'sym_baggie',
  'PILLS': 'sym_pills',
  'CAN': 'sym_can',

  // High pay symbols (The Addicts)
  'SPARKY': 'char_sparky',  // The Rat
  'ZIPPO': 'char_zippo',    // The Lizard
  'SQUIRT': 'char_squirt',  // The Turtle

  // Special symbols
  'WILD': 'sym_wild',       // Neon Puke Wild
  'SCATTER': 'sym_scatter', // Rejected Letter
  'DOCTOR': 'sym_needle',   // The Doctor (Needle) - reuses needle symbol
};

/**
 * Get asset path by key
 */
export function getAssetPath(key: string): string {
  const asset = ASSET_MANIFEST.find(a => a.key === key);
  return asset ? asset.path : '';
}

/**
 * Get all assets by category
 */
export function getAssetsByCategory(category: AssetDefinition['category']): AssetDefinition[] {
  return ASSET_MANIFEST.filter(a => a.category === category);
}
