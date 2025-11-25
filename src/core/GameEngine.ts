import { CONFIG } from './Config';
import { ClusterDetector } from './ClusterDetector';
import { WinCalculator } from './WinCalculator';
import { OverdoseCycleMechanic } from '../mechanics/OverdoseCycle';
import { CascadeMechanic } from '../mechanics/Cascade';
import { ShooterBonus } from '../bonuses/ShooterBonus';
import { BossBattleBonus } from '../bonuses/BossBattleBonus';
import { FreeSpinsBonus } from '../bonuses/FreeSpinsBonus';
import {
  GameState,
  GridSymbol,
  BonusType,
  SpinResult,
  WinResult,
  OverdoseStage,
  GridMultiplier,
} from '../types/GameTypes';
import { generateRandomGrid } from '../utils/Helpers';

/**
 * Main game engine for Pocket Rehab slot
 */
export class GameEngine {
  private state: GameState;
  private clusterDetector: ClusterDetector;
  private winCalculator: WinCalculator;
  private overdoseCycle: OverdoseCycleMechanic;
  private cascade: CascadeMechanic;
  private shooterBonus: ShooterBonus;
  private bossBattle: BossBattleBonus;
  private freeSpins: FreeSpinsBonus;

  constructor(initialBalance: number = 10000, initialBet: number = 10) {
    this.clusterDetector = new ClusterDetector();
    this.winCalculator = new WinCalculator();
    this.overdoseCycle = new OverdoseCycleMechanic();
    this.cascade = new CascadeMechanic();
    this.shooterBonus = new ShooterBonus();
    this.bossBattle = new BossBattleBonus();
    this.freeSpins = new FreeSpinsBonus();

    this.state = {
      grid: this.initializeGrid(),
      multipliers: [],
      bonusType: BonusType.NONE,
      bonusData: null,
      balance: initialBalance,
      bet: initialBet,
      freeSpinsRemaining: 0,
      totalWin: 0,
    };
  }

  /**
   * Initialize grid with symbols
   */
  private initializeGrid(): GridSymbol[][] {
    const symbolGrid = generateRandomGrid(
      CONFIG.GRID_WIDTH,
      CONFIG.GRID_HEIGHT,
      CONFIG.SYMBOL_WEIGHTS
    );

    const grid: GridSymbol[][] = [];
    for (let row = 0; row < CONFIG.GRID_HEIGHT; row++) {
      grid[row] = [];
      for (let col = 0; col < CONFIG.GRID_WIDTH; col++) {
        grid[row][col] = {
          type: symbolGrid[row][col],
          position: { row, col },
          overdoseStage: OverdoseStage.NONE,
          isSticky: false,
        };
      }
    }

    return grid;
  }

