import { CONFIG } from '../core/Config';
import {
  GridSymbol,
  GridMultiplier,
  SymbolType,
  OverdoseStage,
} from '../types/GameTypes';
import { getWeightedRandomSymbol } from '../utils/Helpers';

/**
 * Free Spins Bonus (5 scatters)
 * Features:
 * - Pre-infected symbols
 * - Sticky multipliers
 * - Doctor symbol resets multipliers
 */
export class FreeSpinsBonus {
  private spinsRemaining: number = 0;
  private stickyMultipliers: GridMultiplier[] = [];

  /**
   * Initialize free spins with pre-infected symbols
   */
  initialize(): GridSymbol[][] {
    this.spinsRemaining = CONFIG.FREE_SPINS_COUNT;
    this.stickyMultipliers = [];

    const grid: GridSymbol[][] = [];
    
    for (let row = 0; row < CONFIG.GRID_HEIGHT; row++) {
      grid[row] = [];
      for (let col = 0; col < CONFIG.GRID_WIDTH; col++) {
        const symbolType = getWeightedRandomSymbol(CONFIG.FREE_SPINS_SYMBOL_WEIGHTS);
        
        // Random chance to start with infected status
        const preInfected = Math.random() < 0.3; // 30% chance
        
        grid[row][col] = {
          type: symbolType,
          position: { row, col },
          overdoseStage: preInfected ? OverdoseStage.INFECTED : OverdoseStage.NONE,
          isSticky: preInfected,
        };
      }
    }

    return grid;
  }

  /**
   * Process doctor symbols - reset sticky multipliers
   */
  processDoctorSymbols(grid: GridSymbol[][]): void {
    let hasDoctorSymbol = false;

    for (const row of grid) {
      for (const symbol of row) {
        if (symbol && symbol.type === SymbolType.DOCTOR) {
          hasDoctorSymbol = true;
          break;
        }
      }
      if (hasDoctorSymbol) break;
    }

    // Doctor resets all sticky multipliers
    if (hasDoctorSymbol) {
      this.stickyMultipliers = [];
    }
  }

  /**
   * Add sticky multipliers from wins
   */
  addStickyMultipliers(newMultipliers: GridMultiplier[]): void {
    for (const mult of newMultipliers) {
      // Check if position already has multiplier
      const existing = this.stickyMultipliers.find(
        m => m.position.row === mult.position.row && m.position.col === mult.position.col
      );

      if (!existing) {
        this.stickyMultipliers.push({ ...mult, isPermanent: true });
      }
    }
  }

  /**
   * Decrement spins
   */
  decrementSpins(): void {
    this.spinsRemaining = Math.max(0, this.spinsRemaining - 1);
  }

  /**
   * Check if free spins are active
   */
  isActive(): boolean {
    return this.spinsRemaining > 0;
  }

  /**
   * Get remaining spins
   */
  getSpinsRemaining(): number {
    return this.spinsRemaining;
  }

  /**
   * Get sticky multipliers
   */
  getStickyMultipliers(): GridMultiplier[] {
    return [...this.stickyMultipliers];
  }

  /**
   * Reset free spins
   */
  reset(): void {
    this.spinsRemaining = 0;
    this.stickyMultipliers = [];
  }
}
