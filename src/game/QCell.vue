<template>
	<g :style="positionStyle" @click="handleCellClick">
		<rect :width="tileSize" :height="tileSize" :class="rectBackgroundClass" />
		<component
			:is="cell.element.name"
			:cell="cell"
			:class="cell.element.name"
			:cell-size="tileSize"
			:border="border"
		/>
	</g>
</template>

<script lang="ts">
import { Mutation, State } from 'vuex-class';
import { Component, Vue, Prop, Mixins, Watch } from 'vue-property-decorator';
import { Cell } from '@/engine/classes';
import {
	Laser,
	Mirror,
	BeamSplitter,
	PolarizingBeamSplitter,
	CoatedBeamSplitter,
	CornerCube,
	Detector,
	Rock,
	Mine,
	Absorber,
	DetectorFour,
	Polarizer,
	QuarterWavePlate,
	SugarSolution,
	FaradayRotator,
	Glass,
	VacuumJar
} from './pieces';
import { getPosition } from '@/mixins';

const borderColors = {
	active: '#FF0055',
	rotable: 'white',
	energized: 'blue'
};

@Component({
	components: {
		Laser,
		Mirror,
		BeamSplitter,
		PolarizingBeamSplitter,
		CoatedBeamSplitter,
		CornerCube,
		Detector,
		Rock,
		Mine,
		Absorber,
		DetectorFour,
		Polarizer,
		QuarterWavePlate,
		SugarSolution,
		FaradayRotator,
		Glass,
		VacuumJar
	}
})
export default class QCell extends Mixins(getPosition) {
	@Prop() readonly cell!: Cell;
	@Prop() readonly lasers!: any[];
	@Prop({ default: false }) readonly tool!: boolean;
	@Prop() readonly tileSize!: number;
	@Mutation('SET_ACTIVE_CELL') mutationSetActiveCell!: (cell: Cell) => void;
	@Mutation('START_MOVING') mutationStartMoving!: () => void;
	@Mutation('STOP_MOVING') mutationStopMoving!: () => void;
	@Mutation('SET_MOVE_SOURCE') mutationSetMoveSource!: (source: string) => void;
	@State isMoving!: boolean;
	@State activeCell!: Cell;

	border = '';

	/**
	 * used to handle clicking,
	 * including setting an active cell,
	 * rotation, border color changes
	 * @returns void
	 */
	handleCellClick(): void {
		// first click: see if valid drag target;
		if (!this.isMoving) {
			this.mutationSetActiveCell(this.cell);
			if (this.validDrag) {
				// can drag
				this.mutationStartMoving();
				this.indicateMovable();
				// set the vuex property indicating the
				// movement source
				if (this.tool) {
					this.mutationSetMoveSource('toolbox')
				} else {
					this.mutationSetMoveSource('grid')
				}
			} else {
				this.indicateUnmovable();
			}

			// second click:
		} else {
			if (this.cell === this.activeCell) {
				// same cell click - rotate
				this.$emit('rotate', this.cell);
				return;
			}
			// emit event for moving
			if (this.validDrop) {
				this.$emit('add-cell-here', this.cell.coord);
				this.mutationStopMoving();
			} else {
				/*	the tile is taken;
						indicate kind - frozen or not
				*/
				if (this.validDrag) {
					this.indicateMovable();
				} else {
					this.indicateUnmovable();
				}
				this.mutationSetActiveCell(this.cell);
			}
		}
	}

	/**
	 * changes border color indicating
	 * it can be moved
	 * @returns void
	 */
	indicateMovable() {
		this.border = borderColors.rotable;
	}

	/**
	 * changes border color for w given time
	 * @returns void
	 */
	indicateUnmovable(): void {
		// this.border = borderColors.active;
		// const timeout = setTimeout(() => {
		// 	this.border = '';
		// }, 200);
		this.border = '';
	}

	/**
	 * is the cell a valiable drag target?
	 * @returns a boolean
	 */
	get validDrag(): boolean {
		return !this.cell.frozen && (this.cell.element.name !== 'Void');
	}

	/**
	 * is the cell a valiable drop target?
	 * @returns a boolean
	 */
	get validDrop(): boolean {
		return this.cell.element.name === 'Void' && !this.cell.frozen;
	}

	/**
	 * styles used for wrapper positioning
	 * using the getPosition mixin;
	 * @returns a style object
	 */
	get positionStyle(): any {
		let styleObj = {};
		if (!this.tool) {
			styleObj = {
				'transform-origin': `${this.transformOriginX}px ${this.transformOriginY}px`,
				transform: `
				rotate(-${this.cell.rotation}deg)
				translate(${this.positionX}px, ${this.positionY}px)`
			};
		}
		return styleObj;
	}

	/**
	 * highlight tile during a move
	 * @returns highlight class
	 */
	get rectBackgroundClass() {
		return this.shouldTileChangeColor ? 'movable-space' : '';
	}

	/**
	 * determines whether the tile should
	 * indeed be highlighted
	 * @returns boolean
	 */
	get shouldTileChangeColor() {
		return this.isMoving && this.cell.element.name === 'Void';
	}

	/**
	 * watches active cell changes and resets border
	 * in case the cell is not the new active cell
	 * @params previous and current active cell
	 * @returns void
	 */
	@Watch('activeCell')
	stopIndicatingMovability(newActiveCell: Cell, oldActiveCell: Cell): void {
		if (newActiveCell !== oldActiveCell && this.cell !== newActiveCell) {
			this.border = '';
		}
	}
}
</script>

<style lang="scss">
rect {
	fill: transparent;
}
.movable-space:hover {
	fill: rgba(255, 255, 255, 0.1);
	transition: 0.3s;
}

.is-movable {
	fill: red; 
}
</style>
