import * as dagre from 'dagre';
import { Graph, alg } from 'graphlib';
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
    this.graph = new dagre.graphlib.Graph({ directed: true })
      .setGraph({})
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
        this.graph.setNode(uid, { label: `${pIndex}` });
        // Set edges from particle directions
        this.findParent(fIndex, pIndex).forEach((parentUid: string) => {
          this.graph.setEdge(uid, parentUid);
        });
      });
    });
    // Round the corners of the nodes
    this.graph.nodes().forEach((v: any) => {
      const node = this.graph.node(v);
      node.rx = 5;
      node.ry = 5;
    });
    // console.log(`NODES: ${this.graph.nodes()}`);
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
          const parentUid = `particle-${fIndex - 1}-${parentIndex}`;
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
    // console.log(`CHILDRENS: ${successors}`);
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

    // Compute Dijkstra paths
    // const paths = alg.dijkstra(this.graph, source);
    // console.log(paths);
    // console.log(`SINK: ${sink}`);
    // console.log(`SOURCE: ${source}`);

    // let sinkPath = paths[sink];

    // while (sinkPath.distance !== 0) {
    //   const uid = sinkPath.predecessor;
    //   const particle = this.fromUid(uid);
    //   const x = this.centerCoord(particle.coord.x);
    //   const y = this.centerCoord(particle.coord.y);
    //   svgPath += ` L ${x} ${y} `;
    //   sinkPath = paths[uid];
    // }
    // console.log(svgPath);
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
    return `particle-${fIndex}-${pIndex}`;
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number, tileSize = 64): number {
    return (val + 0.5) * tileSize;
  }
}
