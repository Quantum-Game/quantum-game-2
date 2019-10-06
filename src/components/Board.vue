<template>
  <div
    class="board-container"
  >
    <pre>{{ `THIS IS BOARD, HELLO with dimentions: ${level.cols} X ${level.rows}` }}</pre>
    <div
      v-for="(row, yIndex) in level.rows"
      :key="`${row}-${yIndex}`"
      class="row"
    >
      <div
        v-for="(column, xIndex) in level.cols"
        :key="xIndex"
        class="tile"
        @dragover.prevent="tileDragOver($event, {yIndex, xIndex})"
        @drop.prevent="tileDrop($event, {yIndex, xIndex})"
        @click="tileClick({yIndex, xIndex})"
      >
        <piece
          v-if="isTherePiece(yIndex, xIndex)"
          :cell="isTherePiece(yIndex, xIndex)"
          @dragend="tileDragEnd"
          @pieceDragStart="handleDragStart(yIndex, xIndex)"
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import Tile from '@/components/Tile.vue';
import Piece from './Piece.vue';
import EventBus from '../eventbus';


@Component({
  components: {
    Piece,
    Tile,
  },
})
export default class Board extends Vue {
  @Prop() readonly level!: { cells: Array<Object>, rows: number, cols: number}

  @Prop() draggedElementStatus!: string

  boardState = this.level

  mounted() {
    EventBus.$on('removeFromBoard', this.removeCell);
  }

  // helps to determine if there is a element present
  isTherePiece(y: number, x: number) {
    const possiblePieceArray = this.boardState.cells.filter(cell => cell.x === x && cell.y === y)
    if (possiblePieceArray.length) {
      return possiblePieceArray[0];
    }
    return false;
  }

  handleDragStart(y, x) {
    // const index = this.boardState.cells.indexOf(this.isTherePiece(y, x))
    // this.boardState.cells.splice(index, 1)x
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
    } = {
      x: xIndex,
      y: yIndex,
      element: '',
      originX: -1,
      originY: -1,
    };
    if (this.isTherePiece(yIndex, xIndex)) {
      return false;
    }
    const dt = e.dataTransfer;
    if (dt) {
      dtObj.element = dt.getData('text/plain');
      dtObj.originY = Number(dt.getData('originY'));
      dtObj.originX = Number(dt.getData('originX'));
    }

    this.addCell(dtObj);
    if (dtObj.originY > -1 && dtObj.originX > -1) {
      this.removeCell(dtObj)
    } else {
      this.$emit('dropFromToolBox', dtObj.element);
    }
  }

  removeCell(cell) {
    const index = this.boardState.cells.indexOf(this.isTherePiece(cell.originY, cell.originX));
    this.boardState.cells.splice(index, 1)
  }

  addCell(cell) {
    const {element, x, y} = cell;
    const cellToBeAdded = {
      element,
      x,
      y,
      rotation: 0,
      frozen: false,
    };
    this.boardState.cells.push(cellToBeAdded);
  }

  tileDragOver(e: DragEvent, payload) {
    const {yIndex, xIndex} = payload;
    // console.log(payload)
    const dt = e.dataTransfer;
    if (dt) {
      dt.setData('x', String(xIndex));
      dt.setData('y', String(yIndex));
      const variable = dt.getData('x');
      // does it mean
    // console.log(variable)
    }
  }

  tileClick(payload) {
    const { yIndex, xIndex } = payload;
    const thisCell = this.isTherePiece(yIndex, xIndex)
    if (!thisCell || thisCell.frozen) {
      return false;
    }

    const arrayOfOctadirectionalElements = ['mirror', 'beamsplitter'];
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

    this.boardState.cells.splice(index, 1, rotatedCell)
  }
    tileDragEnd() {
      console.log('whatever');

// This is what happens with the original element after being dragged:
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
