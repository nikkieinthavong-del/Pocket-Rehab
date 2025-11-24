// Game Configuration
const CONFIG = {
    GRID_COLS: 6,
    GRID_ROWS: 5,
    MIN_CLUSTER: 5,
    MAX_MULTIPLIER: 10,
    SPIN_DURATION: 1000,
    CASCADE_DELAY: 500,
    MIN_BET: 0.10,
    MAX_BET: 100.00,
    BET_INCREMENT: 0.10,
    INITIAL_BALANCE: 1000.00
};

// Symbol types - using emojis as placeholders for actual images
const SYMBOLS = {
    BRICK: { emoji: '🧱', value: 10, name: 'brick' },
    FIST: { emoji: '👊', value: 15, name: 'fist' },
    TOXIC: { emoji: '☢️', value: 20, name: 'toxic' },
    PILL: { emoji: '💊', value: 25, name: 'pill' },
    SYRINGE: { emoji: '💉', value: 30, name: 'syringe' },
    SKULL: { emoji: '💀', value: 50, name: 'skull' },
    SCATTER: { emoji: '⚡', value: 100, name: 'scatter' }
};

const SYMBOL_WEIGHTS = [
    { symbol: SYMBOLS.BRICK, weight: 30 },
    { symbol: SYMBOLS.FIST, weight: 25 },
    { symbol: SYMBOLS.TOXIC, weight: 20 },
    { symbol: SYMBOLS.PILL, weight: 15 },
    { symbol: SYMBOLS.SYRINGE, weight: 7 },
    { symbol: SYMBOLS.SKULL, weight: 2 },
    { symbol: SYMBOLS.SCATTER, weight: 1 }
];

// Game State
class GameState {
    constructor() {
        this.balance = CONFIG.INITIAL_BALANCE;
        this.bet = 1.00;
        this.currentWin = 0;
        this.multiplier = 1;
        this.isSpinning = false;
        this.soundEnabled = true;
        this.grid = [];
        this.scatterCount = 0;
    }

    canSpin() {
        return !this.isSpinning && this.balance >= this.bet;
    }

    deductBet() {
        this.balance -= this.bet;
        this.updateDisplay();
    }

    addWin(amount) {
        const winAmount = amount * this.bet * this.multiplier;
        this.currentWin += winAmount;
        this.balance += winAmount;
        this.updateDisplay();
        return winAmount;
    }

    resetWin() {
        this.currentWin = 0;
        this.multiplier = 1;
        this.scatterCount = 0;
        this.updateDisplay();
    }

    incrementMultiplier() {
        if (this.multiplier < CONFIG.MAX_MULTIPLIER) {
            this.multiplier++;
        }
    }

    updateDisplay() {
        document.getElementById('balance').textContent = `$${this.balance.toFixed(2)}`;
        document.getElementById('bet').textContent = `$${this.bet.toFixed(2)}`;
        document.getElementById('betDisplay').textContent = `$${this.bet.toFixed(2)}`;
        document.getElementById('win').textContent = `$${this.currentWin.toFixed(2)}`;
    }
}

// Initialize Game
const game = new GameState();

// Grid Management
class Grid {
    constructor() {
        this.cells = [];
        this.initializeGrid();
    }

