import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * POLARIZING BEAM SPLITTER CLASS
 */
export default class PolarizingBeamSplitter extends Element {
  name: Elem = Elem.PolarizingBeamSplitter;
  group: Group = Group.Direction;
  description: string =
    'Reflects vertical polarization (↕), transmitts horizonal polarization (↔).';
  ascii: string[] = ['⬲', '⟴'];
  angles: number[] = [0, 180];

  rotation: number;

  constructor(rotation: number = 0) {
    super(Elem.PolarizingBeamSplitter, Group.Direction);
    this.rotation = rotation;
  }

  // FIXME: Change orientation in quantum-tensors
  transition() {
    if (this.rotation === 0) {
      return qt.polarizingBeamsplitter(135);
    }
    return qt.polarizingBeamsplitter(45);
  }
}
