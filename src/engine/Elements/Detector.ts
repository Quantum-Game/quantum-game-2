import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * DETECTOR CLASS
 */
export default class Detector extends Element {
  public name: Elem = Elem.Detector
  public group: Group = Group.Absorption
  public description: string =
    'Detects and amplifies electric signal from each single photon, from a single direction. Your goal is to get photon there!'

  public ascii: string[] = ['⭲', '⭱', '⭰', '⭳']
  public angles: number[] = [0, 90, 180, 270]

  public constructor() {
    super(Elem.Detector, Group.Absorption)
  }

  /* eslint-disable-next-line */
  public transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(0)
  }
}
