import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * MIRROR CLASS
 */
export default class Mirror extends Element {
  name: Elem = Elem.Mirror;
  group: Group = Group.Direction;
  description: string = 'Metallic or dielectric mirror.';
  ascii: string[] = ['-', '/', '|', '\\', '-', '/', '|', '\\'];
  angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315];

  constructor(rotation: number = 0) {
    super(Elem.Mirror, Group.Direction);
  }

  transition(rotation: number) {
    return qt.mirror(rotation);
  }
}
