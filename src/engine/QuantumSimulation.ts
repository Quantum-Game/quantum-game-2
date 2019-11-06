import cloneDeep from 'lodash.clonedeep';
import { GridInterface } from '@/engine/interfaces';
import QuantumFrame from '@/engine/QuantumFrame';
import Grid from '@/engine/Grid';
import Cell from '@/engine/Cell';
import Particle from '@/engine/Particle';

// To add in Vector->Photon->QuantumFrame: copy

// - Grid x and y order
// - Grid does do too many things

// there should be no level-simulation circular dependecy!

/**
 * Rewrite of Frame.
 */
export default class QuantumSimulation {
  board: Grid;
  frames: QuantumFrame[];

  constructor(board: Grid) {
    this.board = board;
    this.frames = [];
  }

  static importBoard(gridJSON: GridInterface): QuantumSimulation {
    const cells = gridJSON.cells.map((jsonCell) => Cell.importCell(jsonCell));
    const board = new Grid(gridJSON.rows, gridJSON.cols, cells);
    return new QuantumSimulation(board);
  }

  get lastFrame() {
    return this.frames[this.frames.length - 1];
  }

  initializeFromLaser(pol = 'V'): void {
    this.frames = [];
    if (this.frames.length !== 0) {
      throw new Error(
        `Cannot initialize QuantumSimulation. Already ${this.frames.length} != 0 frames.`
      );
    }
    const lasers = this.board.lasers.active.cells;
    if (lasers.length !== 1) {
      throw new Error(`Cannot initialize QuantumSimulation. ${lasers.length} != 1 lasers.`);
    }
    const laser = lasers[0];

    const frame = new QuantumFrame(this.board.cols, this.board.rows);
    frame.photons.addPhotonIndicator(laser.coord.x, laser.coord.y, laser.ascii, pol);
    this.frames.push(frame);
  }

  nextFrame(): void {
    if (this.frames.length === 0) {
      throw new Error(
        `Cannot do nextFrame when there are no frames. initializeFromLaser or something else.`
      );
    }
    const lastFrame = cloneDeep(this.lastFrame);
    lastFrame.photons.propagatePhotons();
    lastFrame.photons.actOnSinglePhotons(this.board.operatorList);
    this.frames.push(lastFrame);
  }

  nextFrames(n: number = 20, stopIfProbabilityBelow = 1e-6): void {
    for (let i = 0; i < n; i += 1) {
      this.nextFrame();
      if (this.lastFrame.probability < stopIfProbabilityBelow) {
        this.frames.pop();
        break;
      }
    }
  }

  /**
   * Retrieve a list of all the particles for quantum path computation
   * @returns particle list
   */
  get allParticles(): Particle[] {
    const result: Particle[] = [];
    this.frames.forEach((frame) => {
      frame.particles.forEach((particle) => {
        result.push(particle);
      });
    });
    return result;
  }
}
