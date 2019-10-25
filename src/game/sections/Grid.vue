<template>
	<svg class="grid" :width="totalWidth" :height="totalHeight">
		<!-- DOTS -->
		<g v-for="(row, y) in grid.rows" :key="y">
			<g v-for="(column, x) in grid.cols" :key="x">
				<circle :cx="x * cellSize" :cy="y * cellSize" r="1" fill="#edeaf4" />
			</g>
		</g>

		<!-- LASER PATH -->
		<g
			v-for="(laser, index) in individualLaserPath"
			:key="'laser' + index"
			:v-if="individualLaserPath.length > 0"
			class="lasers"
		>
			<path
				:d="laser"
				stroke-dasharray="8 8"
				fill="transparent"
				stroke="red"
				stroke-width="3"
				class="laserPath"
			/>
		</g>

		<!-- CELLS -->
		<cell
			v-for="(cell, i) in grid.exportGrid().cells"
			:key="'cell' + i"
			:cell="cell"
			:cellSize="cellSize"
			@click.native="rotate(cell)"
		/>

		<!-- <path
      :d="laserPath()"
      stroke-dasharray="10 10"
      fill="transparent"
      stroke="red"
      stroke-width="2"
      class="laserPath"
    />-->

		<!-- PHOTONS -->
		<g
			v-for="(particle, index) in photons"
			:key="'particle' + index"
			:v-if="photons.length > 0"
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
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import * as qw from 'quantumweasel';
import Photon from '../Photon.vue';
import Cell from '../Cell.vue';
import { IGrid, ICell, Qparticle, ParticleInterface } from '@/types';

@Component({
	components: {
		Photon,
		Cell
	}
})
export default class Grid extends Vue {
	@Prop({ default: '' }) readonly grid!: {};
	@Prop({ default: '64' }) readonly cellSize!: number;
	@Prop({ default: [] }) readonly photons!: ParticleInterface[];

	get lasers(): ParticleInterface[] {
		return this.grid.computePaths();
	}

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
	 * Cell rotation
	 */
	rotate(cellI: CellInterface) {
		const cell = qw.Cell.importCell(cellI);
		cell.rotate();
		this.grid.set(cell);
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
		}
		return {
			coord: { x, y },
			element: 'Void',
			rotation: 0,
			frozen: false
		};
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
</style>
