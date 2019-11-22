import { Elem, CellInterface } from '@/engine/interfaces';
import Coord from './Coord';
import Element from './Element';
import Cell from './Cell';

/**
 * CLUSTER CLASS
 * List of cells and associated functions that can be chained together
 */
export default class Cluster {
  cells: Cell[];

  // Allow constructor with origin coord, number array and direction
  constructor(cells: Cell[] = []) {
    this.cells = cells;
  }

  // Retrieve list of coordinates of the cluster
  get coords(): Coord[] {
    return this.cells.map((cell) => cell.coord);
  }

  // Retrieve list of elements of the cluster
  get elements(): Element[] {
    return this.cells.map((cell) => cell.element);
  }

  // Origin of the cluster is the first element coordinates.
  get origin(): Coord {
    return this.cells[0].coord;
  }

  /**
   * Trim the void around the cells and return the smallest level container
   * @returns a list of cells with trimmed coordinates
   */
  public trim(): Cluster {
    const cluster = this.unvoid;
    const trimmed: Cell[] = [];
    const minX = Math.min(...cluster.cells.map((cell) => cell.coord.x));
    const minY = Math.min(...cluster.cells.map((cell) => cell.coord.y));
    const maxX = Math.max(...cluster.cells.map((cell) => cell.coord.x));
    const maxY = Math.max(...cluster.cells.map((cell) => cell.coord.y));
    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    console.debug(`The most compressed version is: X:${sizeX} Y: ${sizeY}`);

    cluster.cells.forEach((cell) => {
      const trimmedCell = cell;
      trimmedCell.coord.x -= minX;
      trimmedCell.coord.y -= minY;
      trimmed.push(trimmedCell);
    });

    return new Cluster(trimmed);
  }

  /**
   * Import liqr of files in primitive types
   * @param jsonCells : cells
   * @returns Cluster
   */
  public static importCluster(jsonCells: CellInterface[]): Cluster {
    const cells = jsonCells.map((jsonCell) => {
      return Cell.importCell(jsonCell);
    });
    return new Cluster(cells);
  }

  /**
   * Export list of cells in primitives
   */
  public exportCluster(): CellInterface[] {
    return this.cells
      .filter((cell) => {
        return cell.element.name !== Elem.Void;
      })
      .map((cell) => {
        return cell.exportCell();
      });
  }

  /**
   * Override toString() method
   * @returns string
   */
  public toString(): string {
    return this.cells.map((cell) => cell.toString()).join(' | ');
  }

  /**
   * Filters cells by name (needs refactoring)
   * @param name Name of the element to look for
   * @returns list of cells of a specific type
   */
  public filteredBy(name: string): Cluster {
    return new Cluster(
      this.cells.filter((cell) => {
        return cell.element.name === name;
      })
    );
  }

  /**
   * Filter cells that are not of a specific type
   * @param name Name of the element to avoid
   */
  public filteredByNot(name: string): Cluster {
    return new Cluster(
      this.cells.filter((cell) => {
        return cell.element.name !== name;
      })
    );
  }

  get void(): Cluster {
    return new Cluster(this.filteredBy(Elem.Void).cells);
  }
  get unvoid(): Cluster {
    return new Cluster(this.filteredByNot(Elem.Void).cells);
  }
  get active(): Cluster {
    return new Cluster(this.cells.filter((cell) => cell.active));
  }
  get inactive(): Cluster {
    return new Cluster(this.cells.filter((cell) => !cell.active));
  }
  get energized(): Cluster {
    return new Cluster(this.cells.filter((cell) => cell.energized));
  }
  get unenergized(): Cluster {
    return new Cluster(this.cells.filter((cell) => !cell.energized));
  }
  get frozen(): Cluster {
    return new Cluster(this.cells.filter((cell) => cell.frozen));
  }
  get unfrozen(): Cluster {
    return new Cluster(this.cells.filter((cell) => !cell.frozen));
  }

  // Source Group
  get lasers(): Cluster {
    return this.filteredBy(Elem.Laser);
  }
  get nonlinearcrystals(): Cluster {
    return this.filteredBy(Elem.NonLinearCrystal);
  }
  get sourceGroup(): Cluster {
    return new Cluster(this.lasers.cells.concat(this.nonlinearcrystals.cells));
  }

  // Direction group
  get mirrors(): Cluster {
    return this.filteredBy(Elem.Mirror);
  }
  get beamsplitters(): Cluster {
    return this.filteredBy(Elem.BeamSplitter);
  }
  get coatedbeamsplitters(): Cluster {
    return this.filteredBy(Elem.CoatedBeamSplitter);
  }
  get polarbeamsplitters(): Cluster {
    return this.filteredBy(Elem.PolarizingBeamSplitter);
  }
  get cornercubes(): Cluster {
    return this.filteredBy(Elem.CornerCube);
  }
  get directionGroup(): Cluster {
    return new Cluster(
      this.mirrors.cells.concat(
        this.beamsplitters.cells,
        this.coatedbeamsplitters.cells,
        this.polarbeamsplitters.cells,
        this.cornercubes.cells
      )
    );
  }

  // Absorption group
  get detectors(): Cluster {
    return this.filteredBy(Elem.Detector);
  }
  get mines(): Cluster {
    return this.filteredBy(Elem.Mine);
  }
  get rocks(): Cluster {
    return this.filteredBy(Elem.Rock);
  }
  get omnidetectors(): Cluster {
    return this.filteredBy(Elem.DetectorFour);
  }
  get absorbers(): Cluster {
    return this.filteredBy(Elem.Absorber);
  }
  get walls(): Cluster {
    return this.filteredBy(Elem.Wall);
  }
  get gates(): Cluster {
    return this.filteredBy(Elem.Gate);
  }
  get closedGates(): Cluster {
    return this.gates.inactive;
  }
  get openedGates(): Cluster {
    return this.gates.active;
  }
  get absorptionGroup(): Cluster {
    return new Cluster(
      this.detectors.cells.concat(
        this.mines.cells,
        this.rocks.cells,
        this.omnidetectors.cells,
        this.absorbers.cells,
        this.walls.cells,
        this.closedGates.cells
      )
    );
  }

  // Polarization group
  get polarizers(): Cluster {
    return this.filteredBy(Elem.Polarizer);
  }
  get quarterwaveplates(): Cluster {
    return this.filteredBy(Elem.QuarterWavePlate);
  }
  get sugarsolutions(): Cluster {
    return this.filteredBy(Elem.SugarSolution);
  }
  get faradays(): Cluster {
    return this.filteredBy(Elem.FaradayRotator);
  }
  get polarizationGroup(): Cluster {
    return new Cluster(
      this.polarizers.cells.concat(
        this.quarterwaveplates.cells,
        this.sugarsolutions.cells,
        this.faradays.cells
      )
    );
  }

  // Phase group
  get vacuumjars(): Cluster {
    return this.filteredBy(Elem.VacuumJar);
  }
  get glasses(): Cluster {
    return this.filteredBy(Elem.Glass);
  }
  get phaseGroup(): Cluster {
    return new Cluster(this.vacuumjars.cells.concat(this.glasses.cells));
  }
}
