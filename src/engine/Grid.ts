// FIXME: Figure a way to have uid and coord access to cells
import * as qt from 'quantum-tensors'
import { CellInterface, GridInterface, Elem } from './interfaces'
import Coord from './Coord'
import Cell from './Cell'
import Cluster from './Cluster'

/**
 * GRID CLASS
 * Includes the grid instance that holds the cells
 * TODO: Create a function that gets the grid border cells
 */
export default class Grid extends Cluster {
  public cols: number
  public rows: number

  public constructor(rows: number, cols: number, cells?: Cell[]) {
    super(cells)
    this.rows = rows
    this.cols = cols

    // Populate with blank tiles
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const coord = Coord.importCoord({ y, x })
        const element = Cell.fromName(Elem.Void)
        const cell = new Cell(coord, element)
        this.cells.push(cell)
      }
    }
  }

  /**
   * Set a cell at a specific coordinate
   * TODO: Replace with deepClone?
   * @param cell Cell to set at a grid coordinate
   * @returns boolean if operation is successfull
   */
  public set(cell: Cell): boolean {
    if (this.includes(cell.coord)) {
      const currentCell = this.get(cell.coord)
      currentCell.element = cell.element
      currentCell.rotation = cell.rotation
      currentCell.polarization = cell.polarization
      currentCell.percentage = cell.percentage
      currentCell.frozen = cell.frozen
      currentCell.active = cell.active
      currentCell.energized = cell.energized
      currentCell.tool = cell.tool
      return true
    }
    throw new Error(`Coordinate out of bounds. Cell: [${cell.coord.x}, ${cell.coord.y}]`)
  }

  /**
   * Retrieve the cell at a specified coordinate
   * @param coord Coordinate to get
   * @returns Cell
   */
  public get(coord: Coord): Cell {
    return this.cells.filter((cell): boolean => {
      return coord.equal(cell.coord)
    })[0]
  }

  /**
   * Retrieve a cell from the grid
   * @param x X coordinate
   * @param y Y coordinate
   */
  public cellFromXY(x: number, y: number): Cell {
    const coord = Coord.importCoord({ x, y })
    return this.cells.filter((cell): boolean => {
      return coord.equal(cell.coord)
    })[0]
  }

  /**
   * Remove unfrozen cells once they are moved to the toolbox
   */
  public resetUnfrozen(): void {
    this.unfrozen.cells.forEach((cell): void => {
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
      // eslint-disable-next-line
      cell.energized = false
    })
  }

  /**
   * Retrieve the list of quantum operators from the elements
   * @returns list of operators
   */
  public get operatorList(): [number, number, qt.Operator][] {
    return this.unvoid.cells.map((cell): [number, number, qt.Operator] => {
      return cell.operator
    })
  }

  /**
   * Is a coordinate inside the grid
   * @param coord Coordiante to test
   * @returns boolean if included
   */
  public includes(coord: Coord): boolean {
    return coord.y >= 0 && coord.y < this.rows && (coord.x >= 0 && coord.x < this.cols)
  }

  /**
   * Move a cell to another coord
   * @param sourceCell source cell
   * @param targetCell target cell
   * @returns boolean move was successfull
   */
  public move(sourceCell: Cell, targetCell: Cell): Cell[] {
    const source = sourceCell
    const target = targetCell
    if (source.isFromGrid && source.tool && target.isFromGrid && target.isVoid) {
      const tempCoord = source.coord
      source.coord = target.coord
      target.coord = tempCoord
      target.tool = false
      source.tool = true
      this.set(source)
      this.set(target)
      return [source, target]
    }

    // SWAP GRID TOOL TO GRID TOOL
    if (source.isFromGrid && source.tool && target.isFromGrid && target.tool) {
      const tempCoord = source.coord
      source.coord = target.coord
      target.coord = tempCoord
      target.tool = true
      source.tool = true
      this.set(source)
      this.set(target)
      return [source, target]
    }

    // MOVE TOOLBOX TOOL TO GRID VOID
    if (source.isFromToolbox && source.tool && target.isFromGrid && target.isVoid) {
      target.element = source.element
      target.tool = true
      this.set(target)
      return [target]
    }
    return []
  }

  /**
   * Move all elements to a common direction
   * @param direction direction string
   */
  public moveAll(direction: number): void {
    console.debug(`Moving all in direction: ${direction}`)
    this.unvoid.cells.forEach((cell): void => {
      // eslint-disable-next-line
      cell.coord = cell.coord.fromAngle(direction)
    })
  }

  /**
   * Move all elements to a common direction
   * @param direction direction string
   */
  public rotateAll(): void {
    console.debug(`Rotating grid`)
    this.unvoid.cells.forEach((cell): void => {
      // eslint-disable-next-line
      cell.coord = new Coord(cell.coord.x, cell.coord.y)
      // eslint-disable-next-line
      cell.rotation += (((cell.rotation - cell.element.rotationAngle) % 360) + 360) % 360
    })
  }

  public reflectAll(): void {
    console.debug(`Vertical reflecting grid`)
    this.unvoid.cells.forEach((cell): void => {
      // eslint-disable-next-line
      cell.coord = new Coord(cell.coord.y, 12 - cell.coord.x)
      if (cell.rotation % 180 === 0) {
        // eslint-disable-next-line
        cell.rotation = (cell.rotation + 180) % 360
      }
    })
  }

  /**
   * Return adjacent cells to a coordinate
   * @param coord Coordinate
   * @returns a list of adjacent cells
   */
  public adjacentCells(coord: Coord): Cell[] {
    const adjacents: Cell[] = []
    coord.adjacent.forEach((adjacent): void => {
      if (this.includes(adjacent)) {
        adjacents.push(this.get(adjacent))
      }
    })
    return adjacents
  }

  /**
   * List of cells at the border of the grid
   * Used to find the exit route of particles
   * @returns
   */
  public get borderCells(): Cell[] {
    const borders: Cell[] = []
    this.cells.forEach((cell: Cell): void => {
      if (
        cell.coord.x === 0 ||
        cell.coord.x === this.cols ||
        cell.coord.y === 0 ||
        cell.coord.y === this.rows
      ) {
        borders.push(cell)
      }
    })
    return borders
  }

  /**
   * An escaping particle should be one coord away from its escaping position
   * @param coord espaced coordinate
   * @returns escape cell
   */
  public lastCellBeforeEscape(coord: Coord): Cell {
    console.log(`Particle escaping @: ${coord.toString()}`)
    if (this.includes(coord)) {
      throw new Error(`Not an escaping particle coordinate: ${coord}`)
    }
    const lastCoord = coord.adjacent.find((adjacent): boolean => {
      return this.includes(adjacent)
    })
    /* eslint-disable-next-line */
    return this.get(lastCoord!)
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
  public static importGrid(gridObj: GridInterface): Grid {
    const grid = new Grid(gridObj.rows, gridObj.cols)
    gridObj.cells.forEach((cellObj): void => {
      const cell = Cell.importCell(cellObj)
      grid.set(cell)
    })
    return grid
  }

  /**
   * Create a dummy grid object
   * @returns dummy Grid
   */
  public static dummyGridInterface(rows = 3, cols = 3): GridInterface {
    return {
      rows,
      cols,
      cells: [
        {
          coord: { x: 0, y: 1 },
          element: Elem.Laser,
          rotation: 0,
          active: true,
          frozen: true
        }
      ]
    }
  }

  /**
   * Create a dummy grid object
   * @returns dummy Grid
   */
  public static dummyGrid(rows = 3, cols = 3): Grid {
    const grid = Grid.importGrid(this.dummyGridInterface(rows, cols))
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
  public exportGrid(): GridInterface {
    const cells: CellInterface[] = []
    this.cells
      .filter((cell): boolean => !cell.isVoid)
      .forEach((cell): void => {
        cells.push(cell.exportCell())
      })
    return {
      cols: this.cols,
      rows: this.rows,
      cells
    }
  }
}
