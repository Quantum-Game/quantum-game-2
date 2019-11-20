import { CoordInterface, CellInterface } from './interfaces';
import Coord from './Coord';
import Element from './Element';
import { angleToSymbol } from './Helpers';
/**
 * CELL CLASS
 * A cell is a rotated element at a coordinate
 */
export default class Cell {
  coord: Coord;
  element: Element;
  rotation: number;
  frozen: boolean;
  active: boolean;
  energized: boolean;
  tool: boolean;

  constructor(
    coord: Coord,
    element: Element,
    rotation = 0,
    frozen = false,
    active = false,
    energized = false,
    tool = false
  ) {
    this.coord = coord;
    this.element = element;
    this.rotation = rotation;
    this.frozen = frozen;
    this.active = active;
    this.energized = energized;
    this.tool = tool;
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
    return this.element.name === 'Void';
  }

  /**
   * Is element a detector?
   * @returns true if detector
   */
  get isDetector(): boolean {
    return this.element.name === 'Detector' || this.element.name === 'DetectorFour';
  }

  /**
   * Is element a laser?
   * @returns true if laser
   */
  get isLaser(): boolean {
    return this.element.name === 'Laser';
  }

  /**
   * Ouput the rotation with an unicode arrow
   * @returns unicode arrow describing rotation
   */
  get rotationAscii(): string {
    return angleToSymbol(this.element.rotationAngle);
  }

  /**
   * Determine if the cell comes from a grid or a toolbox
   */
  get isFromToolbox(): boolean {
    return this.coord.x === -1 && this.coord.y === -1;
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
    this.element.name = 'Void';
    this.rotation = 0;
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
    }°`;
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
      frozen: this.frozen,
      active: this.active,
      energized: this.energized
    };
  }

  /**
   * Create a cell from a CellInterface
   * @param obj CellInterface
   */
  static importCell(obj: CellInterface): Cell {
    const coord = Coord.importCoord(obj.coord);
    const element = Element.fromName(obj.element);
    return new Cell(coord, element, obj.rotation, obj.frozen, obj.active, obj.energized);
  }

  /**
   * Create a void cell from a Coord
   * @param coord Coord
   * @returns a blank cell
   */
  static createDummy(coordI: CoordInterface = { x: 0, y: 0 }): Cell {
    const coord = Coord.importCoord(coordI);
    const element = Element.fromName('Void');
    return new Cell(coord, element);
  }

  /**
   * Create a void cell from a Coord
   * @param name string
   * @returns a toolbox cell
   */
  static createToolboxCell(name: string): Cell {
    const element = Element.fromName(name);
    const coord = new Coord(-1, -1);
    const cell = new Cell(coord, element);
    cell.tool = true;
    return cell;
  }
}
