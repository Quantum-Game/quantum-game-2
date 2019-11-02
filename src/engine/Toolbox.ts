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

  constructor(tools: Cell[]) {
    const elements = tools.map((cell) => cell.element.name);
    this.toolbox = countBy(elements);
  }

  /**
   * @returns names of present elements
   */
  get names(): string[] {
    return Object.keys(this.toolbox);
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  getCount(name: string): number {
    return this.toolbox[name];
  }

  /**
   * Add a tool to the toolbox
   * @param cell cell holding element to remove
   */
  addTool(cell: Cell) {
    const { name } = cell.element;
    this.toolbox[name] += 1;
  }

  /**
   * Remove element from toolbox
   * @param cell cell holdeing element to remove
   */
  removeTool(cell: Cell) {
    const { name } = cell.element;
    this.toolbox[name] -= 1;
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
