// FIXME: Figure a way to have uid and coord access to cells
// FIXME: Void cells
import { ICell, IGrid, ISimGrid, Elem, ICoord } from '@/engine/interfaces'
import Coord from './Coord'
import Cell from './Cell'

/**
 * GRID CLASS
 * Includes the grid instance that holds the cells
 */
export default class Grid {
  public readonly cols: number
  public readonly rows: number
  public readonly cells: Map<number, Cell>

  public constructor(rows: number, cols: number, cells?: Cell[]) {
    this.rows = rows
    this.cols = cols
    this.cells = new Map()

    if (cells != null) {
      for (const cell of cells) {
        this.cells.set(this.index(cell.coord), cell)
      }
    }

    // Populate with blank tiles
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const coord = Coord.importCoord({ y, x })
        const key = this.index(coord)
        if (!this.cells.has(key)) {
          this.cells.set(key, new Cell(coord, Elem.Void))
        }
      }
    }
  }

  private index(coord: ICoord): number {
    if (!this.includes(coord)) {
      throw new Error(`Coordinate out of bounds. Cell: [${coord.x}, ${coord.y}]`)
    }
    return coord.y * this.cols + coord.x
  }

  /**
   * Set a cell at a specific coordinate
   * TODO: Replace with deepClone?
   * @param cell Cell to set at a grid coordinate
   */
  public set(cell: Cell): void {
    const key = this.index(cell.coord)
    this.cells.set(key, cell)
  }

  public remove(coord: ICoord): void {
    this.set(new Cell(Coord.importCoord(coord), Elem.Void))
  }

  /**
   * Swap two grid squares on board
   */
  public swap(coordA: ICoord, coordB: ICoord): void {
    const newSource = Cell.importCell({ ...this.get(coordA).exportCell(), coord: coordB })
    const newTarget = Cell.importCell({ ...this.get(coordB).exportCell(), coord: coordA })
    this.set(newSource)
    this.set(newTarget)
  }

  /**
   * Retrieve the cell at a specified coordinate
   * @param coord Coordinate to get
   * @throws if coord is out of bounds
   * @returns Cell
   */
  public get(coord: ICoord): Cell {
    const key = this.index(coord)
    const found = this.cells.get(key)
    if (found == null) {
      throw new Error(`Internal error: cell missing at [${coord.x}, ${coord.y}]`)
    }
    return found
  }

  /**
   * Retrieve a cell from the grid
   * @param x X coordinate
   * @param y Y coordinate
   */
  public cellFromXY(x: number, y: number): Cell {
    return this.get({ x, y })
  }

  /**
   * Remove unfrozen cells once they are moved to the toolbox
   */
  public resetUnfrozen(): void {
    this.unfrozen().forEach((cell): void => {
      cell.reset()
    })
  }

  /**
   * Energize the following list of cells
   */
  public setEnergized(coords: Coord[]): void {
    coords.forEach((coord): void => {
      const cell = this.get(coord)
      cell.energized = true
    })
  }

  /**
   * Remove unfrozen cells once they are moved to the toolbox
   */
  public resetEnergized(): void {
    this.cells.forEach((cell): void => {
      cell.energized = false
    })
  }

  public cellsArray(): Cell[] {
    return Array.from(this.cells.values())
  }

  /**
   * Filters cells by element kind
   * @param name Name of the element to look for
   * @returns list of cells of a specific type
   */
  public filteredBy(kind: Elem): Cell[] {
    return this.cellsArray().filter((cell) => cell.element === kind)
  }

  /**
   * Filter cells that are not of a specific type
   * @param name Name of the element to avoid
   */
  public filteredByNot(kind: Elem): Cell[] {
    return this.cellsArray().filter((cell) => cell.element !== kind)
  }

  public energized(): Cell[] {
    return this.cellsArray().filter((cell) => cell.energized)
  }

  public inactive(): Cell[] {
    return this.cellsArray().filter((cell) => !cell.active)
  }

  public unfrozen(): Cell[] {
    return this.cellsArray().filter((cell) => !cell.frozen)
  }

  public detectors(): Cell[] {
    return this.filteredBy(Elem.Detector)
  }

  public mines(): Cell[] {
    return this.filteredBy(Elem.Mine)
  }

  public unvoid(): Cell[] {
    return this.filteredByNot(Elem.Void)
  }

  public unvoidUnfrozen(): Cell[] {
    return this.cellsArray().filter((cell) => !cell.frozen && cell.element !== Elem.Void)
  }

  /**
   * Is a coordinate inside the grid
   * @param coord Coordiante to test
   * @returns boolean if included
   */
  public includes(coord: ICoord): boolean {
    return coord.y >= 0 && coord.y < this.rows && coord.x >= 0 && coord.x < this.cols
  }

  /**
   * Output an ASCII grid
   * @returns an ascii grid
   */
  public get ascii(): string {
    let result = ''
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const coord = Coord.importCoord({ y, x })
        result += this.get(coord).ascii
      }
      result += '\n'
    }
    return result
  }

  /**
   * Sets the grid with the appropriate cells
   * @param jsonCells A list of cell interface
   */
  public static importGrid(iGrid: IGrid): Grid {
    const grid = new Grid(iGrid.rows, iGrid.cols)
    iGrid.cells.forEach((iCell): void => {
      const cell = Cell.importCell(iCell)
      grid.set(cell)
    })
    return grid
  }

  /**
   * Create a dummy grid interface
   * @returns dummy Grid
   */
  public static dummyIGrid(rows = 3, cols = 3): IGrid {
    return {
      rows,
      cols,
      cells: [
        {
          coord: { x: 0, y: 1 },
          element: Elem[Elem.Laser],
          rotation: 0,
          active: true,
          frozen: true,
        },
      ],
    }
  }

  /**
   * Create a dummy grid instance
   * @returns dummy Grid
   */
  public static dummyGrid(rows = 3, cols = 3): Grid {
    const grid = Grid.importGrid(this.dummyIGrid(rows, cols))
    return grid
  }

  /**
   * Create an empty grid object
   * @returns A grid with nothing.
   */
  public static emptyGrid(rows = 3, cols = 3): Grid {
    return Grid.importGrid({ rows, cols, cells: [] })
  }

  /**
   * Exports the grid to an interface of primitives
   * @returns a grid interface
   */
  public exportGrid(): IGrid {
    const cells = this.cellsArray()
      .filter((cell): boolean => !cell.isVoid)
      .map((cell) => cell.exportCell())
    return {
      cols: this.cols,
      rows: this.rows,
      cells,
    }
  }

  /**
   * Exports the grid to an interface of primitives
   * @returns a grid interface
   */
  public exportSimGrid(): ISimGrid {
    const cells = this.cellsArray()
      .filter((cell): boolean => !cell.isVoid)
      .map((cell) => cell.exportSimCell())
    return {
      cols: this.cols,
      rows: this.rows,
      cells,
    }
  }

  /**
   * Exports the grid to an interface of primitives
   * @returns a grid interface
   */
  public exportGridForDownload(): IGrid {
    const cells: ICell[] = this.cellsArray()
      .filter((cell): boolean => !cell.isVoid)
      .map(
        (cell): ICell => {
          const iCell = cell.exportCell()
          iCell.frozen = true
          return iCell
        }
      )
    return {
      cols: this.cols,
      rows: this.rows,
      cells,
    }
  }
}
