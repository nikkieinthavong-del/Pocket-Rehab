// Bonus Game Logic

// Catch 'Em... If You Can Bonus
function startCatchEmBonus(gameInstance) {
    const bonusScreen = document.getElementById('bonus-catch');
    const bgImage = document.getElementById('bg-image');

    // Show bonus screen
    bonusScreen.classList.remove('hidden');
    bgImage.src = 'assets/backgrounds/bg_bonus_field.png';

    let lives = CONFIG.BONUS.CATCH_EM.lives;
    let totalWin = 0;

    updateCatchUI();

    function updateCatchUI() {
        document.getElementById('catch-lives').textContent = lives;
        document.getElementById('catch-win').textContent = totalWin.toFixed(2);
    }

    function spinReels() {
        // Get random weapon
        const weapons = Object.keys(CONFIG.WEAPONS);
        const weapon = weapons[Math.floor(Math.random() * weapons.length)];
        const weaponData = CONFIG.WEAPONS[weapon];

        // Get random power multiplier
        const power = Math.floor(Math.random() * 5) + 1;

        // Get random accuracy (hit/miss/crit)
        const accuracy = Math.random();
        let result;
        let accuracyText;

        if (accuracy < 0.6) {
            // Hit
            result = 'hit';
            accuracyText = 'HIT!';
            const damage = Math.floor(Math.random() * (weaponData.damage[1] - weaponData.damage[0] + 1)) + weaponData.damage[0];
            const win = damage * power * gameInstance.currentBet;
            totalWin += win;
        } else if (accuracy < 0.8) {
            // Miss
            result = 'miss';
            accuracyText = 'MISS!';
            lives--;
        } else {
            // Crit
            result = 'crit';
            accuracyText = 'CRIT!';
            const damage = weaponData.damage[1] * 2;
            const win = damage * power * gameInstance.currentBet;
            totalWin += win;
            lives++;
        }

        // Display results
        document.getElementById('weapon-reel').innerHTML = `
            <img src="${weaponData.image}" alt="${weaponData.name}" style="width:80px;height:80px;">
            <div>${weaponData.name}</div>
        `;
        document.getElementById('power-reel').textContent = `x${power}`;
        document.getElementById('accuracy-reel').innerHTML = `
            <div style="color: ${result === 'miss' ? '#ff0000' : result === 'crit' ? '#ffcc00' : '#00ff00'}">
                ${accuracyText}
            </div>
        `;

        updateCatchUI();

        // Check if bonus should end
        if (lives <= 0) {
            setTimeout(endBonus, 2000);
        }
    }

    function endBonus() {
        bonusScreen.classList.add('hidden');
        bgImage.src = 'assets/backgrounds/bg_main_alley.png';

        gameInstance.balance += totalWin;
        gameInstance.currentWin = totalWin;
        gameInstance.updateUI();

        if (totalWin > 0) {
            gameInstance.showWinPopup();
        }
    }

    // Event listeners
    const spinBtn = document.getElementById('catch-spin');
    const exitBtn = document.getElementById('catch-exit');

    spinBtn.onclick = () => {
        if (lives > 0) {
            spinReels();
        }
    };

    exitBtn.onclick = () => {
        endBonus();
    };
}

