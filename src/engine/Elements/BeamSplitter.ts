import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * BEAMSPLITTER CLASS
 */
export default class BeamSplitter extends Element {
  public name: Elem = Elem.BeamSplitter
  public group: Group = Group.Direction
  public description =
    'A thin slab of glass reflecting half the beam, and transmitting other half of it.'

  public ascii: string[] = ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘']
  public angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315]

  public percentage = 50

  public constructor(percentage = 50) {
    super(Elem.BeamSplitter, Group.Direction)
    this.percentage = percentage
  }

  public transition(options: TransitionInterface): qt.Operator {
    return qt.beamSplitter(options.rotation)
  }
}
