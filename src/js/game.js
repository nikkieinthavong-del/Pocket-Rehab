// Pocket Rehab: Toxic Shock - Game Logic

class SlotGame {
    constructor() {
        // Game configuration
        this.gridWidth = 6;
        this.gridHeight = 5;
        this.minClusterSize = 5; // Minimum symbols for a cluster win

        // Game state
        this.balance = 1000;
        this.bet = 1;
        this.betLevels = [0.10, 0.25, 0.50, 1, 2, 5, 10, 25, 50, 100];
        this.currentBetIndex = 3; // Start at 1.00
        this.isSpinning = false;
        this.grid = [];

        // Symbol definitions (using placeholder names until images are added)
        this.symbols = [
            { id: 'zombie_hand', name: 'Zombie Hand', value: 100, image: 'assets/images/zombie-hand.png' },
            { id: 'dead_fish', name: 'Dead Fish', value: 80, image: 'assets/images/dead-fish.png' },
            { id: 'cage', name: 'Cage', value: 60, image: 'assets/images/cage-container.png' },
            { id: 'rejected', name: 'Rejected', value: 40, image: 'assets/images/rejected.png' },
            { id: 'low1', name: 'Low 1', value: 20, color: '#ff0000' },
            { id: 'low2', name: 'Low 2', value: 15, color: '#00ff00' },
            { id: 'low3', name: 'Low 3', value: 10, color: '#0000ff' },
        ];

        // Initialize game
        this.init();
    }

    init() {
        this.createGrid();
        this.setupEventListeners();
        this.updateUI();
    }

