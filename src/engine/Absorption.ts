import { IAbsorption } from '@/engine/interfaces'
import Cell from '@/engine/Cell'

/**
 * ABSORPTION CLASS
 * A cell and its probability of absorption
 */
export default class Absorption extends Cell {
  public cell: Cell
  public probability: number

  public constructor(cell: Cell, probability: number) {
    super(cell.coord, cell.element)
    this.cell = cell
    this.probability = probability
  }

  /**
   * Is the particle escaping the grid?
   * @return boolean
   */
  public get isEscaping(): boolean {
    return this.cell.coord.outOfGrid
  }

  /**
   * Override toString()
   */
  public toString(): string {
    return `Absorbing ${this.probability} at ${this.cell.toString}`
  }

  /**
   * Export absorption as javascript primitives
   * @returns IAbsorption
   */
  public exportAbsorption(): IAbsorption {
    return {
      coord: this.cell.coord.exportCoord(),
      probability: this.probability,
    }
  }
}
