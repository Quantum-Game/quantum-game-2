import _ from 'lodash'
import Coord from '@/engine/Coord'
import Cell from '@/engine/Cell'
/**
 * TOOL INTERFACE
 * Contains number of available elements to the player
 */
export interface ITool {
  [symbol: string]: number
}

/**
 * TOOLBOX CLASS
 * Inventory contains the list of elements available to the player.
 */
export default class Toolbox {
  public tools: Cell[] = []
  public toolbox: ITool = {}
  private originalToolbox: ITool = {}

  public constructor(tools: Cell[]) {
    const elements = tools.map((cell): string => cell.element.name)
    this.toolbox = _.countBy(elements)
    this.originalToolbox = _.cloneDeep(this.toolbox)
  }

  /**
   * @returns names of present elements
   */
  public get names(): string[] {
    return Object.keys(this.toolbox)
  }

  /**
   * Reset toolbox to original state
   */
  public reset(): void {
    this.toolbox = this.originalToolbox
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  public getCount(name: string): number {
    return this.toolbox[name]
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  public getCountOriginal(name: string): number {
    return this.originalToolbox[name]
  }

  /**
   * Returns the available elements
   * @param name elements available
   */
  public available(name: string): number {
    return this.getCount(name)
  }

  /**
   * Add a tool to the toolbox
   * TODO: Check if need to compare to original toolbox
   * @param cell cell holding element to remove
   */
  public addTool(cell: Cell, activeCell: Cell): void {
    const { name } = activeCell.element
    this.toolbox[name] += 1
  }

  /**
   * Remove element from toolbox
   * @param cell cell holdeing element to remove
   */
  public removeTool(cell: Cell): void {
    const { name } = cell.element
    if (this.toolbox[name] > 0) {
      this.toolbox[name] -= 1
    }
  }

  /**
   * Create cell cluster from tools
   * @returns cell[]
   */
  public get uniqueCellList(): Cell[] {
    return this.names.map(
      (name): Cell => {
        return Cell.createToolboxCell(name)
      }
    )
  }

  /**
   * Create cell cluster from tools
   * @returns cell[]
   */
  public get fullCellList(): Cell[] {
    const fullList: Cell[] = []
    this.names.forEach((name): void => {
      const cellCount = this.toolbox[name]
      for (let i = 0; i < cellCount; i += 1) {
        fullList.push(Cell.createToolboxCell(name))
      }
    })
    return fullList
  }

  /**
   * Override toString() method
   * Display toolbox content
   * @returns string
   */
  public toString(): string {
    let resultStr = 'Toolbox contains:\n'
    this.names.forEach((name: string): void => {
      resultStr += `Tool: ${name} x ${this.toolbox[name]}`
    })
    return resultStr
  }

  public exportToolbox(): ITool {
    return this.toolbox
  }

  public static importToolbox(tools: string[]): Toolbox {
    const coord = new Coord(-1, -1)
    const toolCells = tools.map(
      (tool): Cell => {
        const element = Cell.fromName(tool)
        return new Cell(coord, element)
      }
    )
    return new Toolbox(toolCells)
  }
}
