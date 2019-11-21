import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * VOID CLASS
 */
export default class Void extends Element {
  name: string = Elem.Void;
  group: string = Group.Basic;
  description: string = 'The void...';
  ascii: string[] = ['.'];

  constructor() {
    super(Elem.Void, Group.Basic);
  }

  transition() {
    return qt.attenuator(1);
  }
}
