import { GameEngine } from './core/GameEngine';
import { VisualRenderer } from './core/VisualRenderer';

/**
 * Pocket Rehab: Toxic Shock
 * Main entry point
 */
async function main() {
  console.log('🎰 Initializing Pocket Rehab: Toxic Shock...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Show loading message
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ff00;
    font-family: Arial, sans-serif;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    z-index: 1000;
  `;
  loadingDiv.innerHTML = '🎮 LOADING TOXIC SHOCK...<br><span style="font-size: 18px;">Loading assets...</span>';
  document.body.appendChild(loadingDiv);

  try {
    // Create game engine
    const engine = new GameEngine(10000, 10);

    // Create visual renderer
    const renderer = new VisualRenderer(engine);

    // Get container
    const container = document.getElementById('game-container');
    if (!container) {
      throw new Error('Game container not found');
    }

    // Initialize renderer (this loads all assets)
    await renderer.initialize(container);

    // Remove loading screen
    loadingDiv.remove();

    console.log('✅ Game initialized successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 GAME FEATURES:');
    console.log('  📐 6x5 Grid with Cluster-Pays (8+ match)');
    console.log('  💉 Overdose Cycle: Infection → Mutation → Explosion');
    console.log('  🎁 3 Bonus Games:');
    console.log('     • 3 Scatters: "Catch \'Em" Shooter Bonus');
    console.log('     • 4 Scatters: "Alleyway Beatdown" Boss Battle');
    console.log('     • 5 Scatters: "Detox Ward" Free Spins');
    console.log('  💰 Max Win: 50,000x');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Display asset info
    console.log('📁 Asset Instructions:');
    console.log('   Place your PNG images in: /public/assets/');
    console.log('   See: /public/assets/PLACE_IMAGES_HERE.md');
  } catch (error) {
    loadingDiv.innerHTML = '❌ ERROR: ' + (error as Error).message;
    loadingDiv.style.color = '#ff0000';
    throw error;
  }
}

// Start the game
main().catch(console.error);
