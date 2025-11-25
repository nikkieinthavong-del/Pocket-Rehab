import { CONFIG } from '../core/Config';
import {
  GridSymbol,
  OverdoseStage,
  SymbolType,
  Cluster,
  GridMultiplier,
} from '../types/GameTypes';

/**
 * Overdose Cycle Mechanic Implementation
 * Stage 1: Winning symbols stick with infection overlay
 * Stage 2: If infected symbols win again, mutate to Wilds
 * Stage 3: Wilds explode leaving permanent x2 grid multipliers
 */
export class OverdoseCycleMechanic {
  /**
   * Process winning clusters and update overdose stages
   * Returns modified grid and new multipliers from explosions
   */
  processClusters(
    grid: GridSymbol[][],
    clusters: Cluster[],
    existingMultipliers: GridMultiplier[]
  ): { updatedGrid: GridSymbol[][], newMultipliers: GridMultiplier[] } {
    const updatedGrid = this.cloneGrid(grid);
    const newMultipliers: GridMultiplier[] = [];

    // Process each cluster
    for (const cluster of clusters) {
      for (const symbol of cluster.symbols) {
        const gridSymbol = updatedGrid[symbol.position.row][symbol.position.col];
        
        if (!gridSymbol) continue;

        // Stage progression
        switch (gridSymbol.overdoseStage) {
          case OverdoseStage.NONE:
            // Stage 1: Infect the symbol
            gridSymbol.overdoseStage = OverdoseStage.INFECTED;
            gridSymbol.isSticky = true;
            break;

          case OverdoseStage.INFECTED:
            // Stage 2: Mutate to Wild
            gridSymbol.overdoseStage = OverdoseStage.MUTATED;
            gridSymbol.type = SymbolType.WILD;
            gridSymbol.isSticky = true;
            break;

          case OverdoseStage.MUTATED:
            // Stage 3: Explode and create permanent multiplier
            gridSymbol.overdoseStage = OverdoseStage.EXPLODED;
            
            // Add permanent x2 multiplier at this position
            const existingMult = existingMultipliers.find(
              m => m.position.row === symbol.position.row && m.position.col === symbol.position.col
            );
            
            if (!existingMult) {
              newMultipliers.push({
                position: { row: symbol.position.row, col: symbol.position.col },
                multiplier: CONFIG.WILD_EXPLOSION_MULTIPLIER,
                isPermanent: true,
              });
            }
            
            // Symbol will be removed in cascade
            gridSymbol.isSticky = false;
            break;
        }
      }
    }

    return { updatedGrid, newMultipliers };
  }

  /**
   * Remove winning symbols from grid (except sticky ones)
   */
  removeWinningSymbols(grid: GridSymbol[][], clusters: Cluster[]): GridSymbol[][] {
    const updatedGrid = this.cloneGrid(grid);
    
    for (const cluster of clusters) {
      for (const symbol of cluster.symbols) {
        const gridSymbol = updatedGrid[symbol.position.row][symbol.position.col];
        
        // Only remove non-sticky symbols or exploded symbols
        if (gridSymbol && (!gridSymbol.isSticky || gridSymbol.overdoseStage === OverdoseStage.EXPLODED)) {
          updatedGrid[symbol.position.row][symbol.position.col] = null!;
        }
      }
    }
    
    return updatedGrid;
  }

  /**
   * Deep clone grid
   */
  private cloneGrid(grid: GridSymbol[][]): GridSymbol[][] {
    return grid.map(row => 
      row.map(symbol => symbol ? { ...symbol, position: { ...symbol.position } } : symbol)
    );
  }
}
