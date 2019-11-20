/**
 * GAME STATE CLASS
 * Computes the current game state
 */
import { GameStateEnum } from '@/engine/interfaces';
import Goal from '@/engine/Goal';
import Cell from '@/engine/Cell';

export default class GameStateEngine {
  probabilityFlag: boolean = false;
  goalFlag: boolean = false;
  safeFlag: boolean = false;
  gameState: GameStateEnum;
  goals: Goal[];
  mines: Cell[];

  constructor(goals: Goal[], mines: Cell[] = []) {
    this.goals = goals;
    this.mines = mines;
    this.gameState = GameStateEnum.Initial;
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

  get minesCount() {
    return this.mines.length;
  }

  /**
   * Compute game state and sets Vuex
   */
  computeGameState() {
    // let probabilityFlag = false;
    // let goalFlag = false;
    // let safeFlag = false;
    // // Compute the current detection probability and compare it to goals
    // if (this.percentage >= this.totalGoalPercentage) {
    //   probabilityFlag = true;
    // }
    // // Check that the current goals are met
    // if (this.detectorsUnhit === 0) {
    //   goalFlag = true;
    // }
    // // Check that no mines are hit so it's safe
    // if (this.minesHit === 0) {
    //   safeFlag = true;
  }
}
//     // if (!safeFlag) {
//     //   this.mutationSetGameState(GameState.MineExploded);
//     //   this.$emit('gameState', GameState.MineExploded);
//     //   return;
//     // }
//     // if ((!goalFlag && probabilityFlag) || (goalFlag && !probabilityFlag)) {
//     //   this.mutationSetGameState(GameState.InProgress);
//     //   this.$emit('gameState', GameState.InProgress);
//     // }
//     // if (probabilityFlag && goalFlag && safeFlag) {
//     //   this.mutationSetGameState(GameState.Victory);
//     //   this.$emit('gameState', GameState.Victory);
//     // }

//   /**
//    * Process the detection events and select the detectors
//    * @returns hit detector count
//    */
//   get detectorsHit(): number {
//     const detectorDetected = this.detections.filter((detection) => {
//       return detection.cell.isDetector;
//     });
//     return detectorDetected.length;
//   }

//   /**
//    * Process the detection events and select the detectors
//    * @returns hit detector count
//    */
//   get detectorsUnhit(): number {
//     return this.goals.length - this.detectorsHit;
//   }

//   /**
//    * Process the detection events and select the mines
//    * @returns hit mines count
//    */
//   get minesHit(): number {
//     const minesDetected = this.detections.filter((detection) => {
//       return detection.cell.element.name === 'Mine';
//     });
//     return minesDetected.length;
//   }
