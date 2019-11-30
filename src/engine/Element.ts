import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from './interfaces'

/**
 * ELEMENT CLASS
 * Used by the cell to compute the transition matrices
 */
export default class Element {
  name: Elem
  group: Group
  description: string
  ascii: string[]
  angles: number[]
  polarization: number
  percentage: number

  constructor(
    name: Elem,
    group: Group,
    description = '',
    ascii: string[] = ['>', '^', '<', 'v'],
    angles: number[] = [0, 90, 180, 270],
    polarization: number = 0,
    percentage: number = 0
  ) {
    this.name = name
    this.group = group
    this.description = description
    this.ascii = ascii
    this.angles = angles
    this.polarization = polarization
    this.percentage = percentage
  }

  /**
   * Compute the rotation angles from the number of tiles
   * @returns amount to rotate the element
   */
  get rotationAngle(): number {
    return 360 / this.angles.length
  }

  /**
   * Override toString() method
   * @returns string describing element
   */
  toString(): string {
    return this.name
  }

  /**
   * Will be overriden by child transition
   */
  transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(0)
  }
}
