import { GameStateEnum } from '@/engine/interfaces';
import Goal from '@/engine/Goal';
import Absorption from '@/engine/Absorption';
import Cell from '@/engine/Cell';

/**
 * GAME STATE CLASS
 * Computes the current game state from the goals and the absorptions.
 */
export default class GameState {
  goals: Goal[];
  mines: Cell[];
  absorptions: Absorption[];

  constructor(goals: Goal[], mines: Cell[] = [], absorptions: Absorption[] = []) {
    this.goals = goals;
    this.mines = mines;
    this.absorptions = absorptions;
  }

  /**
   * Return the sum of the goals threshold percentage
   * @param goals Goal[]
   * @returns percentage
   */
  get totalGoal(): number {
    let sum = 0;
    this.goals.forEach((goal) => {
      sum += goal.threshold;
    });
    return sum * 100;
  }

  /**
   * Absorptions that happened on goal cells
   */
  get totalAbsorption(): number {
    let sum = 0;
    this.absorptions.forEach((absorption) => {
      this.goals.forEach((goal) => {
        if (goal.cell.coord.equal(absorption.coord)) {
          sum += absorption.probability;
        }
      });
    });
    return sum * 100;
  }

  /**
   * Is the absorption above the required goal
   */
  get probabilityFlag(): boolean {
    return this.totalAbsorption >= this.totalGoal;
  }

  /**
   * Is every goal achieved.
   */
  get goalFlag(): boolean {
    return this.goalsUnhit === 0;
  }

  /**
   * Check that no mines are hit so it's safe
   */
  get safeFlag(): boolean {
    return this.minesHit.length === 0;
  }

  /**
   * Compute current game state from the different flags
   */
  get gameState(): GameStateEnum {
    // Simulation will trigger mine
    if (!this.safeFlag) {
      return GameStateEnum.MineExploded;
    }
    // Goals are unmet
    if (!this.goalFlag && this.probabilityFlag) {
      return GameStateEnum.GoalsNotCompleted;
    }
    // Total probability is too low
    if (this.goalFlag && !this.probabilityFlag) {
      return GameStateEnum.ProbabilityTooLow;
    }
    // All conditions met for victory
    if (this.probabilityFlag && this.goalFlag && this.safeFlag) {
      return GameStateEnum.Victory;
    }
    return GameStateEnum.InProgress;
  }

  /**
   * Process the detection events and link them to goals
   * @returns hit detector count
   */
  get goalsHit(): Goal[] {
    const goalsHit: Goal[] = [];
    this.absorptions.forEach((absorption) => {
      this.goals.forEach((goal) => {
        if (absorption.cell.coord.equal(goal.cell.coord)) {
          goalsHit.push(goal);
        }
      });
    });
    return goalsHit;
  }

  /**
   * Process the detection events and select the detectors
   * @returns hit detector count
   */
  get goalsUnhit(): number {
    return this.goals.length - this.goalsHit.length;
  }

  /**
   * Process the detection events and select the mines
   * @returns hit mines count
   */
  get minesHit(): Cell[] {
    return this.absorptions.filter((absorption) => {
      return absorption.cell.isMine;
    });
  }

  /**
   * Process the detection events and select the mines
   * @returns hit mines count
   */
  get minesUnhit(): number {
    return this.mines.length - this.minesHit.length;
  }

  /**
   * Override toString() method.
   */
  toString(): string {
    let result = `--- GameState: ${this.gameState} ---\n`;
    result += `- PROB FLAG: ${this.probabilityFlag ? 'OK' : 'KO'}\n`;
    result += `Probability ${this.totalAbsorption}% / ${this.totalGoal}%\n`;
    result += `- GOAL FLAG: ${this.goalFlag ? 'OK' : 'KO'}\n`;
    result += `Goals hit(${this.goalsHit.length}) + unhit(${this.goalsUnhit}) = ${this.goals.length}\n`;
    result += `- SAFE FLAG: ${this.safeFlag ? 'OK' : 'KO'}\n`;
    result += `Mines hit(${this.minesHit.length}) + unhit(${this.minesUnhit}) = ${this.mines.length}\n`;
    return result;
  }
}
