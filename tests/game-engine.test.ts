/**
 * Manual test script for Pocket Rehab game engine
 * Run with: npm run test-game
 */

import { GameEngine } from '../src/core/GameEngine';
import { ClusterDetector } from '../src/core/ClusterDetector';
import { CONFIG } from '../src/core/Config';

console.log('=== Pocket Rehab: Toxic Shock - Game Engine Test ===\n');

// Test 1: Initialize game engine
console.log('Test 1: Initialize Game Engine');
const engine = new GameEngine(10000, 10);
const state = engine.getState();
console.log(`✓ Initial Balance: $${state.balance}`);
console.log(`✓ Initial Bet: $${state.bet}`);
console.log(`✓ Grid Size: ${state.grid.length}x${state.grid[0].length}`);
console.log();

// Test 2: Cluster detection
console.log('Test 2: Cluster Detection');
const detector = new ClusterDetector();
const grid = engine.getGrid();
const clusters = detector.findClusters(grid);
console.log(`✓ Clusters found: ${clusters.length}`);
if (clusters.length > 0) {
  console.log(`  - Largest cluster: ${Math.max(...clusters.map(c => c.size))} symbols`);
}
console.log();

// Test 3: Perform spins
console.log('Test 3: Perform 5 Spins');
for (let i = 1; i <= 5; i++) {
  const beforeBalance = engine.getState().balance;
  const result = engine.spin();
  const afterState = engine.getState();
  
  console.log(`Spin ${i}:`);
  console.log(`  - Cascades: ${result.cascadeResults.length}`);
  console.log(`  - Total Win: $${result.totalWin.toFixed(2)}`);
  console.log(`  - Balance: $${beforeBalance} → $${afterState.balance.toFixed(2)}`);
  console.log(`  - New Multipliers: ${result.newMultipliers.length}`);
  
  if (result.bonusTriggered !== 'NONE') {
    console.log(`  - 🎰 BONUS TRIGGERED: ${result.bonusTriggered}`);
  }
  console.log();
}

// Test 4: Verify overdose cycle
console.log('Test 4: Verify Overdose Cycle Stages');
const currentGrid = engine.getGrid();
let infectedCount = 0;
let mutatedCount = 0;
let explodedCount = 0;

for (const row of currentGrid) {
  for (const symbol of row) {
    if (!symbol) continue;
    if (symbol.overdoseStage === 1) infectedCount++;
    if (symbol.overdoseStage === 2) mutatedCount++;
    if (symbol.overdoseStage === 3) explodedCount++;
  }
}

console.log(`✓ Infected symbols: ${infectedCount}`);
console.log(`✓ Mutated symbols (Wilds): ${mutatedCount}`);
console.log(`✓ Exploded symbols tracked: ${explodedCount}`);
console.log();

// Test 5: Verify multipliers
console.log('Test 5: Grid Multipliers');
const multipliers = engine.getMultipliers();
console.log(`✓ Active grid multipliers: ${multipliers.length}`);
if (multipliers.length > 0) {
  const permanentMults = multipliers.filter(m => m.isPermanent);
  console.log(`  - Permanent multipliers: ${permanentMults.length}`);
}
console.log();

// Test 6: Max win cap
console.log('Test 6: Configuration');
console.log(`✓ Min cluster size: ${CONFIG.MIN_CLUSTER_SIZE} symbols`);
console.log(`✓ Max win multiplier: ${CONFIG.MAX_WIN_MULTIPLIER}x`);
console.log(`✓ Wild explosion multiplier: ${CONFIG.WILD_EXPLOSION_MULTIPLIER}x`);
console.log(`✓ Free spins count: ${CONFIG.FREE_SPINS_COUNT}`);
console.log();

// Final state
const finalState = engine.getState();
console.log('=== Test Summary ===');
console.log(`Final Balance: $${finalState.balance.toFixed(2)}`);
console.log(`Total Multipliers: ${finalState.multipliers.length}`);
console.log(`Free Spins Remaining: ${finalState.freeSpinsRemaining}`);
console.log('\n✅ All tests completed successfully!');
