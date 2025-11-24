// Advanced Game Features
// Auto-Play, Turbo Mode, Settings, History, Save/Load

// ==================== AUTO-PLAY SYSTEM ====================
class AutoPlayManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.isActive = false;
        this.spinsRemaining = 0;
        this.stopOnWin = false;
        this.stopOnBigWin = false;
        this.stopOnBonus = false;
        this.stopLoss = 0;
        this.stopWin = 0;
        this.startBalance = 0;
    }

    start(spins, options = {}) {
        this.isActive = true;
        this.spinsRemaining = spins;
        this.stopOnWin = options.stopOnWin || false;
        this.stopOnBigWin = options.stopOnBigWin || false;
        this.stopOnBonus = options.stopOnBonus || false;
        this.stopLoss = options.stopLoss || 0;
        this.stopWin = options.stopWin || 0;
        this.startBalance = this.game.balance;

        this.runAutoPlay();
    }

    async runAutoPlay() {
        while (this.isActive && this.spinsRemaining > 0) {
            // Check stop conditions
            if (this.shouldStop()) {
                this.stop();
                break;
            }

            // Play one spin
            await this.game.spin();
            this.spinsRemaining--;

            // Update UI
            this.updateUI();

            // Small delay between spins (unless turbo)
            if (!turboMode.isActive) {
                await this.game.delay(500);
            }
        }

        if (this.spinsRemaining <= 0) {
            this.stop();
        }
    }

    shouldStop() {
        // Stop on any win
        if (this.stopOnWin && this.game.currentWin > 0) {
            return true;
        }

        // Stop on big win (10x+ bet)
        if (this.stopOnBigWin && this.game.currentWin >= this.game.currentBet * 10) {
            return true;
        }

        // Stop on bonus trigger
        if (this.stopOnBonus && this.game.scatterCount >= 3) {
            return true;
        }

        // Stop on loss limit
        if (this.stopLoss > 0) {
            const loss = this.startBalance - this.game.balance;
            if (loss >= this.stopLoss) {
                return true;
            }
        }

        // Stop on win limit
        if (this.stopWin > 0) {
            const profit = this.game.balance - this.startBalance;
            if (profit >= this.stopWin) {
                return true;
            }
        }

        // Stop if insufficient balance
        if (this.game.balance < this.game.currentBet) {
            return true;
        }

        return false;
    }

    stop() {
        this.isActive = false;
        this.spinsRemaining = 0;
        this.updateUI();
    }

    updateUI() {
        const autoplayBtn = document.getElementById('autoplay-display');
        if (autoplayBtn) {
            if (this.isActive) {
                autoplayBtn.textContent = `AUTO: ${this.spinsRemaining}`;
                autoplayBtn.classList.add('active');
            } else {
                autoplayBtn.textContent = 'AUTO';
                autoplayBtn.classList.remove('active');
            }
        }
    }
}

// ==================== TURBO MODE ====================
class TurboMode {
    constructor() {
        this.isActive = false;
    }

    toggle() {
        this.isActive = !this.isActive;

        // Adjust animation speeds
        if (this.isActive) {
            CONFIG.ANIMATION.SPIN_DURATION = 150;
            CONFIG.ANIMATION.WIN_FLASH_DURATION = 500;
            CONFIG.ANIMATION.CASCADE_DELAY = 250;
        } else {
            CONFIG.ANIMATION.SPIN_DURATION = 300;
            CONFIG.ANIMATION.WIN_FLASH_DURATION = 1000;
            CONFIG.ANIMATION.CASCADE_DELAY = 500;
        }

        this.updateUI();
        this.saveState();
        return this.isActive;
    }

    updateUI() {
        const turboBtn = document.getElementById('turbo-display');
        if (turboBtn) {
            if (this.isActive) {
                turboBtn.classList.add('active');
            } else {
                turboBtn.classList.remove('active');
            }
        }
    }

    saveState() {
        localStorage.setItem('turbo_mode', JSON.stringify(this.isActive));
    }

    loadState() {
        const saved = localStorage.getItem('turbo_mode');
        if (saved) {
            this.isActive = JSON.parse(saved);
            if (this.isActive) {
                this.toggle(); // Apply settings
            }
        }
    }
}

// ==================== GAME STATISTICS ====================
class GameStats {
    constructor() {
        this.stats = {
            totalSpins: 0,
            totalWagered: 0,
            totalWon: 0,
            biggestWin: 0,
            bonusesTriggered: 0,
            sessionsPlayed: 0,
            lastPlayed: null
        };
        this.sessionStats = {
            spins: 0,
            wagered: 0,
            won: 0,
            biggestWin: 0,
            startBalance: 0,
            startTime: Date.now()
        };
        this.load();
    }

    recordSpin(bet, win) {
        // Overall stats
        this.stats.totalSpins++;
        this.stats.totalWagered += bet;
        this.stats.totalWon += win;
        if (win > this.stats.biggestWin) {
            this.stats.biggestWin = win;
        }

        // Session stats
        this.sessionStats.spins++;
        this.sessionStats.wagered += bet;
        this.sessionStats.won += win;
        if (win > this.sessionStats.biggestWin) {
            this.sessionStats.biggestWin = win;
        }

        this.save();
    }

    recordBonus() {
        this.stats.bonusesTriggered++;
        this.save();
    }

    startSession(balance) {
        this.stats.sessionsPlayed++;
        this.stats.lastPlayed = Date.now();
        this.sessionStats = {
            spins: 0,
            wagered: 0,
            won: 0,
            biggestWin: 0,
            startBalance: balance,
            startTime: Date.now()
        };
        this.save();
    }

