import { AbsorptionInterface } from '@/engine/interfaces'
import Cell from './Cell'

/**
 * ABSORPTION CLASS
 * A cell and its probability of absorption
 */
export default class Absorption extends Cell {
  cell: Cell
  probability: number

  constructor(cell: Cell, probability: number) {
    super(cell.coord, cell.element)
    this.cell = cell
    this.probability = probability
  }

  /**
   * Is the particle escaping the grid?
   * @return boolean
   */
  get isEscaping() {
    return this.cell.coord.outOfGrid
  }

  /**
   * Override toString()
   */
  toString() {
    return `Absorbing ${this.probability} at ${this.cell.toString}`
  }

  /**
   * Export absorption as javascript primitives
   * @returns AbsorptionInterface
   */
  exportAbsorption(): AbsorptionInterface {
    return {
      coord: this.cell.coord.exportCoord(),
      probability: this.probability
    }
  }
}
