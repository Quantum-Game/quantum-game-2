<template>
  <div class="board-container">
    <pre>{{ `THIS IS BOARD, HELLO with dimentions: ${dimensions.x} X ${dimensions.y}` }}</pre>
    <div
      v-for="(row, yIndex) in dimensions.y"
      :key="`${row}-${yIndex}`"
      class="row"
    >
      <Tile
        v-for="(column, xIndex) in dimensions.x"
        :key="xIndex"
        :y="yIndex"
        :x="xIndex"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Tile from '@/components/Tile.vue';

@Component({
  components: {
    Tile,
  },
})
export default class Board extends Vue {
  lastTile: {x: number, y: number} = { x: 0, y: 0 }

  // acts as compted:
  get dimensions() {
    return this.$store.state.currentLevel.boardDimensions;
  }
}
</script>

<style>
  .board-container {
    display: inline-block;
    height: 100%;
    width: 60%
  }

  .row {
    display: flex;
    flex-direction: row;
  }
</style>
