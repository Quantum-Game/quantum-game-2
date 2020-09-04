import { Elem, Group } from '@/engine/interfaces'
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
  public angles: number[] = [0]

  public constructor() {
    super(Elem.DetectorFour, Group.Absorption)
  }
}
