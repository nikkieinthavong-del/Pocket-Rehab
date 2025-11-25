// UI Manager - Handles all UI interactions and modal management
class UIManager {
    constructor() {
        this.settingsModal = null;
        this.betModal = null;
        this.paytableModal = null;
        this.statsPanel = null;
        this.isMuted = false;

        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.loadSettings();
    }

    cacheElements() {
        // Modals
        this.settingsModal = document.getElementById('settings-menu');
        this.betModal = document.getElementById('bet-selector');
        this.paytableModal = document.getElementById('paytable-modal');

        // Panels
        this.statsPanel = document.getElementById('stats-panel');
        this.statsContent = document.getElementById('stats-content');

        // Toolbar buttons
        this.toolbarSettings = document.getElementById('toolbar-settings');
        this.toolbarPaytable = document.getElementById('toolbar-paytable');
        this.toolbarStats = document.getElementById('toolbar-stats');
        this.toolbarMute = document.getElementById('toolbar-mute');

        // Modal close buttons
        this.closeSettings = document.getElementById('close-settings');
        this.closeBetSelector = document.getElementById('close-bet-selector');
        this.closePaytable = document.getElementById('close-paytable');

        // Stats toggle
        this.toggleStats = document.getElementById('toggle-stats');

        // Original info button
        this.infoBtnOriginal = document.getElementById('info-btn');

        // Bet buttons
        this.betOptions = document.querySelectorAll('.bet-option');
    }

