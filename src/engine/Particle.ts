// FIXME: Duplicate between path and coord
import { Complex } from 'quantum-tensors';
import { ParticleInterface, CoordInterface } from '@/engine/interfaces';
import Coord from './Coord';
import Cell from './Cell';
import { toPercent, angleToSymbol } from './Helpers';

/**
 * Particle interface retrieved from quantum-tensors
 */
export interface Qparticle {
  x: number;
  y: number;
  direction: number;
  are: number;
  aim: number;
  bre: number;
  bim: number;
}

/**
 * PARTICLE CLASS
 * Describes a vector with an origin, a direction and two complex numbers.
 */
export default class Particle extends Coord {
  coord: Coord;
  direction: number;
  intensity: number;
  phase: number;
  a: Complex;
  b: Complex;
  path: ParticleInterface[];

  constructor(
    coord: Coord,
    direction: number,
    intensity = 1,
    phase = 0,
    are = 1,
    aim = 0,
    bre = 0,
    bim = 0,
    path: ParticleInterface[] = [
      {
        coord,
        direction,
        intensity,
        phase,
        are,
        aim,
        bre,
        bim
      }
    ]
  ) {
    super(coord.y, coord.x);
    this.coord = coord;
    this.direction = direction;
    this.intensity = intensity;
    this.phase = phase;
    this.a = new Complex(are, aim);
    this.b = new Complex(bre, bim);
    this.path = path;
  }

  /**
   * Origin cell of the particle
   * @returns start of the particle path
   */
  get origin(): Coord {
    return Coord.importCoord(this.path[0].coord);
  }

  /**
   * Check if the particle has any intensity
   * @returns true if above threshold
   */
  get alive(): boolean {
    return this.intensity > 0.001;
  }

  get are(): number {
    return this.a.re;
  }
  get aim(): number {
    return this.a.im;
  }
  get bre(): number {
    return this.b.re;
  }
  get bim(): number {
    return this.b.im;
  }

  /**
   * Deep clone of a particle
   * @returns particle clone
   */
  get clone(): Particle {
    return new Particle(
      this.coord,
      this.direction,
      this.intensity,
      this.phase,
      this.are,
      this.aim,
      this.bre,
      this.bim
    );
  }

  /**
   * Checks the orientation of the particle for display
   * @returns true if vertical
   */
  get isVertical(): boolean {
    return this.direction === 0 || this.direction === 180;
  }

  /**
   * Opacity from complex values
   * @returns value to use to adapt opacity for frontend
   */
  get probability(): number {
    const scaling = 1;
    const opacity = (this.a.abs2() + this.b.abs2()) ** scaling;
    if (opacity > 1) {
      return 1;
    }
    return opacity;
  }

  /**
   * Convert particle path to particle instances
   * @returns particles
   */
  get pathParticle(): Particle[] {
    const result: Particle[] = [];
    this.path.forEach((particleI) => {
      result.push(Particle.importParticle(particleI));
    });
    return result;
  }

  /**
   * Test if a particle is on a cell
   * @param cell cell to test
   * @returns boolean if particle is on cell
   */
  on(cell: Cell): boolean {
    return this.coord.equal(cell.coord);
  }

  /**
   * When will the particle escape the grid
   * @param cols cols of the grid
   * @param rows rows of the grid
   * @returns numbers of steps before exiting the grid
   */
  stepsToExit(cols: number, rows: number): number {
    switch (this.direction % 360) {
      case 0: // TOP
        return this.y;
      case 90: // RIGHT
        return cols - this.x - 1;
      case 180: // BOTTOM
        return rows - this.y - 1;
      case 270: // LEFT
        return this.x;
      default:
        throw new Error('Something went wrong with directions...');
    }
  }

  /**
   *  Propagate the particle in a classical simulation
   * @returns updated Particle
   */
  next(): Particle {
    this.path.push(this.exportParticle());
    this.coord = this.coord.fromAngle(this.direction);
    return this;
  }

  /**
   *  Propagate the particle following its direction
   * @returns next coord
   */
  nextCoord(): Coord {
    return this.coord.fromAngle(this.direction);
  }

