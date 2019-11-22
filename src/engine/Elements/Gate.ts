import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * GATE CLASS
 */
export default class Gate extends Element {
  name: Elem = Elem.Gate;
  group: Group = Group.Absorption;
  description: string = 'A gate that can be opened if next to a fed plant.';
  ascii: string[] = ['M'];

  constructor() {
    super(Elem.Gate, Group.Absorption);
  }

  transition(options: TransitionInterface) {
    return qt.attenuator(0);
  }
}
