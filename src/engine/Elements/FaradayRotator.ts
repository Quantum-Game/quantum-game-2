import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * FARADAY ROTATOR CLASS
 */
export default class FaradayRotator extends Element {
  public name: Elem = Elem.FaradayRotator
  public group: Group = Group.Polarization
  public description =
    'Rotates polarization with magnetic field by 45°. Has different symmetries than Sugar Solution. A building block for optical diodes.'

  public ascii: string[] = ['🠶', '🠵', '🠴', '🠷']

  public allowedRotations: number[] = [0, 90, 180, 270]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = [0, 0.125, 0.25]

  public constructor() {
    super(Elem.FaradayRotator, Group.Polarization)
  }

  // TODO: Implement active/inactive if linked to a detector
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.faradayRotator(options.rotation, options.percentage)
  }
}
