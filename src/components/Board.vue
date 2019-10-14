<template>
	<div class="board-container">
		<!-- <div v-for="(row, yIndex) in initialBoard.rows" :key="`${row}-${yIndex}`" class="row">
			<div
				v-for="(column, xIndex) in initialBoard.cols"
				:key="xIndex"
				class="tile"
				@dragover.prevent="handleDragOver($event, { yIndex, xIndex })"
				@dragenter.prevent="handleDragEnter($event, { yIndex, xIndex })"
				@drop="tileDrop($event, { yIndex, xIndex })"
				@click="tileClick({ yIndex, xIndex })"
				@mouseup="handleMouseUp($event, { yIndex, xIndex })"
			>
				<piece v-if="isTherePiece(yIndex, xIndex)" :cell="isTherePiece(yIndex, xIndex)" :disabled="isCellDisabled(yIndex, xIndex)" @dragover.prevent="tileDragOver" />
				<div class="dot top left" @drop.prevent="tileDrop($event, { yIndex, xIndex })" />
				<div class="dot top right" @drop.prevent="tileDrop($event, { yIndex, xIndex })" />
				<div class="dot bottom left" @drop.prevent="tileDrop($event, { yIndex, xIndex })" />
				<div class="dot bottom right" @drop.prevent="tileDrop($event, { yIndex, xIndex })" />
			</div>
		</div> -->
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
// import { mixins } from 'vue-class-component';
// import Piece from './Piece.vue';
// import EventBus from '../eventbus';
// import { ICell, ICoord } from '@/types';
// import { setActiveElement } from '../mixins';

@Component({
	components: {
		// Piece
	}
})
export default class Board extends Vue {
	// @Prop() readonly boardData!: { cells: Array<Object>; rows: number; cols: number };
	// @Prop() readonly initialBoard!: { cells: Array<Object>; rows: number; cols: number };
	// // @Prop() readonly draggedElement!: ICell
	// boardState = this.initialBoard;
	// // mouseCell: Coord = new Coord(0,0)
	// @Watch('boardData')
	// updateState() {
	// 	this.boardState = this.boardData;
	// }
	// created() {
	// 	EventBus.$on('removeFromBoard', this.removeCell);
	// }
	// /* eslint-disable class-methods-use-this */
	// beforeDestroy() {
	// 	EventBus.$off('removeFromBoard');
	// }
	// tileDrop(e: DragEvent, payload: {yIndex: number, xIndex: number}) {
	// 	console.log(`DROP: y: ${payload.yIndex} x ${payload.xIndex}`);
	// 	const { yIndex, xIndex } = payload;
	// 	const dtObj: ICell = {
	// 		coord: {
	// 			x: xIndex,
	// 			y: yIndex
	// 		},
	// 		element: '',
	// 		// originX: -1,
	// 		// originY: -1,
	// 		rotation: 0
	// 	};
	// 	if (this.isTherePiece(yIndex, xIndex)) {
	// 		return false;
	// 	}
	// 	const dt = e.dataTransfer;
	// 	if (dt) {
	// 		dtObj.element = dt.getData('text/plain');
	// 		dtObj.originY = Number(dt.getData('originY'));
	// 		dtObj.originX = Number(dt.getData('originX'));
	// 		dtObj.rotation = Number(dt.getData('rotation'));
	// 	}
	// 	const cellToAdd = {	... dtObj, x: xIndex, y: yIndex	}
	// 	this.addCell(cellToAdd);
	// 	if (dtObj.originY > -1 && dtObj.originX > -1) {
	// 		this.removeCell(dtObj);
	// 	} else {
	// 		EventBus.$emit('removeFromToolbox', dtObj);
	// 	}
	// 	return dtObj;
	// }
	// handleDragOver(e: DragEvent, payload) {
	// 	console.log(`OVER: y: ${payload.yIndex} x ${payload.xIndex}`)
	// }
	// handleDragEnter(e, payload) {
	// 	const canItBeDroppedHere = this.isTherePiece()
	// 	console.log(`ENTER: y: ${payload.yIndex} x ${payload.xIndex}`);
	// 	if (e.dataTransfer) {
	// 		e.dataTransfer.dropEffect = 'move';
	// 	}
	// }
	// updateMouseCell(e, payload) {
	// 	if (e.dataTransfer) {
	// 		e.dataTransfer.dropEffect = 'move';
	// 	}
	// 	const { yIndex, xIndex } = payload;
	// 	// this.mouseCell = {y: yIndex, x: xIndex};
	// }
	// tileClick(payload) {
	// 	const { yIndex, xIndex } = payload;
	// 	const thisCell = this.isTherePiece(yIndex, xIndex);
	// 	if (!thisCell || thisCell.frozen) {
	// 		return false;
	// 	}
	// 	const arrayOfOctadirectionalElements = ['Mirror', 'BeamSplitter'];
	// 	const isOctaDirectional = arrayOfOctadirectionalElements.indexOf(thisCell.element) > -1;
	// 	const angle = isOctaDirectional ? 45 : 90;
	// 	const rotationAngle: number = 360 / 8;
	// 	let { rotation } = thisCell;
	// 	if ((360 + angle) % rotationAngle !== 0) {
	// 		throw new Error('Error in the supplied angle compared to the element rotation angle.');
	// 	} else {
	// 		rotation = (((thisCell.rotation + angle) % 360) + 360) % 360;
	// 	}
	// 	const rotatedCell = { ...thisCell, rotation };
	// 	const index = this.boardState.cells.indexOf(thisCell);
	// 	this.boardState.cells.splice(index, 1, rotatedCell);
	// 	return rotatedCell;
	// }
	// // helps to determine if there is a element present
	// isTherePiece(y: number, x: number) {
	// 	const possiblePieceArray = this.boardState.cells.filter(cell => cell.coord.x === x && cell.coord.y === y);
	// 	if (possiblePieceArray.length) {
	// 		return possiblePieceArray[0];
	// 	}
	// 	return false;
	// }
	// removeCell(cell: ICell) {
	// 	const index = this.boardState.cells.indexOf(this.isTherePiece(cell.originY, cell.originX));
	// 	this.boardState.cells.splice(index, 1);
	// }
	// addCell(cell: ICell) {
	// 	this.boardState.cells.push(cell);
	// }
	// handleMouseDown(e, cell) {
	// 	this.setActiveElement(e, cell);
	// }
	// handleMouseUp(e, payload) {
	// 	const dt = e.dataTransfer;
	// 	console.log('Board MouseUP');
	// 	if (dt) {
	// 		const element = dt.getData('element');
	// 		if (element) {
	// 			console.log(element);
	// 		}
	// 	}
	// }
	// isCellDisabled(y, x) {
	// 	return this.isTherePiece(y, x).frozen;
	// }
}
</script>

<style lang="scss">
.board-container {
	width: 100%;
	max-height: 100vh;
	.row {
		display: flex;
		flex-direction: row;
		& .tile {
			width: 64px;
			min-height: 64px;
			// background-color: #0e377815;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: white;
			font-size: 1.3rem;
			&:hover {
				background-color: yellow;
				color: black;
			}
		}
	}
}

.dot {
	width: 2px;
	height: 2px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.534);
	position: absolute;
	&.top {
		top: -3px;
	}

	&.bottom {
		top: 98%;
	}

	&.left {
		left: -7%;
	}

	&.right {
		left: 93%;
	}
}
</style>
