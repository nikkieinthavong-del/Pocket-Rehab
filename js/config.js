// Game Configuration
const CONFIG = {
    // Grid settings
    GRID: {
        COLS: 6,
        ROWS: 5,
        TOTAL_CELLS: 30
    },

    // Symbol definitions
    SYMBOLS: {
        // High Pay Characters
        SPARKY: {
            name: 'Sparky',
            type: 'high',
            image: 'assets/characters/char_high_sparky.png',
            pays: { 8: 10, 10: 20, 12: 50, 15: 100, 20: 500 }
        },
        ZIPPO: {
            name: 'Zippo',
            type: 'high',
            image: 'assets/characters/char_high_zippo.png',
            pays: { 8: 10, 10: 20, 12: 50, 15: 100, 20: 500 }
        },
        SQUIRT: {
            name: 'Squirt',
            type: 'high',
            image: 'assets/characters/char_high_squirt.png',
            pays: { 8: 10, 10: 20, 12: 50, 15: 100, 20: 500 }
        },

        // Low Pay Symbols
        FISH: {
            name: 'Fish',
            type: 'low',
            image: 'assets/symbols/sym_low_fish.png',
            pays: { 8: 2, 10: 5, 12: 10, 15: 20, 20: 50 }
        },
        FINGER: {
            name: 'Finger',
            type: 'low',
            image: 'assets/symbols/sym_low_finger.png',
            pays: { 8: 2, 10: 5, 12: 10, 15: 20, 20: 50 }
        },
        NEEDLE: {
            name: 'Needle',
            type: 'low',
            image: 'assets/symbols/sym_low_needle.png',
            pays: { 8: 2, 10: 5, 12: 10, 15: 20, 20: 50 }
        },
        BAGGIE: {
            name: 'Baggie',
            type: 'low',
            image: 'assets/symbols/sym_low_baggie.png',
            pays: { 8: 2, 10: 5, 12: 10, 15: 20, 20: 50 }
        },
        PILLS: {
            name: 'Pills',
            type: 'low',
            image: 'assets/symbols/sym_low_pills.png',
            pays: { 8: 2, 10: 5, 12: 10, 15: 20, 20: 50 }
        },
        CAN: {
            name: 'Can',
            type: 'low',
            image: 'assets/symbols/sym_low_can.png',
            pays: { 8: 2, 10: 5, 12: 10, 15: 20, 20: 50 }
        },

        // Special Symbols
        WILD: {
            name: 'Wild',
            type: 'special',
            image: 'assets/specials/sym_special_wild.png',
            substitutes: true
        },
        SCATTER: {
            name: 'Scatter',
            type: 'special',
            image: 'assets/specials/sym_special_scatter.png',
            trigger: true
        },
        MULTIPLIER: {
            name: 'Multiplier',
            type: 'special',
            image: 'assets/specials/sym_special_multiplier.png',
            multiplier: 2
        }
    },

    // Symbol weights for random generation
    SYMBOL_WEIGHTS: {
        SPARKY: 8,
        ZIPPO: 8,
        SQUIRT: 8,
        FISH: 12,
        FINGER: 12,
        NEEDLE: 12,
        BAGGIE: 12,
        PILLS: 12,
        CAN: 12,
        WILD: 3,
        SCATTER: 3
    },

    // Game mechanics
    MECHANICS: {
        MIN_CLUSTER: 8,
        CASCADE: true,
        OVERDOSE_CYCLE: {
            INFECTION: 'infected',
            MUTATION: 'mutated',
            CRASH: 'crashed'
        }
    },

    // Bet settings
    BETS: [1, 2, 5, 10, 20, 50, 100],
    DEFAULT_BET_INDEX: 0,
    DEFAULT_BALANCE: 5000,

    // Bonus features
    BONUS: {
        CATCH_EM: {
            scatters: 3,
            cost: 100,
            lives: 3
        },
        BEATDOWN: {
            scatters: 4,
            cost: 200,
            spins: 5,
            bossHP: 100
        },
        DETOX_WARD: {
            scatters: 5,
            cost: 500,
            freeSpins: 10
        }
    },

    // Bonus game weapons (for Catch 'Em)
    WEAPONS: {
        BRICK: { name: 'Brick', damage: [10, 20], image: 'assets/bonus_icons/icon_bonus_brick.png' },
        TASER: { name: 'Taser', damage: [20, 40], image: 'assets/bonus_icons/icon_bonus_taser.png' },
        FIST: { name: 'Fist', damage: [5, 15], image: 'assets/bonus_icons/icon_bonus_fist.png' }
    },

    // Animations
    ANIMATION: {
        CASCADE_DELAY: 500,
        WIN_FLASH_DURATION: 1000,
        SPIN_DURATION: 300
    },

    // Max win
    MAX_WIN: 50000
};

// Helper function to get random symbol based on weights
function getRandomSymbol() {
    const symbols = Object.keys(CONFIG.SYMBOL_WEIGHTS);
    const weights = Object.values(CONFIG.SYMBOL_WEIGHTS);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    let random = Math.random() * totalWeight;

    for (let i = 0; i < symbols.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return symbols[i];
        }
    }

    return symbols[0];
}

// Helper function to get symbol pays
function getSymbolPays(symbolKey, count) {
    const symbol = CONFIG.SYMBOLS[symbolKey];
    if (!symbol || !symbol.pays) return 0;

    const payKeys = Object.keys(symbol.pays).map(Number).sort((a, b) => b - a);
    for (let key of payKeys) {
        if (count >= key) {
            return symbol.pays[key];
        }
    }

    return 0;
}
