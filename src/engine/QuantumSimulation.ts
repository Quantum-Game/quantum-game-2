import { sumBy, groupBy, map } from 'lodash'
import { Vector, Photons } from 'quantum-tensors'
import { weightedRandomInt } from '@/engine/Helpers'
import { IIndicator, PolEnum, IAbsorption } from '@/engine/interfaces'
import Coord from '@/engine/Coord'
import Grid from '@/engine/Grid'
import Particle from '@/engine/Particle'
import Absorption from '@/engine/Absorption'
import QuantumFrame from '@/engine/QuantumFrame'

/**
 * QUANTUM SIMULATION CLASS
 * Contains the frames of the simulation
 */
export default class QuantumSimulation {
  private grid: Grid
  public frames: QuantumFrame[]

  public constructor(grid: Grid) {
    this.grid = grid
    this.frames = []
  }

  /**
   * Create the initial frame of the simulation
   * Using the polarization defined in the laser json
   * @param pol Override of the starting polarization
   */
  public initializeFromLaser(polOverride?: PolEnum): void {
    // Select initial laser
    const lasers = this.grid.emitters.active.cells
    if (lasers.length !== 1) {
      throw new Error(`Cannot initialize QuantumSimulation. ${lasers.length} != 1 lasers.`)
    }
    // Override laser cell polarization if an optional argument is provided
    const laserIndicator = lasers[0].indicator
    if (polOverride) {
      laserIndicator.polarization = polOverride
    }
    // Create initial frame
    this.frames = []
    const initFrame = new QuantumFrame(this.grid.cols, this.grid.rows)
    initFrame.photons.addPhotonFromIndicator(
      laserIndicator.x,
      laserIndicator.y,
      laserIndicator.direction,
      laserIndicator.polarization
    )
    this.frames.push(initFrame)
  }

  /**
   * Initialize simulation from indicator
   * @param indicator IIndicator
   */
  public initializeFromIndicator(indicator: IIndicator): void {
    this.frames = []
    const frame = new QuantumFrame(this.grid.cols, this.grid.rows)
    frame.photons.addPhotonFromIndicator(
      indicator.x,
      indicator.y,
      indicator.direction,
      indicator.polarization
    )
    this.frames.push(frame)
  }

  intializeFromXYState(posX: number, posY: number, vecDirPol: Vector): void {
    this.frames = []
    const frame = new QuantumFrame(this.grid.cols, this.grid.rows)

    const posInd = Vector.indicator(
      [frame.photons.dimX, frame.photons.dimY],
      [posX.toString(), posY.toString()]
    )
    if (vecDirPol.dimensions[0].name === 'direction') {
      frame.photons.vector = posInd.outer(vecDirPol).toBasisAll('polarization', 'HV')
    } else {
      frame.photons.vector = posInd
        .outer(vecDirPol.permute([1, 0]))
        .toBasisAll('polarization', 'HV')
    }

    this.frames.push(frame)
  }

  /**
   * Get last simulation frame
   * @returns last QuantumFrame
   */
  public get lastFrame(): QuantumFrame {
    return this.frames[this.frames.length - 1]
  }

  /**
   * Compute the next simulation frame
   * @returns QuantumFrame
   */
  public nextFrame(): QuantumFrame {
    if (this.frames.length === 0) {
      throw new Error(
        `Cannot do nextFrame when there are no frames. initializeFromLaser or something else.`
      )
    }
    const frame = QuantumFrame.fromPhotons(this.lastFrame.photons)
    frame.propagateAndInteract(this.grid.operatorList)
    return frame
  }

