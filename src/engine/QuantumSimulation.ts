import _ from 'lodash';
import { Photons } from 'quantum-tensors';
import { weightedRandomInt, startingDirection, startingPolarization } from '@/engine/Helpers';
import { GridInterface, AbsorptionInterface } from '@/engine/interfaces';
import Coord from '@/engine/Coord';
import Grid from '@/engine/Grid';
import Particle from '@/engine/Particle';
import Absorption from '@/engine/Absorption';
import QuantumFrame from '@/engine/QuantumFrame';

/**
 * Indicator interface for glue code with qt Photons
 */
export interface IndicatorInterface {
  x: number;
  y: number;
  direction: number;
  polarization: number;
}

/**
 * QUANTUM SIMULATION CLASS
 * Contains the frames of the simulation
 */
export default class QuantumSimulation {
  grid: Grid;
  frames: QuantumFrame[];

  constructor(grid: Grid) {
    this.grid = grid;
    this.frames = [];
  }

  /**
   * Create the initial frame of the simulation
   * If a polarization is specified in the laser element then start with this polarization.
   * @param pol Starting polarization
   */
  initializeFromLaser(): void {
    // Select initial laser
    const lasers = this.grid.emitters.active.cells;
    if (lasers.length !== 1) {
      throw new Error(`Cannot initialize QuantumSimulation. ${lasers.length} != 1 lasers.`);
    }
    const laser = lasers[0];
    // Create initial frame
    this.frames = [];
    const initFrame = new QuantumFrame(this.grid.cols, this.grid.rows);
    initFrame.photons.addPhotonIndicator(
      laser.coord.x,
      laser.coord.y,
      startingDirection(laser.rotation),
      startingPolarization(laser.polarization)
    );
    this.frames.push(initFrame);
  }

  /**
   * Initialize simulation from indicator (ket?)
   * TODO: Use enum instead of two one character strings
   * @param x number
   * @param y number
   * @param dir string
   * @param pol string
   */
  initializeFromIndicator(x: number, y: number, dir = '>', pol = 'H'): void {
    this.frames = [];
    if (this.frames.length !== 0) {
      throw new Error(
        `Cannot initialize QuantumSimulation. Already ${this.frames.length} != 0 frames.`
      );
    }
    const frame = new QuantumFrame(this.grid.cols, this.grid.rows);
    frame.photons.addPhotonIndicator(x, y, dir, pol);
    this.frames.push(frame);
  }

  /**
   * Get last simulation frame
   * @returns last QuantumFrame
   */
  get lastFrame(): QuantumFrame {
    return this.frames[this.frames.length - 1];
  }

  /**
   * Compute the next simulation frame
   * TODO: Should return a new frame which is then added to frames
   */
  nextFrame(): void {
    if (this.frames.length === 0) {
      throw new Error(
        `Cannot do nextFrame when there are no frames. initializeFromLaser or something else.`
      );
    }
    const frame = QuantumFrame.fromPhotons(this.lastFrame.photons);
    frame.propagateAndInteract(this.grid.operatorList);
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
      console.debug('totalAbsorptionPerTile', this.absorptions);
      console.debug('An example of realization:');
      // const randomSample = this.sampleRandomRealization();
      // randomSample.statePerFrame.forEach((state) => console.debug(state.ketString()));
      // console.debug(
      //   `Detected: in ${randomSample.fate.name} at (${randomSample.fate.x},${randomSample.fate.y})`
      // );
    }
  }

  /**
   * Quantum state probability for each frame.
   * @returns probability of frame
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
   * Filter the escaping particle absorption events
   * @param AbsorptionInterface[]
   * @returns absorption instance list (cell, probability)
   */
  get absorptions(): Absorption[] {
    const absorptions: Absorption[] = [];
    this.totalAbsorptionInterfacePerTile.forEach((absorptionI: AbsorptionInterface) => {
      const coord = Coord.importCoord(absorptionI.coord);
      if (!coord.outOfGrid) {
        const cell = this.grid.get(coord);
        cell.energized = true;
        absorptions.push(new Absorption(cell, absorptionI.probability));
      }
    });
    return absorptions;
  }

  /**
   * Check for a detection event with its coordinates
   * @param coord coord to check for detection
   */
  isDetectionEvent(coord: Coord): boolean {
    const coords = this.absorptions.map((absorption) => {
      return Coord.importCoord(absorption.cell.coord);
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

    // TODO: ugly, needs refactor
    const { x, y } = absorption.coord;
    const name = x === -1 && y === -1 ? 'OutOfBoard' : this.grid.cellFromXY(x, y).element.name;

    return {
      statePerFrame: states,
      probability: absorption.probability,
      fate: { x, y, name }
    };
  }
}
