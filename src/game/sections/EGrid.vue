<template>
  <div class="container">
    <div class="svg-container">
      <svg class="grid" :width="totalWidth" :height="totalHeight" ref="grid">
        <!-- DOTS -->
        <g v-for="(row, y) in level.grid.rows + 1" :key="y">
          <g v-for="(column, x) in level.grid.cols + 1" :key="x">
            <circle :cx="x * tileSize" :cy="y * tileSize" r="1" fill="#edeaf4" />
          </g>
        </g>

        <!-- LASER PATH -->
        <g
          v-for="(laser, index) in individualLaserPath"
          :key="'laser' + index"
          :v-if="individualLaserPath.length > 0"
          class="lasers"
        >
          <path :d="laser" stroke-dasharray="8 8" fill="transparent" stroke="red" stroke-width="3" />
        </g>

        <!-- CELLS -->
        <QCell
          v-for="(cell, i) in level.grid.cells"
          :key="'cell' + i"
          :cell="cell"
          :tileSize="tileSize"
          @click.native="rotate(cell)"
        />

        <!-- PHOTONS -->
        <g
          v-for="(particle, index) in activeFrame.quantum"
          :key="'particle' + index"
          :v-if="frame.quantum.length > 0"
          :style="computeParticleStyle(particle)"
          class="photons"
        >
          <photon
            name
            :intensity="particle.intensity"
            :are="particle.a.re"
            :aim="particle.a.im"
            :bre="particle.b.re"
            :bim="particle.b.im"
            :width="64"
            :height="64"
            :margin="0"
            :display-magnetic="true"
            :display-electric="false"
            :display-gaussian="false"
            :sigma="0.25"
          />
        </g>
      </svg>
    </div>
    <div class="btn-group">
      <span
        v-for="(frame, index) in frames"
        :key="'frame' + index"
        @mouseover="setFrame(frame.step)"
      >
        <button
          v-if="frameNumber === frame.step"
          @mouseover="setFrame(frame.step)"
          class="selected"
        >{{frame.step}}</button>
        <button v-else @mouseover="setFrame(frame.step)">{{frame.step}}</button>
      </span>
    </div>
    <ol class="kets">
      <li
        v-for="(frame, index) in frames"
        :key="'frame-ket-' + index"
        @mouseover="setFrame(frame.step)"
      >{{ frameToKet(frame) }}</li>
    </ol>
  </div>
</template>

<script lang="ts">
import cloneDeep from 'lodash.clonedeep';
import { Vue, Prop, Component } from 'vue-property-decorator';
import {
	Level,
	Particle,
	Frame,
	Grid,
	Cell,
	ParticleInterface,
	CellInterface,
	Coord,
	LevelInterface
} from 'quantumweasel';
import Photon from '../Photon.vue';
import QCell from '../QCell.vue';

const defaultLevel: Level = Level.importLevel({
  id: 1337,
  name: 'default',
  group: 'Encyclopedia',
  description: 'default',
  grid: {
    cols: 3,
    rows: 3,
    cells: [
      {
        coord: { x: 0, y: 1 },
        element: 'Laser',
        rotation: 0,
        active: true,
        frozen: true
      }
    ]
  },
  hints: [],
  goals: []
});

@Component({
	components: {
		Photon,
		QCell
	}
})
export default class EGrid extends Vue {
  @Prop({ default: () => defaultLevel }) readonly level!: Level;
  @Prop({ default: 4 }) readonly step!: number;

  tileSize: number = 64;
  frame: Frame = new Frame(this.level);
  frames: Frame[] = [this.frame];
  frameNumber: number = 0;

  $refs!: {
    grid: HTMLElement;
  };

  created() {
    this.createFrames(10);
    this.setFrame(this.step);
    // window.addEventListener('resize', this.assessTileSize);
  }

	/**
	 * Clipping the value of the frameNumber to be displayed
	 */
	setFrame(val: number) {
		if (val < 0) {
			val = 0;
		}
		if (val >= this.frames.length - 1) {
			val = this.frames.length - 1;
		}
		this.frameNumber = val;
	}

	mounted() {
		this.assessTileSize();
	}

  createFrames(number = 25) {
    for (let index = 0; index < number; index += 1) {
			const lastFrameCopy = cloneDeep(this.lastFrame);
      const nextFrame = lastFrameCopy.next();
      if (nextFrame.quantum.length > 0) {
        this.frames.push(nextFrame);
      } else {
        break;
      }
    }
  }

	createNextFrame() {
		const lastFrameCopy = cloneDeep(this.lastFrame);
		const nextFrame = lastFrameCopy.next();
		this.frames.push(nextFrame);
	}

	get activeFrame(): Frame {
		return this.frames[this.frameNumber];
	}

	get lastFrame(): Frame {
		return this.frames[this.frames.length - 1];
	}

	assessTileSize() {
		const currentWidth = this.$refs.grid.getBoundingClientRect().width;
		// this.tileSize = currentWidth / this.grid.cols;
		this.tileSize = 64;
	}

	get lasers(): ParticleInterface[] {
		return this.level.grid.computePaths();
	}

	get totalWidth(): number {
		return this.level.grid.cols * this.tileSize;
	}
	get totalHeight(): number {
		return this.level.grid.rows * this.tileSize;
	}

