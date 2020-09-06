import * as dagre from 'dagre'
import { Frame, Simulation } from 'quantum-tensors'
import Particle from '@/engine/Particle'
import Coord from '@/engine/Coord'
import { IParticle } from '@/engine/interfaces'

/**
 * MULTIVERSE GRAPH CLASS
 * Creates a graph after post processing the current simulation frames
 */
export default class MultiverseGraph {
  public graph: any // eslint-disable-line
  public simulation: Simulation

  public constructor(simulation: Simulation) {
    this.simulation = simulation
    // https://github.com/dagrejs/dagre/wiki#a-note-on-rendering
    this.graph = new dagre.graphlib.Graph({ directed: true })
      .setGraph({
        nodesep: 5,
        ranksep: 20,
        marginy: 10,
        rankdir: 'TB',
      })
      .setDefaultEdgeLabel(() => ({}))
    this.processFrames()
    dagre.layout(this.graph)
  }

  /**
   * Filter absorption at a specific coord
   * @param x
   * @param y
   * @returns boolean
   */
  public isDetectionEvent(x: number, y: number): boolean {
    const coord = Coord.importCoord({ x, y })
    const coords = this.simulation.totalAbsorptionPerTile.map(
      (absorption: { x: number; y: number; probability: number }): Coord =>
        Coord.importCoord({ x: absorption.x, y: absorption.y })
    )
    return coords.includes(coord)
  }

  /**
   * Creates a directed acyclical graph from the quantum simulation frames
   * @returns dag
   */
  public processFrames(): void {
    this.simulation.frames.forEach((frame: Frame, fIndex: number): void => {
      frame.particles.forEach((particleI: IParticle, pIndex: number): void => {
        const particle = Particle.importParticle(particleI)
        const uid = MultiverseGraph.createUid(fIndex, pIndex)
        const detectionEvent = this.isDetectionEvent(particle.x, particle.y)

        this.graph.setNode(uid, {
          label: fIndex,
          fIndex,
          pIndex,
          height: 15,
          width: 15,
          detectionEvent,
        })
        // Set edges from particle directions
        this.findParent(fIndex, pIndex).forEach((parentUid: string): void => {
          this.graph.setEdge(parentUid, uid, {
            label: `${parentUid} -> ${uid}`,
            width: particle.probability * 4 + 1,
            fIndex,
            pIndex,
          })
        })
      })
    })
    // Round the corners of the nodes
    this.graph.nodes().forEach((v: string): void => {
      const node = this.graph.node(v)
      node.rx = 5
      node.ry = 5
      node.leaf = this.isLeaf(v)
      node.root = this.isRoot(v)
    })
  }

  /**
   * Find the parents of a particle from a specific frame
   * @param particle Particle
   * @param frameIndex number
   */
  private findParent(fIndex: number, pIndex: number): string[] {
    const particleI = this.simulation.frames[fIndex].particles[pIndex]
    const particle = Particle.importParticle(particleI)
    const parents: string[] = []
    if (fIndex > 0) {
      const parentFrame = this.simulation.frames[fIndex - 1]
      parentFrame.particles.forEach((parentParticleI: IParticle, parentIndex: number): void => {
        // Check for parent
        const parentParticle = Particle.importParticle(parentParticleI)
        if (parentParticle.nextCoord().equal(particle)) {
          const parentUid = `particle_${fIndex - 1}_${parentIndex}`
          parents.push(parentUid)
        }
      })
    }
    return parents
  }

  /**
   * Find successors of a particle, used to generate photon path
   * @returns nodes
   */
  public successors(particleUid: string): string | undefined {
    const successors = this.graph.children(particleUid)
    return successors
  }

  /**
   * Compute SVG path
   * @param frameIndex
   * @param particleIndex
   */
  public computePath(frameIndex: number, particleIndex: number): string {
    this.processFrames()
    let svgPath = ''
    const rootI: IParticle = this.simulation.frames[frameIndex].particles[particleIndex]
    const root = Particle.importParticle(rootI)
    const originX = this.centerCoord(root.coord.x)
    const originY = this.centerCoord(root.coord.y)
    svgPath += `M ${originX} ${originY} `
    return svgPath
  }

  /**
   * Sinks are where elements don't have childrens
   * @returns roots string names
   */
  public get roots(): string[] {
    return this.graph.sources()
  }

  /**
   * Leafs are where elements don't have childrens
   * @returns leafs string names
   */
  public get leafs(): string[] {
    return this.graph.sinks()
  }

  /**
   * Check if a node is a leaf
   * @returns leafs string names
   */
  public isLeaf(uid: string): boolean {
    return this.leafs.includes(uid)
  }

  /**
   * Check if a node is a leaf
   * @returns leafs string names
   */
  public isRoot(uid: string): boolean {
    return this.roots.includes(uid)
  }

  /**
   * Create unique id for a particle
   * @param frameIndex
   * @param particle
   */
  public fromIndices(fIndex: number, pIndex: number): IParticle {
    return this.simulation.frames[fIndex].particles[pIndex]
  }

  /**
   * Create unique id for a particle
   * @param frameIndex
   * @param particle
   */
  public fromUid(uid: string): IParticle {
    const fIndex = parseInt(uid.match(/\d/g)![0], 10) /* eslint-disable-line */
    const pIndex = parseInt(uid.match(/\d/g)![1], 10) /* eslint-disable-line */
    return this.simulation.frames[fIndex].particles[pIndex]
  }

  /**
   * Create unique id for a particle
   * @param fIndex
   * @param pIndex
   * @returns uid string
   */
  public static createUid(fIndex: number, pIndex: number): string {
    return `particle_${fIndex}_${pIndex}`
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  public centerCoord(val: number, tileSize = 64): number {
    return (val + 0.5) * tileSize
  }
}
