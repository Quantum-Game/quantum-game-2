import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * ROCK CLASS
 */
export default class Rock extends Element {
  public name: Elem = Elem.Rock
  public group: Group = Group.Absorption
  public description =
    "Dark and immersive as your sweetheart's depth of eyes. Absorbs light. And is sensitive."

  public ascii: string[] = ['♜']
  public angles: number[] = [0]

  public constructor() {
    super(Elem.Laser, Group.Source)
  }

  /* eslint-disable-next-line */
  public transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(0)
  }
}
