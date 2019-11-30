import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * LASER CLASS
 */
export default class Laser extends Element {
  name: Elem = Elem.Laser
  group: Group = Group.Source
  description: string = 'An on-demand single photon source.'
  ascii: string[] = ['>', '^', '<', 'v']
  angles: number[] = [0, 90, 180, 270]

  polarization: number = 0

  constructor(polarization: number = 0) {
    super(Elem.Laser, Group.Source)
    this.polarization = polarization
  }

  transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(0)
  }
}
