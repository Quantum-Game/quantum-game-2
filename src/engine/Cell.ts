import * as qt from 'quantum-tensors';
import {
  CoordInterface,
  CellInterface,
  Elem,
  TransitionInterface,
  IndicatorInterface
} from './interfaces';
import Coord from './Coord';
import Element from './Element';
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
} from '@/engine/Elements/index';
import { angleToSymbol, startingPolarization, startingDirection } from './Helpers';
/**
 * CELL CLASS
 * A cell is a rotated element at a coordinate
 */
export default class Cell {
  coord: Coord;
  element: Element;
  rotation: number;
  polarization: number;
  percentage: number;
  frozen: boolean;
  active: boolean;
  energized: boolean;
  tool: boolean;

  constructor(
    coord: Coord,
    element: Element,
    rotation = 0,
    polarization = 0,
    percentage = 0,
    frozen = false,
    active = false,
    energized = false,
    tool = false
  ) {
    this.coord = coord;
    this.element = element;
    this.rotation = rotation;
    this.polarization = polarization;
    this.percentage = percentage;
    this.rotation = rotation;
    this.frozen = frozen;
    this.active = active;
    this.energized = energized;
    this.tool = tool;
  }

  /**
   * Ouput the rotation with an unicode arrow
   * @returns unicode arrow describing rotation
   */
  get rotationAscii(): string {
    return angleToSymbol(this.element.rotationAngle);
  }

  /**
   * Get ASCII character linked to cell's element and cell rotation
   * @returns ascii representation of rotated element
   */
  get ascii(): string {
    return this.element.ascii[this.rotation / this.element.rotationAngle];
  }

  /**
   * Is element blank?
   * @returns true if blank
   */
  get isVoid(): boolean {
    return this.element.name === Elem.Void;
  }

  /**
   * Is element a detector?
   * @returns true if detector
   */
  get isDetector(): boolean {
    return this.element.name === Elem.Detector || this.element.name === Elem.DetectorFour;
  }

  /**
   * Is element a laser?
   * @returns true if laser
   */
  get isLaser(): boolean {
    return this.element.name === Elem.Laser;
  }

  /**
   * Is element a mine?
   * @returns true if mine
   */
  get isMine(): boolean {
    return this.element.name === Elem.Mine;
  }

  /**
   * Is element a complicated rotation?
   * @returns true if quarter wave plate or polarizer
   */
  get isPolarizerOrWavePlate(): boolean {
    return this.element.name === Elem.Polarizer || this.element.name === Elem.QuarterWavePlate;
  }

  /**
   * Determine if the cell comes from a grid or a toolbox
   */
  get isFromToolbox(): boolean {
    return this.coord.x === -1 && this.coord.y === -1;
  }

  /**
   * Create a photon indicator for quantum simulation
   * @returns Indicator for qt.photons
   */
  get indicator(): IndicatorInterface {
    if (this.isLaser) {
      return {
        x: this.coord.x,
        y: this.coord.y,
        direction: startingDirection(this.rotation),
        polarization: startingPolarization(this.polarization)
      };
    }
    throw new Error(`Cannot create photon indicator from ${this.element.name}`);
  }

  /**
   * Determine if the cell comes from a grid or a toolbox
   */
  get isFromGrid(): boolean {
    return !this.isFromToolbox;
  }

  /**
   * Valid draggable source
   * Source should be a tool on grid or toolbox
   * @returns boolean
   */
  isValidSource(): boolean {
    return !this.frozen && !this.isVoid && this.tool;
  }

  /**
   * Valid draggable target
   * Target should be a tool or void on grid or toolbox
   * @returns boolean
   */
  isValidTarget(): boolean {
    return !this.frozen && (this.isVoid || this.tool);
  }

