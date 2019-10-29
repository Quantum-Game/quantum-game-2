<template>
	<g :style="positionStyle" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
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

	border = '';

	get positionStyle() {
		let styleObj = {};
		if (this.cell.element.name !== 'Void' && !this.tool) {
			styleObj = {
				'transform-origin': `${this.transformOriginX}px ${this.transformOriginY}px`,
				transform: `
				rotate(-${this.cell.rotation}deg)
        translate(${this.cell.coord.x * this.tileSize}px, ${this.cell.coord.y * this.tileSize}px)
        `
        //scale(this.tileSize / 64)
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
		this.$store.commit('SET_ACTIVE_CELL', this.cell);
		this.border = borderColors.rotable;
	}

	handleMouseLeave() {
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
