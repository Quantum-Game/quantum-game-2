import { GoalInterface } from './interfaces'
import Cell from './Cell'

/**
 * GOAL CLASS
 * The goals to be achieved by the player
 */
export default class Goal extends Cell {
  public cell: Cell
  public threshold: number

  public constructor(cell: Cell, threshold: number) {
    super(cell.coord, cell.element)
    this.cell = cell
    this.threshold = threshold
  }

  /**
   * Is a goal completed
   * @returns boolean if the goal is completed
   */
  public completed(value: number): boolean {
    return value >= this.threshold
  }

  /**
   * Override toString() method to display the goal
   * @returns string
   */
  public toString(): string {
    return `{#Goal ${this.threshold}% @ ${this.cell.toString()}`
  }

  /**
   * Export goal to primitives
   * @returns a goal interface
   */
  public exportGoal(): GoalInterface {
    return {
      coord: this.cell.coord.exportCoord(),
      threshold: this.threshold
    }
  }

  /**
   * Output formatted list of goals
   * @param goals list of goals
   * @returns formatted string describing goals
   */
  public static manyToString(goals: Goal[]): string {
    let result = `${goals.length} active goals...\n`
    goals.forEach((goal): void => {
      result += `- ${goal.toString()}\n`
    })
    return result
  }
}