  /**
   * Reset a cell to a void passive, unfrozen, unergized cell
   */
  reset(): Cell {
    this.element.name = Elem.Void;
    this.rotation = 0;
    this.polarization = 0;
    this.percentage = 0;
    this.active = false;
    this.frozen = false;
    this.energized = false;
    this.tool = false;
    return this;
  }

  /**
   * Rotate cell
   * Correcting the javascript modulo bug for negative values: https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
   * @param angle rotation angle in degrees
   */
  rotate(angle: number = this.element.rotationAngle): void {
    if (!this.frozen) {
      if (Math.abs(angle) % this.element.rotationAngle !== 0) {
        throw new Error('Error in the supplied angle compared to the element rotation angle.');
      } else {
        this.rotation = (((this.rotation + angle) % 360) + 360) % 360;
      }
    } else {
      console.error("This cell is frozen, you can't rotate it.");
    }
  }

  /**
   * Toggle the frozen status of the cell
   */
  toggleFreeze(): void {
    this.frozen = !this.frozen;
  }

  /**
   * Toggle the active status of the cell, activate laser for example
   */
  toggleActive(): void {
    this.active = !this.active;
  }

  /**
   * Toggle the energized status of the cell, cells are energized around an activated detector
   */
  toggleEnergized(): void {
    this.energized = !this.energized;
  }

  /**
   * Toggle the energized status of the cell, cells are energized around an activated detector
   */
  toggleTool(): void {
    this.tool = !this.tool;
  }

  /**
   * Output a string describing the cell, overrides toString() method
   * @returns string describing the cell status
   */
  toString(): string {
    return `${this.isFromToolbox ? 'TOOLBOX' : 'GRID'} ${
      this.tool ? 'Tool' : 'Nothing'
    } Cell @ ${this.coord.toString()} is ${this.frozen ? 'frozen' : 'unfrozen'} ${
      this.active ? 'active' : 'inactive'
    } and ${this.energized ? 'powered' : 'unpowered'} ${this.element.name} rotated ${
      this.rotation
    }° with polarization: ${this.polarization}° and percentage: ${this.percentage}%`;
  }

  /**
   * Export a cell interface
   * @returns CellInterface
   */
  exportCell(): CellInterface {
    return {
      coord: this.coord.exportCoord(),
      element: this.element.name,
      rotation: this.rotation,
      polarization: this.polarization,
      percentage: this.percentage,
      frozen: this.frozen,
      active: this.active,
      energized: this.energized
    };
  }

  /**
   * Create a cell from a CellInterface
   * TODO: Polarization should be passed to cell
   * @param obj CellInterface
   */
  static importCell(obj: CellInterface): Cell {
    const coord = Coord.importCoord(obj.coord);
    const element = Cell.fromName(obj.element);
    const cell = new Cell(
      coord,
      element,
      obj.rotation,
      obj.polarization,
      obj.percentage,
      obj.frozen,
      obj.active,
      obj.energized
    );
    return cell;
  }

  /**
   * Create a void cell from a Coord
   * @param coord Coord
   * @returns a blank cell
   */
  static createDummy(coordI: CoordInterface = { x: 0, y: 0 }): Cell {
    const coord = Coord.importCoord(coordI);
    const element = Cell.fromName(Elem.Void);
    return new Cell(coord, element);
  }

  /**
   * Create a void cell from a Coord
   * @param name string
   * @returns a toolbox cell
   */
  static createToolboxCell(name: string): Cell {
    const element = Cell.fromName(name);
    const coord = new Coord(-1, -1);
    const cell = new Cell(coord, element);
    cell.tool = true;
    return cell;
  }

  /**
   * TODO: Allow other parameters to be passed to the element transition
   * Get operator from transition
   * @param name
   */
  get operator(): [number, number, qt.Operator] {
    const { x, y } = this.coord;
    const options: TransitionInterface = {
      rotation: this.rotation,
      polarization: this.polarization,
      percentage: this.percentage
    };
    const transition = this.element.transition(options);
    return [x, y, transition];
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
}
