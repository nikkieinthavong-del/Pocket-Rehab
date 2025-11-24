// Main Game Logic
class SlotGame {
    constructor() {
        this.grid = [];
        this.balance = CONFIG.DEFAULT_BALANCE;
        this.currentBet = CONFIG.BETS[CONFIG.DEFAULT_BET_INDEX];
        this.currentWin = 0;
        this.isSpinning = false;
        this.scatterCount = 0;
        this.cellMultipliers = {}; // Track multipliers per cell
        this.infectedCells = new Set(); // Track infected cells
        this.isFreeSpin = false;

        this.init();
    }

    init() {
        this.createGrid();
        this.attachEventListeners();
        this.updateUI();
    }

    createGrid() {
        const gridElement = document.getElementById('game-grid');
        gridElement.innerHTML = '';

        for (let i = 0; i < CONFIG.GRID.TOTAL_CELLS; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;
            gridElement.appendChild(cell);

            this.grid.push({
                element: cell,
                symbol: null,
                infected: false,
                mutated: false
            });
        }

        // Fill initial grid
        this.fillGrid();
    }

    fillGrid() {
        this.grid.forEach((cell, index) => {
            if (!cell.symbol) {
                const symbol = getRandomSymbol();
                this.setSymbol(index, symbol);
            }
        });
    }

    setSymbol(index, symbolKey, animated = false) {
        const cell = this.grid[index];
        cell.symbol = symbolKey;

        const img = document.createElement('img');
        img.src = CONFIG.SYMBOLS[symbolKey].image;
        img.alt = CONFIG.SYMBOLS[symbolKey].name;

        cell.element.innerHTML = '';
        cell.element.appendChild(img);

        // Add multiplier display if exists
        if (this.cellMultipliers[index] && this.cellMultipliers[index] > 1) {
            const multDiv = document.createElement('div');
            multDiv.className = 'multiplier';
            multDiv.textContent = `x${this.cellMultipliers[index]}`;
            cell.element.appendChild(multDiv);
        }

        if (animated) {
            cell.element.classList.add('spinning');
            setTimeout(() => {
                cell.element.classList.remove('spinning');
            }, CONFIG.ANIMATION.SPIN_DURATION);
        }
    }

