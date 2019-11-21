import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * CORNER CUBE CLASS
 */
export default class CornerCube extends Element {
  name: string = Elem.CornerCube;
  group: string = Group.Direction;
  description: string = 'Reflects any incoming photon.';
  ascii: string[] = ['*'];

  constructor() {
    super(Elem.CornerCube, Group.Direction);
  }

  transition() {
    return qt.cornerCube();
  }
}