    initializeGrid() {
        const gridElement = document.getElementById('slotGrid');
        gridElement.innerHTML = '';

        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            this.cells[row] = [];
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'slot-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                const symbol = document.createElement('div');
                symbol.className = 'symbol';
                cell.appendChild(symbol);

                gridElement.appendChild(cell);
                this.cells[row][col] = {
                    element: cell,
                    symbolElement: symbol,
                    symbol: null
                };
            }
        }

        this.fillGrid();
    }

    getRandomSymbol() {
        const totalWeight = SYMBOL_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (const item of SYMBOL_WEIGHTS) {
            random -= item.weight;
            if (random <= 0) {
                return item.symbol;
            }
        }

        return SYMBOLS.BRICK;
    }

    fillGrid() {
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                const symbol = this.getRandomSymbol();
                this.setSymbol(row, col, symbol);
            }
        }
    }

    setSymbol(row, col, symbol) {
        const cell = this.cells[row][col];
        cell.symbol = symbol;
        cell.symbolElement.textContent = symbol.emoji;
        cell.symbolElement.title = symbol.name;
    }

    async spin() {
        // Animate existing symbols
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                const cell = this.cells[row][col];
                cell.element.classList.add('spinning');
            }
        }

        // Wait for animation
        await this.delay(CONFIG.SPIN_DURATION);

        // Fill with new symbols
        this.fillGrid();

        // Remove spinning animation
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                this.cells[row][col].element.classList.remove('spinning');
            }
        }
    }

    async cascade() {
        // Remove winning symbols and cascade down
        for (let col = 0; col < CONFIG.GRID_COLS; col++) {
            let writeRow = CONFIG.GRID_ROWS - 1;

            // Move non-null symbols down
            for (let row = CONFIG.GRID_ROWS - 1; row >= 0; row--) {
                if (this.cells[row][col].symbol !== null) {
                    if (row !== writeRow) {
                        this.cells[writeRow][col].symbol = this.cells[row][col].symbol;
                        this.cells[writeRow][col].symbolElement.textContent = this.cells[row][col].symbol.emoji;
                        this.cells[row][col].symbol = null;
                    }
                    writeRow--;
                }
            }

            // Fill empty cells at top
            for (let row = writeRow; row >= 0; row--) {
                const symbol = this.getRandomSymbol();
                this.setSymbol(row, col, symbol);
            }
        }

        await this.delay(CONFIG.CASCADE_DELAY);
    }

    clearWinningCells(winningCells) {
        winningCells.forEach(([row, col]) => {
            this.cells[row][col].symbol = null;
            this.cells[row][col].element.classList.remove('winning');
        });
    }

    highlightWinningCells(winningCells) {
        winningCells.forEach(([row, col]) => {
            this.cells[row][col].element.classList.add('winning');
        });
    }

    clearHighlights() {
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                this.cells[row][col].element.classList.remove('winning');
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getSymbolAt(row, col) {
        if (row < 0 || row >= CONFIG.GRID_ROWS || col < 0 || col >= CONFIG.GRID_COLS) {
            return null;
        }
        return this.cells[row][col].symbol;
    }
}

// Cluster Detection
class ClusterDetector {
    constructor(grid) {
        this.grid = grid;
    }

    findClusters() {
        const visited = Array(CONFIG.GRID_ROWS).fill(null).map(() => Array(CONFIG.GRID_COLS).fill(false));
        const clusters = [];

        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                if (!visited[row][col]) {
                    const symbol = this.grid.getSymbolAt(row, col);
                    if (symbol && symbol !== SYMBOLS.SCATTER) {
                        const cluster = this.findCluster(row, col, symbol, visited);
                        if (cluster.length >= CONFIG.MIN_CLUSTER) {
                            clusters.push({
                                symbol: symbol,
                                cells: cluster,
                                size: cluster.length
                            });
                        }
                    }
                }
            }
        }

        return clusters;
    }

    findCluster(startRow, startCol, targetSymbol, visited) {
        const cluster = [];
        const queue = [[startRow, startCol]];
        visited[startRow][startCol] = true;

        while (queue.length > 0) {
            const [row, col] = queue.shift();
            cluster.push([row, col]);

            // Check adjacent cells (up, down, left, right)
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;

                if (newRow >= 0 && newRow < CONFIG.GRID_ROWS &&
                    newCol >= 0 && newCol < CONFIG.GRID_COLS &&
                    !visited[newRow][newCol]) {

                    const symbol = this.grid.getSymbolAt(newRow, newCol);
                    if (symbol === targetSymbol) {
                        visited[newRow][newCol] = true;
                        queue.push([newRow, newCol]);
                    }
                }
            }
        }

        return cluster;
    }

    countScatters() {
        let count = 0;
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                if (this.grid.getSymbolAt(row, col) === SYMBOLS.SCATTER) {
                    count++;
                }
            }
        }
        return count;
    }
}

// Win Calculator
class WinCalculator {
    calculateClusterWin(cluster) {
        const size = cluster.size;
        const baseValue = cluster.symbol.value;

        let multiplier = 1;
        if (size >= 5 && size <= 9) multiplier = size - 3; // 2x - 6x
        else if (size >= 10 && size <= 14) multiplier = size - 5; // 5x - 9x
        else if (size >= 15 && size <= 19) multiplier = (size - 10) * 2; // 10x - 18x
        else if (size >= 20) multiplier = size * 2; // 40x+

        return baseValue * multiplier;
    }

    calculateScatterWin(scatterCount) {
        if (scatterCount === 3) return 100;
        if (scatterCount === 4) return 200;
        if (scatterCount >= 5) return 500;
        return 0;
    }
}

// Main Game Controller
const grid = new Grid();
const clusterDetector = new ClusterDetector(grid);
const winCalculator = new WinCalculator();