// Alleyway Beatdown Bonus
function startBeatdownBonus(gameInstance) {
    const bonusScreen = document.getElementById('bonus-beatdown');
    const bgImage = document.getElementById('bg-image');

    // Show bonus screen
    bonusScreen.classList.remove('hidden');
    bgImage.src = 'assets/backgrounds/bg_bonus_cage.png';

    let spinsLeft = CONFIG.BONUS.BEATDOWN.spins;
    let bossHP = CONFIG.BONUS.BEATDOWN.bossHP;
    let totalWin = 0;
    let level = 1;
    let damageMultiplier = 1;

    updateBeatdownUI();

    function updateBeatdownUI() {
        document.getElementById('beatdown-spins').textContent = spinsLeft;
        document.getElementById('beatdown-win').textContent = totalWin.toFixed(2);
        document.getElementById('boss-hp').textContent = bossHP;

        const hpPercentage = (bossHP / CONFIG.BONUS.BEATDOWN.bossHP) * 100;
        document.getElementById('boss-hp-fill').style.width = `${hpPercentage}%`;

        // Update boss sprite
        const bossSprite = document.getElementById('boss-sprite');
        if (bossHP > 0) {
            bossSprite.textContent = '👊';
        } else {
            bossSprite.textContent = '💀';
        }
    }

    function fight() {
        // Random attack type
        const attacks = ['PUNCH', 'KICK', 'COMBO'];
        const attack = attacks[Math.floor(Math.random() * attacks.length)];

        // Random damage
        let baseDamage = Math.floor(Math.random() * 20) + 10;
        if (attack === 'COMBO') {
            baseDamage *= 2;
        }

        const totalDamage = Math.floor(baseDamage * damageMultiplier);
        bossHP -= totalDamage;

        if (bossHP < 0) bossHP = 0;

        // Each point of damage = cash
        const win = totalDamage * gameInstance.currentBet;
        totalWin += win;

        // Display result
        document.getElementById('beatdown-result').innerHTML = `
            <div style="color: #ffcc00; font-size: 1.5em;">
                ${attack}! ${totalDamage} damage! +${win.toFixed(2)}
            </div>
        `;

        spinsLeft--;
        updateBeatdownUI();

        // Check if boss is defeated
        if (bossHP === 0) {
            level++;
            spinsLeft += 3;
            damageMultiplier *= 2;
            bossHP = CONFIG.BONUS.BEATDOWN.bossHP;

            document.getElementById('beatdown-result').innerHTML = `
                <div style="color: #00ff00; font-size: 2em;">
                    BOSS DEFEATED!<br>
                    Level ${level} - Multiplier x${damageMultiplier}
                </div>
            `;

            updateBeatdownUI();
        }

        // Check if bonus should end
        if (spinsLeft <= 0) {
            setTimeout(endBonus, 2000);
        }
    }

    function endBonus() {
        bonusScreen.classList.add('hidden');
        bgImage.src = 'assets/backgrounds/bg_main_alley.png';

        gameInstance.balance += totalWin;
        gameInstance.currentWin = totalWin;
        gameInstance.updateUI();

        if (totalWin > 0) {
            gameInstance.showWinPopup();
        }
    }

    // Event listeners
    const fightBtn = document.getElementById('beatdown-spin');
    const exitBtn = document.getElementById('beatdown-exit');

    fightBtn.onclick = () => {
        if (spinsLeft > 0) {
            fight();
        }
    };

    exitBtn.onclick = () => {
        endBonus();
    };
}

// Detox Ward (Free Spins) Bonus
function startDetoxWardBonus(gameInstance) {
    const bgImage = document.getElementById('bg-image');

    // Change background slightly or add overlay
    bgImage.style.filter = 'hue-rotate(90deg) saturate(150%)';

    let freeSpins = CONFIG.BONUS.DETOX_WARD.freeSpins;
    let totalWin = 0;

    // Mark as free spin mode
    gameInstance.isFreeSpin = true;

    // Pre-infect random cells
    const randomCells = [];
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * CONFIG.GRID.TOTAL_CELLS);
        if (!randomCells.includes(randomIndex)) {
            randomCells.push(randomIndex);
            gameInstance.grid[randomIndex].infected = true;
            gameInstance.grid[randomIndex].element.classList.add('infected');
        }
    }

    alert(`DETOX WARD ACTIVATED!\n\n${freeSpins} Free Spins\nSymbols start infected!\nMultipliers are sticky!`);

    async function runFreeSpin() {
        if (freeSpins <= 0) {
            endBonus();
            return;
        }

        // Deduct the bet from balance for free spin display (will be refunded)
        const originalBalance = gameInstance.balance;

        // Auto spin
        await gameInstance.spin();

        // Refund the bet (it's a free spin)
        gameInstance.balance = originalBalance;
        gameInstance.updateUI();

        freeSpins--;

        // Check for Doctor (Needle) - resets multipliers
        let foundDoctor = false;
        gameInstance.grid.forEach(cell => {
            if (cell.symbol === 'NEEDLE') {
                foundDoctor = true;
            }
        });

        if (foundDoctor) {
            // Reset all multipliers
            gameInstance.cellMultipliers = {};
            alert('The Doctor appeared! All multipliers reset!');
        }

        // Continue if spins remain
        if (freeSpins > 0) {
            setTimeout(() => runFreeSpin(), 1500);
        } else {
            endBonus();
        }
    }

    function endBonus() {
        bgImage.style.filter = 'none';
        gameInstance.isFreeSpin = false;

        // Clear all infections
        gameInstance.grid.forEach(cell => {
            cell.infected = false;
            cell.mutated = false;
            cell.element.classList.remove('infected');
        });

        if (gameInstance.currentWin > 0) {
            gameInstance.showWinPopup();
        }
    }

    // Start the free spin sequence
    setTimeout(runFreeSpin, 1000);
}
