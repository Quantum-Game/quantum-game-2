import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * QUARTER WAVE PLATE CLASS
 */
export default class QuarterWavePlate extends Element {
  public name: Elem = Elem.QuarterWavePlate
  public group: Group = Group.Polarization
  public description =
    'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.'

  public ascii: string[] = ['🡢', '🡥', '🡢', '🡥']
  public angles: number[] = [0, 90, 180, 270]

  public polarization = 0

  public constructor(polarization = 0) {
    super(Elem.QuarterWavePlate, Group.Polarization)
    this.polarization = polarization
  }

  public transition(options: ITransition): qt.Operator {
    if (options.rotation === 90 || options.rotation === 270) {
      return qt.Elements.quarterWavePlateNS(options.polarization)
    }
    return qt.Elements.quarterWavePlateWE(options.polarization)
  }
}
