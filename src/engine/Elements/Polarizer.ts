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

  public ascii: string[] = ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧']
  public angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315]

  public constructor() {
    super(Elem.Polarizer, Group.Polarization)
  }

  public transition(options: ITransition): qt.Operator {
    return qt.Operator.add([
      qt.Elements.polarizerWE(options.rotation),
      qt.Elements.polarizerNS(options.rotation + 90),
    ])
  }
}