async function spin() {
    if (!game.canSpin()) {
        alert('Insufficient balance!');
        return;
    }

    game.isSpinning = true;
    game.resetWin();
    grid.clearHighlights();
    updateSpinButton(true);

    // Deduct bet
    game.deductBet();

    // Spin the grid
    await grid.spin();

    // Process wins with cascades (Overdose Cycle)
    await processWins();

    game.isSpinning = false;
    updateSpinButton(false);
}

async function processWins() {
    let hasWins = true;

    while (hasWins) {
        // Check for clusters
        const clusters = clusterDetector.findClusters();

        // Check for scatters
        const scatterCount = clusterDetector.countScatters();
        game.scatterCount += scatterCount;

        if (clusters.length === 0 && scatterCount < 3) {
            hasWins = false;
            break;
        }

        // Calculate wins
        let totalWin = 0;
        const allWinningCells = [];

        // Cluster wins
        for (const cluster of clusters) {
            const win = winCalculator.calculateClusterWin(cluster);
            totalWin += win;
            allWinningCells.push(...cluster.cells);
        }

        // Scatter wins
        if (scatterCount >= 3) {
            const scatterWin = winCalculator.calculateScatterWin(scatterCount);
            totalWin += scatterWin;
            showBonusPanel(scatterCount, scatterWin);
        }

        if (totalWin > 0) {
            // Highlight winning cells
            grid.highlightWinningCells(allWinningCells);

            // Show win
            const actualWin = game.addWin(totalWin);
            showWin(actualWin);

            await grid.delay(1500);

            // Clear winning cells
            grid.clearWinningCells(allWinningCells);

            // Increment multiplier for cascade
            game.incrementMultiplier();

            // Cascade
            await grid.cascade();
        } else {
            hasWins = false;
        }
    }

    // Final win display
    if (game.currentWin > 0) {
        await grid.delay(1000);
        hideWin();
    }
}

function showWin(amount) {
    const winOverlay = document.getElementById('winOverlay');
    const winAmount = document.getElementById('winAmount');
    const multiplier = document.getElementById('multiplier');

    winAmount.textContent = `WIN: $${amount.toFixed(2)}`;
    multiplier.textContent = game.multiplier > 1 ? `${game.multiplier}x MULTIPLIER` : '';

    winOverlay.classList.add('show');
}

function hideWin() {
    const winOverlay = document.getElementById('winOverlay');
    winOverlay.classList.remove('show');
}

function showBonusPanel(scatterCount, win) {
    const bonusPanel = document.getElementById('bonusPanel');
    bonusPanel.classList.add('show');

    setTimeout(() => {
        bonusPanel.classList.remove('show');
    }, 3000);
}

function updateSpinButton(disabled) {
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = disabled;
    spinBtn.querySelector('.spin-text').textContent = disabled ? 'SPINNING...' : 'SPIN';
}

// Bet Controls
function increaseBet() {
    if (game.bet < CONFIG.MAX_BET) {
        game.bet = Math.min(game.bet + CONFIG.BET_INCREMENT, CONFIG.MAX_BET);
        game.updateDisplay();
    }
}

function decreaseBet() {
    if (game.bet > CONFIG.MIN_BET) {
        game.bet = Math.max(game.bet - CONFIG.BET_INCREMENT, CONFIG.MIN_BET);
        game.updateDisplay();
    }
}

function setMaxBet() {
    game.bet = CONFIG.MAX_BET;
    game.updateDisplay();
}

// Modal Controls
function showPaytable() {
    document.getElementById('paytableModal').classList.add('show');
}

function hidePaytable() {
    document.getElementById('paytableModal').classList.remove('show');
}

function toggleSound() {
    game.soundEnabled = !game.soundEnabled;
    const soundBtn = document.getElementById('soundBtn');
    soundBtn.textContent = game.soundEnabled ? '🔊' : '🔇';
}

// Event Listeners
document.getElementById('spinBtn').addEventListener('click', spin);
document.getElementById('betPlusBtn').addEventListener('click', increaseBet);
document.getElementById('betMinusBtn').addEventListener('click', decreaseBet);
document.getElementById('maxBetBtn').addEventListener('click', setMaxBet);
document.getElementById('infoBtn').addEventListener('click', showPaytable);
document.getElementById('closePaytable').addEventListener('click', hidePaytable);
document.getElementById('soundBtn').addEventListener('click', toggleSound);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !game.isSpinning) {
        e.preventDefault();
        spin();
    }
});

// Initialize display
game.updateDisplay();

console.log('🎰 Pocket Rehab: Toxic Shock - Game Loaded!');
console.log('Press SPACE or click SPIN to play');
console.log('Grid: 6x5 | Max Win: 50,000x | High Volatility');
