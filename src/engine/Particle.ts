import { Complex } from 'quantum-tensors'
import { IParticle, ICoord } from '@/engine/interfaces'
import Coord from './Coord'
import Cell from './Cell'
import { toPercentString } from './helpers'

/**
 * PARTICLE CLASS
 * Describes a vector with an origin, a direction and two complex numbers.
 */
export default class Particle extends Coord {
  public coord: Coord
  public direction: number
  public a: Complex
  public b: Complex

  public constructor(coord: Coord, direction: number, are = 1, aim = 0, bre = 0, bim = 0) {
    super(coord.y, coord.x)
    this.coord = coord
    this.direction = direction
    this.a = new Complex(are, aim)
    this.b = new Complex(bre, bim)
  }

  public get are(): number {
    return this.a.re
  }

  public get aim(): number {
    return this.a.im
  }

  public get bre(): number {
    return this.b.re
  }

  public get bim(): number {
    return this.b.im
  }

  /**
   * Deep clone of a particle
   * @returns particle clone
   */
  public get clone(): Particle {
    return new Particle(this.coord, this.direction, this.are, this.aim, this.bre, this.bim)
  }

  /**
   * Checks the orientation of the particle for display
   * @returns true if vertical
   */
  public get isVertical(): boolean {
    return this.direction === 0 || this.direction === 180
  }

  /**
   * Opacity from complex values
   * @returns value to use to adapt opacity for frontend
   */
  public get probability(): number {
    const scaling = 1
    const opacity = (this.a.abs2() + this.b.abs2()) ** scaling
    if (opacity > 1) {
      return 1
    }
    return opacity
  }

  /**
   * Test if a particle is on a cell
   * @param cell cell to test
   * @returns boolean if particle is on cell
   */
  public on(cell: Cell): boolean {
    return this.coord.equal(cell.coord)
  }

  /**
   * When will the particle escape the grid
   * @param cols cols of the grid
   * @param rows rows of the grid
   * @returns numbers of steps before exiting the grid
   */
  public stepsToExit(cols: number, rows: number): number {
    switch (this.direction % 360) {
      case 0: // TOP
        return this.y
      case 90: // RIGHT
        return cols - this.x - 1
      case 180: // BOTTOM
        return rows - this.y - 1
      case 270: // LEFT
        return this.x
      default:
        throw new Error('Something went wrong with directions...')
    }
  }

  /**
   *  Propagate the particle following its direction
   * @returns next coord
   */
  public nextCoord(): Coord {
    return this.coord.fromAngle(this.direction)
  }

  /**
   * Temporary! I want to work with actual quantum states.
   * Also - quick, dirty, no-LaTeX and pure string
   * Generating ket from Photons or QuantumFrame is preferred.
   */
  public toKetString(): string {
    const dirVis = new Map<number, string>()
    dirVis.set(0, '⇢')
    dirVis.set(90, '⇡')
    dirVis.set(180, '⇠')
    dirVis.set(270, '⇣')
    let result = ''
    if (this.a.re !== 0 || this.a.im !== 0) {
      result += `(${this.a.re.toFixed(2)} + ${this.a.im.toFixed(2)} i) | ${dirVis.get(
        this.direction
      )} H⟩`
    }
    if (this.b.re !== 0 || this.b.im !== 0) {
      result += `(${this.b.re.toFixed(2)} + ${this.b.im.toFixed(2)} i) | ${dirVis.get(
        this.direction
      )} V⟩`
    }
    return result
  }

  /**
   * Override toString() method for debug
   * @returns a string describing the particle
   */
  public toString(): string {
    return `Particle @ ${this.coord.toString()} moving ${this.direction}° with ${toPercentString(
      this.probability
    )} intensity and polarization | A:${this.a.re} + ${this.a.im}i & B:${this.b.re} + ${
      this.b.im
    }i\n`
  }

  /**
   * Get relative movement for the particle
   * @returns Coord using relative position
   */
  public get relativeTarget(): ICoord {
    switch (this.direction) {
      case 0:
        return { x: 1, y: 0 }
      case 90:
        return { x: 0, y: -1 }
      case 180:
        return { x: -1, y: 0 }
      case 270:
        return { x: 0, y: 1 }
      default:
        throw new Error('Wrong direction provided from particle...')
    }
  }

  /**
   * export a svg path of the particle
   * @returns
   */
  public toSvg(): string {
    let pathStr = ''
    const originX = this.centerCoord(this.coord.x)
    const originY = this.centerCoord(this.coord.y)
    pathStr += `M ${originX} ${originY} `
    switch (this.direction) {
      case 0:
        pathStr += ` H ${this.centerCoord(this.coord.x + 1)}`
        break
      case 90:
        pathStr += ` V ${this.centerCoord(this.coord.y - 1)}`
        break
      case 180:
        pathStr += ` H ${this.centerCoord(this.coord.x - 1)}`
        break
      case 270:
        pathStr += ` V ${this.centerCoord(this.coord.y + 1)}`
        break
      default:
        throw new Error(`Laser has wrong direction: ${this.direction}°`)
    }
    if (this.probability < 0.001) {
      return ''
    }
    return pathStr
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  public centerCoord(val: number, tileSize = 64): number {
    return (val + 0.5) * tileSize
  }

  /**
   * Export particle interface in primitives
   * @returns particle interface
   */
  public exportParticle(): IParticle {
    return {
      x: this.coord.x,
      y: this.coord.y,
      direction: this.direction,
      are: this.are,
      aim: this.aim,
      bre: this.bre,
      bim: this.bim
    }
  }

  /**
   * Create a particle from a particle interface
   * @param iParticle particle interface
   * @returns particle instance
   */
  public static importParticle(iParticle: IParticle): Particle {
    const coord = new Coord(iParticle.y, iParticle.x)
    return new Particle(
      coord,
      iParticle.direction,
      iParticle.are,
      iParticle.aim,
      iParticle.bre,
      iParticle.bim
    )
  }

  /**
   * Create a dummy particle
   * @returns dummy particle
   */
  public static createDummy(): Particle {
    const coord = new Coord(0, 0)
    return new Particle(coord, 0)
  }

  /**
   * Convert particles to a string representation
   * @param particles list of particles
   * @returns string
   */
  public static manyToString(particles: Particle[]): string {
    let result = ''
    particles.forEach((particle): void => {
      result += particle.toString()
    })
    return result
  }
}
