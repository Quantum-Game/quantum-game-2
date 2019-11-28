import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * VOID CLASS
 */
export default class Void extends Element {
  name: Elem = Elem.Void;
  group: Group = Group.Basic;
  description: string = 'The void...';
  ascii: string[] = ['.'];
  angles: number[] = [0];

  constructor() {
    super(Elem.Void, Group.Basic);
  }

  transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(1);
  }
}
