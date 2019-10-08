// GOAL CLASS
// Each detector should have a related threshold level in order to achieve the level.
// Goal should extend Cell or should extend Coord
// FIXME: Extend Coord in a nice way
import Coord from "./Coord";

export interface GoalInterface {
  coord: Coord;
  threshold: number;
  value: number;
}

export class Goal {
  coord: Coord;
  threshold: number;
  value: number;

  constructor(coord: Coord, threshold: number, value = 0) {
    // super(coord.y, coord.x);
    this.coord = coord;
    this.threshold = threshold;
    this.value = value;
  }

  get completed(): boolean {
    return this.value >= this.threshold;
  }

  get percentage(): number {
    return (this.value / this.threshold) * 100;
  }

  toString(): string {
    return `{#Goal ${
      this.completed ? "completed " : " "
    }@ ${this.coord.toString()} is ${this.value} / ${this.threshold}} (${
      this.percentage
    }%)`;
  }

  // Format active particle list
  static manyToString(goals: Goal[]): string {
    let result = `${goals.length} active goals...\n`;
    goals.forEach(goal => {
      result += `- ${goal.toString()}\n`;
    });
    return result;
  }

  // Import JSON
  static importJSON(jsonGoals: GoalInterface[]): Goal[] {
    const goals: Goal[] = [];
    jsonGoals.forEach(goal => {
      const coord = goal.coord;
      goals.push(new Goal(coord, goal.threshold));
    });
    return goals;
  }
}
