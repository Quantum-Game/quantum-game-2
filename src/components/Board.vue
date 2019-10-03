<template>
  <div class="board-container">
    <pre>{{ `THIS IS BOARD, HELLO with dimentions: ${level.cols} X ${level.rows}` }}</pre>
    <div
      v-for="(row, yIndex) in level.rows"
      :key="`${row}-${yIndex}`"
      class="row"
    >
      <Tile
        v-for="(column, xIndex) in level.cols"
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
  @Prop() readonly level!: object
}
</script>

<style>
  .board-container {
    width: 50%
  }

  .row {
    display: flex;
    flex-direction: row;
  }
</style>
