import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * POLARIZING BEAM SPLITTER CLASS
 */
export default class PolarizingBeamSplitter extends Element {
  name: Elem = Elem.PolarizingBeamSplitter
  group: Group = Group.Direction
  description: string = 'Reflects vertical polarization (↕), transmitts horizonal polarization (↔).'
  ascii: string[] = ['⬲', '⟴']
  angles: number[] = [0, 180]

  constructor() {
    super(Elem.PolarizingBeamSplitter, Group.Direction)
  }

  // FIXME: Change orientation in quantum-tensors
  transition(options: TransitionInterface): qt.Operator {
    if (options.rotation === 0) {
      return qt.polarizingBeamsplitter(135)
    }
    return qt.polarizingBeamsplitter(45)
  }
}
