import _ from 'lodash';
import { Photons } from 'quantum-tensors';
import { weightedRandomInt } from '@/engine/Helpers';
import { AbsorptionInterface, IndicatorInterface, PolEnum } from '@/engine/interfaces';
import Coord from '@/engine/Coord';
import Cell from '@/engine/Cell';
import Grid from '@/engine/Grid';
import Particle from '@/engine/Particle';
import Absorption from '@/engine/Absorption';
import QuantumFrame from '@/engine/QuantumFrame';

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
   * Using the polarization defined in the laser json
   * @param pol Override of the starting polarization
   */
  initializeFromLaser(polOverride?: PolEnum): void {
    // Select initial laser
    const lasers = this.grid.emitters.active.cells;
    if (lasers.length !== 1) {
      throw new Error(`Cannot initialize QuantumSimulation. ${lasers.length} != 1 lasers.`);
    }
    // Override laser cell polarization if an optional argument is provided
    const laserIndicator = lasers[0].indicator;
    if (polOverride) {
      laserIndicator.polarization = polOverride;
    }
    // Create initial frame
    this.frames = [];
    const initFrame = new QuantumFrame(this.grid.cols, this.grid.rows);
    initFrame.photons.addPhotonIndicator(
      laserIndicator.x,
      laserIndicator.y,
      laserIndicator.direction,
      laserIndicator.polarization
    );
    this.frames.push(initFrame);
  }

  /**
   * Initialize simulation from indicator
   * @param indicator IndicatorInterface
   */
  initializeFromIndicator(indicator: IndicatorInterface): void {
    this.frames = [];
    const frame = new QuantumFrame(this.grid.cols, this.grid.rows);
    frame.photons.addPhotonIndicator(
      indicator.x,
      indicator.y,
      indicator.direction,
      indicator.polarization
    );
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
   * @returns QuantumFrame
   */
  nextFrame(): QuantumFrame {
    if (this.frames.length === 0) {
      throw new Error(
        `Cannot do nextFrame when there are no frames. initializeFromLaser or something else.`
      );
    }
    const frame = QuantumFrame.fromPhotons(this.lastFrame.photons);
    frame.propagateAndInteract(this.grid.operatorList);
    return frame;
  }

  /**
   * Compute next frames until probability threshold
   * @param n default number of frames
   * @param stopThreshold stop if probability below threshold
   */
  computeFrames(n: number = 20, stopThreshold = 1e-6): void {
    const logging = true;
    for (let i = 0; i < n; i += 1) {
      this.frames.push(this.nextFrame());
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
    fate: Cell;
  } {
    // first, which frame
    const [...totalAbsorptionPerFrame] = this.totalAbsorptionPerFrame;
    const lastId = weightedRandomInt(this.totalAbsorptionPerFrame, false);
    // -1 if no measurement, and we need to deal with that
    const lastFrameAbs = this.frames[lastId].absorptions;
    const absorptionId = weightedRandomInt(lastFrameAbs.map((d) => d.probability), true);
    const absorption = lastFrameAbs[absorptionId];
    const states = this.frames.slice(0, lastId).map((frame) => frame.photons.normalize());

    // if particle escape it has at least an adjacent cell inside grid
    const coord = Coord.importCoord(absorption.coord);
    let cell;
    if (this.grid.includes(coord)) {
      cell = this.grid.get(coord);
    } else {
      cell = this.grid.lastCellBeforeEscape(coord);
    }

    return {
      statePerFrame: states,
      probability: absorption.probability,
      fate: cell
    };
  }

  /**
   * Compute particle detection path from sampleRandomRealization
   * @returns fate cell
   */
  get fate(): Cell {
    return this.sampleRandomRealization().fate;
  }
}
