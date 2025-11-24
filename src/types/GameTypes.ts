/**
 * Symbol types in the game
 */
export enum SymbolType {
  LOW1 = 'LOW1',
  LOW2 = 'LOW2',
  LOW3 = 'LOW3',
  MED1 = 'MED1',
  MED2 = 'MED2',
  HIGH1 = 'HIGH1',
  HIGH2 = 'HIGH2',
  WILD = 'WILD',
  SCATTER = 'SCATTER',
  DOCTOR = 'DOCTOR',
}

/**
 * Overdose cycle stages
 */
export enum OverdoseStage {
  NONE = 0,
  INFECTED = 1,
  MUTATED = 2,
  EXPLODED = 3,
}

/**
 * Bonus game types
 */
export enum BonusType {
  NONE = 'NONE',
  SHOOTER = 'SHOOTER',
  BOSS_BATTLE = 'BOSS_BATTLE',
  FREE_SPINS = 'FREE_SPINS',
}

/**
 * Position on the grid
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Symbol on the grid with state
 */
export interface GridSymbol {
  type: SymbolType;
  position: Position;
  overdoseStage: OverdoseStage;
  isSticky: boolean;
}

/**
 * Cluster of matching symbols
 */
export interface Cluster {
  symbols: GridSymbol[];
  symbolType: SymbolType;
  size: number;
}

/**
 * Grid multiplier at a position
 */
export interface GridMultiplier {
  position: Position;
  multiplier: number;
  isPermanent: boolean;
}

/**
 * Win result
 */
export interface WinResult {
  clusters: Cluster[];
  totalWin: number;
  multiplier: number;
}

/**
 * Game state
 */
export interface GameState {
  grid: GridSymbol[][];
  multipliers: GridMultiplier[];
  bonusType: BonusType;
  bonusData: any;
  balance: number;
  bet: number;
  freeSpinsRemaining: number;
  totalWin: number;
}

/**
 * Spin result
 */
export interface SpinResult {
  finalGrid: GridSymbol[][];
  cascadeResults: WinResult[];
  totalWin: number;
  bonusTriggered: BonusType;
  newMultipliers: GridMultiplier[];
}
