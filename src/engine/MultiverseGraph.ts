import * as dagre from 'dagre'
import { Particle, Simulation, Coord, particleProbability, reverseDirection } from '@/engine/model'

/**
 * MULTIVERSE GRAPH CLASS
 * Creates a graph after post processing the current simulation frames
 */
export default class MultiverseGraph {
  public graph: dagre.graphlib.Graph<any> // eslint-disable-line
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
  public isDetectionEvent(coord: Coord): boolean {
    return this.simulation.absorptions.has(coord)
  }

  /**
   * Creates a directed acyclical graph from the quantum simulation frames
   * @returns dag
   */
  public processFrames(): void {
    this.simulation.frames.forEach((frame, fIndex): void => {
      frame.particles.forEach((particle: Particle, pIndex: number): void => {
        const uid = MultiverseGraph.createUid(fIndex, pIndex)
        const detectionEvent = this.isDetectionEvent(particle.coord)

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
            width: particleProbability(particle) * 4 + 1,
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
    if (fIndex <= 0 || pIndex < 0) return []

    const particle = this.simulation.frames[fIndex].particles[pIndex]
    const parentCoord = particle.coord.neighbour(reverseDirection(particle.direction))

    return this.simulation.frames[fIndex - 1].particles
      .filter((p) => p.coord === parentCoord)
      .map((_, index) => `particle_${fIndex - 1}_${index}`)
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
   * @param fIndex
   * @param pIndex
   * @returns uid string
   */
  public static createUid(fIndex: number, pIndex: number): string {
    return `particle_${fIndex}_${pIndex}`
  }
}
