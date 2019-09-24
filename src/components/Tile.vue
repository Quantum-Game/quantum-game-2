<template>
  <div
    class="tile"
    :class="{'active': element === 'active'}"
    draggable="true"
    @click="tileClick"
    @dragstart="tileDragStart"
    @dragover.prevent="tileDragOver"
    @drop.prevent="tileDrop"
    @dragend="tileDragEnd"
  >
    <div class="dot top left" />
    <div class="dot top right" />
    <div class="dot bottom left" />
    <div class="dot bottom right" />
    {{ element }}
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
} from 'vue-property-decorator';

@Component
export default class Tile extends Vue {
  @Prop({ default: false }) readonly active!: boolean

  @Prop({ default: null }) readonly x!: number

  @Prop({ default: null }) readonly y!: number

  @Emit()
  tileClick(e: MouseEvent) {
    return { x: this.x, y: this.y };
  }

  tileDragStart(e: DragEvent) {
    const dt = e.dataTransfer;
    if (dt) {
      dt.setData('text/plain', this.element);
    }
    return { x: this.x, y: this.y, event: e };
  }

  tileDrop(e: DragEvent) {
    const dt = e.dataTransfer;
    const dtObj: { x: number, y: number, element: string } = { x: this.x, y: this.y, element: '' };
    if (dt) {
      dtObj.element = dt.getData('text/plain');
    }
    this.$store.commit('setTile', dtObj);
    return dtObj;
  }

  tileDragOver(e: DragEvent) {
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    const tileDataObj = { x: this.x, y: this.y };
    return tileDataObj;
  }

  tileDragEnd() {
    // TODO: Conditionality
    this.$store.commit('setTile', { x: this.x, y: this.y, element: '' });
  }

  created() {
    if (!this.$store.state.currentLevel.elementPositions[this.y][this.x]) {
      this.$store.commit('setTile', { x: this.x, y: this.y, element: '' });
    }
  }

  get element() {
    return this.$store.state.currentLevel.elementPositions[this.y][this.x].element;
  }
}
</script>

<style lang="scss">
.tile {
  width: 100px;
  height: 100px;
  background-color: #780e0e;
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

.active {
  background-color: black;
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
