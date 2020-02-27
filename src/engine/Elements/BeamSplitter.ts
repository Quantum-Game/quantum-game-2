import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
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

  public allowedRotations: number[] = [0, 45, 90, 135, 180, 225, 270, 315]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = [0, 0.25, 0.5, 0.75, 1]

  public percentage = 0.5

  public constructor(percentage = 0.5) {
    super(Elem.BeamSplitter, Group.Direction)
    this.percentage = percentage
  }

  public transition(options: ITransition): qt.Operator {
    return qt.Elements.beamSplitter(options.rotation)
  }
}