    getRTP() {
        if (this.stats.totalWagered === 0) return 0;
        return (this.stats.totalWon / this.stats.totalWagered) * 100;
    }

    getSessionRTP() {
        if (this.sessionStats.wagered === 0) return 0;
        return (this.sessionStats.won / this.sessionStats.wagered) * 100;
    }

    getSessionProfit(currentBalance) {
        return currentBalance - this.sessionStats.startBalance;
    }

    save() {
        localStorage.setItem('game_stats', JSON.stringify(this.stats));
    }

    load() {
        const saved = localStorage.getItem('game_stats');
        if (saved) {
            try {
                this.stats = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load stats', e);
            }
        }
    }

    reset() {
        this.stats = {
            totalSpins: 0,
            totalWagered: 0,
            totalWon: 0,
            biggestWin: 0,
            bonusesTriggered: 0,
            sessionsPlayed: 0,
            lastPlayed: null
        };
        this.save();
    }
}

// ==================== SAVE/LOAD SYSTEM ====================
class SaveManager {
    constructor() {
        this.autosaveInterval = null;
    }

    saveGame(gameInstance) {
        const saveData = {
            balance: gameInstance.balance,
            currentBet: gameInstance.currentBet,
            timestamp: Date.now(),
            version: '1.0'
        };

        localStorage.setItem('game_save', JSON.stringify(saveData));
        console.log('Game saved');
    }

    loadGame(gameInstance) {
        const saved = localStorage.getItem('game_save');
        if (saved) {
            try {
                const saveData = JSON.parse(saved);
                gameInstance.balance = saveData.balance;
                gameInstance.currentBet = saveData.currentBet;
                gameInstance.updateUI();
                console.log('Game loaded');
                return true;
            } catch (e) {
                console.error('Failed to load game', e);
                return false;
            }
        }
        return false;
    }

    startAutosave(gameInstance, intervalMs = 30000) {
        this.stopAutosave();
        this.autosaveInterval = setInterval(() => {
            this.saveGame(gameInstance);
        }, intervalMs);
    }

    stopAutosave() {
        if (this.autosaveInterval) {
            clearInterval(this.autosaveInterval);
            this.autosaveInterval = null;
        }
    }

    deleteSave() {
        localStorage.removeItem('game_save');
        console.log('Save deleted');
    }
}

// ==================== SCREEN SHAKE ====================
class ScreenShake {
    static shake(intensity = 1, duration = 500) {
        const container = document.getElementById('game-container');
        if (!container) return;

        container.classList.add('screen-shake');
        container.style.setProperty('--shake-intensity', `${intensity * 10}px`);

        setTimeout(() => {
            container.classList.remove('screen-shake');
        }, duration);
    }
}

// ==================== SETTINGS MANAGER ====================
class SettingsManager {
    constructor() {
        this.settings = {
            sfxVolume: 0.7,
            musicVolume: 0.3,
            muted: false,
            turboMode: false,
            quickSpin: false,
            showStats: true,
            autosave: true
        };
        this.load();
    }

    update(key, value) {
        this.settings[key] = value;
        this.save();
        this.apply();
    }

    apply() {
        // Apply audio settings
        if (audioManager) {
            audioManager.setSFXVolume(this.settings.sfxVolume);
            audioManager.setMusicVolume(this.settings.musicVolume);
            audioManager.muted = this.settings.muted;
        }

        // Apply turbo mode
        if (turboMode && this.settings.turboMode !== turboMode.isActive) {
            turboMode.toggle();
        }
    }

    save() {
        localStorage.setItem('game_settings', JSON.stringify(this.settings));
    }

    load() {
        const saved = localStorage.getItem('game_settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.apply();
            } catch (e) {
                console.error('Failed to load settings', e);
            }
        }
    }
}

// ==================== MOBILE DETECTION ====================
class MobileDetector {
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    static getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    static enableMobileOptimizations() {
        if (this.isMobile()) {
            document.body.classList.add('mobile');

            // Prevent zoom on double-tap
            let lastTap = 0;
            document.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 300 && tapLength > 0) {
                    e.preventDefault();
                }
                lastTap = currentTime;
            }, { passive: false });

            // Prevent pull-to-refresh
            document.body.addEventListener('touchmove', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }
}

// ==================== LOADING SCREEN ====================
class LoadingScreen {
    static show() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    static hide() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    static setProgress(percent) {
        const bar = document.getElementById('loading-progress-bar');
        const text = document.getElementById('loading-progress-text');
        if (bar) bar.style.width = `${percent}%`;
        if (text) text.textContent = `${Math.floor(percent)}%`;
    }
}

// ==================== INITIALIZE GLOBALS ====================
let autoPlayManager;
let turboMode;
let gameStats;
let saveManager;
let settingsManager;

window.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    turboMode = new TurboMode();
    gameStats = new GameStats();
    saveManager = new SaveManager();
    settingsManager = new SettingsManager();

    // Enable mobile optimizations
    MobileDetector.enableMobileOptimizations();

    // Initialize autoplay when game is ready
    setTimeout(() => {
        if (typeof game !== 'undefined') {
            autoPlayManager = new AutoPlayManager(game);
            gameStats.startSession(game.balance);
            saveManager.startAutosave(game);

            // Try to load save
            if (settingsManager.settings.autosave) {
                saveManager.loadGame(game);
            }
        }
    }, 100);
});
