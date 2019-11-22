import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * FARADAY ROTATOR CLASS
 */
export default class FaradayRotator extends Element {
  name: Elem = Elem.FaradayRotator;
  group: Group = Group.Polarization;
  description: string =
    'Rotates polarization with magnetic field by 45°. Has different symmetries than Sugar Solution. A building block for optical diodes.';
  ascii: string[] = ['🠶', '🠵', '🠴', '🠷'];
  angles: number[] = [0, 90, 180, 270];

  rotation: number = 0;

  constructor(rotation: number = 0) {
    super(Elem.FaradayRotator, Group.Polarization);
    this.rotation = rotation;
  }

  transition() {
    return qt.faradayRotator(this.rotation);
  }
}
