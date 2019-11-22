import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * WALL CLASS
 */
export default class Wall extends Element {
  name: Elem = Elem.Wall;
  group: Group = Group.Absorption;
  description: string = 'Another brick in the wall.';
  ascii: string[] = ['▓'];
  angles: number[] = [0];

  constructor() {
    super(Elem.Wall, Group.Absorption);
  }

  transition() {
    return qt.attenuator(0);
  }
}
