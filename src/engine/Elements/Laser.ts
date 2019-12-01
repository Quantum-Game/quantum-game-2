import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * LASER CLASS
 */
export default class Laser extends Element {
  public name: Elem = Elem.Laser
  public group: Group = Group.Source
  public description: string = 'An on-demand single photon source.'
  public ascii: string[] = ['>', '^', '<', 'v']
  public angles: number[] = [0, 90, 180, 270]

  public polarization: number = 0

  public constructor(polarization: number = 0) {
    super(Elem.Laser, Group.Source)
    this.polarization = polarization
  }

  public transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(0)
  }
}
