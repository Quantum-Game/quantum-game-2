<template>
  <div
    class="tile"
    :class="{'active': status === 'active'}"
    @click="tileClick"
  >
    <div class="dot top left" />
    <div class="dot top right" />
    <div class="dot bottom left" />
    <div class="dot bottom right" />
    {{ status }}
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Emit,
  // Watch,
} from 'vue-property-decorator';

@Component
export default class Tile extends Vue {
  @Prop({ default: false }) readonly active!: boolean

  @Prop({ default: undefined }) readonly element!: String

  @Prop({ default: null }) readonly x!: number

  @Prop({ default: null }) readonly y!: number

  @Emit('tileClick')
  tileClick(e: Event) {
    const tileDataObj = { x: this.x, y: this.y };
    console.log(`x: ${tileDataObj.x}, y: ${tileDataObj.y}`);
    return tileDataObj;
  }

  created() {
    if (!this.$store.state.currentLevel.elementPositions[this.y][this.x]) {
      this.$store.commit('setTile', { x: this.x, y: this.y, status: 'normal' });
    }
  }

  get status() {
    return this.$store.state.currentLevel.elementPositions[this.y][this.x].status;
  }
}
</script>

<style lang="scss">
.tile {
  width: 100px;
  height: 100px;
  background-color: red;
  position: relative;
  &:hover {
    background-color: yellow;
  }
}

.active {
  background-color: black;
}
// TODO: abstract dot position, eg. "top", "right"
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
