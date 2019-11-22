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

  rotation: number = 0;
  polarization: number = 0;

  constructor(rotation: number = 0, polarization: number = 0) {
    super(Elem.QuarterWavePlate, Group.Polarization);
    this.rotation = rotation;
    this.polarization = polarization;
  }

  transition() {
    if (this.rotation === 90 || this.rotation === 270) {
      return qt.quarterWavePlateNS(this.polarization);
    }
    return qt.quarterWavePlateWE(this.polarization);
  }
}
