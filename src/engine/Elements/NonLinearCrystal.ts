import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * NON LINEAR CRYSTAL CLASS
 */
export default class NonLinearCrystal extends Element {
  public name: Elem = Elem.NonLinearCrystal
  public group: Group = Group.Source
  public description: string = 'A BBO crystal.'
  public ascii: string[] = ['>', '^', '<', 'v']
  public angles: number[] = [0, 90, 180, 270]

  public constructor() {
    super(Elem.NonLinearCrystal, Group.Source)
  }

  public transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(1)
  }
}
