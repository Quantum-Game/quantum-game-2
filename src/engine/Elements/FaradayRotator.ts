import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
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
  public angles: number[] = [0, 90, 180, 270]

  public constructor() {
    super(Elem.FaradayRotator, Group.Polarization)
  }

  public transition(options: TransitionInterface): qt.Operator {
    return qt.faradayRotator(options.rotation)
  }
}