    attachEventListeners() {
        // Spin button
        document.getElementById('spin-btn').addEventListener('click', () => {
            this.spin();
        });

        // Bet button
        document.getElementById('bet-btn').addEventListener('click', () => {
            this.changeBet();
        });

        // Info button
        document.getElementById('info-btn').addEventListener('click', () => {
            this.showInfo();
        });

        // Vomit button (bonus buy)
        document.getElementById('vomit-button').addEventListener('click', () => {
            this.showBonusBuyMenu();
        });

        // Bonus buy menu
        document.getElementById('close-bonus-menu').addEventListener('click', () => {
            this.hideBonusBuyMenu();
        });

        document.querySelectorAll('.bonus-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cost = parseInt(e.currentTarget.dataset.cost);
                const type = e.currentTarget.dataset.type;
                this.buyBonus(type, cost);
            });
        });
    }

    async spin() {
        if (this.isSpinning) return;
        if (this.balance < this.currentBet) {
            alert('Insufficient balance!');
            return;
        }

        this.isSpinning = true;
        this.disableButtons();
        this.balance -= this.currentBet;
        this.currentWin = 0;
        this.scatterCount = 0;
        this.updateUI();

        // Spin animation
        this.grid.forEach((cell, index) => {
            cell.element.classList.add('spinning');
        });

        await this.delay(CONFIG.ANIMATION.SPIN_DURATION);

        // Generate new symbols
        this.grid.forEach((cell, index) => {
            cell.element.classList.remove('spinning');
            const symbol = getRandomSymbol();
            this.setSymbol(index, symbol);
        });

        // Check for wins
        await this.checkWins();

        this.isSpinning = false;
        this.enableButtons();
    }

    disableButtons() {
        document.getElementById('spin-btn').disabled = true;
        document.getElementById('bet-btn').disabled = true;
        document.getElementById('vomit-button').style.pointerEvents = 'none';
        document.getElementById('vomit-button').style.opacity = '0.5';
    }

    enableButtons() {
        document.getElementById('spin-btn').disabled = false;
        document.getElementById('bet-btn').disabled = false;
        document.getElementById('vomit-button').style.pointerEvents = 'auto';
        document.getElementById('vomit-button').style.opacity = '1';
    }

    async checkWins() {
        let hasWins = true;
        let cascadeCount = 0;

        while (hasWins) {
            hasWins = false;
            const clusters = this.findClusters();

            if (clusters.length > 0) {
                hasWins = true;
                cascadeCount++;

                // Calculate wins
                let totalWin = 0;
                const winningCells = new Set();

                clusters.forEach(cluster => {
                    const baseWin = getSymbolPays(cluster.symbol, cluster.cells.length);
                    let clusterWin = baseWin * this.currentBet;

                    // Apply cell multipliers
                    cluster.cells.forEach(cellIndex => {
                        winningCells.add(cellIndex);
                        if (this.cellMultipliers[cellIndex]) {
                            clusterWin *= this.cellMultipliers[cellIndex];
                        }
                    });

                    totalWin += clusterWin;
                });

                this.currentWin += totalWin;
                this.updateWin();

                // Animate winning cells
                const winningElements = Array.from(winningCells).map(idx => this.grid[idx].element);
                const isHugeWin = totalWin >= this.currentBet * 20;

                if (typeof animationController !== 'undefined') {
                    animationController.animateWin(winningElements, isHugeWin);
                } else {
                    // Fallback if animation system not loaded
                    winningElements.forEach(el => el.classList.add('winning'));
                }

                await this.delay(CONFIG.ANIMATION.WIN_FLASH_DURATION);

                // Apply Overdose Cycle
                await this.applyOverdoseCycle(winningCells);

                // Remove winning symbols and cascade
                await this.cascade(winningCells);
            }
        }

        // Check for scatter triggers
        this.checkScatters();

        // Pay out winnings
        if (this.currentWin > 0) {
            this.balance += this.currentWin;
            this.updateUI();

            if (this.currentWin >= this.currentBet * 10) {
                this.showWinPopup();
            }
        }
    }

    findClusters() {
        const clusters = [];
        const visited = new Set();

        // Helper function to get adjacent cells
        const getAdjacent = (index) => {
            const row = Math.floor(index / CONFIG.GRID.COLS);
            const col = index % CONFIG.GRID.COLS;
            const adjacent = [];

            // Up
            if (row > 0) adjacent.push(index - CONFIG.GRID.COLS);
            // Down
            if (row < CONFIG.GRID.ROWS - 1) adjacent.push(index + CONFIG.GRID.COLS);
            // Left
            if (col > 0) adjacent.push(index - 1);
            // Right
            if (col < CONFIG.GRID.COLS - 1) adjacent.push(index + 1);

            return adjacent;
        };

        // Flood fill to find connected clusters
        const floodFill = (startIndex, targetSymbol) => {
            const cluster = [];
            const queue = [startIndex];
            const localVisited = new Set();

            while (queue.length > 0) {
                const current = queue.shift();

                if (localVisited.has(current)) continue;
                localVisited.add(current);

                const cell = this.grid[current];

                // Check if cell matches target symbol or is wild
                if (cell.symbol === targetSymbol || cell.symbol === 'WILD') {
                    cluster.push(current);
                    visited.add(current);

                    // Add adjacent cells to queue
                    getAdjacent(current).forEach(adjIndex => {
                        if (!localVisited.has(adjIndex)) {
                            queue.push(adjIndex);
                        }
                    });
                }
            }

            return cluster;
        };

        // Check each cell for clusters
        this.grid.forEach((cell, index) => {
            if (visited.has(index)) return;
            if (!cell.symbol || cell.symbol === 'SCATTER') return;

            // Start flood fill from this cell
            const cluster = floodFill(index, cell.symbol);

            // Only add if cluster meets minimum size
            if (cluster.length >= CONFIG.MECHANICS.MIN_CLUSTER) {
                // Determine the actual paying symbol (not WILD)
                let payingSymbol = cell.symbol;
                if (payingSymbol === 'WILD') {
                    // Find a non-wild symbol in the cluster
                    for (let cellIndex of cluster) {
                        if (this.grid[cellIndex].symbol !== 'WILD') {
                            payingSymbol = this.grid[cellIndex].symbol;
                            break;
                        }
                    }
                }

                clusters.push({
                    symbol: payingSymbol,
                    cells: cluster
                });
            }
        });

        return clusters;
    }

    async applyOverdoseCycle(winningCells) {
        const newInfected = new Set();
        const newMutated = new Set();
        const crashed = new Set();

        winningCells.forEach(index => {
            const cell = this.grid[index];

            if (cell.mutated) {
                // Stage 3: Crash - create multiplier
                crashed.add(index);
                const currentMult = this.cellMultipliers[index] || 1;
                this.cellMultipliers[index] = currentMult * 2;
                cell.mutated = false;
            } else if (cell.infected) {
                // Stage 2: Mutation - turn to wild
                newMutated.add(index);
                this.setSymbol(index, 'WILD');
                cell.mutated = true;
                cell.infected = false;
            } else {
                // Stage 1: Infection
                newInfected.add(index);
                cell.infected = true;
                cell.element.classList.add('infected');

                // Add infection overlay
                const overlay = document.createElement('div');
                overlay.className = 'infection-overlay';
                cell.element.appendChild(overlay);
            }
        });

        // Animate infections
        if (newInfected.size > 0 && typeof animationController !== 'undefined') {
            const infectedElements = Array.from(newInfected).map(idx => this.grid[idx].element);
            animationController.animateInfection(infectedElements);
        }

        // Animate mutations
        if (newMutated.size > 0 && typeof animationController !== 'undefined') {
            const mutatedElements = Array.from(newMutated).map(idx => this.grid[idx].element);
            animationController.animateMutation(mutatedElements);
        }

        // Animate crashes
        if (crashed.size > 0 && typeof animationController !== 'undefined') {
            const crashedElements = Array.from(crashed).map(idx => this.grid[idx].element);
            animationController.animateCrash(crashedElements);
        }

        this.infectedCells = newInfected;

        await this.delay(500);
    }

    async cascade(removedCells) {
        // Animate removal
        const removedElements = Array.from(removedCells).map(idx => this.grid[idx].element);
        if (typeof animationController !== 'undefined') {
            animationController.animateRemoval(removedElements);
        }

        await this.delay(300);

        // Remove symbols from winning cells
        removedCells.forEach(index => {
            this.grid[index].element.classList.remove('winning', 'infected');
            this.grid[index].symbol = null;
            this.grid[index].infected = false;
        });

        // Drop symbols down
        for (let col = 0; col < CONFIG.GRID.COLS; col++) {
            const columnCells = [];
            for (let row = CONFIG.GRID.ROWS - 1; row >= 0; row--) {
                const index = row * CONFIG.GRID.COLS + col;
                if (this.grid[index].symbol) {
                    columnCells.push(this.grid[index].symbol);
                }
            }

            // Fill from bottom
            let cellIndex = columnCells.length - 1;
            for (let row = CONFIG.GRID.ROWS - 1; row >= 0; row--) {
                const index = row * CONFIG.GRID.COLS + col;
                if (cellIndex >= 0) {
                    this.setSymbol(index, columnCells[cellIndex], true);
                    cellIndex--;
                } else {
                    // Add new symbols from top
                    const newSymbol = getRandomSymbol();
                    this.setSymbol(index, newSymbol, true);
                }
            }
        }

        await this.delay(CONFIG.ANIMATION.CASCADE_DELAY);
    }

    checkScatters() {
        this.scatterCount = 0;
        const scatterCells = [];
        this.grid.forEach((cell, index) => {
            if (cell.symbol === 'SCATTER') {
                this.scatterCount++;
                scatterCells.push(cell.element);
            }
        });

        if (this.scatterCount >= 3) {
            // Animate scatter trigger
            if (typeof animationController !== 'undefined') {
                animationController.animateScatter(scatterCells);
            }
            this.triggerBonus();
        }
    }

    triggerBonus() {
        if (this.scatterCount === 3) {
            this.startCatchEm();
        } else if (this.scatterCount === 4) {
            this.startBeatdown();
        } else if (this.scatterCount >= 5) {
            this.startDetoxWard();
        }
    }

    changeBet() {
        const currentIndex = CONFIG.BETS.indexOf(this.currentBet);
        const nextIndex = (currentIndex + 1) % CONFIG.BETS.length;
        this.currentBet = CONFIG.BETS[nextIndex];
        this.updateUI();
    }

    showBonusBuyMenu() {
        document.getElementById('bonus-buy-menu').classList.remove('hidden');
    }

    hideBonusBuyMenu() {
        document.getElementById('bonus-buy-menu').classList.add('hidden');
    }

    buyBonus(type, cost) {
        const totalCost = cost * this.currentBet;

        if (this.balance < totalCost) {
            alert('Insufficient balance!');
            return;
        }

        this.balance -= totalCost;
        this.updateUI();
        this.hideBonusBuyMenu();

        // Trigger bonus
        if (type === 'catch') {
            this.startCatchEm();
        } else if (type === 'beatdown') {
            this.startBeatdown();
        } else if (type === 'detox') {
            this.startDetoxWard();
        }
    }

    startCatchEm() {
        // Implemented in bonus.js
        if (typeof startCatchEmBonus === 'function') {
            startCatchEmBonus(this);
        }
    }

    startBeatdown() {
        // Implemented in bonus.js
        if (typeof startBeatdownBonus === 'function') {
            startBeatdownBonus(this);
        }
    }

    startDetoxWard() {
        // Implemented in bonus.js
        if (typeof startDetoxWardBonus === 'function') {
            startDetoxWardBonus(this);
        }
    }

    showWinPopup() {
        const popup = document.getElementById('win-popup');
        const amount = document.getElementById('popup-win-amount');
        amount.textContent = this.currentWin.toFixed(2);
        popup.classList.remove('hidden');

        // Trigger big win celebration
        if (typeof animationController !== 'undefined') {
            animationController.triggerBigWinCelebration();
        }

        document.getElementById('close-popup').onclick = () => {
            popup.classList.add('hidden');
        };
    }

    showInfo() {
        alert(`POCKET REHAB: RELAPSE EDITION\n\nHow to Win:\n- Match 8+ symbols anywhere on screen\n- Symbols cascade and refill\n\nOverdose Cycle:\n1. Infection: Winning symbols glow green\n2. Mutation: Win again → turns to Wild\n3. Crash: Wild wins → leaves x2 multiplier\n\nScatters:\n- 3 Scatters: Catch 'Em bonus\n- 4 Scatters: Beatdown bonus\n- 5 Scatters: Detox Ward (Free Spins)\n\nMax Win: ${CONFIG.MAX_WIN}x`);
    }

    updateUI() {
        document.getElementById('balance').textContent = this.balance.toFixed(2);
        document.getElementById('win-amount').textContent = this.currentWin.toFixed(2);

        // Update tolerance meter based on win
        const meterFill = document.getElementById('meter-fill');
        const percentage = Math.min((this.currentWin / (this.currentBet * 100)) * 100, 100);
        meterFill.style.height = `${percentage}%`;
    }

    updateWin() {
        document.getElementById('win-amount').textContent = this.currentWin.toFixed(2);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new SlotGame();
});
