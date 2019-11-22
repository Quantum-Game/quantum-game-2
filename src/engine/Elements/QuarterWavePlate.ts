import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * QUARTER WAVE PLATE CLASS
 */
export default class QuarterWavePlate extends Element {
  name: Elem = Elem.QuarterWavePlate;
  group: Group = Group.Polarization;
  description: string =
    'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.';
  ascii: string[] = ['🡢', '🡥', '🡢', '🡥'];
  angles: number[] = [0, 90, 180, 270];

  polarization: number = 0;

  constructor(polarization: number = 0) {
    super(Elem.QuarterWavePlate, Group.Polarization);
    this.polarization = polarization;
  }

  transition(rotation: number = 0, polarization: number = this.polarization) {
    if (rotation === 90 || rotation === 270) {
      return qt.quarterWavePlateNS(polarization);
    }
    return qt.quarterWavePlateWE(polarization);
  }
}
