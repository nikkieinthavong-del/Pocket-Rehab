/**
 * Symbol types in the game
 * Based on Pocket Rehab: Toxic Shock design
 */
export enum SymbolType {
  // Low Pay Symbols (Paraphernalia)
  FISH = 'FISH',           // Skeleton Fish
  FINGER = 'FINGER',       // Middle Finger
  NEEDLE = 'NEEDLE',       // Syringe
  BAGGIE = 'BAGGIE',       // Baggie
  PILLS = 'PILLS',         // Spilled Pills
  CAN = 'CAN',             // Crushed Can

  // High Pay Symbols (The Addicts)
  SPARKY = 'SPARKY',       // The Rat
  ZIPPO = 'ZIPPO',         // The Lizard
  SQUIRT = 'SQUIRT',       // The Turtle

  // Special Symbols
  WILD = 'WILD',           // Neon Puke Wild
  SCATTER = 'SCATTER',     // Rejected Letter
  DOCTOR = 'DOCTOR',       // The Doctor (resets multipliers in free spins)
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
