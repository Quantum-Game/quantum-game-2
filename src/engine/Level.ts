import { LevelInterface, ClassicLevelInterface, GoalInterface } from './interfaces';
import Coord from './Coord';
import Element from './Element';
import Cell from './Cell';
import Grid from './Grid';
import Toolbox from './Toolbox';
import Goal from './Goal';
import Hint from './Hint';
import GameState from './GameState';
import { convertFromClassicNames } from './Helpers';

/**
 * LEVEL CLASS
 * Level class describes the level data and logic
 * Levels are loaded as a JSON file of a solution
 * Unfrozen elements are then processed into the players inventory
 */
export default class Level {
  id: number;
  name: string;
  group: string;
  description: string;
  grid: Grid;
  goals: Goal[];
  hints: Hint[];
  toolbox: Toolbox;
  gameState: GameState;

  constructor(
    id: number,
    name: string,
    group: string,
    description: string,
    grid: Grid = new Grid(8, 8),
    goals: Goal[],
    hints: Hint[],
    toolbox: Toolbox
  ) {
    // Basic infos
    this.id = id;
    this.group = group;
    this.name = name;
    this.description = description;
    // Basic grid definition
    this.grid = grid;
    this.goals = goals;
    this.hints = hints;

    // Populate toolbox
    if (Object.keys(toolbox).length === 0) {
      this.toolbox = new Toolbox(this.grid.unvoid.unfrozen.cells);
    } else {
      this.toolbox = toolbox;
    }

    // Initiate game state
    this.gameState = new GameState(this.goals, this.grid.mines.cells);

    // Remove toolbox cells from grid
    this.grid.resetUnfrozen();
  }

  /**
   * Shortand for checking if the toolbox has available elements
   * @param element
   * @returns number of available elements in the toolbox
   */
  isAvailable(cell: Cell) {
    return this.toolbox.available(cell.element.name) > 0;
  }

  /**
   * String output of a level
   * @returns a string describing the level
   */
  toString(): string {
    let result = `LEVEL: ${this.name} [${this.grid.cols}x${this.grid.rows}]\n`;
    result += `DESC: ${this.description}\n`;
    result += `GROUP: ${this.group}\n`;
    result += `${this.grid.toString()}\n`;
    result += `GOALS: ${this.goals.map((i) => i.toString())}\n`;
    result += `HINTS: ${this.hints.map((i) => i.toString())}\n`;
    result += `TOOLBOX: ${this.toolbox.toString()}\n`;
    return result;
  }

  /**
   * Export a json level
   * @returns a level interface of the current level
   */
  exportLevel(): LevelInterface {
    return {
      id: this.id,
      name: this.name,
      group: this.group,
      description: this.description,
      grid: this.grid.exportGrid(),
      hints: this.hints.map((hint) => hint.exportHint()),
      goals: this.goals.map((goal) => goal.exportGoal()),
      tools: this.toolbox.fullCellList.map((cell: Cell) => cell.element.name)
    };
  }

  /**
   * Import a json level
   * @param obj a level interface with primitives
   * @returns a Level instance
   */
  static importLevel(obj: LevelInterface): Level {
    const grid = Grid.importGrid(obj.grid);
    const goals = obj.goals.map((goalI: GoalInterface) => {
      const coord = Coord.importCoord(goalI.coord);
      const cell = grid.get(coord);
      return new Goal(cell, goalI.threshold);
    });
    const hints = Hint.importHint(obj.hints);
    const toolbox = Toolbox.importToolbox(obj.tools);
    return new Level(obj.id, obj.name, obj.group, obj.description, grid, goals, hints, toolbox);
  }

  /**
   * Import a json level
   * @param obj a level interface with primitives
   * @returns a Level instance
   */
  static importClassicLevel(obj: ClassicLevelInterface): Level {
    const rows = obj.height;
    const cols = obj.width;
    const grid = new Grid(rows, cols);
    obj.tiles.forEach((tile) => {
      const element = Cell.fromName(convertFromClassicNames(tile.name));
      const rotation = tile.rotation * element.rotationAngle;
      const coord = new Coord(tile.j, tile.i);
      const cell = new Cell(coord, element, rotation, tile.frozen);
      grid.set(cell);
    });
    const goals: Goal[] = [];
    const hints: Hint[] = [];
    const toolbox: Toolbox = new Toolbox([]);
    return new Level(0, obj.name, obj.group, '', grid, goals, hints, toolbox);
  }

  /**
   * Import a json level
   * @returns a Level instance
   */
  static createDummy(): Level {
    return Level.importLevel({
      id: 0,
      name: 'Dummy',
      group: 'Dummy',
      description: 'Dummy level created for placeholders...',
      grid: new Grid(2, 2).exportGrid(),
      goals: [],
      hints: [],
      tools: []
    });
  }
}
