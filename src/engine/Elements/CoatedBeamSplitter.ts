import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * COATED BEAM SPLITTER CLASS
 */
export default class CoatedBeamSplitter extends Element {
  name: Elem = Elem.CoatedBeamSplitter;
  group: Group = Group.Direction;
  description: string =
    'A thin slab of glass with a reflective layer - reflecting half the beam and transmitting the other half of it.';
  ascii: string[] = ['⇒', '⇗', '⇑', '⇖', '⇐', '⇙', '⇓', '⇘'];
  angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315];

  constructor() {
    super(Elem.CoatedBeamSplitter, Group.Direction);
  }

  // FIXME: Add qt operator for coated beam splitter, using beamsplitter meanwhile
  transition(options: TransitionInterface): qt.Operator {
    return qt.beamSplitter(options.rotation);
  }
}
