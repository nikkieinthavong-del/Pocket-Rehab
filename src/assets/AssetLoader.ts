import * as PIXI from 'pixi.js';
import { ASSET_MANIFEST, type AssetDefinition } from './AssetManifest';

/**
 * Asset Loader
 * Handles loading and caching of all game assets
 */
export class AssetLoader {
  private assets: Map<string, PIXI.Texture> = new Map();
  private loadedCount: number = 0;
  private totalCount: number = 0;
  private onProgressCallback?: (progress: number) => void;

  /**
   * Load all assets
   */
  async loadAll(onProgress?: (progress: number) => void): Promise<void> {
    this.onProgressCallback = onProgress;
    this.totalCount = ASSET_MANIFEST.length;
    this.loadedCount = 0;

    console.log(`Loading ${this.totalCount} assets...`);

    // Load assets in parallel
    const loadPromises = ASSET_MANIFEST.map(asset => this.loadAsset(asset));

    try {
      await Promise.all(loadPromises);
      console.log('All assets loaded successfully!');
    } catch (error) {
      console.warn('Some assets failed to load:', error);
      // Continue anyway - we'll use fallbacks for missing assets
    }
  }

  /**
   * Load a single asset
   */
  private async loadAsset(asset: AssetDefinition): Promise<void> {
    try {
      const texture = await PIXI.Assets.load(asset.path);
      this.assets.set(asset.key, texture);
      this.loadedCount++;

      if (this.onProgressCallback) {
        this.onProgressCallback(this.loadedCount / this.totalCount);
      }

      console.log(`Loaded: ${asset.key}`);
    } catch (error) {
      console.warn(`Failed to load asset: ${asset.key} at ${asset.path}`, error);
      // Create a fallback colored texture
      this.assets.set(asset.key, this.createFallbackTexture(asset));
      this.loadedCount++;

      if (this.onProgressCallback) {
        this.onProgressCallback(this.loadedCount / this.totalCount);
      }
    }
  }

  /**
   * Create a fallback texture when asset is missing
   */
  private createFallbackTexture(asset: AssetDefinition): PIXI.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Different colors based on category
    const colors: Record<AssetDefinition['category'], string> = {
      background: '#1a1a2e',
      ui: '#16213e',
      character: '#e94560',
      symbol: '#0f3460',
      special: '#ffd700',
      fx: '#00ff00',
      bonus: '#ff6b35',
    };

    ctx.fillStyle = colors[asset.category];
    ctx.fillRect(0, 0, 128, 128);

    // Add border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 128, 128);

    // Add text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(asset.key, 64, 64);

    return PIXI.Texture.from(canvas);
  }

  /**
   * Get a loaded asset texture
   */
  getTexture(key: string): PIXI.Texture | undefined {
    return this.assets.get(key);
  }

  /**
   * Check if all assets are loaded
   */
  isLoaded(): boolean {
    return this.loadedCount === this.totalCount;
  }

  /**
   * Get loading progress (0-1)
   */
  getProgress(): number {
    return this.totalCount > 0 ? this.loadedCount / this.totalCount : 0;
  }

  /**
   * Preload specific assets
   */
  async preload(keys: string[]): Promise<void> {
    const assetsToLoad = ASSET_MANIFEST.filter(a => keys.includes(a.key));
    const loadPromises = assetsToLoad.map(asset => this.loadAsset(asset));

    try {
      await Promise.all(loadPromises);
    } catch (error) {
      console.warn('Some preloaded assets failed:', error);
    }
  }

  /**
   * Get all loaded texture keys
   */
  getLoadedKeys(): string[] {
    return Array.from(this.assets.keys());
  }

  /**
   * Clear all loaded assets
   */
  clear(): void {
    this.assets.clear();
    this.loadedCount = 0;
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();
