import * as PIXI from 'pixi.js';
import { BonusType } from '../types/GameTypes';

/**
 * Bonus Buy Menu UI
 * Allows players to purchase bonus features
 */
export class BonusBuyMenu {
  private container: PIXI.Container;
  private visible: boolean = false;
  private onBuyCallback?: (bonusType: BonusType) => void;

  constructor() {
    this.container = new PIXI.Container();
    this.container.visible = false;
  }

  /**
   * Initialize the menu
   */
  initialize(screenWidth: number, screenHeight: number, onBuy: (bonusType: BonusType) => void): void {
    this.onBuyCallback = onBuy;

    // Semi-transparent background
    const overlay = new PIXI.Graphics();
    overlay.rect(0, 0, screenWidth, screenHeight);
    overlay.fill({ color: 0x000000, alpha: 0.8 });
    overlay.eventMode = 'static';
    overlay.on('pointerdown', () => this.hide());
    this.container.addChild(overlay);

    // Menu panel
    const panelWidth = 600;
    const panelHeight = 500;
    const panelX = (screenWidth - panelWidth) / 2;
    const panelY = (screenHeight - panelHeight) / 2;

    const panel = new PIXI.Graphics();
    panel.rect(panelX, panelY, panelWidth, panelHeight);
    panel.fill({ color: 0x1a1a2e });
    panel.stroke({ color: 0x00ff00, width: 4 });
    this.container.addChild(panel);

    // Title
    const title = new PIXI.Text({
      text: 'BONUS BUY',
      style: {
        fontFamily: 'Arial Black',
        fontSize: 48,
        fill: '#00ff00',
        stroke: { color: '#000000', width: 4 },
      },
    });
    title.anchor.set(0.5, 0);
    title.x = screenWidth / 2;
    title.y = panelY + 20;
    this.container.addChild(title);

    // Bonus options
    const options = [
      {
        type: BonusType.SHOOTER,
        name: 'CATCH \'EM',
        description: 'Throw bricks at hallucinations',
        cost: '100x Bet',
        costValue: 100,
        y: panelY + 100,
      },
      {
        type: BonusType.BOSS_BATTLE,
        name: 'ALLEYWAY BEATDOWN',
        description: 'Fight the boss in a cage',
        cost: '200x Bet',
        costValue: 200,
        y: panelY + 220,
      },
      {
        type: BonusType.FREE_SPINS,
        name: 'DETOX WARD',
        description: '10 Free Spins with sticky multipliers',
        cost: '500x Bet',
        costValue: 500,
        y: panelY + 340,
      },
    ];

    options.forEach(option => {
      this.createBonusButton(
        screenWidth / 2,
        option.y,
        option.name,
        option.description,
        option.cost,
        () => this.buyBonus(option.type, option.costValue)
      );
    });

    // Close button
    this.createCloseButton(screenWidth / 2, panelY + panelHeight - 40);
  }

  /**
   * Create a bonus button
   */
  private createBonusButton(
    x: number,
    y: number,
    name: string,
    description: string,
    cost: string,
    onClick: () => void
  ): void {
    const buttonWidth = 500;
    const buttonHeight = 100;

    const button = new PIXI.Graphics();
    button.rect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
    button.fill({ color: 0x2a2a3e });
    button.stroke({ color: 0xffff00, width: 3 });
    button.x = x;
    button.y = y;
    button.eventMode = 'static';
    button.cursor = 'pointer';

    // Hover effect
    button.on('pointerover', () => {
      button.clear();
      button.rect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
      button.fill({ color: 0x3a3a4e });
      button.stroke({ color: 0x00ff00, width: 3 });
    });

    button.on('pointerout', () => {
      button.clear();
      button.rect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
      button.fill({ color: 0x2a2a3e });
      button.stroke({ color: 0xffff00, width: 3 });
    });

    button.on('pointerdown', onClick);
    this.container.addChild(button);

    // Button text - name
    const nameText = new PIXI.Text({
      text: name,
      style: {
        fontFamily: 'Arial Black',
        fontSize: 28,
        fill: '#ffff00',
        fontWeight: 'bold',
      },
    });
    nameText.anchor.set(0.5, 0);
    nameText.x = x;
    nameText.y = y - 35;
    this.container.addChild(nameText);

    // Button text - description
    const descText = new PIXI.Text({
      text: description,
      style: {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: '#ffffff',
      },
    });
    descText.anchor.set(0.5, 0);
    descText.x = x;
    descText.y = y - 5;
    this.container.addChild(descText);

    // Button text - cost
    const costText = new PIXI.Text({
      text: cost,
      style: {
        fontFamily: 'Arial Black',
        fontSize: 20,
        fill: '#00ff00',
        fontWeight: 'bold',
      },
    });
    costText.anchor.set(0.5, 0);
    costText.x = x;
    costText.y = y + 20;
    this.container.addChild(costText);
  }

  /**
   * Create close button
   */
  private createCloseButton(x: number, y: number): void {
    const button = new PIXI.Graphics();
    button.rect(-80, -20, 160, 40);
    button.fill({ color: 0xff0000 });
    button.x = x;
    button.y = y;
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.on('pointerdown', () => this.hide());
    this.container.addChild(button);

    const text = new PIXI.Text({
      text: 'CLOSE',
      style: {
        fontFamily: 'Arial Black',
        fontSize: 20,
        fill: '#ffffff',
        fontWeight: 'bold',
      },
    });
    text.anchor.set(0.5);
    text.x = x;
    text.y = y;
    this.container.addChild(text);
  }

  /**
   * Buy a bonus
   */
  private buyBonus(bonusType: BonusType, _cost: number): void {
    if (this.onBuyCallback) {
      this.onBuyCallback(bonusType);
    }
    this.hide();
  }

  /**
   * Show the menu
   */
  show(): void {
    this.visible = true;
    this.container.visible = true;
  }

  /**
   * Hide the menu
   */
  hide(): void {
    this.visible = false;
    this.container.visible = false;
  }

  /**
   * Toggle visibility
   */
  toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Get the container
   */
  getContainer(): PIXI.Container {
    return this.container;
  }

  /**
   * Check if visible
   */
  isVisible(): boolean {
    return this.visible;
  }
}
