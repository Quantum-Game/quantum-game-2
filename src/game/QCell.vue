<template>
	<g :style="getPositionStyle" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
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
import { Component, Emit, Vue, Prop, Mixins } from 'vue-property-decorator';
import { Cell } from 'quantumweasel';
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
import { setActiveCell, getPositionStyle } from '../mixins';

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
export default class QCell extends Mixins(setActiveCell, getPositionStyle) {
	@Prop() readonly cell!: Cell;
	@Prop({ default: false }) readonly tool!: boolean;
	@Prop() readonly tileSize!: number;

	border = '';

	get getPositionStyle(): {} {
		let styleObj = {};
		if (!this.tool) {
			styleObj = {
				transformOrigin: `${this.rotationOriginX}px ${this.rotationOriginY}px`,
				transform: `rotate(-${this.rotation}deg)
										translate(${this.positionX}px, ${this.positionY}px)`
			};
		}
		return styleObj;
	}

	// centerCoord(val: number): number {
	//   return (val + 0.5) * this.tileSize;
	// }

	handleMouseEnter(): void {
		this.border = borderColors.rotable;
		if (this.cell.element.name !== 'Void') {
			this.setActiveCell(this.cell);
		}
	}

	handleMouseLeave(): void {
		this.border = '';
	}

	get translationX(): number {
		return this.cell.coord.x * this.tileSize;
	}

	get translationY(): number {
		return this.cell.coord.y * this.tileSize;
	}
}
</script>

<style lang="scss">
rect {
	fill: transparent;
}
</style>
