// TODO: Add allowed angle property
import { Elem, Group } from './interfaces';
import {
  Absorber,
  BeamSplitter,
  CoatedBeamSplitter,
  CornerCube,
  Detector,
  DetectorFour,
  FaradayRotator,
  Gate,
  Glass,
  Laser,
  Mine,
  Mirror,
  NonLinearCrystal,
  Polarizer,
  QuarterWavePlate,
  Rock,
  SugarSolution,
  VacuumJar,
  Wall,
  Void,
  PolarizingBeamSplitter
} from './Elements/index';

/**
 * ELEMENT CLASS
 * Loads the elements from the JSON file
 */
export default class Element {
  name: Elem;
  group: Group;
  description: string;
  ascii: string[];
  angles: number[];

  constructor(
    name: Elem,
    group: Group,
    description = '',
    ascii: string[] = ['>', '^', '<', 'v'],
    angles: number[] = [0, 90, 180, 270]
  ) {
    this.name = name;
    this.group = group;
    this.description = description;
    this.ascii = ascii;
    this.angles = angles;
  }

  /**
   * Create a instance of the descendant class from Element
   * @param name element name
   * @returns element class instance
   */
  static fromName(name: string): Element {
    switch (name) {
      case Elem.Absorber:
        return new Absorber();
      case Elem.BeamSplitter:
        return new BeamSplitter();
      case Elem.CoatedBeamSplitter:
        return new CoatedBeamSplitter();
      case Elem.CornerCube:
        return new CornerCube();
      case Elem.Detector:
        return new Detector();
      case Elem.DetectorFour:
        return new DetectorFour();
      case Elem.FaradayRotator:
        return new FaradayRotator();
      case Elem.Gate:
        return new Gate();
      case Elem.Glass:
        return new Glass();
      case Elem.Laser:
        return new Laser();
      case Elem.Mine:
        return new Mine();
      case Elem.Mirror:
        return new Mirror();
      case Elem.NonLinearCrystal:
        return new NonLinearCrystal();
      case Elem.Polarizer:
        return new Polarizer();
      case Elem.PolarizingBeamSplitter:
        return new PolarizingBeamSplitter();
      case Elem.QuarterWavePlate:
        return new QuarterWavePlate();
      case Elem.Rock:
        return new Rock();
      case Elem.SugarSolution:
        return new SugarSolution();
      case Elem.VacuumJar:
        return new VacuumJar();
      case Elem.Void:
        return new Void();
      case Elem.Wall:
        return new Wall();
      default:
        throw new Error(`Element ${this.name} not included in quantum-tensors operators..`);
    }
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
}
