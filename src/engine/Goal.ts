import { GoalInterface } from './interfaces';
import Cell from './Cell';

/**
 * GOAL CLASS
 * The goals to be achieved by the player
 */
export default class Goal extends Cell {
  cell: Cell;
  threshold: number;

  constructor(cell: Cell, threshold: number, value = 0) {
    super(cell.coord, cell.element);
    this.cell = cell;
    this.threshold = threshold;
  }

  /**
   * Is a goal completed
   * @returns boolean if the goal is completed
   */
  completed(value: number): boolean {
    return value >= this.threshold;
  }

  /**
   * Returns a percentage of the current value compared to the expected value.
   * @returns number from 0 to 1 describing percentage
   */
  percentage(value: number): number {
    return (value / this.threshold) * 100;
  }

  /**
   * Override toString() method to display the goal
   * @returns string
   */
  toString(): string {
    return `{#Goal ${this.threshold}% @ ${this.cell.toString()}`;
  }

  /**
   * Export goal to primitives
   * @returns a goal interface
   */
  exportGoal(): GoalInterface {
    return {
      coord: this.cell.coord.exportCoord(),
      threshold: this.threshold
    };
  }

  /**
   * Output formatted list of goals
   * @param goals list of goals
   * @returns formatted string describing goals
   */
  static manyToString(goals: Goal[]): string {
    let result = `${goals.length} active goals...\n`;
    goals.forEach((goal) => {
      result += `- ${goal.toString()}\n`;
    });
    return result;
  }
}
