export default class GameState {
  achievedGoals: boolean;
  noPointers: boolean;
  notEnoughIntensity: boolean;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.achievedGoals = false;
    this.noPointers = false;
    this.notEnoughIntensity = false;
  }

  doStartNextRound(): boolean {
    return !this.noPointers;
  }

  doRestartGame(): boolean {
    return this.noPointers || this.notEnoughIntensity;
  }

  isGameOver(): boolean {
    return this.achievedGoals || this.noPointers || this.notEnoughIntensity;
  }
}
