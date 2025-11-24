import { GameEngine } from './core/GameEngine';
import { GameRenderer } from './core/GameRenderer';

/**
 * Pocket Rehab: Toxic Shock
 * Main entry point
 */
async function main() {
  console.log('Initializing Pocket Rehab: Toxic Shock...');

  // Create game engine
  const engine = new GameEngine(10000, 10);

  // Create renderer
  const renderer = new GameRenderer(engine);

  // Get container
  const container = document.getElementById('game-container');
  if (!container) {
    throw new Error('Game container not found');
  }

  // Initialize renderer
  await renderer.initialize(container);

  console.log('Game initialized successfully!');
  console.log('Game Features:');
  console.log('- 6x5 Grid with Cluster-Pays (8+ match)');
  console.log('- Overdose Cycle: Infection → Mutation → Explosion');
  console.log('- 3 Bonus Games:');
  console.log('  * 3 Scatters: Shooter Bonus');
  console.log('  * 4 Scatters: Boss Battle');
  console.log('  * 5 Scatters: Free Spins');
  console.log('- Max Win: 50,000x');
}

// Start the game
main().catch(console.error);
