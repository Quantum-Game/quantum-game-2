import * as qt from 'quantum-tensors'
import { ICoord, ICell, Elem, ITransition, IIndicator } from './interfaces'
import { startingPolarization, startingDirection, toPercentString } from './Helpers'
import Coord from './Coord'
import Element from './Element'
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
  HalfWavePlate,
  Rock,
  SugarSolution,
  VacuumJar,
  Wall,
  Void,
  PolarizingBeamSplitter,
} from '@/engine/Elements/index'
/**
 * CELL CLASS
 * A cell is a rotated element at a coordinate
 */
// export default class Cell extends Coord {
export default class Cell {
  public coord: Coord
  public element: Element
  public rotation: number
  public polarization: number
  public percentage: number
  public frozen: boolean
  public active: boolean
  public energized: boolean
  public tool: boolean

  public constructor(
    coord: Coord,
    element: Element,
    rotation = 0,
    polarization = 0,
    percentage = 0,
    frozen = false,
    active = false,
    energized = false,
    tool = true // dangerous, interferes with frozen
  ) {
    // super(coord.y, coord.x)
    this.coord = coord
    this.element = element
    this.rotation = rotation
    this.polarization = polarization
    this.percentage = percentage
    this.rotation = rotation
    this.frozen = frozen
    this.active = active
    this.energized = energized
    this.tool = tool
  }

  /**
   * Get ASCII character linked to cell's element and cell rotation
   * @returns ascii representation of rotated element
   */
  public get ascii(): string {
    return this.element.ascii[this.rotation / this.element.rotationAngle]
  }

  /**
   * Is element blank?
   * @returns true if blank
   */
  public get isVoid(): boolean {
    return this.element.name === Elem.Void
  }

  /**
   * Is element a laser?
   * @returns true if laser
   */
  public get isLaser(): boolean {
    return this.element.name === Elem.Laser
  }

  /**
   * Is element a mine?
   * @returns true if mine
   */
  public get isMine(): boolean {
    return this.element.name === Elem.Mine
  }

  /**
   * Create a photon indicator for quantum simulation
   * @returns Indicator for qt.photons
   */
  public get indicator(): IIndicator {
    if (this.isLaser) {
      return {
        x: this.coord.x,
        y: this.coord.y,
        direction: startingDirection(this.rotation),
        polarization: startingPolarization(this.polarization),
      }
    }
    throw new Error(`Cannot create photon indicator from ${this.element.name}`)
  }

  /**
   * Determine if the cell comes from a grid or a toolbox
   */
  public get isFromToolbox(): boolean {
    return this.coord.x === -1 && this.coord.y === -1
  }

  /**
   * Determine if the cell comes from a grid or a toolbox
   */
  public get isFromGrid(): boolean {
    return !this.isFromToolbox
  }

  /**
   * Reset a cell to a void passive, unfrozen, unergized cell
   */
  public reset(): Cell {
    this.element.name = Elem.Void
    this.rotation = 0
    this.polarization = 0
    this.percentage = 0
    this.active = false
    this.frozen = false
    this.energized = false
    this.tool = false
    return this
  }

  /**
   * Are cells at the same coordinates
   * @param cell
   */
  equal(cell: Cell): boolean {
    return this.coord.equal(cell.coord)
  }

  /**
   * Rotate cell
   * Correcting the javascript modulo bug for negative values: https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
   * @param angle rotation angle in degrees
   */
  public rotate(angle: number = this.element.rotationAngle): void {
    if (!this.frozen) {
      if (Math.abs(angle) % this.element.rotationAngle !== 0) {
        throw new Error('Error in the supplied angle compared to the element rotation angle.')
      } else {
        this.rotation = (((this.rotation + angle) % 360) + 360) % 360
      }
    } else {
      console.error("This cell is frozen, you can't rotate it.")
    }
  }

