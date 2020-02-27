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
  public polarization: number
  public percentage: number

  public allowedRotations: number[]
  public allowedPolarizations: number[]
  public allowedPercentages: number[]

  public constructor(
    name: Elem,
    group: Group,
    description = '',
    ascii: string[] = ['>', '^', '<', 'v'],
    polarization = 0,
    percentage = 0,
    allowedRotations = [0],
    allowedPolarizations = [],
    allowedPercentages = []
  ) {
    this.name = name
    this.group = group
    this.description = description
    this.ascii = ascii
    this.polarization = polarization
    this.percentage = percentage
    this.allowedRotations = allowedRotations
    this.allowedPolarizations = allowedPolarizations
    this.allowedPercentages = allowedPercentages
  }

  /**
   * Compute the rotation angles from the number of tiles
   * @returns amount to rotate the element
   */
  public get rotationAngle(): number {
    return 360 / this.allowedRotations.length
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
    return qt.Elements.attenuator(0)
  }
}
