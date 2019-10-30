<template>
	<g :style="positionStyle" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @click="handleCellClick">
		<rect :width="tileSize" :height="tileSize" />
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
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class'
import { Cell, CellInterface } from 'quantumweasel';
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
	rotable: 'yellow',
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
	@State isMoving!: boolean;

	border = '';

	get positionStyle() {
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

	centerCoord(val: number) {
		return (val + 0.5) * this.tileSize;
	}

	/*
		set cell as active
	*/
	handleMouseEnter() {
		this.border = borderColors.rotable;
	}

	get validDrag() {
		return !this.cell.frozen && this.cell.element.name !== 'Void';
	}

	get validDrop() {
		return (this.cell.element.name === 'Void') && !this.cell.frozen;
	}

	handleCellClick() {
		// first click: see if valid drag target;
		if (!this.isMoving) {
			this.mutationSetActiveCell(this.cell);
			if (this.validDrag) {
				this.mutationStartMoving();
			}
			// second click:
		} else {
			if (this.cell === this.activeCell) {
				this.$emit('rotate', this.cell)
				return;
			}
			if (this.validDrop) {
				this.$emit('add-cell-here', this.cell.coord)
				this.mutationStopMoving();
			} else {
				this.mutationSetActiveCell(this.cell);
			}
		}
	}

	get activeCell() {
		return this.$store.state.activeCell;
	}

	handleMouseLeave() {
		this.border = '';
	}
}
</script>

<style lang="scss">
rect {
	fill: transparent;
}
</style>