  /**
   * returns an ascii arrow of the particle direction angle
   * @returns arrow ascii
   */
  directionToAscii() {
    return angleToSymbol(this.direction);
  }

  /**
   * Temporary! I want to work with actual quantum states.
   * Also - quick, dirty, no-LaTeX and pure string
   * Generating ket from Photons or QuantumFrame is preferred.
   */
  toKetString(): string {
    const d = this;
    const dirVis = new Map<number, string>();
    dirVis.set(0, '⇢');
    dirVis.set(90, '⇡');
    dirVis.set(180, '⇠');
    dirVis.set(270, '⇣');
    let result = '';
    if (d.a.re !== 0 || d.a.im !== 0) {
      result += `(${d.a.re.toFixed(2)} + ${d.a.im.toFixed(2)} i) | ${dirVis.get(d.direction)} H⟩`;
    }
    if (d.b.re !== 0 || d.b.im !== 0) {
      result += `(${d.b.re.toFixed(2)} + ${d.b.im.toFixed(2)} i) | ${dirVis.get(d.direction)} V⟩`;
    }
    return result;
  }

  /**
   * Override toString() method for debug
   * @returns a string describing the particle
   */
  toString(): string {
    return `Particle @ ${this.coord.toString()} moving ${this.direction}° with ${toPercent(
      this.intensity
    )} intensity and polarization | A:${this.a.re} + ${this.a.im}i & B:${this.b.re} + ${
      this.b.im
    }i\n`;
  }

  /**
   * Get relative movement for the particle
   * @returns Coord using relative position
   */
  get relativeTarget(): CoordInterface {
    switch (this.direction) {
      case 0:
        return { x: 1, y: 0 };
      case 90:
        return { x: 0, y: -1 };
      case 180:
        return { x: -1, y: 0 };
      case 270:
        return { x: 0, y: 1 };
      default:
        throw new Error('Wrong direction provided from particle...');
    }
  }

  /**
   * export a svg path of the particle
   * @returns
   */
  toSvg(): string {
    let pathStr = '';
    const originX = this.centerCoord(this.coord.x);
    const originY = this.centerCoord(this.coord.y);
    pathStr += `M ${originX} ${originY} `;
    switch (this.direction) {
      case 0:
        pathStr += ` H ${this.centerCoord(this.coord.x + 1)}`;
        break;
      case 90:
        pathStr += ` V ${this.centerCoord(this.coord.y - 1)}`;
        break;
      case 180:
        pathStr += ` H ${this.centerCoord(this.coord.x - 1)}`;
        break;
      case 270:
        pathStr += ` V ${this.centerCoord(this.coord.y + 1)}`;
        break;
      default:
        throw new Error(`Laser has wrong direction: ${this.direction}°`);
    }
    if (this.probability < 0.001) {
      return '';
    }
    return pathStr;
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number, tileSize = 64): number {
    return (val + 0.5) * tileSize;
  }

  /**
   * Export particle interface in primitives
   * @returns particle interface
   */
  exportParticle(): ParticleInterface {
    return {
      coord: this.coord,
      direction: this.direction,
      intensity: this.intensity,
      phase: this.phase,
      are: this.are,
      aim: this.aim,
      bre: this.bre,
      bim: this.bim
    };
  }

  /**
   * Create a particle from a particle interface
   * @param obj particle interface
   */
  static importParticle(obj: ParticleInterface): Particle {
    const coord = Coord.importCoord(obj.coord);
    return new Particle(
      coord,
      obj.direction,
      obj.intensity,
      obj.phase,
      obj.are,
      obj.aim,
      obj.bre,
      obj.bim
    );
  }

  /**
   * Create a dummy particle
   * @returns dummy particle
   */
  static createDummy(): Particle {
    const coord = new Coord(0, 0);
    return new Particle(coord, 0);
  }

  /**
   * Convert particles to a string representation
   * @param particles list of particles
   * @returns string
   */
  static manyToString(particles: Particle[]): string {
    let result = '';
    particles.forEach((particle) => {
      result += particle.toString();
    });
    return result;
  }
}