  /**
   * Output a string describing the cell, overrides toString() method
   * @returns string describing the cell status
   */
  public toString(): string {
    return `${this.isFromToolbox ? 'TOOLBOX' : 'GRID'} ${
      this.tool ? 'Tool' : 'Nothing'
    } Cell @ ${this.coord.toString()} is ${this.frozen ? 'frozen' : 'unfrozen'} ${
      this.active ? 'active' : 'inactive'
    } and ${this.energized ? 'powered' : 'unpowered'} ${this.element.name} rotated ${
      this.rotation
    }° with polarization: ${this.polarization}° and percentage: ${toPercentString(this.percentage)}`
  }

  /**
   * Export a cell interface
   * @returns ICell
   */
  public exportCell(): ICell {
    return {
      coord: this.coord.exportCoord(),
      element: this.element.name,
      rotation: this.rotation,
      polarization: this.polarization,
      percentage: this.percentage,
      frozen: this.frozen,
      active: this.active,
      energized: this.energized,
    }
  }

  /**
   * Create a cell from a ICell
   * TODO: Polarization should be passed to cell
   * @param iCell ICell
   */
  public static importCell(iCell: ICell): Cell {
    const coord = Coord.importCoord(iCell.coord)
    const element = Cell.fromName(iCell.element)
    const cell = new Cell(
      coord,
      element,
      iCell.rotation,
      iCell.polarization,
      iCell.percentage,
      iCell.frozen,
      iCell.active,
      iCell.energized,
      !iCell.frozen
    )
    return cell
  }

  /**
   * Create a void cell from a Coord
   * @param coord Coord
   * @returns a blank cell
   */
  public static createDummy(coordI: ICoord = { x: 0, y: 0 }): Cell {
    const coord = Coord.importCoord(coordI)
    const element = Cell.fromName(Elem.Void)
    return new Cell(coord, element)
  }

  /**
   * Create a void cell from a Coord
   * @param name string
   * @returns a toolbox cell
   */
  public static createToolboxCell(name: string): Cell {
    const element = Cell.fromName(name)
    const coord = new Coord(-1, -1)
    const cell = new Cell(coord, element)
    cell.tool = true
    return cell
  }

  /**
   * Get operator from transition
   * @param name
   */
  public get operator(): [number, number, qt.Operator] {
    const options: ITransition = {
      rotation: this.rotation,
      polarization: this.polarization,
      percentage: this.percentage,
    }
    const transition = this.element.transition(options)
    return [this.coord.x, this.coord.y, transition]
  }

  /**
   * Create a instance of the descendant class from Element
   * @param name element name
   * @returns element class instance
   */
  public static fromName(name: string): Element {
    switch (name) {
      case Elem.Absorber:
        return new Absorber()
      case Elem.BeamSplitter:
        return new BeamSplitter()
      case Elem.CoatedBeamSplitter:
        return new CoatedBeamSplitter()
      case Elem.CornerCube:
        return new CornerCube()
      case Elem.Detector:
        return new Detector()
      case Elem.DetectorFour:
        return new DetectorFour()
      case Elem.FaradayRotator:
        return new FaradayRotator()
      case Elem.Gate:
        return new Gate()
      case Elem.Glass:
        return new Glass()
      case Elem.Laser:
        return new Laser()
      case Elem.Mine:
        return new Mine()
      case Elem.Mirror:
        return new Mirror()
      case Elem.NonLinearCrystal:
        return new NonLinearCrystal()
      case Elem.Polarizer:
        return new Polarizer()
      case Elem.PolarizingBeamSplitter:
        return new PolarizingBeamSplitter()
      case Elem.QuarterWavePlate:
        return new QuarterWavePlate()
      case Elem.HalfWavePlate:
        return new HalfWavePlate()
      case Elem.Rock:
        return new Rock()
      case Elem.SugarSolution:
        return new SugarSolution()
      case Elem.VacuumJar:
        return new VacuumJar()
      case Elem.Void:
        return new Void()
      case Elem.Wall:
        return new Wall()
      default:
        throw new Error(`Element ${this.name} not included in quantum-tensors operators..`)
    }
  }
}
