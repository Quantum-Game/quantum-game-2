import { ICoord, ICell, ISimCell, Elem, IIndicator, elemFromString } from '@/engine/interfaces'
import { startingPolarization, startingDirection, toPercentString } from './Helpers'
import Coord from './Coord'
import { elementsData } from '@/engine/elements'
/**
 * CELL CLASS
 * A cell is a rotated element at a coordinate
 */
export default class Cell {
  public coord: Coord
  public element: Elem
  public rotation: number
  public polarization: number
  public percentage: number
  public frozen: boolean
  public active: boolean
  public energized: boolean
  public tool: boolean

  public constructor(
    coord: Coord,
    element: Elem,
    rotation = 0,
    polarization = 0,
    percentage = 0,
    frozen = false,
    active = false,
    energized = false,
    tool = true // dangerous, interferes with frozen
  ) {
    this.coord = coord
    this.element = element
    this.rotation = rotation
    this.polarization = polarization
    this.percentage = percentage
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
    const data = elementsData[this.element]
    return data.ascii[this.rotation / this.rotationAngle]
  }

  private get rotationAngle(): number {
    return 360 / elementsData[this.element].angles.length
  }

  /**
   * Is element blank?
   * @returns true if blank
   */
  public get isVoid(): boolean {
    return this.element === Elem.Void
  }

  /**
   * Is element a laser?
   * @returns true if laser
   */
  public get isLaser(): boolean {
    return this.element === Elem.Laser
  }

  /**
   * Is element a mine?
   * @returns true if mine
   */
  public get isMine(): boolean {
    return this.element === Elem.Mine
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
    throw new Error(`Cannot create photon indicator from ${Elem[this.element]}`)
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
    this.element = Elem.Void
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
  public rotate(angle: number = this.rotationAngle): void {
    if (!this.frozen) {
      if (Math.abs(angle) % this.rotationAngle !== 0) {
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
    const from = this.isFromToolbox ? 'TOOLBOX' : 'GRID'
    const coord = this.coord.toString()
    const tool = this.tool ? 'Tool' : 'Nothing'
    const frozen = this.frozen ? 'frozen' : 'unfrozen'
    const active = this.active ? 'active' : 'inactive'
    const power = this.energized ? 'powered' : 'unpowered'
    const percentage = toPercentString(this.percentage)

    const mainName = `${from} ${tool} ${Elem[this.element]}`
    const flags = `${frozen} ${active} and ${power}`

    return `${mainName} @ ${coord} is ${flags} rotated ${this.rotation}° with polarization: ${this.polarization}° and percentage: ${percentage}`
  }

  /**
   * Export a cell interface
   * @returns ICell
   */
  public exportCell(): ICell {
    return {
      coord: this.coord.exportCoord(),
      element: Elem[this.element],
      rotation: this.rotation,
      polarization: this.polarization,
      percentage: this.percentage,
      frozen: this.frozen,
      active: this.active,
      energized: this.energized,
    }
  }

  /**
   * Export a cell interface for qt Simulation
   * @todo discuss json grid format
   * @returns ICell
   */
  public exportSimCell(): ISimCell {
    return {
      x: this.coord.x,
      y: this.coord.y,
      element: Elem[this.element],
      rotation: this.rotation,
      polarization: this.polarization,
      percentage: this.percentage,
      frozen: this.frozen,
    }
  }

  /**
   * Create a cell from a ICell
   * TODO: Polarization should be passed to cell
   * @param iCell ICell
   */
  public static importCell(iCell: ICell): Cell {
    return new Cell(
      Coord.importCoord(iCell.coord),
      elemFromString(iCell.element) || Elem.Void,
      iCell.rotation,
      iCell.polarization,
      iCell.percentage,
      iCell.frozen,
      iCell.active,
      iCell.energized,
      !iCell.frozen
    )
  }

  /**
   * Create a void cell from a Coord
   * @param coord Coord
   * @returns a blank cell
   */
  public static createDummy(coordI: ICoord = { x: 0, y: 0 }): Cell {
    return new Cell(Coord.importCoord(coordI), Elem.Void)
  }
}