  /**
   * Perform a spin
   */
  spin(): SpinResult {
    // Deduct bet
    if (!this.freeSpins.isActive()) {
      this.state.balance -= this.state.bet;
    }

    // Generate initial grid or use free spins grid
    let currentGrid: GridSymbol[][];
    if (this.freeSpins.isActive()) {
      // In free spins, cascade from existing grid
      currentGrid = this.state.grid;
    } else {
      currentGrid = this.initializeGrid();
    }

    const cascadeResults: WinResult[] = [];
    const allNewMultipliers: GridMultiplier[] = [];
    let totalWin = 0;
    let bonusTriggered = BonusType.NONE;

    // Check for scatter bonus triggers
    const scatterCount = this.clusterDetector.countScatters(currentGrid);
    if (scatterCount >= CONFIG.FREE_SPINS_SCATTERS) {
      bonusTriggered = BonusType.FREE_SPINS;
    } else if (scatterCount >= CONFIG.BOSS_BATTLE_SCATTERS) {
      bonusTriggered = BonusType.BOSS_BATTLE;
    } else if (scatterCount >= CONFIG.SHOOTER_SCATTERS) {
      bonusTriggered = BonusType.SHOOTER;
    }

    // Cascade loop
    let cascading = true;
    let maxCascades = 20; // Prevent infinite loops
    
    while (cascading && maxCascades > 0) {
      maxCascades--;

      // Find clusters
      const clusters = this.clusterDetector.findClusters(currentGrid);

      if (clusters.length === 0) {
        cascading = false;
        break;
      }

      // Get all multipliers (permanent + free spins sticky)
      const allMultipliers = [
        ...this.state.multipliers,
        ...(this.freeSpins.isActive() ? this.freeSpins.getStickyMultipliers() : []),
      ];

      // Calculate win
      const winResult = this.winCalculator.calculateWin(
        clusters,
        this.state.bet,
        allMultipliers
      );
      cascadeResults.push(winResult);
      totalWin += winResult.totalWin;

      // Process overdose cycle
      const { updatedGrid, newMultipliers } = this.overdoseCycle.processClusters(
        currentGrid,
        clusters,
        allMultipliers
      );
      currentGrid = updatedGrid;
      allNewMultipliers.push(...newMultipliers);

      // Add new multipliers to state
      for (const mult of newMultipliers) {
        this.state.multipliers.push(mult);
      }

      // Free spins: add sticky multipliers
      if (this.freeSpins.isActive()) {
        this.freeSpins.addStickyMultipliers(newMultipliers);
      }

      // Remove winning symbols
      currentGrid = this.overdoseCycle.removeWinningSymbols(currentGrid, clusters);

      // Cascade
      const weights = this.freeSpins.isActive() 
        ? CONFIG.FREE_SPINS_SYMBOL_WEIGHTS 
        : CONFIG.SYMBOL_WEIGHTS;
      currentGrid = this.cascade.cascade(currentGrid, weights, this.freeSpins.isActive());

      // Check for doctor symbols in free spins
      if (this.freeSpins.isActive()) {
        this.freeSpins.processDoctorSymbols(currentGrid);
      }
    }

    // Update state
    this.state.grid = currentGrid;
    this.state.totalWin = totalWin;
    this.state.balance += totalWin;

    // Handle bonuses
    if (bonusTriggered !== BonusType.NONE) {
      this.triggerBonus(bonusTriggered);
    }

    // Decrement free spins
    if (this.freeSpins.isActive()) {
      this.freeSpins.decrementSpins();
      this.state.freeSpinsRemaining = this.freeSpins.getSpinsRemaining();
    }

    return {
      finalGrid: currentGrid,
      cascadeResults,
      totalWin,
      bonusTriggered,
      newMultipliers: allNewMultipliers,
    };
  }

  /**
   * Trigger bonus game
   */
  private triggerBonus(bonusType: BonusType): void {
    this.state.bonusType = bonusType;

    switch (bonusType) {
      case BonusType.SHOOTER:
        const shooterWin = this.shooterBonus.play(this.state.bet);
        this.state.balance += shooterWin;
        this.state.totalWin += shooterWin;
        break;

      case BonusType.BOSS_BATTLE:
        const bossWin = this.bossBattle.play(this.state.bet);
        this.state.balance += bossWin;
        this.state.totalWin += bossWin;
        break;

      case BonusType.FREE_SPINS:
        this.state.grid = this.freeSpins.initialize();
        this.state.freeSpinsRemaining = this.freeSpins.getSpinsRemaining();
        break;
    }
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Set bet amount
   */
  setBet(bet: number): void {
    this.state.bet = Math.max(1, Math.min(bet, this.state.balance));
  }

  /**
   * Get grid for display
   */
  getGrid(): GridSymbol[][] {
    return this.state.grid;
  }

  /**
   * Get multipliers for display
   */
  getMultipliers(): GridMultiplier[] {
    return [
      ...this.state.multipliers,
      ...(this.freeSpins.isActive() ? this.freeSpins.getStickyMultipliers() : []),
    ];
  }
}
