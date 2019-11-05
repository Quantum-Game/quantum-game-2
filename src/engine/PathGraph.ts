import { Graph } from 'graphlib';
import QuantumSimulation from '@/engine/QuantumSimulation';
import QuantumFrame from '@/engine/QuantumFrame';
import Particle from '@/engine/Particle';

// Create a new directed graph
export default class PathGraph {
  graph: Graph;
  qs: QuantumSimulation;

  constructor(qs: QuantumSimulation) {
    this.graph = new Graph();
    this.qs = qs;
  }

  /**
   * Creates a directed acyclical graph from the quantum simulation frames
   * @returns dag
   */
  processFrames() {
    if (this.qs.frames.length === 0) {
      throw new Error('No quantum simulation frames...');
    }
    this.qs.frames.forEach((frame: QuantumFrame, i) => {
      frame.particles.forEach((particle: Particle, j: number) => {
        const uid = `particle-${i}-${j}`;
        const particleI = particle.exportParticle();
        this.graph.setNode(uid, particleI);
        // Set edges from particle directions
        if (i !== 0) {
          this.findParent(particle, j).forEach((parentUid: string) => {
            this.graph.setEdge(uid, parentUid);
          });
        }
      });
    });
    console.log(this.graph.edges());
  }

  /**
   * Find the parents of a particle from a specific frame
   * @param particle Particle
   * @param frameIndex number
   */
  findParent(particle: Particle, frameIndex: number): string[] {
    const parents: string[] = [];
    const frame = this.qs.frames[frameIndex];
    const parentFrame = this.qs.frames[frameIndex - 1];
    parentFrame.particles.forEach((parentParticle: Particle, pIndex: number) => {
      // Check for parent
      if (parentParticle.nextCoord().equal(particle)) {
        const parentUid = `particle-${frameIndex - 1}-${pIndex}`;
        parents.push(parentUid);
      }
    });
    return parents;
  }
}
