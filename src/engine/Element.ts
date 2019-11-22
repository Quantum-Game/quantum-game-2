import * as qt from 'quantum-tensors';
import { Elem, Group } from './interfaces';

/**
 * ELEMENT CLASS
 * Used by the cell to compute the transition matrices
 */
export default class Element {
  name: Elem;
  group: Group;
  description: string;
  ascii: string[];
  angles: number[];
  polarization: number;
  percentage: number;

  constructor(
    name: Elem,
    group: Group,
    description = '',
    ascii: string[] = ['>', '^', '<', 'v'],
    angles: number[] = [0, 90, 180, 270],
    polarization: number = 0,
    percentage: number = 0
  ) {
    this.name = name;
    this.group = group;
    this.description = description;
    this.ascii = ascii;
    this.angles = angles;
    this.polarization = polarization;
    this.percentage = percentage;
  }

  /**
   * Compute the rotation angles from the number of tiles
   * @returns amount to rotate the element
   */
  get rotationAngle(): number {
    return 360 / this.angles.length;
  }

  /**
   * Override toString() method
   * @returns string describing element
   */
  toString(): string {
    return this.name;
  }

  /**
   * Transition is a member of extended element classes
   * FIXME: Find a way to drill through child classes
   *
   * Return quantum operators to be applied to states
   * @param param parameters to pass for operator creation
   * @returns operator
   */
  transition(rotation: number, polarization: number, percentage: number): qt.Operator {
    switch (this.name) {
      case Elem.Absorber:
        // return qt.attenuator(percentage);
        return qt.attenuator(Math.SQRT1_2);

      case Elem.BeamSplitter:
        return qt.beamSplitter(rotation);

      case Elem.CoatedBeamSplitter:
        return qt.beamSplitter(rotation);

      case Elem.CornerCube:
        return qt.cornerCube();

      case Elem.Detector:
        return qt.attenuator(0);

      case Elem.DetectorFour:
        return qt.attenuator(0);

      case Elem.FaradayRotator:
        return qt.faradayRotator(rotation);

      case Elem.Gate:
        return qt.attenuator(0);

      case Elem.Glass:
        return qt.glassSlab();

      case Elem.Laser:
        return qt.attenuator(0);

      case Elem.Mine:
        return qt.attenuator(0);

      case Elem.Mirror:
        return qt.mirror(rotation);

      case Elem.NonLinearCrystal:
        return qt.attenuator(1);

      case Elem.QuarterWavePlate:
        if (rotation === 0) {
          return qt.quarterWavePlateWE(rotation);
        }
        return qt.quarterWavePlateNS(rotation);

      case Elem.Polarizer:
        return qt.polarizer(rotation, polarization);

      case Elem.PolarizingBeamSplitter:
        if (rotation === 0) {
          return qt.polarizingBeamsplitter(135);
        }
        return qt.polarizingBeamsplitter(45);

      case Elem.Rock:
        return qt.attenuator(0);

      case Elem.SugarSolution:
        // return qt.sugarSolution(percentage);
        return qt.sugarSolution(0.125);

      case Elem.VacuumJar:
        return qt.vacuumJar();

      case Elem.Void:
        return qt.attenuator(1);

      case Elem.Wall:
        return qt.attenuator(0);

      default:
        throw new Error(`Element ${this.name} not included in quantum-tensors operators..`);
    }
  }
}
