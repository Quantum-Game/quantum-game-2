import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * MIRROR CLASS
 */
export default class Mirror extends Element {
  name: string = Elem.Mirror;
  group: string = Group.Direction;
  description: string = 'Metallic or dielectric mirror.';
  ascii: string[] = ['-', '/', '|', '\\', '-', '/', '|', '\\'];

  rotation: number = 0;

  constructor(rotation: number = 0) {
    super(Elem.Mirror, Group.Direction);
    this.rotation = rotation;
  }

  transition() {
    return qt.mirror(this.rotation);
  }
}
