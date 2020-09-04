import { Elem, Group } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * GATE CLASS
 */
export default class Gate extends Element {
  public name: Elem = Elem.Gate
  public group: Group = Group.Absorption
  public description = 'A gate that can be opened if next to a fed plant.'
  public ascii: string[] = ['M']

  public constructor() {
    super(Elem.Gate, Group.Absorption)
  }
}
