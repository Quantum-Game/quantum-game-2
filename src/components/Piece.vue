<template>
	<div class="piece-wrapper">
		<component :is="element" :class="element" />
	</div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import {
	Absorber,
	BeamSplitter,
	Bomb,
	CoatedBeamSplitter,
	Detector,
	Laser,
	GlassSlab,
	Mirror,
	OmniDetector,
	PolarizerV,
	Polarizer45,
	PolarizerH,
	Polarizer135,
	PolarizingBeamSplitter,
	Rock,
	SugarSolution,
	VacuumJar,
	WavePlateV,
	WavePlate45,
	WavePlateH,
	WavePlate135
} from './pieces';

@Component({
	components: {
		Absorber,
		BeamSplitter,
		Bomb,
		CoatedBeamSplitter,
		Detector,
		Laser,
		GlassSlab,
		Mirror,
		OmniDetector,
		PolarizerV,
		Polarizer45,
		PolarizerH,
		Polarizer135,
		PolarizingBeamSplitter,
		Rock,
		SugarSolution,
		VacuumJar,
		WavePlateV,
		WavePlate45,
		WavePlateH,
		WavePlate135
	}
})
export default class Piece extends Vue {
	@Prop() readonly cell!: {
		element: string;
		frozen: boolean;
		x: number;
		y: number;
		rotation: number;
	};

	created() {
		console.log(this.cell);
	}
	// @Prop() readonly tool!: boolean
	// isBeingDragged: boolean = false
	// get opacity() {
	// 	return 1;
	// }
	// // for toolbox only:
	// @Prop() readonly disabled!: boolean;
	// onDragEnd(e) {
	// 	this.isBeingDragged = false;
	// 	this.$emit('onDragEnd', this.cell);
	// 	// console.log(this.cell);
	// }
	// /* eslint-disable class-methods-use-this */
	// @Emit('ondrop')
	// onDrop(e: MpuseEvent) {
	// }
	// @Emit()
	// onDragOver(e: MpuseEvent) {
	// }
	// get isDraggable(): boolean {
	// 	return !this.cell.frozen && !this.disabled;
	// }
	get element() {
		return this.cell.element;
	}
	// @Emit('pieceDragStart')
	// onPieceDragStart(e: DragEvent) {
	// 	const {
	// 		element,
	// 		frozen,
	// 		x,
	// 		y,
	// 		rotation,
	// 	} = this.cell;
	// 	const dt = e.dataTransfer;
	// 	if (!this.isDraggable || frozen) {
	// 		if (dt) {
	// 			dt.clearData();
	// 		}
	// 		return false;
	// 	}
	// 	if (dt) {
	// 		dt.setData('text/plain', element);
	// 		dt.setData('originY', String(y));
	// 		dt.setData('originX', String(x));
	// 		dt.setData('rotation', String(rotation));
	// 		dt.dropEffect = 'move';
	// 	}
	// 	this.$emit('elementDragging', this.cell)
	// 	this.isBeingDragged = true;
	// 	return this.cell;
	// }
	// // @Emit('emit')
	// // onDrop(e: MouseEvent){
	// //	 return e;
	// // }
}
</script>

<style lang="scss">
.piece-wrapper {
	height: 100%;
	width: 100%;

	// Animation class?
	svg {
		transition: 0.5s;
	}
}
</style>