    attachEventListeners() {
        // Toolbar buttons
        this.toolbarSettings?.addEventListener('click', () => this.showSettings());
        this.toolbarPaytable?.addEventListener('click', () => this.showPaytable());
        this.toolbarStats?.addEventListener('click', () => this.toggleStatsPanel());
        this.toolbarMute?.addEventListener('click', () => this.toggleMute());

        // Original info button opens paytable
        this.infoBtnOriginal?.addEventListener('click', () => this.showPaytable());

        // Modal close buttons
        this.closeSettings?.addEventListener('click', () => this.hideSettings());
        this.closeBetSelector?.addEventListener('click', () => this.hideBetSelector());
        this.closePaytable?.addEventListener('click', () => this.hidePaytable());

        // Stats panel toggle
        this.toggleStats?.addEventListener('click', () => this.toggleStatsContent());
        this.statsPanel?.querySelector('.stats-header')?.addEventListener('click', () => this.toggleStatsContent());

        // Close modals on overlay click
        [this.settingsModal, this.betModal, this.paytableModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAllModals();
                }
            });
        });

        // Settings - Auto-play controls
        document.getElementById('start-autoplay')?.addEventListener('click', () => this.startAutoPlay());
        document.getElementById('stop-autoplay')?.addEventListener('click', () => this.stopAutoPlay());

        // Settings - Sound controls
        document.getElementById('master-volume')?.addEventListener('input', (e) => {
            this.updateVolume(e.target.value);
        });

        document.getElementById('sound-effects')?.addEventListener('change', (e) => {
            this.toggleSoundEffects(e.target.checked);
        });

        document.getElementById('background-music')?.addEventListener('change', (e) => {
            this.toggleBackgroundMusic(e.target.checked);
        });

        // Settings - Game options
        document.getElementById('turbo-mode')?.addEventListener('change', (e) => {
            this.toggleTurboMode(e.target.checked);
        });

        document.getElementById('quick-spin')?.addEventListener('change', (e) => {
            this.toggleQuickSpin(e.target.checked);
        });

        document.getElementById('show-stats')?.addEventListener('change', (e) => {
            this.toggleStatsVisibility(e.target.checked);
        });

        // Settings - Save/Load
        document.getElementById('save-game')?.addEventListener('click', () => this.saveGame());
        document.getElementById('load-game')?.addEventListener('click', () => this.loadGame());
        document.getElementById('reset-game')?.addEventListener('click', () => this.resetGame());

        // Bet selector options
        this.betOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const betValue = parseInt(btn.dataset.bet);
                this.selectBet(betValue);
            });
        });

        // Override original bet button to show modal
        const betBtn = document.getElementById('bet-btn');
        if (betBtn) {
            // Remove existing listeners by cloning
            const newBetBtn = betBtn.cloneNode(true);
            betBtn.parentNode.replaceChild(newBetBtn, betBtn);
            newBetBtn.addEventListener('click', () => this.showBetSelector());
        }

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    // Modal Management
    showSettings() {
        this.hideAllModals();
        this.settingsModal?.classList.remove('hidden');
    }

    hideSettings() {
        this.settingsModal?.classList.add('hidden');
    }

    showPaytable() {
        this.hideAllModals();
        this.paytableModal?.classList.remove('hidden');
    }

    hidePaytable() {
        this.paytableModal?.classList.add('hidden');
    }

    showBetSelector() {
        this.hideAllModals();
        this.updateBetSelectorUI();
        this.betModal?.classList.remove('hidden');
    }

    hideBetSelector() {
        this.betModal?.classList.add('hidden');
    }

    hideAllModals() {
        this.settingsModal?.classList.add('hidden');
        this.betModal?.classList.add('hidden');
        this.paytableModal?.classList.add('hidden');
    }

    // Stats Panel
    toggleStatsPanel() {
        this.statsPanel?.classList.toggle('hidden');
    }

    toggleStatsContent() {
        this.statsContent?.classList.toggle('hidden');
        this.toggleStats?.classList.toggle('collapsed');
    }

    toggleStatsVisibility(show) {
        if (show) {
            this.statsPanel?.classList.remove('hidden');
        } else {
            this.statsPanel?.classList.add('hidden');
        }
        this.saveSettings();
    }

    updateStats(stats) {
        document.getElementById('stat-spins').textContent = stats.totalSpins || 0;
        document.getElementById('stat-wagered').textContent = `$${stats.totalWagered || 0}`;
        document.getElementById('stat-won').textContent = `$${stats.totalWon || 0}`;
        document.getElementById('stat-biggest').textContent = `$${stats.biggestWin || 0}`;
        document.getElementById('stat-bonus').textContent = stats.bonusTriggered || 0;

        const rtp = stats.totalWagered > 0 ? ((stats.totalWon / stats.totalWagered) * 100).toFixed(2) : 0;
        document.getElementById('stat-rtp').textContent = `${rtp}%`;
    }

    // Bet Selector
    selectBet(betValue) {
        // Update game bet
        if (window.game) {
            const betIndex = CONFIG.BETS.indexOf(betValue);
            if (betIndex !== -1) {
                window.game.currentBet = betValue;
                window.game.updateUI();
                this.updateBetSelectorUI();
                this.hideBetSelector();
            }
        }
    }

    updateBetSelectorUI() {
        const currentBet = window.game?.currentBet || CONFIG.BETS[0];
        document.getElementById('current-bet-value').textContent = currentBet;

        this.betOptions.forEach(btn => {
            const betValue = parseInt(btn.dataset.bet);
            if (betValue === currentBet) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Auto-Play
    startAutoPlay() {
        const spins = parseInt(document.getElementById('autoplay-spins')?.value || 10);
        const options = {
            stopOnWin: document.getElementById('autoplay-stop-win')?.checked || false,
            stopOnBigWin: document.getElementById('autoplay-stop-bigwin')?.checked || false,
            stopOnBonus: document.getElementById('autoplay-stop-bonus')?.checked || false,
            stopLoss: parseInt(document.getElementById('autoplay-stoploss')?.value || 0),
            stopWin: parseInt(document.getElementById('autoplay-stopwin')?.value || 0)
        };

        if (window.autoPlayManager) {
            window.autoPlayManager.start(spins, options);
            this.updateAutoPlayStatus('Active');
        }
    }

    stopAutoPlay() {
        if (window.autoPlayManager) {
            window.autoPlayManager.stop();
            this.updateAutoPlayStatus('Inactive');
        }
    }

    updateAutoPlayStatus(status) {
        const statusEl = document.getElementById('autoplay-status');
        if (statusEl) {
            statusEl.textContent = `Status: ${status}`;
            statusEl.style.color = status === 'Active' ? '#00ff00' : '#ffcc00';
        }
    }

    // Sound Controls
    updateVolume(value) {
        document.getElementById('volume-value').textContent = `${value}%`;
        if (window.audioManager) {
            window.audioManager.setMasterVolume(value / 100);
        }
        this.saveSettings();
    }

    toggleSoundEffects(enabled) {
        if (window.audioManager) {
            window.audioManager.soundEffectsEnabled = enabled;
        }
        this.saveSettings();
    }

    toggleBackgroundMusic(enabled) {
        if (window.audioManager) {
            window.audioManager.musicEnabled = enabled;
            if (enabled) {
                window.audioManager.playMusic('bg_main');
            } else {
                window.audioManager.stopMusic();
            }
        }
        this.saveSettings();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const muteIcon = this.toolbarMute?.querySelector('.toolbar-icon');

        if (this.isMuted) {
            muteIcon.textContent = '🔇';
            if (window.audioManager) {
                window.audioManager.setMasterVolume(0);
            }
        } else {
            muteIcon.textContent = '🔊';
            const volume = parseInt(document.getElementById('master-volume')?.value || 70);
            if (window.audioManager) {
                window.audioManager.setMasterVolume(volume / 100);
            }
        }
        this.saveSettings();
    }

    // Game Options
    toggleTurboMode(enabled) {
        if (window.turboMode) {
            if (enabled) {
                window.turboMode.activate();
            } else {
                window.turboMode.deactivate();
            }
        }
        this.saveSettings();
    }

    toggleQuickSpin(enabled) {
        if (window.game) {
            window.game.quickSpin = enabled;
        }
        this.saveSettings();
    }

    // Save/Load System
    saveGame() {
        if (window.saveLoadSystem) {
            const saved = window.saveLoadSystem.saveGame();
            const statusEl = document.getElementById('save-status');
            if (statusEl) {
                statusEl.textContent = saved ? '✅ Game saved successfully!' : '❌ Failed to save game';
                statusEl.style.color = saved ? '#00ff00' : '#ff0000';
                setTimeout(() => {
                    statusEl.textContent = '';
                }, 3000);
            }
        }
    }

    loadGame() {
        if (window.saveLoadSystem) {
            const loaded = window.saveLoadSystem.loadGame();
            const statusEl = document.getElementById('save-status');
            if (statusEl) {
                statusEl.textContent = loaded ? '✅ Game loaded successfully!' : '❌ No saved game found';
                statusEl.style.color = loaded ? '#00ff00' : '#ff0000';
                setTimeout(() => {
                    statusEl.textContent = '';
                }, 3000);
            }
            if (loaded && window.game) {
                window.game.updateUI();
            }
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
            if (window.game) {
                window.game.balance = CONFIG.DEFAULT_BALANCE;
                window.game.currentBet = CONFIG.BETS[CONFIG.DEFAULT_BET_INDEX];
                window.game.updateUI();
            }
            if (window.statsTracker) {
                window.statsTracker.reset();
            }
            localStorage.removeItem('pocketRehabSave');

            const statusEl = document.getElementById('save-status');
            if (statusEl) {
                statusEl.textContent = '✅ Game reset successfully!';
                statusEl.style.color = '#00ff00';
                setTimeout(() => {
                    statusEl.textContent = '';
                }, 3000);
            }
        }
    }

    // Settings Persistence
    saveSettings() {
        const settings = {
            volume: document.getElementById('master-volume')?.value || 70,
            soundEffects: document.getElementById('sound-effects')?.checked ?? true,
            backgroundMusic: document.getElementById('background-music')?.checked ?? true,
            turboMode: document.getElementById('turbo-mode')?.checked ?? false,
            quickSpin: document.getElementById('quick-spin')?.checked ?? false,
            showStats: document.getElementById('show-stats')?.checked ?? true,
            isMuted: this.isMuted
        };
        localStorage.setItem('pocketRehabSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const settingsJson = localStorage.getItem('pocketRehabSettings');
        if (!settingsJson) return;

        try {
            const settings = JSON.parse(settingsJson);

            if (settings.volume !== undefined) {
                const volumeInput = document.getElementById('master-volume');
                if (volumeInput) {
                    volumeInput.value = settings.volume;
                    this.updateVolume(settings.volume);
                }
            }

            if (settings.soundEffects !== undefined) {
                const soundEffectsCheckbox = document.getElementById('sound-effects');
                if (soundEffectsCheckbox) {
                    soundEffectsCheckbox.checked = settings.soundEffects;
                    this.toggleSoundEffects(settings.soundEffects);
                }
            }

            if (settings.backgroundMusic !== undefined) {
                const bgMusicCheckbox = document.getElementById('background-music');
                if (bgMusicCheckbox) {
                    bgMusicCheckbox.checked = settings.backgroundMusic;
                    this.toggleBackgroundMusic(settings.backgroundMusic);
                }
            }

            if (settings.turboMode !== undefined) {
                const turboCheckbox = document.getElementById('turbo-mode');
                if (turboCheckbox) {
                    turboCheckbox.checked = settings.turboMode;
                    this.toggleTurboMode(settings.turboMode);
                }
            }

            if (settings.quickSpin !== undefined) {
                const quickSpinCheckbox = document.getElementById('quick-spin');
                if (quickSpinCheckbox) {
                    quickSpinCheckbox.checked = settings.quickSpin;
                    this.toggleQuickSpin(settings.quickSpin);
                }
            }

            if (settings.showStats !== undefined) {
                const showStatsCheckbox = document.getElementById('show-stats');
                if (showStatsCheckbox) {
                    showStatsCheckbox.checked = settings.showStats;
                    this.toggleStatsVisibility(settings.showStats);
                }
            }

            if (settings.isMuted !== undefined) {
                this.isMuted = settings.isMuted;
                if (this.isMuted) {
                    const muteIcon = this.toolbarMute?.querySelector('.toolbar-icon');
                    if (muteIcon) muteIcon.textContent = '🔇';
                }
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }
}

// Initialize UI Manager when DOM is ready
let uiManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        uiManager = new UIManager();
        window.uiManager = uiManager;
    });
} else {
    uiManager = new UIManager();
    window.uiManager = uiManager;
}
