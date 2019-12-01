import * as qt from 'quantum-tensors'
import { Elem, Group, TransitionInterface } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * MIRROR CLASS
 */
export default class Mirror extends Element {
  public name: Elem = Elem.Mirror
  public group: Group = Group.Direction
  public description: string = 'Metallic or dielectric mirror.'
  public ascii: string[] = ['-', '/', '|', '\\', '-', '/', '|', '\\']
  public angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315]

  public constructor() {
    super(Elem.Mirror, Group.Direction)
  }

  public transition(options: TransitionInterface): qt.Operator {
    return qt.mirror(options.rotation)
  }
}
