/**
 * 3-Reel Shooter Bonus (3 scatters)
 */
export class ShooterBonus {
  private readonly REELS = 3;

  /**
   * Play shooter bonus round
   * Returns total win from the bonus
   */
  play(bet: number): number {
    let totalWin = 0;

    // Simple 3-reel bonus - hit targets for wins
    for (let i = 0; i < this.REELS; i++) {
      const hit = Math.random() > 0.3; // 70% hit rate
      if (hit) {
        const winMultiplier = Math.floor(Math.random() * 10) + 5; // 5-15x
        totalWin += bet * winMultiplier;
      }
    }

    return totalWin;
  }

  /**
   * Get shooter bonus state for rendering
   */
  getState(): { reels: number; hitRate: number } {
    return {
      reels: this.REELS,
      hitRate: 0.7,
    };
  }
}
