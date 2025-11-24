// Pocket Rehab: Toxic Shock - Game Logic

class SlotGame {
    constructor() {
        // Game State
        this.balance = 10000;
        this.bet = 100;
        this.minBet = 10;
        this.maxBet = 1000;
        this.betStep = 10;
        this.isSpinning = false;
        this.overdoseLevel = 0;
        this.maxOverdose = 100;

        // Grid Configuration
        this.rows = 5;
        this.cols = 6;
        this.grid = [];

        // Symbols (using emojis as placeholders until images are loaded)
        this.symbols = [
            { id: 'brick', emoji: '🧱', value: 1 },
            { id: 'taser', emoji: '⚡', value: 2 },
            { id: 'skull', emoji: '💀', value: 3 },
            { id: 'syringe', emoji: '💉', value: 4 },
            { id: 'pills', emoji: '💊', value: 5 },
            { id: 'toxic', emoji: '☢️', value: 8 },
            { id: 'wild', emoji: '🎰', value: 10 }
        ];

        // Paytable (cluster size : multiplier)
        this.paytable = {
            5: 1,
            6: 1.5,
            7: 2,
            8: 3,
            9: 4,
            10: 5,
            11: 7,
            12: 10,
            13: 15,
            14: 20,
            15: 30,
            20: 50,
            25: 100,
            30: 500
        };

        this.init();
    }

    init() {
        this.createGrid();
        this.attachEventListeners();
        this.updateUI();
        this.fillGrid();
    }

