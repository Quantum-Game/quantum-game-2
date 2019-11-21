import { GameStateEnum } from '@/engine/interfaces';
import Goal from '@/engine/Goal';
import Absorption from '@/engine/Absorption';
import Cell from '@/engine/Cell';

/**
 * GAME STATE CLASS
 * Computes the current game state
 */
export default class GameStateEngine {
  probabilityFlag: boolean = false;
  goalFlag: boolean = false;
  safeFlag: boolean = false;
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
  get totalGoalPercentage(): number {
    let sum = 0;
    this.goals.forEach((goal) => {
      sum += goal.threshold;
    });
    return sum;
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
    return sum;
  }

  /**
   * Compute game state and sets Vuex
   */
  get gameState(): GameStateEnum {
    let probabilityFlag = false;
    let goalFlag = false;
    let safeFlag = false;
    // Compute the current detection probability and compare it to goals
    if (this.totalAbsorption >= this.totalGoalPercentage) {
      probabilityFlag = true;
    }
    // Check that the current goals are met
    if (this.goalsUnhit === 0) {
      goalFlag = true;
    }
    // Check that no mines are hit so it's safe
    if (this.minesHit.length === 0) {
      safeFlag = true;
    }

    // Compute gameState from flags
    if (!safeFlag) {
      return GameStateEnum.MineExploded;
    }
    if ((!goalFlag && probabilityFlag) || (goalFlag && !probabilityFlag)) {
      return GameStateEnum.InProgress;
    }
    if (probabilityFlag && goalFlag && safeFlag) {
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
    const minesDetected = this.absorptions.filter((absorption) => {
      return absorption.cell.element.name === 'Mine';
    });
    return minesDetected;
  }
}
