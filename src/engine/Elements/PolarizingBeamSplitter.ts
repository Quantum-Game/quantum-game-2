import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * POLARIZING BEAM SPLITTER CLASS
 */
export default class PolarizingBeamSplitter extends Element {
  public name: Elem = Elem.PolarizingBeamSplitter
  public group: Group = Group.Direction
  public description = 'Reflects vertical polarization (↕), transmits horizonal polarization (↔).'

  public ascii: string[] = ['⬲', '⟴']

  public allowedRotations: number[] = [0, 90, 180, 270]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = []

  public constructor() {
    super(Elem.PolarizingBeamSplitter, Group.Direction)
  }

  public transition(options: ITransition): qt.Operator {
    return qt.Elements.polarizingBeamsplitter(options.rotation)
  }
}
