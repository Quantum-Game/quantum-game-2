<template>
	<svg ref="grid" class="grid" :width="totalWidth" :height="totalHeight">
		<!-- DOTS -->
		<g v-for="(row, y) in grid.rows" :key="y">
			<g v-for="(column, x) in grid.cols" :key="x">
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
		<QCell
			v-for="(cell, i) in grid.cells"
			:key="'cell' + i"
			:cell="cell"
			:tileSize="tileSize"
			@add-cell-here="moveCell"
			@rotate="rotateCell"
		/>

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
		<speech-bubble
			v-for="(hint, index) in hints"
			:key="`hint${index}`"
			:hint="hint"
			:tileSize="tileSize"
		/>
	</svg>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Grid, Cell, ParticleInterface, CellInterface, Coord, Element } from 'quantumweasel';
import { Mutation, State } from 'vuex-class';
import { IHintList } from '@/types';
import { Photon, QCell, SpeechBubble } from '..';

@Component({
	components: {
		Photon,
		QCell,
		SpeechBubble
	}
})
export default class QGrid extends Vue {
	@Prop({ default: '' }) readonly grid!: Grid;
	@Prop({ default: [] }) readonly photons!: ParticleInterface[];
	@Prop() readonly hints!: IHintList;
	@State activeCell!: Cell;
	@Mutation('RESET_ACTIVE_CELL') mutationResetActiveCell!: () => void;
	@Mutation('STOP_MOVING') mutationStopMoving!: () => void;
	@Mutation('RESET_MOVE_SOURCE') mutationResetMoveSource!: () => void;
	@Mutation('REMOVE_FROM_CURRENT_TOOLS') mutationRemoveFromCurrentTools!: (cell: Cell) => void;
	@State moveSource!: string;

	tileSize: number = 64;

	$refs!: {
		grid: HTMLElement;
	};

	mounted() {
		window.addEventListener('resize', this.assessTileSize);
		this.assessTileSize();
	}

	assessTileSize() {
		// const currentWidth = this.$refs.grid.getBoundingClientRect().width;
		// this.tileSize = currentWidth / this.grid.cols;
		this.tileSize = 64;
	}

	get lasers(): ParticleInterface[] {
		return this.grid.computePaths();
	}

	get totalWidth(): number {
		return this.grid.cols * this.tileSize;
	}
	get totalHeight(): number {
		return this.grid.rows * this.tileSize;
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
	 * Used to move a cell
	 * @params coord to move to
	 * @returns boolean
	 */
	moveCell(coord: Coord): boolean {
		const destinationCell = this.grid.get(coord);
		if (!destinationCell.frozen && !this.activeCell.frozen) {
			if (this.moveSource === 'toolbox') {
				this.mutationRemoveFromCurrentTools(this.activeCell);
			}
			destinationCell.coord = this.activeCell.coord;
			const sourceCell = this.activeCell;
			sourceCell.coord = coord;
			this.grid.set(sourceCell);
			this.grid.set(destinationCell);
			this.mutationResetMoveSource();
			return true;
		}
		return false;
	}

	/**
	 * Cell rotation
	 * @returns void
	 */
	rotateCell(cell: Cell): void {
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
	element(y: number, x: number): CellInterface {
		const cells = this.grid.cells.filter((cell: Cell) => cell.coord.x === x && cell.coord.y === y);
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
