import { Elem, ICell } from '@/engine/interfaces'
import Coord from './Coord'
import Element from './Element'
import Cell from './Cell'

/**
 * CLUSTER CLASS
 * List of cells and associated functions that can be chained together
 */
export default class Cluster {
  public cells: Cell[]

  // Allow constructor with origin coord, number array and direction
  public constructor(cells: Cell[] = []) {
    this.cells = cells
  }

  // Retrieve list of coordinates of the cluster
  public get coords(): Coord[] {
    return this.cells.map((cell): Coord => cell.coord)
  }

  // Retrieve list of elements of the cluster
  public get elements(): Element[] {
    return this.cells.map((cell): Element => cell.element)
  }

  // Origin of the cluster is the first element coordinates.
  public get origin(): Coord {
    return this.cells[0].coord
  }

  /**
   * Trim the void around the cells and return the smallest level container
   * @returns a list of cells with trimmed coordinates
   */
  public trim(): Cluster {
    const cluster = this.unvoid
    const trimmed: Cell[] = []
    const minX = Math.min(...cluster.cells.map((cell): number => cell.coord.x))
    const minY = Math.min(...cluster.cells.map((cell): number => cell.coord.y))
    const maxX = Math.max(...cluster.cells.map((cell): number => cell.coord.x))
    const maxY = Math.max(...cluster.cells.map((cell): number => cell.coord.y))
    const sizeX = maxX - minX
    const sizeY = maxY - minY
    console.debug(`The most compressed version is: X:${sizeX} Y: ${sizeY}`)

    cluster.cells.forEach((cell): void => {
      const trimmedCell = cell
      trimmedCell.coord.x -= minX
      trimmedCell.coord.y -= minY
      trimmed.push(trimmedCell)
    })

    return new Cluster(trimmed)
  }

  /**
   * Import liqr of files in primitive types
   * @param jsonCells : cells
   * @returns Cluster
   */
  public static importCluster(iCells: ICell[]): Cluster {
    const cells = iCells.map(
      (iCell): Cell => {
        return Cell.importCell(iCell)
      }
    )
    return new Cluster(cells)
  }

  /**
   * Export list of cells in primitives
   */
  public exportCluster(): ICell[] {
    return this.cells
      .filter((cell): boolean => {
        return cell.element.name !== Elem.Void
      })
      .map(
        (cell): ICell => {
          return cell.exportCell()
        }
      )
  }

  /**
   * Override toString() method
   * @returns string
   */
  public toString(): string {
    return this.cells.map((cell): string => cell.toString()).join(' | ')
  }

  /**
   * Filters cells by name (needs refactoring)
   * @param name Name of the element to look for
   * @returns list of cells of a specific type
   */
  public filteredBy(name: string): Cluster {
    return new Cluster(
      this.cells.filter((cell): boolean => {
        return cell.element.name === name
      })
    )
  }

  /**
   * Filter cells that are not of a specific type
   * @param name Name of the element to avoid
   */
  public filteredByNot(name: string): Cluster {
    return new Cluster(
      this.cells.filter((cell): boolean => {
        return cell.element.name !== name
      })
    )
  }

  public get void(): Cluster {
    return new Cluster(this.filteredBy(Elem.Void).cells)
  }

  public get unvoid(): Cluster {
    return new Cluster(this.filteredByNot(Elem.Void).cells)
  }

  public get active(): Cluster {
    return new Cluster(this.cells.filter((cell): boolean => cell.active))
  }

  public get inactive(): Cluster {
    return new Cluster(this.cells.filter((cell): boolean => !cell.active))
  }

  public get energized(): Cluster {
    return new Cluster(this.cells.filter((cell): boolean => cell.energized))
  }

  public get unenergized(): Cluster {
    return new Cluster(this.cells.filter((cell): boolean => !cell.energized))
  }

  public get frozen(): Cluster {
    return new Cluster(this.cells.filter((cell): boolean => cell.frozen))
  }

  public get unfrozen(): Cluster {
    return new Cluster(this.cells.filter((cell): boolean => !cell.frozen))
  }

  // Source Group
  public get lasers(): Cluster {
    return this.filteredBy(Elem.Laser)
  }

  public get nonlinearcrystals(): Cluster {
    return this.filteredBy(Elem.NonLinearCrystal)
  }

  public get sourceGroup(): Cluster {
    return new Cluster(this.lasers.cells.concat(this.nonlinearcrystals.cells))
  }

  public get emitters(): Cluster {
    return this.sourceGroup
  }

  // Direction group
  public get mirrors(): Cluster {
    return this.filteredBy(Elem.Mirror)
  }

  public get beamsplitters(): Cluster {
    return this.filteredBy(Elem.BeamSplitter)
  }

  public get coatedbeamsplitters(): Cluster {
    return this.filteredBy(Elem.CoatedBeamSplitter)
  }

  public get polarbeamsplitters(): Cluster {
    return this.filteredBy(Elem.PolarizingBeamSplitter)
  }

  public get cornercubes(): Cluster {
    return this.filteredBy(Elem.CornerCube)
  }

  public get directionGroup(): Cluster {
    return new Cluster(
      this.mirrors.cells.concat(
        this.beamsplitters.cells,
        this.coatedbeamsplitters.cells,
        this.polarbeamsplitters.cells,
        this.cornercubes.cells
      )
    )
  }

  // Absorption group
  public get detectors(): Cluster {
    return this.filteredBy(Elem.Detector)
  }

  public get mines(): Cluster {
    return this.filteredBy(Elem.Mine)
  }

  public get rocks(): Cluster {
    return this.filteredBy(Elem.Rock)
  }

  public get omnidetectors(): Cluster {
    return this.filteredBy(Elem.DetectorFour)
  }

  public get absorbers(): Cluster {
    return this.filteredBy(Elem.Absorber)
  }

  public get walls(): Cluster {
    return this.filteredBy(Elem.Wall)
  }

  public get gates(): Cluster {
    return this.filteredBy(Elem.Gate)
  }

  public get closedGates(): Cluster {
    return this.gates.inactive
  }

  public get openedGates(): Cluster {
    return this.gates.active
  }

  public get absorptionGroup(): Cluster {
    return new Cluster(
      this.detectors.cells.concat(
        this.mines.cells,
        this.rocks.cells,
        this.omnidetectors.cells,
        this.absorbers.cells,
        this.walls.cells,
        this.closedGates.cells
      )
    )
  }

  // Polarization group
  public get polarizers(): Cluster {
    return this.filteredBy(Elem.Polarizer)
  }

  public get quarterwaveplates(): Cluster {
    return this.filteredBy(Elem.QuarterWavePlate)
  }

  public get sugarsolutions(): Cluster {
    return this.filteredBy(Elem.SugarSolution)
  }

  public get faradays(): Cluster {
    return this.filteredBy(Elem.FaradayRotator)
  }

  public get polarizationGroup(): Cluster {
    return new Cluster(
      this.polarizers.cells.concat(
        this.quarterwaveplates.cells,
        this.sugarsolutions.cells,
        this.faradays.cells
      )
    )
  }

  // Phase group
  public get vacuumjars(): Cluster {
    return this.filteredBy(Elem.VacuumJar)
  }

  public get glasses(): Cluster {
    return this.filteredBy(Elem.Glass)
  }

  public get phaseGroup(): Cluster {
    return new Cluster(this.vacuumjars.cells.concat(this.glasses.cells))
  }
}
