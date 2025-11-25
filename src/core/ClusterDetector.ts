import { CONFIG } from '../core/Config';
import {
  GridSymbol,
  Cluster,
  Position,
  SymbolType,
} from '../types/GameTypes';

/**
 * Cluster detection for cluster-pays mechanic
 */
export class ClusterDetector {
  /**
   * Find all clusters of size >= minSize on the grid
   */
  findClusters(grid: GridSymbol[][], minSize: number = CONFIG.MIN_CLUSTER_SIZE): Cluster[] {
    const visited = new Set<string>();
    const clusters: Cluster[] = [];

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const key = `${row},${col}`;
        if (visited.has(key)) continue;

        const symbol = grid[row][col];
        if (!symbol) continue;

        const cluster = this.findCluster(grid, row, col, visited);
        
        if (cluster.size >= minSize) {
          clusters.push(cluster);
        }
      }
    }

    return clusters;
  }

  /**
   * Find a single cluster starting from a position using flood fill
   */
  private findCluster(
    grid: GridSymbol[][],
    startRow: number,
    startCol: number,
    visited: Set<string>
  ): Cluster {
    const startSymbol = grid[startRow][startCol];
    const symbolType = startSymbol.type;
    const clusterSymbols: GridSymbol[] = [];
    const queue: Position[] = [{ row: startRow, col: startCol }];

    while (queue.length > 0) {
      const pos = queue.shift()!;
      const key = `${pos.row},${pos.col}`;

      if (visited.has(key)) continue;
      if (pos.row < 0 || pos.row >= grid.length) continue;
      if (pos.col < 0 || pos.col >= grid[0].length) continue;

      const symbol = grid[pos.row][pos.col];
      if (!symbol) continue;

      // Wild symbols can match with any symbol type
      const isMatch = 
        symbol.type === symbolType ||
        symbol.type === SymbolType.WILD ||
        symbolType === SymbolType.WILD;

      if (!isMatch) continue;

      visited.add(key);
      clusterSymbols.push(symbol);

      // Add adjacent positions to queue
      queue.push({ row: pos.row - 1, col: pos.col }); // Up
      queue.push({ row: pos.row + 1, col: pos.col }); // Down
      queue.push({ row: pos.row, col: pos.col - 1 }); // Left
      queue.push({ row: pos.row, col: pos.col + 1 }); // Right
    }

    return {
      symbols: clusterSymbols,
      symbolType: symbolType === SymbolType.WILD && clusterSymbols.length > 0 
        ? clusterSymbols.find(s => s.type !== SymbolType.WILD)?.type || SymbolType.WILD
        : symbolType,
      size: clusterSymbols.length,
    };
  }

  /**
   * Count scatter symbols on grid
   */
  countScatters(grid: GridSymbol[][]): number {
    let count = 0;
    for (const row of grid) {
      for (const symbol of row) {
        if (symbol && symbol.type === SymbolType.SCATTER) {
          count++;
        }
      }
    }
    return count;
  }
}
