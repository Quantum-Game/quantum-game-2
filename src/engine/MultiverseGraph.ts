import * as dagre from 'dagre';
import _ from 'lodash';
import QuantumSimulation from '@/engine/QuantumSimulation';
import QuantumFrame from '@/engine/QuantumFrame';
import Particle from '@/engine/Particle';

/**
 * MULTIVERSE GRAPH CLASS
 * Creates a graph after post processing the current simulation frames
 */
export default class MultiverseGraph {
  graph: any;
  qs: QuantumSimulation;

  constructor(qs: QuantumSimulation) {
    this.qs = qs;
    // https://github.com/dagrejs/dagre/wiki#a-note-on-rendering
    this.graph = new dagre.graphlib.Graph({ directed: true })
      .setGraph({
        nodesep: 5,
        ranksep: 20,
        marginy: 10,
        rankdir: 'TB'
      })
      .setDefaultEdgeLabel(() => {
        return {};
      });
    this.processFrames();
    dagre.layout(this.graph);
  }

  /**
   * Creates a directed acyclical graph from the quantum simulation frames
   * @returns dag
   */
  processFrames() {
    this.qs.frames.forEach((frame: QuantumFrame, fIndex: number) => {
      frame.particles.forEach((particle: Particle, pIndex: number) => {
        const uid = MultiverseGraph.createUid(fIndex, pIndex);
        const particleI = particle.exportParticle();
        const detectionEvent = this.qs.isDetectionEvent(particle.coord);
        this.graph.setNode(uid, {
          label: fIndex,
          fIndex,
          pIndex,
          height: 15,
          width: 15,
          detectionEvent
        });
        // Set edges from particle directions
        this.findParent(fIndex, pIndex).forEach((parentUid: string) => {
          this.graph.setEdge(parentUid, uid, {
            label: `${parentUid} -> ${uid}`,
            width: particle.probability * 4 + 1,
            fIndex,
            pIndex
          });
        });
      });
    });
    // Round the corners of the nodes
    this.graph.nodes().forEach((v: any) => {
      const node = this.graph.node(v);
      node.rx = 5;
      node.ry = 5;
      node.leaf = this.isLeaf(v);
      node.root = this.isRoot(v);
    });
  }

  /**
   * Find the parents of a particle from a specific frame
   * @param particle Particle
   * @param frameIndex number
   */
  findParent(fIndex: number, pIndex: number): string[] {
    const particle = this.qs.frames[fIndex].particles[pIndex];
    const parents: string[] = [];
    if (fIndex > 0) {
      const frame = this.qs.frames[fIndex];
      const parentFrame = this.qs.frames[fIndex - 1];
      parentFrame.particles.forEach((parentParticle: Particle, parentIndex: number) => {
        // Check for parent
        if (parentParticle.nextCoord().equal(particle)) {
          const parentUid = `particle_${fIndex - 1}_${parentIndex}`;
          parents.push(parentUid);
        }
      });
    }
    return parents;
  }

  /**
   * Find successors of a particle, used to generate photon path
   * @returns nodes
   */
  successors(particleUid: string) {
    const successors = this.graph.children(particleUid);
    return successors;
  }

  /**
   * Compute SVG path
   * @param frameIndex
   * @param particleIndex
   */
  computePath(frameIndex: number, particleIndex: number): string {
    this.processFrames();
    let svgPath = '';
    const root: Particle = this.qs.frames[frameIndex].particles[particleIndex];
    const parentUid: string = MultiverseGraph.createUid(frameIndex, particleIndex);
    const originX = this.centerCoord(root.coord.x);
    const originY = this.centerCoord(root.coord.y);
    svgPath += `M ${originX} ${originY} `;

    const source = this.roots[0];
    const sink = this.leafs[0];
    return svgPath;
  }

  /**
   * Sinks are where elements don't have childrens
   * @returns roots string names
   */
  get roots(): string[] {
    return this.graph.sources();
  }

  /**
   * Leafs are where elements don't have childrens
   * @returns leafs string names
   */
  get leafs(): string[] {
    return this.graph.sinks();
  }

  /**
   * Check if a node is a leaf
   * @returns leafs string names
   */
  isLeaf(uid: string): boolean {
    return _.includes(this.leafs, uid);
  }

  /**
   * Check if a node is a leaf
   * @returns leafs string names
   */
  isRoot(uid: string): boolean {
    return _.includes(this.roots, uid);
  }

  /**
   * Create unique id for a particle
   * @param frameIndex
   * @param particle
   */
  fromIndices(fIndex: number, pIndex: number): Particle {
    return this.qs.frames[fIndex].particles[pIndex];
  }

  /**
   * Create unique id for a particle
   * @param frameIndex
   * @param particle
   */
  fromUid(uid: string): Particle {
    const fIndex = parseInt(uid.match(/\d/g)![0], 10);
    const pIndex = parseInt(uid.match(/\d/g)![1], 10);
    return this.qs.frames[fIndex].particles[pIndex];
  }

  /**
   * Create unique id for a particle
   * @param fIndex
   * @param pIndex
   * @returns uid string
   */
  static createUid(fIndex: number, pIndex: number): string {
    return `particle_${fIndex}_${pIndex}`;
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number, tileSize = 64): number {
    return (val + 0.5) * tileSize;
  }
}
