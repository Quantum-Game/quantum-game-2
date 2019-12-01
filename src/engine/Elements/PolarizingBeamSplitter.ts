import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * POLARIZING BEAM SPLITTER CLASS
 */
export default class PolarizingBeamSplitter extends Element {
  public name: Elem = Elem.PolarizingBeamSplitter
  public group: Group = Group.Direction
  public description = 'Reflects vertical polarization (↕), transmitts horizonal polarization (↔).'

  public ascii: string[] = ['⬲', '⟴']
  public angles: number[] = [0, 180]

  public constructor() {
    super(Elem.PolarizingBeamSplitter, Group.Direction)
  }

  // FIXME: Change orientation in quantum-tensors
  public transition(options: TransitionInterface): qt.Operator {
    if (options.rotation === 0) {
      return qt.polarizingBeamsplitter(135)
    }
    return qt.polarizingBeamsplitter(45)
  }
}
