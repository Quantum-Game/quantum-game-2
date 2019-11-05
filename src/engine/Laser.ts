import { ParticleInterface, GridInterface } from '@/engine/interfaces';
import Grid from '@/engine/Grid';
import Particle from '@/engine/Particle';
import Cell from '@/engine/Cell';

export default class Laser {
  public grid: Grid;
  public paths: ParticleInterface[];

  constructor(grid: Grid) {
    this.grid = grid;
    const initialParticles = this.fireLasers();
    this.paths = this.computePaths();
  }

  /**
   * Fire all the lasers
   * @returns the particles fired
   */
  public fireLasers(): Particle[] {
    return this.grid.lasers.active.cells.map((laser) => {
      if (laser.active) {
        return new Particle(laser.coord, laser.rotation, 1, 0);
      }
      throw Error('Laser is inactive...');
    });
  }

  /**
   * Compute the laser path of a particle
   * @param particle Particle which needs its laser path computed
   * @param maxFrames Max number of frames to compute
   * @returns list of "path particles"
   */
  laserPath(initParticle: Particle, maxFrames = 40): Particle[][] {
    // Make a depp clone of the particle
    let alive: Particle[] = [initParticle];
    const dead: Particle[] = [];
    // Simulate path with a specific number of frames
    for (let i = 0; i < maxFrames; i += 1) {
      // Propagate each living particle
      // eslint-disable-next-line
      alive.forEach((particle: Particle) => {
        particle.next();
        // Zero the intensity of escaping particles
        if (!this.grid.includes(particle.coord)) {
          // eslint-disable-next-line no-param-reassign
          particle.intensity = 0;
        }
        // Absorption
        this.grid.absorbers.cells.forEach((absorber: Cell) => {
          if (particle.on(absorber)) {
            // eslint-disable-next-line no-param-reassign
            particle.intensity -= particle.intensity * absorber.element.absorption;
          }
        });
        // Reflection
        this.grid.mirrors.cells.forEach((mirror: Cell) => {
          if (particle.on(mirror)) {
            // eslint-disable-next-line no-param-reassign
            particle.direction = (2 * mirror.rotation - particle.direction + 360) % 360;
          }
        });
        this.grid.polarbeamsplitters.cells.forEach((polar: Cell) => {
          if (particle.on(polar)) {
            if (polar.rotation === 0) {
              const direction = (2 * (polar.rotation - 45) - particle.direction + 360) % 360;
              alive.push(new Particle(particle.coord, direction, particle.intensity));
            }
            if (polar.rotation === 180) {
              const direction = (2 * (polar.rotation + 45) - particle.direction + 360) % 360;
              alive.push(new Particle(particle.coord, direction, particle.intensity));
            }
          }
        });
        this.grid.beamsplitters.cells.forEach((beamsplitter: Cell) => {
          if (particle.on(beamsplitter)) {
            // Dim the current particle intensity
            // eslint-disable-next-line no-param-reassign
            particle.intensity /= 2;
            // Reflecting particle (create new reflected faded particle)
            const direction = (2 * beamsplitter.rotation - particle.direction + 360) % 360;
            alive.push(new Particle(particle.coord, direction, particle.intensity));
          }
        });
      });
      // Filter the living from the dead
      alive.forEach((particle) => {
        if (!particle.alive) {
          dead.push(particle);
        }
      });
      alive = alive.filter((particle) => {
        return particle.alive;
      });
    }
    // Flatten and dedupe list of particles
    const pathParticles: Particle[][] = [];
    alive = dead.concat(alive);
    alive.forEach((particle) => {
      pathParticles.push(particle.pathParticle);
    });
    return pathParticles;
    // return [...new Set(flatDeep(pathParticles))]
  }

  /**
   * Gives the classical laser path of a specific particle
   * FIXME: Could be refactored
   * @returns a list of coordinates
   * */
  computePaths(): Particle[] {
    const laserParticles = this.fireLasers();
    const particles = laserParticles.map((laserParticle: Particle) => {
      return [...new Set(this.laserPath(laserParticle, 40).flat())];
    });
    return particles.flat();
  }
}
