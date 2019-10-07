<template>
  <div
    class="board-container"
  >
    <div
      v-for="(row, yIndex) in boardState.rows"
      :key="`${row}-${yIndex}`"
      class="row"
    >
      <div
        v-for="(column, xIndex) in boardState.cols"
        :key="xIndex"
        class="tile"
        @dragover.prevent="tileDragOver"
        @drop.prevent="tileDrop($event, {yIndex, xIndex})"
        @click="tileClick({yIndex, xIndex})"
      >
        <piece
          @dragover.prevent="tileDragOver"
          v-if="isTherePiece(yIndex, xIndex)"
          :cell="isTherePiece(yIndex, xIndex)"
        />
        <div class="dot top left" />
        <div class="dot top right" />
        <div class="dot bottom left" />
        <div class="dot bottom right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Watch,
} from 'vue-property-decorator';
import Piece from './Piece.vue';
import EventBus from '../eventbus';

@Component({
  components: {
    Piece,
  },
})
export default class Board extends Vue {
  @Prop() readonly boardData!: { cells: Array<Object>, rows: number, cols: number}

  boardState = this.boardData

  @Watch('boardData')
  updateState() {
    this.boardState = this.boardData;
  }

  created() {
    EventBus.$on('removeFromBoard', this.removeCell);
  }

  beforeDestroy() {
    EventBus.$off('removeFromBoard');
  }

  tileDrop(e: DragEvent, payload: {yIndex: number, xIndex: number}) {
    const { yIndex, xIndex } = payload;
    // TODO: outsource to an dtObj-setting function (one with es6 default parameters) for brevity.
    const dtObj: {
      x: number,
      y: number,
      element: string,
      originY?: number,
      originX?: number,
      rotation: number
    } = {
      x: xIndex,
      y: yIndex,
      element: '',
      originX: -1,
      originY: -1,
      rotation: 0,
    };
    if (this.isTherePiece(yIndex, xIndex)) {
      return false;
    }
    const dt = e.dataTransfer;
    if (dt) {
      dtObj.element = dt.getData('text/plain');
      dtObj.originY = Number(dt.getData('originY'));
      dtObj.originX = Number(dt.getData('originX'));
      dtObj.rotation = Number(dt.getData('rotation'));
    }

    console.log(dtObj)

    this.addCell(dtObj);
    if (dtObj.originY > -1 && dtObj.originX > -1) {
      this.removeCell(dtObj);
    } else {
      EventBus.$emit('removeFromToolbox', dtObj);
    }
  }

  tileDragOver(e: DragEvent) {
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }

  tileClick(payload) {
    const { yIndex, xIndex } = payload;
    const thisCell = this.isTherePiece(yIndex, xIndex)
    if (!thisCell || thisCell.frozen) {
      return false;
    }

    const arrayOfOctadirectionalElements = ['Mirror', 'BeamSplitter'];
    const isOctaDirectional = arrayOfOctadirectionalElements.indexOf(thisCell.element) > -1;
    const angle = isOctaDirectional ? 45 : 90;

    const rotationAngle: number = 360 / 8;
    let { rotation } = thisCell;

    if ((360 + angle) % rotationAngle !== 0) {
      throw new Error('Error in the supplied angle compared to the element rotation angle.');
    } else {
      rotation = ((thisCell.rotation + angle) % 360 + 360) % 360;
    }

    const rotatedCell = { ...thisCell, rotation };
    const index = this.boardState.cells.indexOf(thisCell);

    this.boardState.cells.splice(index, 1, rotatedCell);
  }

  // helps to determine if there is a element present
  isTherePiece(y: number, x: number) {
    const possiblePieceArray = this.boardState.cells.filter(cell => cell.x === x && cell.y === y)
    if (possiblePieceArray.length) {
      return possiblePieceArray[0];
    }
    return false;
  }

  removeCell(cell) {
    const index = this.boardState.cells.indexOf(this.isTherePiece(cell.originY, cell.originX));
    this.boardState.cells.splice(index, 1);
  }

  addCell(cell) {
    this.boardState.cells.push(cell);
  }
}
</script>

<style lang="scss">
  .board-container {
    width: 50%;
    max-height: 100vh;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .tile {
  width: 70px;
  min-height: 40px;
  background-color: #0e37782c;
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

.dot  {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: blue;
  position: absolute;
  &.top {
    top: -3px;
  }

  &.bottom {
    top: 97%;
  }

  &.left {
    left: -7%;
  }

  &.right {
    left: 93%;
  }
}

</style>
