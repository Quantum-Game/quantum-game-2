import * as qt from 'quantum-tensors'
import { Elem, Group, ITransition } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * CORNER CUBE CLASS
 */
export default class CornerCube extends Element {
  public name: Elem = Elem.CornerCube
  public group: Group = Group.Direction
  public description = 'Reflects any incoming photon.'
  public ascii: string[] = ['*']

  public allowedRotations: number[] = [0]
  public allowedPolarizations: number[] = []
  public allowedPercentages: number[] = []

  public constructor() {
    super(Elem.CornerCube, Group.Direction)
  }

  /* eslint-disable-next-line */
  public transition(options: ITransition): qt.Operator {
    return qt.Elements.cornerCube()
  }
}
