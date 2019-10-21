<template>
	<div class="piece-wrapper">
		<component :is="element" :class="element" />
	</div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
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
export default class Piece extends Vue {
	@Prop() readonly cell!: {
		element: string;
		x: number;
		y: number;
		active: boolean;
		frozen: boolean;
		rotation: number;
	};

	created() {
		console.log(this.cell);
	}

	get element() {
		return this.cell.element;
	}

}
</script>

<style lang="scss" scoped>
.piece-wrapper {
	height: 100%;
	width: 100%;

	svg {
		transition: 0.5s;
	}
}
</style>
