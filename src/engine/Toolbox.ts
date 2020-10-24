import { countBy } from 'lodash'
import { Elem, exportElem, importElem } from './model'
import { isDef, isNotString } from '@/types'
import { iFilterMap } from '@/itertools'
/**
 * TOOLBOX CLASS
 * Inventory contains the list of elements available to the player.
 */
export default class Toolbox {
  readonly tools: Map<Elem, number> = new Map()

  public constructor(elements: Elem[], infinite = true) {
    const elems = Object.values(Elem).filter(isNotString)
    const counts = countBy(elements)

    for (const elem of elems) {
      const count = counts[elem] ?? 0
      this.tools.set(elem, infinite && count > 0 ? Infinity : count)
    }
  }

  initializedEmpty(): boolean {
    return this.tools.size === 0
  }

  /**
   * @returns names of present elements
   */
  present(): Elem[] {
    return Array.from(iFilterMap(this.tools.entries(), ([k, v]) => (v > 0 ? k : null)))
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  getCount(elem: Elem): number {
    return this.tools.get(elem) || 0
  }

  /**
   * Add a tool to the toolbox
   * TODO: Check if need to compare to original toolbox
   * @param cell cell holding element to remove
   */
  addTool(elem: Elem): void {
    this.tools.set(elem, this.getCount(elem) + 1)
  }

  /**
   * Remove element from toolbox
   * @param cell cell holdeing element to remove
   * @returns element successfuly removed
   */
  removeTool(elem: Elem): boolean {
    const count = this.getCount(elem)
    if (count > 0) {
      this.tools.set(elem, count - 1)
      return true
    }
    return false
  }

  /**
   * Create list of available tools
   */
  public fullElemList(): Elem[] {
    return this.present().flatMap((name) => Array(this.getCount(name)).fill(name))
  }

  /**
   * Override toString() method
   * Display toolbox content
   * @returns string
   */
  public toString(): string {
    let resultStr = 'Toolbox contains:\n'
    this.present().forEach((elem) => {
      resultStr += ` - ${Elem[elem]} x ${this.getCount(elem)}\n`
    })
    return resultStr
  }

  public static import(tools: unknown[], infinite = false): Toolbox {
    return new Toolbox(tools.map(importElem).filter(isDef), infinite)
  }

  public export(): string[] {
    return this.fullElemList().map(exportElem)
  }
}
