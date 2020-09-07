import { Elem, Group } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * LASER CLASS
 */
export default class Laser extends Element {
  public name: Elem = Elem.Laser
  public group: Group = Group.Source
  public description = 'An on-demand single photon source.'
  public ascii: string[] = ['>', '^', '<', 'v']
  public angles: number[] = [0, 90, 180, 270]

  public polarization = 0

  public constructor(polarization = 0) {
    super(Elem.Laser, Group.Source)
    this.polarization = polarization
  }
}
