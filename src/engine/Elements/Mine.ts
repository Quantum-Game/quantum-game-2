import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * MINE CLASS
 */
export default class Mine extends Element {
  public name: Elem = Elem.Mine
  public group: Group = Group.Absorption
  public description =
    'Once it absorbs a single photon, it sets off. Old french submarine captains can sometimes disarm them.'

  public ascii: string[] = ['!']
  public angles: number[] = [0]

  public constructor() {
    super(Elem.Mine, Group.Absorption)
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.attenuator(0)
  }
}
