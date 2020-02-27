import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
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

  public allowedRotations: number[] = [0]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = []

  public constructor() {
    super(Elem.Laser, Group.Source)
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.attenuator(0)
  }
}
