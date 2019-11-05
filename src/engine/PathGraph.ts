import { Graph, alg } from 'graphlib';
import QuantumSimulation from '@/engine/QuantumSimulation';
import QuantumFrame from '@/engine/QuantumFrame';
import Particle from '@/engine/Particle';

interface fpInterface {
  fIndex: number;
  pIndex: number;
}

// Create a new directed graph
export default class PathGraph {
  graph: Graph;
  qs: QuantumSimulation;

  constructor(qs: QuantumSimulation) {
    this.graph = new Graph({ directed: true });
    this.qs = qs;
  }

  /**
   * Creates a directed acyclical graph from the quantum simulation frames
   * @returns dag
   */
  processFrames() {
    // if (this.qs.frames.length === 0) {
    //   throw new Error('No quantum simulation frames...');
    // }
    this.qs.frames.forEach((frame: QuantumFrame, fIndex: number) => {
      frame.particles.forEach((particle: Particle, pIndex: number) => {
        const fpInterface: fpInterface = { fIndex, pIndex };
        const uid = PathGraph.createUid(fpInterface);
        const particleI = particle.exportParticle();
        this.graph.setNode(uid, particleI);
        // Set edges from particle directions
        this.findParent(fpInterface).forEach((parentUid: string) => {
          this.graph.setEdge(uid, parentUid, 1);
          // this.graph.setEdge(parentUid, uid, 1);
        });
      });
    });
    console.log(`NODES: ${this.graph.nodes()}`);
  }

  /**
   * Find the parents of a particle from a specific frame
   * @param particle Particle
   * @param frameIndex number
   */
  findParent(fpInterface: fpInterface): string[] {
    const particle = this.qs.frames[fpInterface.fIndex].particles[fpInterface.pIndex];
    const parents: string[] = [];
    if (fpInterface.fIndex > 0) {
      const frame = this.qs.frames[fpInterface.fIndex];
      const parentFrame = this.qs.frames[fpInterface.fIndex - 1];
      parentFrame.particles.forEach((parentParticle: Particle, pIndex: number) => {
        // Check for parent
        if (parentParticle.nextCoord().equal(particle)) {
          const parentUid = `particle-${fpInterface.fIndex - 1}-${pIndex}`;
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
    console.log(`CHILDRENS: ${successors}`);
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
    const parentUid: string = PathGraph.createUid({ fIndex: frameIndex, pIndex: particleIndex });
    const originX = this.centerCoord(root.coord.x);
    const originY = this.centerCoord(root.coord.y);
    svgPath += `M ${originX} ${originY} `;

    const sink = this.sinks[0];
    const source = this.sources[0];

    // Compute Dijkstra paths
    const paths = alg.dijkstra(this.graph, source);
    console.log(paths);
    console.log('SINK: ' + sink);
    console.log('SOURCE: ' + source);

    let sinkPath = paths[sink];

    while (sinkPath.distance !== 0) {
      const uid = sinkPath.predecessor;
      const particle = this.fromUid(uid);
      const x = this.centerCoord(particle.coord.x);
      const y = this.centerCoord(particle.coord.y);
      svgPath += ` L ${x} ${y} `;
      sinkPath = paths[uid];
    }
    console.log(svgPath);
    return svgPath;
  }

  get sources() {
    return this.graph.sources();
  }

  get sinks() {
    return this.graph.sinks();
  }

  /**
   * Compute SVG path
   * @param frameIndex
   * @param particleIndex
   */
  // computePath(frameIndex: number, particleIndex: number): string {
  //   let svgPath = '';
  //   const root: Particle = this.qs.frames[frameIndex].particles[particleIndex];
  //   const originX = this.centerCoord(root.coord.x);
  //   const originY = this.centerCoord(root.coord.y);
  //   svgPath += `M ${originX} ${originY} `;

  //   this.qs.frames.forEach((frame, fIndex) => {
  //     frame.particles.forEach((particle, pIndex) => {
  //       if (fIndex > 0) {
  //         const fpInterface: fpInterface = { fIndex, pIndex };
  //         // Check for parent
  //         const x = this.centerCoord(particle.coord.x);
  //         const y = this.centerCoord(particle.coord.y);
  //         svgPath += ` L ${x} ${y} `;
  //         const parentFrame = this.qs.frames[fpInterface.fIndex - 1];

  //         let parents = [];
  //         parentFrame.particles.forEach((parentParticle: Particle) => {
  //           if (parentParticle.nextCoord().equal(particle)) {
  //             // const xParent = this.centerCoord(parentParticle.coord.x);
  //             // const yParent = this.centerCoord(parentParticle.coord.y);
  //             // svgPath += ` L ${xParent} ${yParent} `;
  //           }
  //         });
  //       }
  //     });
  //   });
  //   console.log(svgPath);
  //   return svgPath;
  // }

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
   * @param frameIndex
   * @param particle
   */
  static createUid(fpInterface: fpInterface): string {
    return `particle-${fpInterface.fIndex}-${fpInterface.pIndex}`;
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number, tileSize = 64): number {
    return (val + 0.5) * tileSize;
  }
}
