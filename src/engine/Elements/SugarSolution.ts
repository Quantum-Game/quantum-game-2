import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * SUGAR SOLUTION CLASS
 */
export default class SugarSolution extends Element {
  public name: Elem = Elem.SugarSolution
  public group: Group = Group.Polarization
  public description =
    'Table sugar is a chiral molecule – it does not look the same as its mirror reflection. We put it in an amount, so it rotates polarization by 45°.'

  public ascii: string[] = ['S']
  public angles: number[] = [0]

  public percentage = 0.125

  public constructor(percentage = 0.125) {
    super(Elem.SugarSolution, Group.Polarization)
    this.percentage = percentage
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    // return qt.sugarSolution(options.percentage);
    return qt.sugarSolution(0.125)
  }
}
