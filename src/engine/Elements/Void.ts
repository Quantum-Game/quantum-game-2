import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * VOID CLASS
 */
export default class Void extends Element {
  public name: Elem = Elem.Void
  public group: Group = Group.Basic
  public description = 'The void...'
  public ascii: string[] = ['.']
  public angles: number[] = [0]

  public constructor() {
    super(Elem.Void, Group.Basic)
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.attenuator(1)
  }
}