	computeParticleStyle(particle: ParticleInterface): {} {
		const originX = this.centerCoord(particle.coord.x);
		const originY = this.centerCoord(particle.coord.y);
		return {
			'transform-origin': `${originX}px ${originY}px`,
			transform: `
				rotate(${particle.direction}deg)
				translate(${particle.coord.x * this.tileSize}px, ${particle.coord.y * this.tileSize}px)`
		};
	}

	/**
	 * Compute the cell center at a specific coordinate for grid dots
	 * @returns x, y pixel coordinates
	 */
	centerCoord(val: number): number {
		return (val + 0.5) * this.tileSize;
	}

  /**
   * Cell rotation
   */
  rotate(cell: Cell) {
    cell.rotate();
    this.level.grid.set(cell);
    this.reset();
  }

  reset() {
    this.frame = new Frame(this.level);
    this.frames = [this.frame.next()];
    this.frameNumber = 0;
    this.createFrames(10);
    this.setFrame(this.step);
  }

  /**
   * Create laser path through the lasers points
   * @returns SVG laser path
   */
  laserPath(): string {
    let pathStr = '';
    if (this.lasers.length > 0) {
      const originX = this.centerCoord(this.lasers[0].coord.x);
      const originY = this.centerCoord(this.lasers[0].coord.y);
      pathStr += `M ${originX} ${originY} `;
      this.lasers.forEach((laser: any) => {
        const x = this.centerCoord(laser.coord.x);
        const y = this.centerCoord(laser.coord.y);
        pathStr += ` L ${x} ${y} `;
      });
      pathStr += ' ';
    }
    return pathStr;
  }

  get individualLaserPath(): string[] {
    const pathsStr: string[] = [];
    if (this.lasers.length > 0) {
      this.lasers.forEach((laser: any) => {
        let pathStr = '';
        const originX = this.centerCoord(laser.coord.x);
        const originY = this.centerCoord(laser.coord.y);
        pathStr += `M ${originX} ${originY} `;
        switch (laser.direction) {
          case 0:
            pathStr += ` H ${this.centerCoord(laser.coord.x + 1)}`;
            break;
          case 90:
            pathStr += ` V ${this.centerCoord(laser.coord.y - 1)}`;
            break;
          case 180:
            pathStr += ` H ${this.centerCoord(laser.coord.x - 1)}`;
            break;
          case 270:
            pathStr += ` V ${this.centerCoord(laser.coord.y + 1)}`;
            break;
          default:
            throw new Error(`Laser has wrong direction: ${laser.direction}°`);
        }
        pathsStr.push(pathStr);
      });
    }
    return pathsStr;
  }

  /**
   * Create laser path through the lasers points
   * @returns SVG laser path
   */
  photonPath(): string {
    let pathStr = '';
    if (this.frame.quantum.length > 0) {
      const originX = this.centerCoord(this.frame.quantum[0].coord.x);
      const originY = this.centerCoord(this.frame.quantum[0].coord.y);
      pathStr += `M ${originX} ${originY} `;
      this.lasers.forEach((laser: any) => {
        const x = this.centerCoord(laser.coord.x);
        const y = this.centerCoord(laser.coord.y);
        pathStr += ` L ${x} ${y} `;
      });
    }
    return pathStr;
  }

  // HELPING FUNCTIONS
  element(y: number, x: number): CellInterface {
    const cells = this.level.grid.cells.filter(
      (cell: Cell) => cell.coord.x === x && cell.coord.y === y
    );
    if (cells.length > 0) {
      return cells[0].exportCell();
    }
    return {
      coord: { x, y },
      element: 'Void',
      rotation: 0,
      frozen: false
    };
  }

  /**
   * Temporary! I want to work with actual quantum states.
   * Also - quick, dirty, no-LaTeX and pure string
   */
  frameToKet(frame: Frame): string {
    const dirVis = new Map<number, string>();
    dirVis.set(0, '⇢');
    dirVis.set(90, '⇡');
    dirVis.set(180, '⇠');
    dirVis.set(270, '⇣');

    return frame.quantum
      .flatMap((d) => {
        const res = [];
        if (d.a.re !== 0 || d.a.im !== 0) {
          res.push(
            `(${d.a.re.toFixed(2)} + ${d.a.im.toFixed(2)} i) |${d.coord.x} ${
              d.coord.y
            } ${dirVis.get(d.direction)} H⟩`
          );
        }
        if (d.b.re !== 0 || d.b.im !== 0) {
          res.push(
            `(${d.b.re.toFixed(2)} + ${d.b.im.toFixed(2)} i) |${d.coord.x} ${
              d.coord.y
            } ${dirVis.get(d.direction)} V⟩`
          );
        }
        return res;
      })
      .join(' + ');
  }
}
</script>

<style lang="scss" scoped>
.laserPath {
	stroke-dasharray: 8;
	animation-name: dash;
	animation-duration: 4s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	animation-direction: reverse;
}
@keyframes dash {
	to {
		stroke-dashoffset: 64;
	}
}

.container {
  display: inline-block;
  margin-bottom: 30px;
  .svg-container {
    border: 5px solid #666;
  }
}

.btn-group {
  text-align: center;
  width: 100%;

  button {
    background-color: darkmagenta;
    border: 1px solid darko drchid;
    color: white;
    padding: 5px 14px;
    cursor: pointer;

    &:not(:last-child) {
      border-right: none;
    }
  }

	&:after {
		content: '';
		clear: both;
		display: table;
	}

	button:hover {
		background-color: darkorchid;
	}

	.selected {
		background-color: darkred;
	}
}
</style>
