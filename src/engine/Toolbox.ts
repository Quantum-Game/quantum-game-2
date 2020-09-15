import { countBy } from 'lodash'
import { Elem, elemFromString } from './interfaces'
import { isDef, isNotString } from '@/types'
/**
 * TOOL INTERFACE
 * Contains number of available elements to the player
 */
type ToolMap = Map<Elem, number>

/**
 * TOOLBOX CLASS
 * Inventory contains the list of elements available to the player.
 */
export default class Toolbox {
  public toolbox: ToolMap = new Map()
  private originalToolbox: ToolMap = new Map()

  public constructor(elements: Elem[]) {
    const elems = Object.values(Elem).filter(isNotString)
    const counts = countBy(elements)

    for (const elem of elems) {
      this.toolbox.set(elem, counts[elem] || 0)
      this.originalToolbox.set(elem, counts[elem] || 0)
    }
  }

  /**
   * @returns names of present elements
   */
  public get present(): Elem[] {
    const present: Elem[] = []
    for (const [k, v] of this.toolbox.entries()) {
      if (v > 0) present.push(k)
    }
    return present
  }

  /**
   * @returns names of originally elements
   */
  public originallyPresent(): Elem[] {
    const present: Elem[] = []
    for (const [k, v] of this.originalToolbox.entries()) {
      if (v > 0) present.push(k)
    }
    return present
  }

  /**
   * Reset toolbox to original state
   */
  public reset(): void {
    this.toolbox = new Map()
    for (const [k, v] of this.originalToolbox.entries()) {
      this.toolbox.set(k, v)
    }
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  public getCount(elem: Elem): number {
    return this.toolbox.get(elem) || 0
  }

  /**
   * @params name
   * @returns count of available elements in toolbox
   */
  public getCountOriginal(elem: Elem): number {
    return this.originalToolbox.get(elem) || 0
  }

  /**
   * Returns the available elements
   * @param elem elements available
   */
  public available(elem: Elem): number {
    return this.getCount(elem)
  }

  /**
   * Add a tool to the toolbox
   * TODO: Check if need to compare to original toolbox
   * @param cell cell holding element to remove
   */
  public addTool(elem: Elem): void {
    this.toolbox.set(elem, this.getCount(elem) + 1)
  }

  /**
   * Remove element from toolbox
   * @param cell cell holdeing element to remove
   */
  public removeTool(elem: Elem): void {
    this.toolbox.set(elem, Math.max(0, this.getCount(elem) - 1))
  }

  /**
   * Create list of available tools
   */
  public fullElemList(): Elem[] {
    return this.present.flatMap((name) => Array(this.getCount(name)).fill(name))
  }

  /**
   * Override toString() method
   * Display toolbox content
   * @returns string
   */
  public toString(): string {
    let resultStr = 'Toolbox contains:\n'
    this.present.forEach((elem) => {
      resultStr += ` - ${Elem[elem]} x ${this.getCount(elem)}\n`
    })
    return resultStr
  }

  public exportToolbox(): string[] {
    return this.fullElemList().map((elem: Elem) => Elem[elem] as string)
  }

  public static importToolbox(tools: string[]): Toolbox {
    return new Toolbox(tools.map(elemFromString).filter(isDef))
  }
}
