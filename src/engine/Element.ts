// TODO: Remove display logic to Glyph class
// TODO: Refactor to extended class based logic
import * as qt from 'quantum-tensors';
import { ElementInterface, Elem } from './interfaces';
import jsonElements from './dataElements';

/**
 * Class responsible for elements
 * Rendering abstraction should be moved to Glyph
 */
export default class Element {
  id: number;
  name: string;
  group: string;
  description: string;
  active: boolean;
  absorption: number;
  phase: number;
  ascii: string[];

  constructor(
    id: number,
    name: string,
    group: string,
    description = '',
    active = false,
    absorption = 0,
    phase = 0,
    ascii: string[] = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
  ) {
    this.id = id;
    this.name = name;
    this.group = group;
    this.description = description;
    this.active = active;
    this.absorption = absorption;
    this.phase = phase;
    this.ascii = ascii;
  }

  /**
   * Return quantum operators to be applied to states
   * @param param parameters to pass for operator creation
   * @returns operator
   */
  transition(param: number): qt.Operator {
    switch (this.name) {
      case Elem.Mirror:
        return qt.mirror(param);
      case Elem.CornerCube:
        return qt.cornerCube();
      case Elem.BeamSplitter:
        return qt.beamSplitter(param);
      case Elem.Absorber:
        return qt.attenuator(Math.SQRT1_2);
      case Elem.VacuumJar:
        return qt.vacuumJar();
      case Elem.Glass:
        return qt.glassSlab();
      case Elem.Detector:
        return qt.attenuator(0);
      case Elem.DetectorFour:
        return qt.attenuator(0);
      case Elem.Laser:
        return qt.attenuator(1);
      case Elem.NonLinearCrystal:
        return qt.attenuator(1);
      case Elem.Void:
        return qt.attenuator(1);
      case Elem.SugarSolution:
        return qt.sugarSolution(0.125);
      case Elem.PolarizingBeamSplitter:
        if (param === 0) {
          return qt.polarizingBeamsplitter(135);
        }
        return qt.polarizingBeamsplitter(45);
      case Elem.PolarizerH:
        return qt.quarterWavePlateWE(param);
      case Elem.PolarizerV:
        return qt.quarterWavePlateNS(param);
      case Elem.QuarterWavePlateH:
        return qt.quarterWavePlateWE(param);
      case Elem.QuarterWavePlateV:
        return qt.quarterWavePlateNS(param);
      case Elem.FaradayRotator:
        return qt.faradayRotator(param, 0);
      case Elem.Mine:
        return qt.attenuator(0);
      case Elem.Rock:
        return qt.attenuator(0);
      case Elem.Wall:
        return qt.attenuator(0);
      default:
        throw new Error(`Element ${this.name} not included in quantum-tensors operators..`);
    }
  }

  /**
   * Compute the rotation angles from the number of tiles
   * TODO: Find a better way
   * @returns amount to rotate the element
   */
  get rotationAngle(): number {
    return 360 / this.ascii.length;
  }

  /**
   * Override toString() method
   * @returns string describing element
   */
  toString(): string {
    return `${this.name} (Phase: ${this.phase}, Absorption: ${this.absorption * 100}%)`;
  }

  /**
   * Export element in primitives
   * @returns ElementInterface
   */
  exportElement(): ElementInterface {
    return {
      id: this.id,
      name: this.name,
      group: this.group,
      description: this.description,
      active: this.active,
      absorption: this.absorption,
      phase: this.phase,
      ascii: this.ascii
    };
  }

  /**
   * Create an element from an interface
   * @param obj Create element from interface
   */
  static importElement(obj: ElementInterface): Element {
    return new Element(
      obj.id,
      obj.name,
      obj.group,
      obj.description,
      obj.active,
      obj.absorption,
      obj.phase,
      obj.ascii
    );
  }

  /**
   * Returns an element from its name
   * @param name Element from enum of element names
   * @returns Element
   */
  static fromName(name: string): Element {
    const element = jsonElements.find((elem) => {
      return elem.name === name;
    });
    if (element) {
      return Element.importElement(element!);
    }
    throw new Error(`Element: ${name} is not implemented.`);
  }
}
