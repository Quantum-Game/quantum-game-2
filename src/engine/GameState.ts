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
    // Compute gameState from flags
    if (!this.safeFlag) {
      return GameStateEnum.MineExploded;
    }
    if ((!this.goalFlag && this.probabilityFlag) || (this.goalFlag && !this.probabilityFlag)) {
      return GameStateEnum.InProgress;
    }
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
        goalsHit.push(goal);
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
}
