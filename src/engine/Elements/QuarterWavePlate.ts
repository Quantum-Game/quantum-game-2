import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * QUARTER WAVE PLATE CLASS
 */
export default class QuarterWavePlate extends Element {
  name: Elem = Elem.QuarterWavePlate
  group: Group = Group.Polarization
  description: string =
    'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.'
  ascii: string[] = ['🡢', '🡥', '🡢', '🡥']
  angles: number[] = [0, 90, 180, 270]

  polarization: number = 0

  constructor(polarization: number = 0) {
    super(Elem.QuarterWavePlate, Group.Polarization)
    this.polarization = polarization
  }

  transition(options: TransitionInterface): qt.Operator {
    if (options.rotation === 90 || options.rotation === 270) {
      return qt.quarterWavePlateNS(options.polarization)
    }
    return qt.quarterWavePlateWE(options.polarization)
  }
}
