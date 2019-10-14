<template>
	<div class="piece-wrapper">
		<!-- <component
			:is="element"
			:opacity="opacity"
			:style="{
				transform: `rotate(${cell.rotation}deg)`
			}"
			:class="element"
		/>-->
	</div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
// import {
// 	Absorber,
// 	BeamSplitter,
// 	Bomb,
// 	CoatedBeamSplitter,
// 	Detector,
// 	Emitter,
// 	GlassSlab,
// 	Mirror,
// 	OmniDetector,
// 	Polarizer0,
// 	Polarizer45,
// 	Polarizer90,
// 	Polarizer135,
// 	PolarizingBeamSplitter,
// 	Rock,
// 	SugarSolution,
// 	VacuumJar,
// 	WavePlate0,
// 	WavePlate45,
// 	WavePlate90,
// 	WavePlate135,
// } from './pieces';
// import EventBus from '../eventbus';
// :class="{ tool: tool }"
// :draggable="isDraggable"
// @dragstart="onPieceDragStart"
// @drop.prevent="onDrop"
// @dragend="onDragEnd"

@Component({
	components: {
		// Absorber,
		// BeamSplitter,
		// Bomb,
		// CoatedBeamSplitter,
		// Detector,
		// Emitter,
		// GlassSlab,
		// Mirror,
		// OmniDetector,
		// Polarizer0,
		// Polarizer45,
		// Polarizer90,
		// Polarizer135,
		// PolarizingBeamSplitter,
		// Rock,
		// SugarSolution,
		// VacuumJar,
		// WavePlate0,
		// WavePlate45,
		// WavePlate90,
		// WavePlate135,
	}
})
export default class Piece extends Vue {
	// @Prop() readonly cell!: {
	// 	element: string;
	// 	frozen: boolean;
	// 	x: number;
	// 	y: number;
	// 	rotation: number;
	// }
	// @Prop() readonly tool!: boolean
	// isBeingDragged: boolean = false
	// get opacity() {
	// 	return this.isBeingDragged ? 0.3 : 1;
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
	// get element() {
	// 	return this.cell.element;
	// }
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
