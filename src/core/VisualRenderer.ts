import * as PIXI from 'pixi.js';
import { GameEngine } from './GameEngine';
import { CONFIG } from './Config';
import { SymbolType, OverdoseStage, BonusType } from '../types/GameTypes';
import { assetLoader } from '../assets/AssetLoader';
import { SYMBOL_TO_ASSET } from '../assets/AssetManifest';
import { BonusBuyMenu } from '../ui/BonusBuyMenu';

/**
 * Enhanced PixiJS renderer with asset support
 */
export class VisualRenderer {
  private app: PIXI.Application;
  private engine: GameEngine;
  private symbolSize: number = 100;
  private gridContainer: PIXI.Container;
  private uiContainer: PIXI.Container;
  private backgroundContainer: PIXI.Container;
  private effectsContainer: PIXI.Container;
  private symbolSprites: PIXI.Sprite[][] = [];
  private isSpinning: boolean = false;

  // UI element references
  private balanceText!: PIXI.Text;
  private betText!: PIXI.Text;
  private winText!: PIXI.Text;
  private freeSpinsText?: PIXI.Text;
  private spinButton!: PIXI.Sprite;
  private bonusBuyButton!: PIXI.Sprite;
  private gridFrame?: PIXI.Sprite;
  private background?: PIXI.Sprite;
  private bonusBuyMenu!: BonusBuyMenu;

  constructor(engine: GameEngine) {
    this.engine = engine;

    // Initialize PixiJS application
    this.app = new PIXI.Application();
    this.backgroundContainer = new PIXI.Container();
    this.gridContainer = new PIXI.Container();
    this.effectsContainer = new PIXI.Container();
    this.uiContainer = new PIXI.Container();
  }

  /**
   * Initialize renderer
   */
  async initialize(container: HTMLElement): Promise<void> {
    await this.app.init({
      width: 1920,
      height: 1080,
      backgroundColor: 0x000000,
      antialias: true,
    });

    container.appendChild(this.app.canvas);

    // Add containers to stage in order
    this.app.stage.addChild(this.backgroundContainer);
    this.app.stage.addChild(this.gridContainer);
    this.app.stage.addChild(this.effectsContainer);
    this.app.stage.addChild(this.uiContainer);

    // Initialize bonus buy menu
    this.bonusBuyMenu = new BonusBuyMenu();

    // Load assets first
    await this.loadAssets();

    // Setup scenes
    this.setupBackground();
    this.setupGrid();
    this.setupUI();
    this.setupBonusBuyMenu();
    this.renderGrid();
  }

  /**
   * Setup bonus buy menu
   */
  private setupBonusBuyMenu(): void {
    this.bonusBuyMenu.initialize(
      this.app.screen.width,
      this.app.screen.height,
      (bonusType: BonusType) => this.handleBonusBuy(bonusType)
    );

    // Add bonus buy menu to stage (on top of everything)
    this.app.stage.addChild(this.bonusBuyMenu.getContainer());
  }

  /**
   * Handle bonus buy purchase
   */
  private handleBonusBuy(bonusType: BonusType): void {
    const state = this.engine.getState();
    let cost = 0;

    switch (bonusType) {
      case BonusType.SHOOTER:
        cost = state.bet * 100;
        break;
      case BonusType.BOSS_BATTLE:
        cost = state.bet * 200;
        break;
      case BonusType.FREE_SPINS:
        cost = state.bet * 500;
        break;
    }

    if (state.balance >= cost) {
      console.log(`Buying ${bonusType} for $${cost}`);
      // TODO: Implement actual bonus buy logic in GameEngine
      alert(`Bonus Buy: ${bonusType}\nCost: $${cost}\n\nBonus features coming soon!`);
    } else {
      alert('Insufficient balance!');
    }
  }

  /**
   * Load all game assets
   */
  private async loadAssets(): Promise<void> {
    console.log('Loading game assets...');

    await assetLoader.loadAll((progress) => {
      console.log(`Loading... ${Math.round(progress * 100)}%`);
    });

    console.log('Assets loaded!');
  }

