<template>
  <div
    class="tile"
    :class="{'active': element === 'active'}"
    @click="tileClick"
    @dragover.prevent="tileDragOver"
    @drop.prevent="tileDrop"
    @dragend="tileDragEnd"
  >
    <piece
      v-if="element"
      :cell="cell"
    />
    <div class="dot top left" />
    <div class="dot top right" />
    <div class="dot bottom left" />
    <div class="dot bottom right" />
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
} from 'vue-property-decorator';
import Piece from './Piece.vue';

@Component({
  components: {
    Piece,
  },
})
export default class Tile extends Vue {
  @Prop({ default: false }) readonly active!: boolean

  @Prop({ default: null }) readonly x!: number

  @Prop({ default: null }) readonly y!: number

  tileClick(e: MouseEvent) {
    if (!this.cell) {
      return false;
    }
    const {
      x,
      y,
      element,
      frozen,
    } = this.cell;
    if (element && !frozen) {
      const arrayOfOctadirectionalElements = ['mirror', 'beamsplitter'];
      const isOctaDirectional = arrayOfOctadirectionalElements.indexOf(element) > -1;
      const angle = isOctaDirectional ? 45 : 90;

      this.$store.dispatch('rotate', { y, x, angle });
    }
  }

  tileDrop(e: DragEvent) {
    // TODO: outsource to an dtObj-setting function (one with es6 default parameters) for brevity.
    const dtObj: {
      x: number,
      y: number,
      element: string,
      originY?: number,
      originX?: number,
      fromToolslot?: string,
    } = {
      x: this.x,
      y: this.y,
      element: '',
      originX: -1,
      originY: -1,
      fromToolslot: '',
    };
    if (this.element) {
      return;
    }
    const dt = e.dataTransfer;
    if (dt) {
      dtObj.element = dt.getData('text/plain');
      dtObj.originY = Number(dt.getData('originY'));
      dtObj.originX = Number(dt.getData('originX'));
    }
    this.$store.dispatch('drop', dtObj);
  }

  tileDragOver(e: DragEvent) {
    // if (!this.cell.element && e.dataTransfer) {
    //   e.dataTransfer.dropEffect = 'move';
    // }
    const tileDataObj = { x: this.x, y: this.y };
    return tileDataObj;
  }

  tileDragEnd() {
    // This is what happens with the original element after being dragged:
  }

  get cell() {
    // TODO: make it a store getter
    let thisTileCell;
    if (this.$store.state.currentLevel.cells) {
      thisTileCell = this.$store.state.currentLevel.cells.find((cell: {x: number, y: number}) => cell.x === this.x && cell.y === this.y);
    }
    return thisTileCell;
  }

  get element() {
    if (!this.cell) return undefined;
    return this.cell.element;
  }

  get isDraggable(): boolean {
    return !this.cell.frozen && !!this.element;
  }
}
</script>

<style lang="scss">
.tile {
  width: 70px;
  height: 70px;
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
}

.top {
  top: -3px;
}

.bottom {
  top: 97%;
}

.left {
  left: -7%;
}

.right {
  left: 93%;
}

</style>
