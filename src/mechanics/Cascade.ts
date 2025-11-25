import { GridSymbol, SymbolType, OverdoseStage } from '../types/GameTypes';
import { getWeightedRandomSymbol } from '../utils/Helpers';

/**
 * Cascade mechanic - drops symbols to fill empty spaces
 */
export class CascadeMechanic {
  /**
   * Apply gravity to grid - symbols fall down to fill empty spaces
   * Returns new grid with symbols dropped
   */
  applyGravity(grid: GridSymbol[][]): GridSymbol[][] {
    const newGrid: GridSymbol[][] = Array(grid.length)
      .fill(null)
      .map(() => Array(grid[0].length).fill(null));

    // Process each column
    for (let col = 0; col < grid[0].length; col++) {
      let writePos = grid.length - 1; // Start from bottom

      // First, drop existing symbols
      for (let row = grid.length - 1; row >= 0; row--) {
        const symbol = grid[row][col];
        if (symbol) {
          newGrid[writePos][col] = {
            ...symbol,
            position: { row: writePos, col },
          };
          writePos--;
        }
      }
    }

    return newGrid;
  }

  /**
   * Fill empty spaces with new symbols
   */
  fillEmptySpaces(
    grid: GridSymbol[][],
    symbolWeights: Record<SymbolType, number>,
    _isFreeSpins: boolean = false
  ): GridSymbol[][] {
    const newGrid = grid.map(row => [...row]);

    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        if (!newGrid[row][col]) {
          const symbolType = getWeightedRandomSymbol(symbolWeights);
          newGrid[row][col] = {
            type: symbolType,
            position: { row, col },
            overdoseStage: OverdoseStage.NONE,
            isSticky: false,
          };
        }
      }
    }

    return newGrid;
  }

  /**
   * Complete cascade - apply gravity and fill
   */
  cascade(
    grid: GridSymbol[][],
    symbolWeights: Record<SymbolType, number>,
    isFreeSpins: boolean = false
  ): GridSymbol[][] {
    const afterGravity = this.applyGravity(grid);
    return this.fillEmptySpaces(afterGravity, symbolWeights, isFreeSpins);
  }
}
