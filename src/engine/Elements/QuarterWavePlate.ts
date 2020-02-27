import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * QUARTER WAVE PLATE CLASS
 * TODO: Rename QuarterWavePlate to phasePlate
 */
export default class QuarterWavePlate extends Element {
  public name: Elem = Elem.QuarterWavePlate
  public group: Group = Group.Polarization
  public description =
    'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.'

  public ascii: string[] = ['🡢', '🡥', '🡢', '🡥']

  public allowedRotations: number[] = [0, 90, 180, 270]
  public allowedPolarizations: number[] = [0, 0.125, 0.25, 0.375, 0.5]
  public allowedPercentages: number[] = [0.125, 0.25]

  public constructor(polarization = 0) {
    super(Elem.QuarterWavePlate, Group.Polarization)
    this.polarization = polarization
  }

  public transition(options: ITransition): qt.Operator {
    // TODO: See polarizations conventions in qt
    return qt.Elements.phasePlate(options.rotation, options.polarization, options.percentage)
  }
}