    createGrid() {
        const gridElement = document.getElementById('slotGrid');
        gridElement.innerHTML = '';

        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'slot-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gridElement.appendChild(cell);
                this.grid[row][col] = { cell, symbol: null };
            }
        }
    }

    fillGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const symbol = this.getRandomSymbol();
                this.grid[row][col].symbol = symbol;
                this.grid[row][col].cell.textContent = symbol.emoji;
            }
        }
    }

    getRandomSymbol() {
        // Weighted random selection
        const totalWeight = this.symbols.reduce((sum, s) => sum + (10 - s.value), 0);
        let random = Math.random() * totalWeight;

        for (const symbol of this.symbols) {
            random -= (10 - symbol.value);
            if (random <= 0) return { ...symbol };
        }

        return { ...this.symbols[0] };
    }

    attachEventListeners() {
        // Spin Button
        document.getElementById('spinButton').addEventListener('click', () => this.spin());

        // Bet Controls
        document.getElementById('increaseBet').addEventListener('click', () => this.changeBet(this.betStep));
        document.getElementById('decreaseBet').addEventListener('click', () => this.changeBet(-this.betStep));

        // Info Panel
        document.getElementById('infoButton').addEventListener('click', () => this.toggleInfo(true));
        document.getElementById('closeInfo').addEventListener('click', () => this.toggleInfo(false));

        // Keyboard Controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });
    }

    changeBet(amount) {
        this.bet = Math.max(this.minBet, Math.min(this.maxBet, this.bet + amount));
        this.updateUI();
    }

    toggleInfo(show) {
        const panel = document.getElementById('infoPanel');
        if (show) {
            panel.classList.add('show');
        } else {
            panel.classList.remove('show');
        }
    }

    async spin() {
        if (this.isSpinning) return;

        if (this.balance < this.bet) {
            alert('Insufficient balance!');
            return;
        }

        this.isSpinning = true;
        this.balance -= this.bet;
        this.updateUI();

        // Disable spin button
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = true;

        // Spin animation
        await this.animateSpin();

        // Check for wins
        const totalWin = await this.checkWins();

        // Update balance with win
        if (totalWin > 0) {
            this.balance += totalWin;
            this.showWin(totalWin);
            this.updateOverdose(10);
        }

        this.updateUI();
        this.isSpinning = false;
        spinButton.disabled = false;
    }

    async animateSpin() {
        const duration = 2000;
        const startTime = Date.now();

        // Add spinning class
        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.cell.classList.add('spinning');
            });
        });

        // Animate symbols changing
        const interval = setInterval(() => {
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const symbol = this.getRandomSymbol();
                    this.grid[row][col].cell.textContent = symbol.emoji;
                }
            }
        }, 100);

        // Wait for spin duration
        await new Promise(resolve => setTimeout(resolve, duration));

        clearInterval(interval);

        // Remove spinning class and set final symbols
        this.fillGrid();
        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.cell.classList.remove('spinning');
            });
        });
    }

    async checkWins() {
        let totalWin = 0;
        let cascadeCount = 0;
        let hasWins = true;

        while (hasWins) {
            hasWins = false;
            const visited = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
            const clusters = [];

            // Find all clusters
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    if (!visited[row][col]) {
                        const cluster = this.findCluster(row, col, visited);
                        if (cluster.length >= 5) {
                            clusters.push(cluster);
                            hasWins = true;
                        }
                    }
                }
            }

            // Calculate wins
            if (clusters.length > 0) {
                cascadeCount++;

                for (const cluster of clusters) {
                    // Highlight winning cells
                    cluster.forEach(({ row, col }) => {
                        this.grid[row][col].cell.classList.add('winning');
                    });

                    // Calculate win for this cluster
                    const clusterSize = cluster.length;
                    const symbol = this.grid[cluster[0].row][cluster[0].col].symbol;
                    const multiplier = this.getClusterMultiplier(clusterSize);
                    const win = this.bet * multiplier * symbol.value * cascadeCount;
                    totalWin += win;
                }

                // Wait for win animation
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Remove winning symbols
                for (const cluster of clusters) {
                    cluster.forEach(({ row, col }) => {
                        this.grid[row][col].cell.classList.remove('winning');
                        this.grid[row][col].cell.textContent = '';
                        this.grid[row][col].symbol = null;
                    });
                }

                // Cascade down
                await this.cascade();
            }
        }

        return totalWin;
    }

    findCluster(startRow, startCol, visited) {
        const symbol = this.grid[startRow][startCol].symbol;
        const cluster = [];
        const queue = [{ row: startRow, col: startCol }];

        while (queue.length > 0) {
            const { row, col } = queue.shift();

            if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) continue;
            if (visited[row][col]) continue;
            if (!this.grid[row][col].symbol) continue;
            if (this.grid[row][col].symbol.id !== symbol.id &&
                this.grid[row][col].symbol.id !== 'wild' &&
                symbol.id !== 'wild') continue;

            visited[row][col] = true;
            cluster.push({ row, col });

            // Check adjacent cells (horizontal and vertical only)
            queue.push({ row: row - 1, col });
            queue.push({ row: row + 1, col });
            queue.push({ row, col: col - 1 });
            queue.push({ row, col: col + 1 });
        }

        return cluster;
    }

    getClusterMultiplier(size) {
        // Find the highest multiplier for clusters of this size or smaller
        const sizes = Object.keys(this.paytable).map(Number).sort((a, b) => b - a);
        for (const threshold of sizes) {
            if (size >= threshold) {
                return this.paytable[threshold];
            }
        }
        return 0;
    }

    async cascade() {
        // Drop symbols down
        for (let col = 0; col < this.cols; col++) {
            let emptyRow = this.rows - 1;

            // Move existing symbols down
            for (let row = this.rows - 1; row >= 0; row--) {
                if (this.grid[row][col].symbol) {
                    if (row !== emptyRow) {
                        this.grid[emptyRow][col].symbol = this.grid[row][col].symbol;
                        this.grid[emptyRow][col].cell.textContent = this.grid[row][col].symbol.emoji;
                        this.grid[row][col].symbol = null;
                        this.grid[row][col].cell.textContent = '';
                    }
                    emptyRow--;
                }
            }

            // Fill empty spaces with new symbols
            for (let row = emptyRow; row >= 0; row--) {
                const symbol = this.getRandomSymbol();
                this.grid[row][col].symbol = symbol;
                this.grid[row][col].cell.textContent = symbol.emoji;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    showWin(amount) {
        const winDisplay = document.getElementById('winDisplay');
        const winText = winDisplay.querySelector('.win-text');

        winText.textContent = `WIN: ${amount}`;
        winDisplay.classList.add('show');

        setTimeout(() => {
            winDisplay.classList.remove('show');
        }, 2000);
    }

    updateOverdose(amount) {
        this.overdoseLevel = Math.min(this.maxOverdose, this.overdoseLevel + amount);

        const fill = document.getElementById('overdoseFill');
        const value = document.getElementById('overdoseValue');

        fill.style.height = `${(this.overdoseLevel / this.maxOverdose) * 100}%`;
        value.textContent = `${this.overdoseLevel}/${this.maxOverdose}`;

        if (this.overdoseLevel >= this.maxOverdose) {
            this.triggerOverdoseBonus();
        }
    }

    triggerOverdoseBonus() {
        alert('OVERDOSE CYCLE ACTIVATED! 🔥\n\nBonus round triggered!');
        this.overdoseLevel = 0;
        this.updateOverdose(0);
        // TODO: Implement bonus round
    }

    updateUI() {
        document.getElementById('balance').textContent = this.balance;
        document.getElementById('betAmount').textContent = this.bet;
        document.getElementById('betDisplay').textContent = this.bet;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SlotGame();

    // Make game accessible globally for debugging
    window.game = game;

    console.log('🎰 Pocket Rehab: Toxic Shock - Game Loaded');
    console.log('Press SPACE to spin or use the SPIN button');
});
