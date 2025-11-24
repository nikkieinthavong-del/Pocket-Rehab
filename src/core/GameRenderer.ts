import * as PIXI from 'pixi.js';
import { GameEngine } from '../core/GameEngine';
import { CONFIG } from '../core/Config';
import { SymbolType, OverdoseStage } from '../types/GameTypes';

/**
 * PixiJS renderer for the game
 */
export class GameRenderer {
  private app: PIXI.Application;
  private engine: GameEngine;
  private symbolSize: number = 80;
  private gridContainer: PIXI.Container;
  private uiContainer: PIXI.Container;
  private symbolSprites: PIXI.Graphics[][] = [];
  private isSpinning: boolean = false;

  constructor(engine: GameEngine) {
    this.engine = engine;
    
    // Initialize PixiJS application
    this.app = new PIXI.Application();
    this.gridContainer = new PIXI.Container();
    this.uiContainer = new PIXI.Container();
  }

  /**
   * Initialize renderer
   */
  async initialize(container: HTMLElement): Promise<void> {
    await this.app.init({
      width: 1280,
      height: 720,
      backgroundColor: 0x1a1a2e,
      antialias: true,
    });

    container.appendChild(this.app.canvas);

    // Add containers to stage
    this.app.stage.addChild(this.gridContainer);
    this.app.stage.addChild(this.uiContainer);

    // Setup grid
    this.setupGrid();
    this.setupUI();
    this.renderGrid();
  }

  /**
   * Setup grid container
   */
  private setupGrid(): void {
    const gridWidth = CONFIG.GRID_WIDTH * this.symbolSize;
    
    this.gridContainer.x = (this.app.screen.width - gridWidth) / 2;
    this.gridContainer.y = 100;

    // Initialize sprite grid
    for (let row = 0; row < CONFIG.GRID_HEIGHT; row++) {
      this.symbolSprites[row] = [];
      for (let col = 0; col < CONFIG.GRID_WIDTH; col++) {
        const sprite = new PIXI.Graphics();
        sprite.x = col * this.symbolSize;
        sprite.y = row * this.symbolSize;
        this.gridContainer.addChild(sprite);
        this.symbolSprites[row][col] = sprite;
      }
    }
  }

  /**
   * Setup UI elements
   */
  private setupUI(): void {
    const state = this.engine.getState();

    // Balance text
    const balanceText = new PIXI.Text({
      text: `Balance: $${state.balance.toFixed(2)}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
      },
    });
    balanceText.x = 20;
    balanceText.y = 20;
    this.uiContainer.addChild(balanceText);

    // Bet text
    const betText = new PIXI.Text({
      text: `Bet: $${state.bet}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffff00,
      },
    });
    betText.x = 20;
    betText.y = 50;
    this.uiContainer.addChild(betText);

    // Spin button
    const spinButton = new PIXI.Graphics();
    spinButton.circle(0, 0, 50);
    spinButton.fill(0x00ff00);
    spinButton.x = this.app.screen.width - 100;
    spinButton.y = this.app.screen.height - 80;
    spinButton.eventMode = 'static';
    spinButton.cursor = 'pointer';
    spinButton.on('pointerdown', () => this.handleSpin());
    this.uiContainer.addChild(spinButton);

    const spinText = new PIXI.Text({
      text: 'SPIN',
      style: {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0x000000,
        fontWeight: 'bold',
      },
    });
    spinText.anchor.set(0.5);
    spinText.x = spinButton.x;
    spinText.y = spinButton.y;
    this.uiContainer.addChild(spinText);

