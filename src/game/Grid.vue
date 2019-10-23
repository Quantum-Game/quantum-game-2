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

    <!-- LASER DOTS -->
    <!-- <g
      v-for="(laser, index) in this.lasers"
      :key="'laser' + index"
      :v-if="lasers.length > 0"
      class="lasers"
    >
      <circle :cx="centerCoord(laser.coord.x)" :cy="centerCoord(laser.coord.y)" r="3" fill="red" />
    </g> -->
    <!-- LASER PATH -->
    <path stroke-dasharray="10,10" :d="laserPath()" fill="transparent" stroke="red" stroke-width="3" />

    <!-- PHOTONS -->
    <g
      v-for="(particle, index) in this.particles()"
      :key="'particle' + index"
      :v-if="particles.length > 0"
      class="photons"
      :style="computeParticleStyle(particle)"
    >
      <photon
        name
        :intensity="particle.intensity"
        :are="particle.are"
        :aim="particle.aim"
        :bre="particle.bre"
        :bim="particle.bim"
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
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import Photon from './Photon.vue';
import { IGrid, ICell, Qparticle } from '@/types';
import Mirror from './pieces/Mirror.vue';
import Tile from './Tile.vue';
// import { drag } from 'd3-drag';
// import { select } from 'd3-selection';
// const d3 = {
// 	scaleLinear,
// 	scaleSequential,
// 	select,
// 	range,
// 	interpolateInferno,
// 	interpolateViridis
// };

// var svg = d3.select("svg.grid");
// svg.append("use")
//     .attr("href", "#pointer")
//     .attr("x", 50)
//     .attr("y", 50)
//     .attr("fill", "#039BE5")
//     .attr("stroke", "#039BE5")
//     .attr("stroke-width", "1px");

// var dragHandler = d3.drag()
//     .on("drag", function () {
//         d3.select(this)
//             .attr("x", d3.event.x)
//             .attr("y", d3.event.y);
//     });

// dragHandler(svg.selectAll("use"));

@Component({
  components: {
    Photon,
    Tile
  }
})
export default class Grid extends Vue {
  @Prop({ default: '' }) readonly grid!: IGrid;
  @Prop({ default: '64' }) readonly cellSize!: number;
  @Prop({ default: '' }) readonly lasers!: Qparticle[];

  get totalWidth(): number {
    return this.grid.cols * this.cellSize;
  }
  get totalHeight(): number {
    return this.grid.rows * this.cellSize;
  }

  particles(): Qparticle[] {
    return [
      {
        x: 3,
        y: 3,
        direction: 0,
        are: 0,
        aim: 0,
        bre: 1,
        bim: 0
      },
      {
        x: 4,
        y: 3,
        direction: 270,
        are: 0,
        aim: 0,
        bre: 1,
        bim: 0
      }
    ];
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
		let pathStr = "";
		if (this.lasers.length > 0) {
			const originX = this.centerCoord(this.lasers[0].coord.x)
			const originY = this.centerCoord(this.lasers[0].coord.y)
			pathStr += `M ${originX} ${originY} `
			this.lasers.forEach((laser: any) => {
				const x = this.centerCoord(laser.coord.x)
				const y = this.centerCoord(laser.coord.y)
				pathStr += ` L ${x} ${y} `
			});
		}
		return pathStr
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
</style>
