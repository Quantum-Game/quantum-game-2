// FIXME: Figure a way to have uid and coord access to cells
// FIXME: Figure out blank cells in constructor
import * as qt from 'quantum-tensors';
import { CellInterface, GridInterface, ParticleInterface } from './interfaces';
import Coord from './Coord';
import Element from './Element';
import Cell from './Cell';
import Cluster from './Cluster';

/**
 * Grid class includes the grid instance that holds the cells
 */
export default class Grid extends Cluster {
  public cols: number;
  public rows: number;

  constructor(rows: number, cols: number, cells?: Cell[]) {
    super(cells);
    this.rows = rows;
    this.cols = cols;

    // Populate with blank tiles
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const coord = Coord.importCoord({ y, x });
        const element = Element.fromName('Void');
        const cell = new Cell(coord, element);
        this.cells.push(cell);
      }
    }
  }

  /**
   * Set a cell at a specific coordinate
   * @param cell Cell to set at a grid coordinate
   * @returns boolean if operation is successfull
   */
  public set(cell: Cell): boolean {
    if (this.includes(cell.coord)) {
      const currentCell = this.get(cell.coord);
      currentCell.element = cell.element;
      currentCell.frozen = cell.frozen;
      currentCell.active = cell.active;
      currentCell.energized = cell.energized;
      currentCell.rotation = cell.rotation;
      currentCell.tool = cell.tool;
      return true;
    }
    throw new Error(`Coordinate out of bounds. Cell: [${cell.coord.x}, ${cell.coord.y}]`);
  }

  /**
   * Retrieve the cell at a specified coordinate
   * @param coord Coordinate to get
   * @returns Cell
   */
  public get(coord: Coord): Cell {
    return this.cells.filter((cell) => {
      return coord.equal(cell.coord);
    })[0];
  }

  public cellFromXY(x: number, y: number): Cell {
    const coord = Coord.importCoord({ x, y });
    return this.cells.filter((cell) => {
      return coord.equal(cell.coord);
    })[0];
  }

  /**
   * Get center cell of the grid
   * @returns center cell coordinates
   */
  get center(): Coord {
    return Coord.importCoord({
      y: Math.floor(this.cols / 2),
      x: Math.floor(this.rows / 2)
    });
  }

  /**
   * Remove unfrozen cells once they are moved to the toolbox
   */
  resetUnfrozen(): void {
    this.unfrozen.cells.forEach((cell) => {
      cell.reset();
    });
  }

  /**
   * Remove unfrozen cells once they are moved to the toolbox
   */
  resetEnergized(): void {
    this.cells.forEach((cell) => {
      // eslint-disable-next-line
      cell.energized = false;
    });
  }

  /**
   * Retrieve the list of quantum operators from the elements
   * @returns list of operators
   */
  get operatorList(): [number, number, qt.Operator][] {
    return this.unvoid.cells.map((cell) => {
      return [cell.coord.x, cell.coord.y, cell.element.transition(cell.rotation)];
    });
  }

  /**
   * Is a coordinate inside the grid
   * @param coord Coordiante to test
   * @returns boolean if included
   */
  public includes(coord: Coord): boolean {
    return coord.y >= 0 && coord.y < this.rows && (coord.x >= 0 && coord.x < this.cols);
  }

  /**
   * Move a cell to another coord
   * @param sourceCell source cell
   * @param targetCell target cell
   * @returns boolean move was successfull
   */
  public move(sourceCell: Cell, targetCell: Cell): Cell[] {
    const source = sourceCell;
    const target = targetCell;
    if (source.isFromGrid && source.tool && target.isFromGrid && target.isVoid) {
      const tempCoord = source.coord;
      source.coord = target.coord;
      target.coord = tempCoord;
      target.tool = false;
      source.tool = true;
      this.set(source);
      this.set(target);
      return [source, target];
    }

    // SWAP GRID TOOL TO GRID TOOL
    if (source.isFromGrid && source.tool && target.isFromGrid && target.tool) {
      const tempCoord = source.coord;
      source.coord = target.coord;
      target.coord = tempCoord;
      target.tool = true;
      source.tool = true;
      this.set(source);
      this.set(target);
      return [source, target];
    }

    // MOVE TOOLBOX TOOL TO GRID VOID
    if (source.isFromToolbox && source.tool && target.isFromGrid && target.isVoid) {
      target.element = source.element;
      target.tool = true;
      this.set(target);
      return [target];
    }
    return [];
  }

  /**
   * Move all elements to a common direction
   * @param direction direction string
   */
  public moveAll(direction: number): void {
    console.debug(`Moving all in direction: ${direction}`);
    this.cells.map((cell) => {
      return cell.coord.fromAngle(direction);
    });
  }

  /**
   * Set the cells as energized if on this laser path.
   * @param paths laser path to energize
   */
  energizeCells(paths: ParticleInterface[]): void {
    const pathCoords: Coord[] = paths.map((pathParticle) => Coord.importCoord(pathParticle.coord));
    this.cells.forEach((cell: Cell) => {
      if (cell.coord.isIncludedIn(pathCoords) && cell.element.name !== 'Void') {
        // eslint-disable-next-line no-param-reassign
        cell.energized = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        cell.energized = false;
      }
    });
  }

  /**
   * Set the adjacent cells as active if they are near an energized detector
   */
  activateCells(): void {
    this.unvoid.cells.forEach((cell) => {
      if (cell.element.name !== 'laser') {
        // eslint-disable-next-line no-param-reassign
        cell.active = false;
      }
      const energizedAdjacent = this.adjacentCells(cell.coord).filter((adjacent) => {
        return adjacent.energized && adjacent.element.name === 'detector';
      });
      if (energizedAdjacent.length > 0) {
        console.debug(`Cell ${cell.toString()} has 1+ active detectors as adjacent cell.`);
        // eslint-disable-next-line no-param-reassign
        cell.active = true;
      }
    });
  }

  /**
   * Return adjacent cells to a coordinate
   * @param coord Coordinate
   * @returns a list of adjacent cells
   */
  adjacentCells(coord: Coord): Cell[] {
    const adjacents: Cell[] = [];
    coord.adjacent.forEach((adjacent) => {
      if (this.includes(adjacent)) {
        adjacents.push(this.get(adjacent));
      }
    });
    return adjacents;
  }

  /**
   * Output an ASCII grid
   * @returns an ascii grid
   */
  public get ascii(): string {
    let result = '';
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const coord = Coord.importCoord({ y, x });
        result += this.get(coord).ascii;
      }
      result += '\n';
    }
    return result;
  }

  /**
   * Sets the grid with the appropriate cells
   * @param jsonCells A list of cell interface
   */
  public static importGrid(gridObj: GridInterface): Grid {
    const grid = new Grid(gridObj.rows, gridObj.cols);
    gridObj.cells.forEach((cellObj) => {
      const cell = Cell.importCell(cellObj);
      grid.set(cell);
    });
    return grid;
  }

  /**
   * Create a dummy grid object
   * @returns dummy Grid
   */
  public static dummyGrid(rows = 3, cols = 3): Grid {
    const gridI: GridInterface = {
      rows,
      cols,
      cells: [
        {
          coord: { x: 0, y: 1 },
          element: 'Laser',
          rotation: 0,
          active: true,
          frozen: true
        }
      ]
    };
    const grid = Grid.importGrid(gridI);
    return grid;
  }

  /**
   * Create an empty grid object
   * @returns A grid with nothing.
   */
  public static emptyGrid(rows = 3, cols = 3): Grid {
    return Grid.importGrid({ rows, cols, cells: [] });
  }

  /**
   * Exports the grid to an interface of primitives
   * @returns a grid interface
   */
  public exportGrid(): GridInterface {
    const cells: CellInterface[] = [];
    this.cells
      .filter((cell) => !cell.isVoid)
      .forEach((cell) => {
        cells.push(cell.exportCell());
      });
    return {
      cols: this.cols,
      rows: this.rows,
      cells
    };
  }
}
