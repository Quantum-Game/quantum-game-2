import { Elem, Group } from '@/engine/interfaces'
import Element from '@/engine/Element'

/**
 * COATED BEAM SPLITTER CLASS
 */
export default class CoatedBeamSplitter extends Element {
  public name: Elem = Elem.CoatedBeamSplitter
  public group: Group = Group.Direction
  public description =
    'A thin slab of glass with a reflective layer - reflecting half the beam and transmitting the other half of it.'

  public ascii: string[] = ['⇒', '⇗', '⇑', '⇖', '⇐', '⇙', '⇓', '⇘']
  public angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315]

  public constructor() {
    super(Elem.CoatedBeamSplitter, Group.Direction)
  }
}
