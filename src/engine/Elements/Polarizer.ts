import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * POLARIZER CLASS
 */
export default class Polarizer extends Element {
  public name: Elem = Elem.Polarizer
  public group: Group = Group.Polarization
  public description =
    'A polarization filter... Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.'

  public ascii: string[] = ['🡢', '🡥', '🡢', '🡥']
  public angles: number[] = [0, 90, 180, 270]

  public polarization = 0

  public constructor(polarization = 0) {
    super(Elem.Polarizer, Group.Polarization)
    this.polarization = polarization
  }

  public transition(options: ITransition): qt.Operator {
    return qt.polarizer(options.rotation, options.polarization)
  }
}
