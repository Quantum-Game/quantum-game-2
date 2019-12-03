import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from './interfaces'

/**
 * ELEMENT CLASS
 * Used by the cell to compute the transition matrices
 */
export default class Element {
  public name: Elem
  public group: Group
  public description: string
  public ascii: string[]
  public angles: number[]
  public polarization: number
  public percentage: number

  public constructor(
    name: Elem,
    group: Group,
    description = '',
    ascii: string[] = ['>', '^', '<', 'v'],
    angles: number[] = [0, 90, 180, 270],
    polarization = 0,
    percentage = 0
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
  public get rotationAngle(): number {
    return 360 / this.angles.length
  }

  /**
   * Override toString() method
   * @returns string describing element
   */
  public toString(): string {
    return this.name
  }

  /**
   * Will be overriden by child transition
   */
  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.attenuator(0)
  }
}
