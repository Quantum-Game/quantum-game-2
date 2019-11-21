import _ from 'lodash';
import { Photons } from 'quantum-tensors';
import { weightedRandomInt } from './utils';
import QuantumFrame from './QuantumFrame';
import Grid from './Grid';
import { GridInterface, AbsorptionInterface } from './interfaces';
import Cell from './Cell';
import Particle from './Particle';
import { Coord } from './classes';
import Absorption from './Absorption';

/**
 * QUANTUM SIMULATION CLASS
 * Contains the frames of the simulation
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
    const lasers = this.board.emitters.active.cells;
    if (lasers.length !== 1) {
      throw new Error(`Cannot initialize QuantumSimulation. ${lasers.length} != 1 lasers.`);
    }
    const laser = lasers[0];

    const frame = new QuantumFrame(this.board.cols, this.board.rows);
    frame.photons.addPhotonIndicator(laser.coord.x, laser.coord.y, laser.ascii, pol);
    this.frames.push(frame);
  }

  initializeFromIndicator(x: number, y: number, dir = '>', pol = 'H'): void {
    this.frames = [];
    if (this.frames.length !== 0) {
      throw new Error(
        `Cannot initialize QuantumSimulation. Already ${this.frames.length} != 0 frames.`
      );
    }
    const frame = new QuantumFrame(this.board.cols, this.board.rows);
    frame.photons.addPhotonIndicator(x, y, dir, pol);
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

  /**
   * Compute next frames until probability threshold
   * @param n default number of frames
   * @param stopThreshold stop if probability below threshold
   */
  nextFrames(n: number = 20, stopThreshold = 1e-6): void {
    const logging = false;
    for (let i = 0; i < n; i += 1) {
      this.nextFrame();
      if (this.lastFrame.probability < stopThreshold) {
        break;
      }
    }
    if (logging) {
      console.debug('POST-SIMULATION LOG:');
      console.debug('probabilityPerFrame', this.probabilityPerFrame);
      console.debug('totalAbsorptionPerFrame', this.totalAbsorptionPerFrame);
      console.debug('totalAbsorptionPerTile', this.totalAbsorptionPerTile);
      console.debug('An example of realization:');
      // const randomSample = this.sampleRandomRealization();
      // randomSample.statePerFrame.forEach((state) => console.debug(state.ketString()));
      // console.debug(
      //   `Detected: in ${randomSample.fate.name} at (${randomSample.fate.x},${randomSample.fate.y})`
      // );
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
  get totalAbsorptionInterfacePerTile(): AbsorptionInterface[] {
    return _(this.frames)
      .flatMap((frame) => frame.absorptions)
      .groupBy((absorption) => `(${absorption.coord.x}.${absorption.coord.y})`)
      .values()
      .map((absorptions) => ({
        coord: absorptions[0].coord,
        probability: _.sumBy(absorptions, 'probability')
      }))
      .value();
  }

  /**
   * Convert AbsorptionInterface to Absorption class instances
   * @param AbsorptionInterface[]
   */
  get totalAbsorptionPerTile(): Absorption[] {
    return this.totalAbsorptionInterfacePerTile.map((absorptionI: AbsorptionInterface) => {
      const coord = Coord.importCoord(absorptionI.coord);
      const cell = this.board.get(coord);
      cell.energized = true;
      return new Absorption(cell, absorptionI.probability);
    });
  }

  /**
   * Check for a detection event with its coordinates
   * @param coord coord to check for detection
   */
  isDetectionEvent(coord: Coord): boolean {
    const coords = this.totalAbsorptionPerTile.map((absorption) => {
      return Coord.importCoord(absorption.coord);
    });
    return _.includes(coords, coord);
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

  /**
   * Create a random realization. So - the state is normalized, until a successful measurement.
   * @remark So far for 1 particle.
   * @todo Make it work for more particles.
   * @todo Maybe make it another object? Or use QuantumFrame?
   */
  sampleRandomRealization(): {
    statePerFrame: Photons[];
    probability: number;
    fate: { x: number; y: number; name: string };
  } {
    // first, which frame
    const [...totalAbsorptionPerFrame] = this.totalAbsorptionPerFrame;
    const lastId = weightedRandomInt(this.totalAbsorptionPerFrame, false);
    // -1 if no measurement, and we need to deal with that
    const lastFrameAbs = this.frames[lastId].absorptions;
    const absorptionId = weightedRandomInt(lastFrameAbs.map((d) => d.probability), true);
    const absorption = lastFrameAbs[absorptionId];
    const states = this.frames.slice(0, lastId).map((frame) => frame.photons.normalize());

    const { x, y } = absorption.coord;
    const name = x === -1 && y === -1 ? 'OutOfBoard' : this.board.cellFromXY(x, y).element.name;

    return {
      statePerFrame: states,
      probability: absorption.probability,
      fate: { x, y, name }
    };
  }
}
