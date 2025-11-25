import { SymbolType } from '../types/GameTypes';

/**
 * Configuration constants
 */
export const CONFIG = {
  // Grid
  GRID_WIDTH: 6,
  GRID_HEIGHT: 5,
  MIN_CLUSTER_SIZE: 8,
  
  // Payouts (multiplier of bet per symbol in cluster)
  SYMBOL_PAYOUTS: {
    // Low Pay Symbols (Paraphernalia)
    [SymbolType.FISH]: 0.1,
    [SymbolType.FINGER]: 0.12,
    [SymbolType.NEEDLE]: 0.15,
    [SymbolType.BAGGIE]: 0.18,
    [SymbolType.PILLS]: 0.2,
    [SymbolType.CAN]: 0.25,

    // High Pay Symbols (The Addicts)
    [SymbolType.SPARKY]: 1.0,  // The Rat
    [SymbolType.ZIPPO]: 1.5,   // The Lizard
    [SymbolType.SQUIRT]: 2.0,  // The Turtle

    // Special Symbols
    [SymbolType.WILD]: 2.5,
  } as Record<SymbolType, number>,
  
  // Multipliers
  WILD_EXPLOSION_MULTIPLIER: 2,
  MAX_WIN_MULTIPLIER: 50000,
  
  // Bonuses
  SHOOTER_SCATTERS: 3,
  BOSS_BATTLE_SCATTERS: 4,
  FREE_SPINS_SCATTERS: 5,
  FREE_SPINS_COUNT: 10,
  
  // Symbol weights for reel generation (higher = more common)
  SYMBOL_WEIGHTS: {
    // Low Pay Symbols (more common)
    [SymbolType.FISH]: 20,
    [SymbolType.FINGER]: 18,
    [SymbolType.NEEDLE]: 16,
    [SymbolType.BAGGIE]: 15,
    [SymbolType.PILLS]: 14,
    [SymbolType.CAN]: 13,

    // High Pay Symbols (less common)
    [SymbolType.SPARKY]: 8,
    [SymbolType.ZIPPO]: 6,
    [SymbolType.SQUIRT]: 4,

    // Special
    [SymbolType.SCATTER]: 3,
  } as Record<SymbolType, number>,
  
  // Free spins symbol weights (more high-value symbols, with Doctor threat)
  FREE_SPINS_SYMBOL_WEIGHTS: {
    [SymbolType.FISH]: 12,
    [SymbolType.FINGER]: 11,
    [SymbolType.NEEDLE]: 10,
    [SymbolType.BAGGIE]: 10,
    [SymbolType.PILLS]: 9,
    [SymbolType.CAN]: 9,
    [SymbolType.SPARKY]: 12,
    [SymbolType.ZIPPO]: 10,
    [SymbolType.SQUIRT]: 8,
    [SymbolType.DOCTOR]: 2,  // The buzzkill - resets multipliers
  } as Record<SymbolType, number>,
} as const;
