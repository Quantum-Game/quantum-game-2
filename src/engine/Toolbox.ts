import countBy from 'lodash.countby';
import Cell from './Cell';
/**
 * TOOL INTERFACE
 * Contains number of available elements to the player
 */
export interface ToolInterface {
  [symbol: string]: number;
}

/**
 * TOOLBOX CLASS
 * Inventory contains the list of elements available to the player.
 */
export default class Toolbox {
  tools: Cell[] = [];
  toolbox: ToolInterface = {};
  originalToolbox: ToolInterface = {};

  constructor(tools: Cell[]) {
    const elements = tools.map((cell) => cell.element.name);
    this.toolbox = countBy(elements);
    this.originalToolbox = this.toolbox;
  }

  /**
   * @returns names of present elements
   */
  get names(): string[] {
    return Object.keys(this.toolbox);
  }

  /**
   * Reset toolbox to original state
   */
  reset(): void {
    this.toolbox = this.originalToolbox;
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  getCount(name: string): number {
    return this.toolbox[name];
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  getCountOriginal(name: string): number {
    return this.originalToolbox[name];
  }

  /**
   * Add a tool to the toolbox
   * @param cell cell holding element to remove
   */
  addTool(cell: Cell) {
    const { name } = cell.element;
    if (this.toolbox[name] < this.originalToolbox[name]) {
      this.toolbox[name] += 1;
    }
  }

  /**
   * Remove element from toolbox
   * @param cell cell holdeing element to remove
   */
  removeTool(cell: Cell) {
    const { name } = cell.element;
    if (this.toolbox[name] > 0) {
      this.toolbox[name] -= 1;
    }
  }

  /**
   * Create cell cluster from tools
   * @returns cell[]
   */
  get uniqueCellList(): Cell[] {
    return this.names.map((name) => {
      return Cell.createToolboxCell(name);
    });
  }

  /**
   * Create cell cluster from tools
   * @returns cell[]
   */
  get fullCellList(): Cell[] {
    const fullList: Cell[] = [];
    this.names.forEach((name) => {
      const cellCount = this.toolbox[name];
      for (let i = 0; i < cellCount; i += 1) {
        fullList.push(Cell.createToolboxCell(name));
      }
    });
    return fullList;
  }

  /**
   * Override toString() method
   * Display toolbox content
   * @returns string
   */
  toString(): string {
    let resultStr = 'Toolbox contains:\n';
    this.names.forEach((name: string) => {
      resultStr += `Tool: ${name} x ${this.toolbox[name]}`;
    });
    return resultStr;
  }
}
