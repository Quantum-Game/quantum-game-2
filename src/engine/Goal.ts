import { IGoal } from '@/engine/interfaces'
import Coord from './Coord'

/**
 * GOAL CLASS
 * The goals to be achieved by the player
 */
export default class Goal {
  public coord: Coord
  public threshold: number

  public constructor(coord: Coord, threshold: number) {
    this.coord = coord
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
    return `{#Goal ${this.threshold}% @ ${this.coord.toString()}`
  }

  /**
   * Export goal to primitives
   * @returns a goal interface
   */
  public exportGoal(): IGoal {
    return {
      coord: this.coord.exportCoord(),
      threshold: this.threshold,
    }
  }

  /**
   * Export goal to primitives
   * @returns a goal interface
   */
  public static importGoals(iGoals: IGoal[]): Goal[] {
    return iGoals.map((iGoal) => {
      const coord = Coord.importCoord(iGoal.coord)
      return new Goal(coord, iGoal.threshold)
    })
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
