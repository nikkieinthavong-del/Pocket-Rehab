/**
 * Boss Battle Bonus (4 scatters)
 * Damage dealt = cash won
 */
export class BossBattleBonus {
  private readonly MAX_ATTACKS = 10;
  private bossHealth: number = 1000;

  /**
   * Play boss battle bonus
   * Each attack deals damage = cash
   */
  play(bet: number): number {
    let totalDamage = 0;
    this.bossHealth = 1000;

    for (let attack = 0; attack < this.MAX_ATTACKS; attack++) {
      if (this.bossHealth <= 0) break;

      // Random damage between 50-200
      const damage = Math.floor(Math.random() * 150) + 50;
      totalDamage += damage;
      this.bossHealth -= damage;
    }

    // Bonus for defeating boss
    if (this.bossHealth <= 0) {
      totalDamage *= 1.5;
    }

    // Convert damage to cash (damage points = bet multiplier)
    return (totalDamage / 10) * bet;
  }

  /**
   * Get current boss state
   */
  getState(): { health: number; maxHealth: number; attacks: number } {
    return {
      health: Math.max(0, this.bossHealth),
      maxHealth: 1000,
      attacks: this.MAX_ATTACKS,
    };
  }
}
