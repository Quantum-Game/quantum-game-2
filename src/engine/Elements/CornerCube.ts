import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * CORNER CUBE CLASS
 */
export default class CornerCube extends Element {
  name: Elem = Elem.CornerCube;
  group: Group = Group.Direction;
  description: string = 'Reflects any incoming photon.';
  ascii: string[] = ['*'];
  angles: number[] = [0];

  constructor() {
    super(Elem.CornerCube, Group.Direction);
  }

  transition() {
    return qt.cornerCube();
  }
}
