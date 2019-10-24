<template>
	<g
		:style="positionStyle"
		@click="rotate"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<rect :width="cellSize" :height="cellSize" />
		<component :is="cell.element" :class="cell.element" :cell-size="cellSize" :border="border" />
	</g>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import { ICell } from '@/types';
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
export default class Cell extends Vue {
	@Prop() readonly cell!: ICell;
	@Prop() readonly lasers!: any[];
	@Prop() readonly toolbox!: boolean;
	cellSize = 64;

	border = '';

	get positionStyle() {
		let styleObj = {};
		const originX = this.centerCoord(this.cell.coord.x);
		const originY = this.centerCoord(this.cell.coord.y);
		if (this.cell.element !== 'Void' && !this.cell.toolbox) {
			styleObj = {
				'transform-origin': `${originX}px ${originY}px`,
				transform: `
				rotate(-${this.cell.rotation}deg)
				translate(${this.cell.coord.x * this.cellSize}px, ${this.cell.coord.y * this.cellSize}px)`
			};
		}
		return styleObj;
	}

	centerCoord(val: number) {
		return (val + 0.5) * this.cellSize;
	}

	/**
	 * onClick rotate the element
	 */
	rotate(): void {
		this.cell.rotation += 45;
		console.log(`CURRENT ROTATION: ${this.cell.rotation}`);
	}

	handleMouseEnter() {
		this.border = borderColors.rotable;
	}

	handleMouseLeave() {
		this.border = '';
	}

	get translationX(): number {
		return this.cell.coord.x * this.cellSize;
	}
	get translationY(): number {
		return this.cell.coord.y * this.cellSize;
	}
}
</script>

<style lang="scss">
rect {
	fill: transparent;
}
</style>