  /**
   * Setup background
   */
  private setupBackground(): void {
    // Load main background
    const bgTexture = assetLoader.getTexture('bg_main_alley');

    if (bgTexture) {
      this.background = new PIXI.Sprite(bgTexture);
      this.background.width = this.app.screen.width;
      this.background.height = this.app.screen.height;
      this.backgroundContainer.addChild(this.background);
    } else {
      // Fallback gradient background
      const graphics = new PIXI.Graphics();
      graphics.rect(0, 0, this.app.screen.width, this.app.screen.height);
      graphics.fill({ color: 0x1a1a2e });
      this.backgroundContainer.addChild(graphics);
    }
  }

  /**
   * Setup grid container with frame
   */
  private setupGrid(): void {
    const gridWidth = CONFIG.GRID_WIDTH * this.symbolSize;
    const gridHeight = CONFIG.GRID_HEIGHT * this.symbolSize;

    // Center the grid
    this.gridContainer.x = (this.app.screen.width - gridWidth) / 2;
    this.gridContainer.y = (this.app.screen.height - gridHeight) / 2;

    // Add grid frame if available
    const frameTexture = assetLoader.getTexture('ui_container_grid');
    if (frameTexture) {
      this.gridFrame = new PIXI.Sprite(frameTexture);
      this.gridFrame.width = gridWidth + 40;
      this.gridFrame.height = gridHeight + 40;
      this.gridFrame.x = this.gridContainer.x - 20;
      this.gridFrame.y = this.gridContainer.y - 20;
      this.backgroundContainer.addChild(this.gridFrame);
    }

    // Initialize sprite grid
    for (let row = 0; row < CONFIG.GRID_HEIGHT; row++) {
      this.symbolSprites[row] = [];
      for (let col = 0; col < CONFIG.GRID_WIDTH; col++) {
        const sprite = new PIXI.Sprite();
        sprite.width = this.symbolSize;
        sprite.height = this.symbolSize;
        sprite.x = col * this.symbolSize;
        sprite.y = row * this.symbolSize;
        sprite.anchor.set(0.5);
        sprite.x += this.symbolSize / 2;
        sprite.y += this.symbolSize / 2;
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
    const textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial Black, Arial',
      fontSize: 32,
      fill: '#00ff00',
      stroke: { color: '#000000', width: 4 },
    });

    // Balance text
    this.balanceText = new PIXI.Text({
      text: `$${state.balance.toFixed(2)}`,
      style: textStyle,
    });
    this.balanceText.x = 50;
    this.balanceText.y = 50;
    this.uiContainer.addChild(this.balanceText);

    // Balance label
    const balanceLabel = new PIXI.Text({
      text: 'BALANCE',
      style: { ...textStyle, fontSize: 20, fill: '#ffffff' },
    });
    balanceLabel.x = 50;
    balanceLabel.y = 20;
    this.uiContainer.addChild(balanceLabel);

    // Bet text
    this.betText = new PIXI.Text({
      text: `$${state.bet}`,
      style: { ...textStyle, fill: '#ffff00' },
    });
    this.betText.x = 50;
    this.betText.y = 130;
    this.uiContainer.addChild(this.betText);

    // Bet label
    const betLabel = new PIXI.Text({
      text: 'BET',
      style: { ...textStyle, fontSize: 20, fill: '#ffffff' },
    });
    betLabel.x = 50;
    betLabel.y = 100;
    this.uiContainer.addChild(betLabel);

    // Win text (center top)
    this.winText = new PIXI.Text({
      text: state.totalWin > 0 ? `WIN: $${state.totalWin.toFixed(2)}` : '',
      style: {
        ...textStyle,
        fontSize: 48,
        fill: '#ffff00',
        stroke: { color: '#ff0000', width: 6 },
      },
    });
    this.winText.anchor.set(0.5, 0);
    this.winText.x = this.app.screen.width / 2;
    this.winText.y = 50;
    this.uiContainer.addChild(this.winText);

    // Spin button
    const spinTexture = assetLoader.getTexture('ui_btn_spin');
    if (spinTexture) {
      this.spinButton = new PIXI.Sprite(spinTexture);
      this.spinButton.width = 120;
      this.spinButton.height = 120;
    } else {
      // Fallback button
      const graphics = new PIXI.Graphics();
      graphics.circle(0, 0, 60);
      graphics.fill(0x00ff00);
      const texture = this.app.renderer.generateTexture(graphics);
      this.spinButton = new PIXI.Sprite(texture);
    }

    this.spinButton.anchor.set(0.5);
    this.spinButton.x = this.app.screen.width - 150;
    this.spinButton.y = this.app.screen.height - 150;
    this.spinButton.eventMode = 'static';
    this.spinButton.cursor = 'pointer';
    this.spinButton.on('pointerdown', () => this.handleSpin());
    this.uiContainer.addChild(this.spinButton);

    // Spin button text
    const spinText = new PIXI.Text({
      text: 'SPIN',
      style: {
        fontFamily: 'Arial Black',
        fontSize: 24,
        fill: '#000000',
        fontWeight: 'bold',
      },
    });
    spinText.anchor.set(0.5);
    spinText.x = this.spinButton.x;
    spinText.y = this.spinButton.y;
    this.uiContainer.addChild(spinText);

    // Bonus Buy button
    const bonusBuyTexture = assetLoader.getTexture('ui_panel_bonusbuy');
    if (bonusBuyTexture) {
      this.bonusBuyButton = new PIXI.Sprite(bonusBuyTexture);
      this.bonusBuyButton.width = 140;
      this.bonusBuyButton.height = 60;
    } else {
      // Fallback button
      const graphics = new PIXI.Graphics();
      graphics.rect(0, 0, 140, 60);
      graphics.fill(0xff6b35);
      const texture = this.app.renderer.generateTexture(graphics);
      this.bonusBuyButton = new PIXI.Sprite(texture);
    }

    this.bonusBuyButton.x = this.app.screen.width - 180;
    this.bonusBuyButton.y = 50;
    this.bonusBuyButton.eventMode = 'static';
    this.bonusBuyButton.cursor = 'pointer';
    this.bonusBuyButton.on('pointerdown', () => this.bonusBuyMenu.toggle());
    this.uiContainer.addChild(this.bonusBuyButton);

    // Bonus Buy button text
    const bonusBuyText = new PIXI.Text({
      text: 'BONUS\nBUY',
      style: {
        fontFamily: 'Arial Black',
        fontSize: 18,
        fill: '#ffffff',
        fontWeight: 'bold',
        align: 'center',
      },
    });
    bonusBuyText.anchor.set(0.5);
    bonusBuyText.x = this.bonusBuyButton.x + this.bonusBuyButton.width / 2;
    bonusBuyText.y = this.bonusBuyButton.y + this.bonusBuyButton.height / 2;
    this.uiContainer.addChild(bonusBuyText);
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

        if (symbol) {
          // Get texture for symbol type
          const assetKey = SYMBOL_TO_ASSET[symbol.type];
          const texture = assetLoader.getTexture(assetKey);

          if (texture) {
            sprite.texture = texture;
            sprite.visible = true;
          } else {
            // Fallback: create colored square
            const graphics = new PIXI.Graphics();
            graphics.rect(-this.symbolSize/2, -this.symbolSize/2, this.symbolSize - 10, this.symbolSize - 10);
            graphics.fill(this.getSymbolColor(symbol.type));
            sprite.texture = this.app.renderer.generateTexture(graphics);
            sprite.visible = true;
          }

          // Apply overdose stage effects
          this.applyOverdoseEffect(sprite, symbol.overdoseStage);

          // Show multiplier if present
          const mult = multipliers.find(
            m => m.position.row === row && m.position.col === col
          );

          if (mult && mult.multiplier > 1) {
            this.renderMultiplier(sprite, mult.multiplier);
          }
        } else {
          sprite.visible = false;
        }
      }
    }
  }

  /**
   * Apply overdose cycle visual effect to sprite
   */
  private applyOverdoseEffect(sprite: PIXI.Sprite, stage: OverdoseStage): void {
    // Reset filters
    sprite.filters = [];

    switch (stage) {
      case OverdoseStage.INFECTED:
        // Green glitch overlay
        const infectedTexture = assetLoader.getTexture('overlay_infected');
        if (infectedTexture) {
          // Apply green tint
          sprite.tint = 0x00ff00;
          sprite.alpha = 0.9;
        } else {
          sprite.tint = 0x00ff00;
          sprite.alpha = 0.8;
        }
        break;

      case OverdoseStage.MUTATED:
        // Wild transformation - yellow glow
        sprite.tint = 0xffff00;
        sprite.alpha = 1.0;
        // Pulsing effect could be added with animation
        break;

      case OverdoseStage.EXPLODED:
        // Exploded state
        sprite.alpha = 0.5;
        sprite.tint = 0xff0000;
        break;

      default:
        sprite.tint = 0xffffff;
        sprite.alpha = 1.0;
    }
  }

  /**
   * Render multiplier on sprite
   */
  private renderMultiplier(sprite: PIXI.Sprite, multiplier: number): void {
    const multText = new PIXI.Text({
      text: `x${multiplier}`,
      style: {
        fontFamily: 'Arial Black',
        fontSize: 24,
        fill: '#ffff00',
        stroke: { color: '#000000', width: 4 },
        fontWeight: 'bold',
      },
    });
    multText.anchor.set(0.5);
    multText.x = sprite.x;
    multText.y = sprite.y + this.symbolSize / 2 - 20;
    this.gridContainer.addChild(multText);
  }

  /**
   * Get fallback color for symbol type
   */
  private getSymbolColor(type: SymbolType): number {
    const colors: Record<SymbolType, number> = {
      [SymbolType.FISH]: 0x4a4a4a,
      [SymbolType.FINGER]: 0x5a5a5a,
      [SymbolType.NEEDLE]: 0x6a6a6a,
      [SymbolType.BAGGIE]: 0x7a7a7a,
      [SymbolType.PILLS]: 0x8a8a8a,
      [SymbolType.CAN]: 0x9a9a9a,
      [SymbolType.SPARKY]: 0xe74c3c,
      [SymbolType.ZIPPO]: 0xf39c12,
      [SymbolType.SQUIRT]: 0x3498db,
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

    // Disable button
    this.spinButton.tint = 0x888888;
    this.spinButton.eventMode = 'none';

    // Perform spin
    const result = this.engine.spin();

    // Animate result
    await this.animateSpin(result);

    // Re-enable button
    this.spinButton.tint = 0xffffff;
    this.spinButton.eventMode = 'static';
    this.isSpinning = false;
  }

  /**
   * Animate spin result with cascades
   */
  private async animateSpin(_result: any): Promise<void> {
    // Simple animation for now - show result
    this.renderGrid();
    this.updateUI();

    // Wait to show result
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  /**
   * Update UI text elements
   */
  private updateUI(): void {
    const state = this.engine.getState();

    this.balanceText.text = `$${state.balance.toFixed(2)}`;
    this.betText.text = `$${state.bet}`;

    if (state.totalWin > 0) {
      this.winText.text = `WIN: $${state.totalWin.toFixed(2)}`;
      this.winText.visible = true;
    } else {
      this.winText.visible = false;
    }

    // Free spins indicator
    if (state.freeSpinsRemaining > 0) {
      if (!this.freeSpinsText) {
        this.freeSpinsText = new PIXI.Text({
          text: `FREE SPINS: ${state.freeSpinsRemaining}`,
          style: {
            fontFamily: 'Arial Black',
            fontSize: 36,
            fill: '#ff00ff',
            stroke: { color: '#000000', width: 5 },
            fontWeight: 'bold',
          },
        });
        this.freeSpinsText.anchor.set(0.5, 0);
        this.freeSpinsText.x = this.app.screen.width / 2;
        this.freeSpinsText.y = 120;
        this.uiContainer.addChild(this.freeSpinsText);
      } else {
        this.freeSpinsText.text = `FREE SPINS: ${state.freeSpinsRemaining}`;
      }
    } else if (this.freeSpinsText) {
      this.uiContainer.removeChild(this.freeSpinsText);
      this.freeSpinsText = undefined;
    }
  }

  /**
   * Get PixiJS app
   */
  getApp(): PIXI.Application {
    return this.app;
  }
}
