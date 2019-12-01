import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * CORNER CUBE CLASS
 */
export default class CornerCube extends Element {
  public name: Elem = Elem.CornerCube
  public group: Group = Group.Direction
  public description: string = 'Reflects any incoming photon.'
  public ascii: string[] = ['*']
  public angles: number[] = [0]

  public constructor() {
    super(Elem.CornerCube, Group.Direction)
  }

  public transition(options: TransitionInterface): qt.Operator {
    return qt.cornerCube()
  }
}
