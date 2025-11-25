import { CONFIG } from '../core/Config';
import {
  Cluster,
  GridMultiplier,
  WinResult,
} from '../types/GameTypes';

/**
 * Win calculator
 */
export class WinCalculator {
  /**
   * Calculate win amount for clusters
   */
  calculateWin(
    clusters: Cluster[],
    bet: number,
    multipliers: GridMultiplier[]
  ): WinResult {
    let totalWin = 0;
    let totalMultiplier = 1;

    // Calculate base win from clusters
    for (const cluster of clusters) {
      const symbolPayout = CONFIG.SYMBOL_PAYOUTS[cluster.symbolType] || 0;
      const clusterWin = symbolPayout * cluster.size * bet;
      totalWin += clusterWin;
    }

    // Apply grid multipliers for winning positions
    const winningPositions = new Set<string>();
    for (const cluster of clusters) {
      for (const symbol of cluster.symbols) {
        winningPositions.add(`${symbol.position.row},${symbol.position.col}`);
      }
    }

    // Calculate total multiplier from grid positions
    for (const mult of multipliers) {
      const key = `${mult.position.row},${mult.position.col}`;
      if (winningPositions.has(key)) {
        totalMultiplier *= mult.multiplier;
      }
    }

    totalWin *= totalMultiplier;

    // Cap at max win
    totalWin = Math.min(totalWin, bet * CONFIG.MAX_WIN_MULTIPLIER);

    return {
      clusters,
      totalWin,
      multiplier: totalMultiplier,
    };
  }
}