    // Win text
    const winText = new PIXI.Text({
      text: `Win: $${state.totalWin.toFixed(2)}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 28,
        fill: 0x00ff00,
        fontWeight: 'bold',
      },
    });
    winText.x = this.app.screen.width / 2;
    winText.y = 20;
    winText.anchor.set(0.5, 0);
    this.uiContainer.addChild(winText);
  }

  /**
   * Render grid symbols
   */
  private renderGrid(): void {
    const grid = this.engine.getGrid();
    const multipliers = this.engine.getMultipliers();

    for (let row = 0; row < CONFIG.GRID_HEIGHT; row++) {
      for (let col = 0; col < CONFIG.GRID_WIDTH; col++) {
        const symbol = grid[row][col];
        const sprite = this.symbolSprites[row][col];
        
        sprite.clear();

        if (symbol) {
          // Draw symbol background
          const color = this.getSymbolColor(symbol.type);
          sprite.rect(5, 5, this.symbolSize - 10, this.symbolSize - 10);
          sprite.fill(color);

          // Draw infection overlay
          if (symbol.overdoseStage === OverdoseStage.INFECTED) {
            sprite.rect(5, 5, this.symbolSize - 10, this.symbolSize - 10);
            sprite.stroke({ width: 3, color: 0xff0000 });
          }

          // Draw wild indicator
          if (symbol.type === SymbolType.WILD || symbol.overdoseStage === OverdoseStage.MUTATED) {
            sprite.rect(10, 10, this.symbolSize - 20, this.symbolSize - 20);
            sprite.stroke({ width: 4, color: 0xffff00 });
          }

          // Draw multiplier indicator
          const mult = multipliers.find(
            m => m.position.row === row && m.position.col === col
          );
          if (mult) {
            const multText = new PIXI.Text({
              text: `x${mult.multiplier}`,
              style: {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xffff00,
                fontWeight: 'bold',
              },
            });
            multText.x = sprite.x + 5;
            multText.y = sprite.y + this.symbolSize - 25;
            this.gridContainer.addChild(multText);
          }
        }
      }
    }
  }

  /**
   * Get color for symbol type
   */
  private getSymbolColor(type: SymbolType): number {
    const colors: Record<SymbolType, number> = {
      [SymbolType.LOW1]: 0x4a4a4a,
      [SymbolType.LOW2]: 0x5a5a5a,
      [SymbolType.LOW3]: 0x6a6a6a,
      [SymbolType.MED1]: 0x3498db,
      [SymbolType.MED2]: 0x9b59b6,
      [SymbolType.HIGH1]: 0xe74c3c,
      [SymbolType.HIGH2]: 0xf39c12,
      [SymbolType.WILD]: 0x2ecc71,
      [SymbolType.SCATTER]: 0xe67e22,
      [SymbolType.DOCTOR]: 0x1abc9c,
    };
    return colors[type] || 0xffffff;
  }

  /**
   * Handle spin button click
   */
  private async handleSpin(): Promise<void> {
    if (this.isSpinning) return;
    this.isSpinning = true;

    // Perform spin
    const result = this.engine.spin();

    // Animate and render result
    await this.animateSpin(result);

    this.isSpinning = false;
  }

  /**
   * Animate spin result
   */
  private async animateSpin(_result: any): Promise<void> {
    // Simple animation - just update display
    this.renderGrid();
    this.updateUI();

    // Wait a bit to show result
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  /**
   * Update UI text
   */
  private updateUI(): void {
    const state = this.engine.getState();
    
    // Update balance
    const balanceText = this.uiContainer.children[0] as PIXI.Text;
    balanceText.text = `Balance: $${state.balance.toFixed(2)}`;

    // Update win
    const winText = this.uiContainer.children[3] as PIXI.Text;
    winText.text = `Win: $${state.totalWin.toFixed(2)}`;

    // Show free spins
    if (state.freeSpinsRemaining > 0) {
      const fsText = new PIXI.Text({
        text: `Free Spins: ${state.freeSpinsRemaining}`,
        style: {
          fontFamily: 'Arial',
          fontSize: 24,
          fill: 0xff00ff,
          fontWeight: 'bold',
        },
      });
      fsText.x = this.app.screen.width / 2;
      fsText.y = 60;
      fsText.anchor.set(0.5, 0);
      
      // Remove old free spins text if exists
      const oldFsText = this.uiContainer.children.find((child: any) => 
        child instanceof PIXI.Text && child.text.startsWith('Free Spins:')
      );
      if (oldFsText) {
        this.uiContainer.removeChild(oldFsText);
      }
      
      this.uiContainer.addChild(fsText);
    }
  }

  /**
   * Get PixiJS app
   */
  getApp(): PIXI.Application {
    return this.app;
  }
}
