import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * DETECTOR FOUR CLASS
 */
export default class DetectorFour extends Element {
  public name: Elem = Elem.DetectorFour
  public group: Group = Group.Absorption
  public description =
    'Detects and amplifies electric signal from each single photon, from all directions. Typically, it is the goal to get the photon here.'

  public ascii: string[] = ['O']

  public allowedRotations: number[] = [0]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = []

  public constructor() {
    super(Elem.DetectorFour, Group.Absorption)
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.attenuator(0)
  }
}
