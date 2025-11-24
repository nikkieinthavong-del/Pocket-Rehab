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
    [SymbolType.LOW1]: 0.1,
    [SymbolType.LOW2]: 0.15,
    [SymbolType.LOW3]: 0.2,
    [SymbolType.MED1]: 0.3,
    [SymbolType.MED2]: 0.5,
    [SymbolType.HIGH1]: 1.0,
    [SymbolType.HIGH2]: 2.0,
    [SymbolType.WILD]: 2.0,
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
    [SymbolType.LOW1]: 20,
    [SymbolType.LOW2]: 18,
    [SymbolType.LOW3]: 16,
    [SymbolType.MED1]: 14,
    [SymbolType.MED2]: 12,
    [SymbolType.HIGH1]: 8,
    [SymbolType.HIGH2]: 6,
    [SymbolType.SCATTER]: 3,
  } as Record<SymbolType, number>,
  
  // Free spins symbol weights
  FREE_SPINS_SYMBOL_WEIGHTS: {
    [SymbolType.LOW1]: 15,
    [SymbolType.LOW2]: 14,
    [SymbolType.LOW3]: 13,
    [SymbolType.MED1]: 12,
    [SymbolType.MED2]: 11,
    [SymbolType.HIGH1]: 10,
    [SymbolType.HIGH2]: 8,
    [SymbolType.DOCTOR]: 2,
  } as Record<SymbolType, number>,
} as const;
