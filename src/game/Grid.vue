<template>
  <svg class="grid" :width="totalWidth" :height="totalHeight">
    <!-- DOTS -->
    <g v-for="(row, y) in grid.rows" :key="y">
      <g v-for="(column, x) in grid.cols" :key="x">
        <circle :cx="x * cellSize" :cy="y * cellSize" r="1" fill="#edeaf4" />
      </g>
    </g>

    <!-- TILES -->
    <g class="cells" v-for="(cell, i) in grid.cells" :key="'cell' + i">
      <tile :cell="cell" :cellSize="cellSize" />
    </g>

    <!-- LASER PATH -->
    <path
      :d="laserPath()"
      stroke-dasharray="10 10"
      fill="transparent"
      stroke="red"
      stroke-width="3"
      id="laserPath"
    />

    <!-- PHOTONS -->
    <g
      v-for="(particle, index) in photons"
      :key="'particle' + index"
      :v-if="photons.length > 0"
      class="photons"
      :style="computeParticleStyle(particle)"
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
      <!-- MOTION PATH -->
      <animate dur="6s" repeatCount="indefinite" begin="click">
        <mpath xlink:href="#laserPath" />
      </animate>
    </g>
  </svg>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import Photon from './Photon.vue';
import { IGrid, ICell, Qparticle, ParticleInterface } from '@/types';
import Mirror from './pieces/Mirror.vue';
import Tile from './Tile.vue';


@Component({
  components: {
    Photon,
    Tile
  }
})
export default class Grid extends Vue {
  @Prop({ default: '' }) readonly grid!: IGrid;
  @Prop({ default: '64' }) readonly cellSize!: number;
  @Prop({ default: '' }) readonly lasers!: ParticleInterface[];
  @Prop({ default: '' }) readonly photons!: ParticleInterface[];

  get totalWidth(): number {
    return this.grid.cols * this.cellSize;
  }
  get totalHeight(): number {
    return this.grid.rows * this.cellSize;
  }

  computeParticleStyle(particle: Qparticle): {} {
    const originX = this.centerCoord(particle.x);
    const originY = this.centerCoord(particle.y);
    return {
      'transform-origin': `${originX}px ${originY}px`,
      transform: `
				rotate(${particle.direction}deg)
				translate(${particle.x * this.cellSize}px, ${particle.y * this.cellSize}px)`
    };
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number): number {
    return (val + 0.5) * this.cellSize;
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
			pathStr += " "
    }
    return pathStr;
  }

  /**
   * Create laser path through the lasers points
   * @returns SVG laser path
   */
  photonPath(): string {
    let pathStr = '';
    if (this.photons.length > 0) {
      const originX = this.centerCoord(this.photons[0].coord.x);
      const originY = this.centerCoord(this.photons[0].coord.y);
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
  element(y: number, x: number): ICell {
    const cells = this.grid.cells.filter((cell: ICell) => cell.coord.x === x && cell.coord.y === y);
    if (cells.length > 0) {
      return cells[0];
    } else {
      return {
        coord: { x, y },
        element: 'Void',
        rotation: 0,
        frozen: false
      };
    }
  }
}
</script>

<style lang="scss" scoped>
#laserPath {
  stroke-dasharray: 10;
  animation-name: dash;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: reverse;
}
@keyframes dash {
  to {
    stroke-dashoffset: 100;
  }
}
</style>

<!-- LASER DOTS -->
<!-- <g
	v-for="(laser, index) in this.lasers"
	:key="'laser' + index"
	:v-if="lasers.length > 0"
	class="lasers"
>
<circle :cx="centerCoord(laser.coord.x)" :cy="centerCoord(laser.coord.y)" r="3" fill="red" />
</g> -->