    // Create the game grid
    createGrid() {
        const gridContainer = document.getElementById('gameGrid');
        gridContainer.innerHTML = '';

        this.grid = [];

        for (let row = 0; row < this.gridHeight; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridWidth; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                const symbol = this.getRandomSymbol();
                this.grid[row][col] = symbol;

                this.renderSymbol(cell, symbol);
                gridContainer.appendChild(cell);
            }
        }
    }

    // Get random symbol
    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    // Render symbol in cell
    renderSymbol(cell, symbol) {
        cell.innerHTML = '';

        if (symbol.image) {
            const img = document.createElement('img');
            img.src = symbol.image;
            img.alt = symbol.name;
            img.className = 'symbol';
            img.onerror = () => {
                // Fallback if image not found
                cell.style.background = symbol.color || '#333';
                cell.innerHTML = `<span style="color: #00ff00; font-size: 0.8rem;">${symbol.name}</span>`;
            };
            cell.appendChild(img);
        } else {
            cell.style.background = symbol.color || '#333';
            cell.innerHTML = `<span style="color: #00ff00; font-size: 0.8rem;">${symbol.name}</span>`;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Spin button
        document.getElementById('spinBtn').addEventListener('click', () => this.spin());

        // Bet controls
        document.getElementById('betMinus').addEventListener('click', () => this.adjustBet(-1));
        document.getElementById('betPlus').addEventListener('click', () => this.adjustBet(1));

        // Info panel
        document.getElementById('infoBtn').addEventListener('click', () => this.toggleInfo());
        document.getElementById('closeInfo').addEventListener('click', () => this.toggleInfo());

        // Auto play (placeholder)
        document.getElementById('autoBtn').addEventListener('click', () => {
            this.showFeature('AUTO PLAY\nCOMING SOON');
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });
    }

    // Adjust bet
    adjustBet(direction) {
        const newIndex = this.currentBetIndex + direction;
        if (newIndex >= 0 && newIndex < this.betLevels.length) {
            this.currentBetIndex = newIndex;
            this.bet = this.betLevels[this.currentBetIndex];
            this.updateUI();
        }
    }

    // Main spin function
    async spin() {
        if (this.isSpinning || this.balance < this.bet) {
            if (this.balance < this.bet) {
                this.showFeature('INSUFFICIENT\nBALANCE');
            }
            return;
        }

        this.isSpinning = true;
        this.balance -= this.bet;
        this.updateUI();

        const spinBtn = document.getElementById('spinBtn');
        spinBtn.disabled = true;

        // Simulate spin animation
        await this.animateSpin();

        // Generate new grid
        this.regenerateGrid();

        // Check for wins
        const totalWin = await this.checkWinsAndCascade();

        if (totalWin > 0) {
            this.balance += totalWin;
            this.showFeature(`WIN!\n${totalWin.toFixed(2)}`);
        }

        this.isSpinning = false;
        spinBtn.disabled = false;
        this.updateUI();
    }

    // Animate spin
    async animateSpin() {
        const cells = document.querySelectorAll('.grid-cell');
        const duration = 2000;
        const intervalTime = 100;
        const steps = duration / intervalTime;

        for (let i = 0; i < steps; i++) {
            cells.forEach(cell => {
                const symbol = this.getRandomSymbol();
                this.renderSymbol(cell, symbol);
            });
            await this.delay(intervalTime);
        }
    }

    // Regenerate grid with new symbols
    regenerateGrid() {
        const cells = document.querySelectorAll('.grid-cell');

        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const symbol = this.getRandomSymbol();
                this.grid[row][col] = symbol;

                const cell = cells[row * this.gridWidth + col];
                this.renderSymbol(cell, symbol);
            }
        }
    }

    // Check for wins and handle cascades
    async checkWinsAndCascade() {
        let totalWin = 0;
        let hasWins = true;

        while (hasWins) {
            const clusters = this.findClusters();

            if (clusters.length === 0) {
                hasWins = false;
            } else {
                // Calculate win for this cascade
                const cascadeWin = this.calculateWin(clusters);
                totalWin += cascadeWin;

                // Highlight winning symbols
                this.highlightWinningCells(clusters);
                await this.delay(1000);

                // Remove winning symbols
                this.removeWinningSymbols(clusters);
                await this.delay(500);

                // Drop symbols and fill empty spaces
                await this.dropAndFillSymbols();
                await this.delay(500);
            }
        }

        return totalWin;
    }

    // Find all clusters in the grid
    findClusters() {
        const visited = Array(this.gridHeight).fill(null).map(() => Array(this.gridWidth).fill(false));
        const clusters = [];

        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                if (!visited[row][col] && this.grid[row][col]) {
                    const cluster = this.findClusterFromCell(row, col, visited);
                    if (cluster.length >= this.minClusterSize) {
                        clusters.push(cluster);
                    }
                }
            }
        }

        return clusters;
    }

    // Find cluster starting from a specific cell (flood fill)
    findClusterFromCell(startRow, startCol, visited) {
        const symbol = this.grid[startRow][startCol];
        const cluster = [];
        const queue = [[startRow, startCol]];

        while (queue.length > 0) {
            const [row, col] = queue.shift();

            if (row < 0 || row >= this.gridHeight || col < 0 || col >= this.gridWidth) continue;
            if (visited[row][col]) continue;
            if (!this.grid[row][col] || this.grid[row][col].id !== symbol.id) continue;

            visited[row][col] = true;
            cluster.push({ row, col, symbol });

            // Check adjacent cells (up, down, left, right)
            queue.push([row - 1, col]);
            queue.push([row + 1, col]);
            queue.push([row, col - 1]);
            queue.push([row, col + 1]);
        }

        return cluster;
    }

    // Calculate win amount from clusters
    calculateWin(clusters) {
        let win = 0;

        clusters.forEach(cluster => {
            const symbolValue = cluster[0].symbol.value;
            const clusterSize = cluster.length;

            // Win calculation: base value * cluster size * bet multiplier
            const clusterWin = symbolValue * (clusterSize / this.minClusterSize) * this.bet;
            win += clusterWin;
        });

        return win;
    }

    // Highlight winning cells
    highlightWinningCells(clusters) {
        const cells = document.querySelectorAll('.grid-cell');

        // Remove previous highlights
        cells.forEach(cell => cell.classList.remove('winning'));

        // Add highlights to winning cells
        clusters.forEach(cluster => {
            cluster.forEach(({ row, col }) => {
                const index = row * this.gridWidth + col;
                cells[index].classList.add('winning');
            });
        });
    }

    // Remove winning symbols
    removeWinningSymbols(clusters) {
        clusters.forEach(cluster => {
            cluster.forEach(({ row, col }) => {
                this.grid[row][col] = null;
            });
        });

        this.renderGrid();
    }

    // Drop symbols and fill empty spaces
    async dropAndFillSymbols() {
        // Drop existing symbols
        for (let col = 0; col < this.gridWidth; col++) {
            let emptyRow = this.gridHeight - 1;

            for (let row = this.gridHeight - 1; row >= 0; row--) {
                if (this.grid[row][col] !== null) {
                    if (row !== emptyRow) {
                        this.grid[emptyRow][col] = this.grid[row][col];
                        this.grid[row][col] = null;
                    }
                    emptyRow--;
                }
            }
        }

        // Fill empty spaces with new symbols
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                if (this.grid[row][col] === null) {
                    this.grid[row][col] = this.getRandomSymbol();
                }
            }
        }

        this.renderGrid();
    }

    // Render the entire grid
    renderGrid() {
        const cells = document.querySelectorAll('.grid-cell');

        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const index = row * this.gridWidth + col;
                const cell = cells[index];
                const symbol = this.grid[row][col];

                if (symbol) {
                    this.renderSymbol(cell, symbol);
                    cell.style.opacity = '1';
                } else {
                    cell.style.opacity = '0.3';
                    cell.innerHTML = '';
                }
            }
        }
    }

    // Show feature overlay
    showFeature(text) {
        const overlay = document.getElementById('featureOverlay');
        const content = overlay.querySelector('.feature-content');

        content.innerHTML = text.replace(/\n/g, '<br>');
        overlay.classList.add('active');

        setTimeout(() => {
            overlay.classList.remove('active');
        }, 2000);
    }

    // Toggle info panel
    toggleInfo() {
        const panel = document.getElementById('infoPanel');
        panel.classList.toggle('active');
    }

    // Update UI elements
    updateUI() {
        document.getElementById('balance').textContent = this.balance.toFixed(2);
        document.getElementById('bet').textContent = this.bet.toFixed(2);
        document.getElementById('betDisplay').textContent = this.bet.toFixed(2);
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SlotGame();

    // Make game accessible in console for debugging
    window.game = game;

    console.log('%c🎰 POCKET REHAB: TOXIC SHOCK 🎰', 'color: #00ff00; font-size: 20px; font-weight: bold;');
    console.log('%cGame loaded successfully!', 'color: #00ff00;');
    console.log('%cPress SPACE to spin', 'color: #ff0000;');
});
