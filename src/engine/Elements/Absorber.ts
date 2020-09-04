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
  public angles: number[] = [0]

  public percentage: number = Math.SQRT1_2

  public constructor(percentage: number = Math.SQRT1_2) {
    super(Elem.Absorber, Group.Absorption)
    this.percentage = percentage
  }
}
