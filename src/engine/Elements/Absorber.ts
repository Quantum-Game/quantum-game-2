import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * ABSORBER CLASS
 */
export default class Absorber extends Element {
  public name: Elem = Elem.Absorber
  public group: Group = Group.Absorption
  public description = 'Filter with 50% absorption probability.'
  public ascii: string[] = ['A']

  public allowedPolarizations: number[] = []
  public allowedRotations: number[] = [0]
  public allowedPercentages: number[] = [0, 0.5, Math.SQRT1_2, 1]

  public percentage = Math.SQRT1_2

  /**
   * Check for allowed value of percentage
   * @param percentage
   */
  public constructor(percentage: number = Math.SQRT1_2) {
    super(Elem.Absorber, Group.Absorption)
    if (this.allowedPercentages.includes(percentage)) {
      this.percentage = percentage
    } else {
      throw new Error(`Percentage ${percentage} not in allowed range.`)
    }
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.attenuator(options.percentage)
  }
}
