/**
 * GAME STATE CLASS
 * Stores the game starting and ending logic
 * FIXME: Currently unused
 */
export default class GameState {
  achievedGoals: boolean;
  noParticles: boolean;
  notEnoughIntensity: boolean;

  constructor() {
    this.achievedGoals = false;
    this.noParticles = false;
    this.notEnoughIntensity = false;
  }

  /**
   * Reset game state variables
   */
  reset(): void {
    this.achievedGoals = false;
    this.noParticles = false;
    this.notEnoughIntensity = false;
  }

  doComputeNextFrame(): boolean {
    return !this.noParticles;
  }

  doRestartGame(): boolean {
    return this.noParticles || this.notEnoughIntensity;
  }

  isGameOver(): boolean {
    return this.achievedGoals || this.noParticles || this.notEnoughIntensity;
  }
}
