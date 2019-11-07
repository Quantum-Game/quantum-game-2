import _ from 'lodash';
import QuantumFrame, { AbsorptionsInterface } from './QuantumFrame';
import Grid from './Grid';
import { GridInterface } from './interfaces';
import Cell from './Cell';
import Particle from './Particle';

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
    const frame = QuantumFrame.fromPhotons(this.lastFrame.photons);
    frame.propagateAndInteract(this.board.operatorList);
    this.frames.push(frame);
  }

  nextFrames(n: number = 20, stopIfProbabilityBelow = 1e-6, logging = true): void {
    for (let i = 0; i < n; i += 1) {
      this.nextFrame();
      if (this.lastFrame.probability < stopIfProbabilityBelow) {
        break;
      }
    }
    if (logging) {
      console.debug('POST-SIMULATION LOG:');
      console.debug('probabilityPerFrame', this.probabilityPerFrame);
      console.debug('totalAbsorptionPerFrame', this.totalAbsorptionPerFrame);
      console.debug('totalAbsorptionPerTile', this.totalAbsorptionPerTile);
    }
  }

  /**
   * Quantum state probability for for a for each frame.
   */
  get probabilityPerFrame(): number[] {
    return this.frames.map((frame) => frame.probability);
  }

  /**
   * Quantum state probability of absorption for each frame.
   */
  get totalAbsorptionPerFrame(): number[] {
    return this.frames.map((frame) => frame.totalProbabilityLoss);
  }

  /**
   * Total (summed over all frames) absorption per tile.
   * {x: -1, y: -1, probability: ...} means falling of the board.
   * @todo If needed, I we can add exact (off-board) cooardinates of all lost photons.
   * @returns E.g.
   * [{x: 2, y: 1, probability: 0.25}, {x: 3, y: 5, probability: 0.25}, {x: -1, y: -1, probability: 0.25}]
   */
  get totalAbsorptionPerTile(): AbsorptionsInterface[] {
    return _(this.frames)
      .flatMap((frame) => frame.absorptions)
      .groupBy((absorption) => `(${absorption.x}.${absorption.y})`)
      .values()
      .map((absorptions) => ({
        x: absorptions[0].x,
        y: absorptions[0].y,
        probability: _.sumBy(absorptions, 'probability')
      }))
      .value();
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

  // TODO: a random realizaiton; but first I need to eat something
}
