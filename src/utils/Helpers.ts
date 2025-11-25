import { SymbolType } from '../types/GameTypes';

/**
 * Utility functions
 */

/**
 * Get weighted random symbol
 */
export function getWeightedRandomSymbol(weights: Record<SymbolType, number>): SymbolType {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (const [symbol, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return symbol as SymbolType;
    }
  }
  
  return SymbolType.LOW1;
}

/**
 * Generate random grid with weighted symbols
 */
export function generateRandomGrid(
  width: number,
  height: number,
  weights: Record<SymbolType, number>
): SymbolType[][] {
  const grid: SymbolType[][] = [];
  
  for (let row = 0; row < height; row++) {
    grid[row] = [];
    for (let col = 0; col < width; col++) {
      grid[row][col] = getWeightedRandomSymbol(weights);
    }
  }
  
  return grid;
}

/**
 * Check if two positions are adjacent (4-way connectivity)
 */
export function areAdjacent(pos1: { row: number; col: number }, pos2: { row: number; col: number }): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