  /**
   * Compute next frames until probability threshold
   * @param n default number of frames
   * @param stopThreshold stop if probability below threshold
   */
  public computeFrames(n = 20, stopThreshold = 1e-6): void {
    const logging = false
    for (let i = 0; i < n; i += 1) {
      this.frames.push(this.nextFrame())
      if (this.lastFrame.probability < stopThreshold) {
        break
      }
    }
    if (logging) {
      console.debug('POST-SIMULATION LOG:')
      console.debug('probabilityPerFrame', this.probabilityPerFrame)
      console.debug('totalAbsorptionPerFrame', this.totalAbsorptionPerFrame)
      console.debug('totalAbsorptionPerTile', this.absorptions)
      console.debug('An example of realization:')
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
  public get probabilityPerFrame(): number[] {
    return this.frames.map((frame): number => frame.probability)
  }

  /**
   * Quantum state probability of absorption for each frame.
   */
  public get totalAbsorptionPerFrame(): number[] {
    return this.frames.map((frame): number => frame.totalProbabilityLoss)
  }

  /**
   * Total (summed over all frames) absorption per tile.
   * {x: -1, y: -1, probability: ...} means falling of the board.
   * @todo If needed, I we can add exact (off-board) cooardinates of all lost photons.
   * @returns E.g.
   * [{x: 2, y: 1, probability: 0.25}, {x: 3, y: 5, probability: 0.25}, {x: -1, y: -1, probability: 0.25}]
   */
  public get totalIAbsorptionPerTile(): IAbsorption[] {
    const perTile = groupBy(
      this.frames.flatMap((frame) => frame.absorptions),
      (absorption: IAbsorption) => `(${absorption.coord.x}.${absorption.coord.y})`
    )
    return map(perTile, (absorptions) => ({
      coord: absorptions[0].coord,
      probability: sumBy(absorptions, 'probability'),
    }))
  }

  /**
   * Convert IAbsorption to Absorption class instances
   * Filter the escaping particle absorption events
   * @param IAbsorption[]
   * @returns absorption instance list (cell, probability)
   */
  public get absorptions(): Absorption[] {
    const absorptions: Absorption[] = []
    this.totalIAbsorptionPerTile.forEach((absorptionI: IAbsorption): void => {
      const coord = Coord.importCoord(absorptionI.coord)
      if (!coord.outOfGrid) {
        const cell = this.grid.get(coord)
        cell.energized = true
        absorptions.push(new Absorption(cell, absorptionI.probability))
      }
    })
    return absorptions
  }

  /**
   * Check for a detection event with its coordinates
   * @param coord coord to check for detection
   */
  public isDetectionEvent(coord: Coord): boolean {
    const coords = this.absorptions.map(
      (absorption): Coord => {
        return Coord.importCoord(absorption.cell.coord)
      }
    )
    return coords.includes(coord)
  }

  /**
   * Retrieve a list of all the particles for quantum path computation
   * @returns particle list
   */
  public get allParticles(): Particle[] {
    const result: Particle[] = []
    this.frames.forEach((frame): void => {
      frame.particles.forEach((particle): void => {
        result.push(particle)
      })
    })
    return result
  }

  /**
   * Create a random realization. So - the state is normalized, until a successful measurement.
   * @remark So far for 1 particle.
   * @todo Make it work for more particles.
   * @todo Maybe make it another object? Or use QuantumFrame?
   */
  public sampleRandomRealization(): {
    statePerFrame: Photons[]
    probability: number
    step: number
    coord: Coord
  } {
    // first, which frame
    const lastId = weightedRandomInt(this.totalAbsorptionPerFrame, false)
    // -1 if no measurement, and we need to deal with that
    const lastFrameAbs = this.frames[lastId].absorptions
    const absorptionId = weightedRandomInt(
      lastFrameAbs.map((d): number => d.probability),
      true
    )
    const absorption = lastFrameAbs[absorptionId]
    const states = this.frames.slice(0, lastId).map((frame): Photons => frame.photons.normalize())

    // TO FIX: should NOT use Coord object, just absorption.coord
    const coord = Coord.importCoord(absorption.coord)

    return {
      statePerFrame: states,
      probability: absorption.probability,
      step: lastId,
      coord: coord,
    }
  }
}
