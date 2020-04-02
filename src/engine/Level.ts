import { ILevel, IGoal, IHint } from './interfaces'
import Cell from './Cell'
import Grid from './Grid'
import Toolbox from './Toolbox'
import Goal from './Goal'
import Hint from './Hint'
import GameState from './GameState'

/**
 * LEVEL CLASS
 * Level class describes the level data and logic
 * Levels are loaded as a JSON file of a solution
 * Unfrozen elements are then processed into the players inventory
 */
export default class Level {
  public id: number
  public name: string
  public group: string
  public description: string
  public grid: Grid
  public goals: Goal[]
  public hints: Hint[]
  public toolbox: Toolbox
  public gameState: GameState
  public safetyThreshold: number

  public constructor(
    id: number,
    name: string,
    group: string,
    description: string,
    grid: Grid = new Grid(8, 8),
    goals: Goal[],
    hints: Hint[],
    toolbox: Toolbox,
    safetyThreshold = 0
  ) {
    // Basic infos
    this.id = id
    this.group = group
    this.name = name
    this.description = description
    // Basic grid definition
    this.grid = grid
    this.goals = goals
    this.hints = hints
    this.safetyThreshold = safetyThreshold

    // Populate toolbox
    if (Object.keys(toolbox).length === 0) {
      this.toolbox = new Toolbox(this.grid.unvoid.unfrozen.cells)
    } else {
      this.toolbox = toolbox
    }

    // Initiate game state
    this.gameState = new GameState(this.goals, this.grid.mines.cells, [], this.safetyThreshold)

    // Remove toolbox cells from grid
    // this.grid.resetUnfrozen()
  }

  /**
   * Shortand for checking if the toolbox has available elements
   * @param element
   * @returns number of available elements in the toolbox
   */
  public isAvailable(cell: Cell): boolean {
    return this.toolbox.available(cell.element.name) > 0
  }

  /**
   * String output of a level
   * @returns a string describing the level
   */
  public toString(): string {
    let result = `LEVEL: ${this.name} [${this.grid.cols}x${this.grid.rows}]\n`
    result += `DESC: ${this.description}\n`
    result += `GROUP: ${this.group}\n`
    result += `${this.grid.toString()}\n`
    result += `GOALS: ${this.goals.map((i): string => i.toString())}\n`
    result += `HINTS: ${this.hints.map((i): string => i.toString())}\n`
    result += `TOOLBOX: ${this.toolbox.toString()}\n`
    return result
  }

  /**
   * Export to an iLevel
   * @returns a level interface of the current level
   */
  public exportLevel(): ILevel {
    return {
      id: this.id,
      name: this.name,
      group: this.group,
      description: this.description,
      grid: this.grid.exportGrid(),
      hints: this.hints.map((hint): IHint => hint.exportHint()),
      goals: this.goals.map((goal): IGoal => goal.exportGoal()),
      tools: this.toolbox.fullCellList.map((cell: Cell): string => cell.element.name),
    }
  }

  /**
   * Export to an iLevel
   * Create the goals from the detector cells with low probability
   * Mark all cells as frozen
   * @returns a level interface of the current level
   */
  public exportLevelForDownload(): ILevel {
    const goals = this.grid.detectors.cells.map((detector: Cell) => {
      return new Goal(detector.coord, 0.001)
    })
    return {
      id: 101,
      name: 'Custom Level',
      group: 'Custom',
      description: '',
      grid: this.grid.exportGridForDownload(),
      hints: this.hints.map((hint): IHint => hint.exportHint()),
      goals: goals.map((goal): IGoal => goal.exportGoal()),
      tools: this.toolbox.fullCellList.map((cell: Cell): string => cell.element.name)
    }
  }

  /**
   * Import a json level
   * @param iLevel a level interface with primitives
   * @returns a Level instance
   */
  public static importLevel(iLevel: ILevel): Level {
    const grid = Grid.importGrid(iLevel.grid)
    const goals = Goal.importGoals(iLevel.goals)
    const hints = Hint.importHint(iLevel.hints)
    const toolbox = Toolbox.importToolbox(iLevel.tools)
    return new Level(
      iLevel.id,
      iLevel.name,
      iLevel.group,
      iLevel.description,
      grid,
      goals,
      hints,
      toolbox,
      iLevel.safetyThreshold
    )
  }

  /**
   * Import a level interface
   * @returns a Level instance
   */
  public static createDummy(): Level {
    return Level.importLevel({
      id: 0,
      name: 'Dummy',
      group: 'Dummy',
      description: 'Dummy level created for placeholders...',
      grid: new Grid(2, 2).exportGrid(),
      goals: [],
      hints: [],
      tools: []
    })
  }
}
