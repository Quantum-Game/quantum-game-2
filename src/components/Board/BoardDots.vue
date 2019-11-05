<template>
  <g class="dots">
    <g v-for="(row, y) in level.grid.rows" :key="y">
      <g v-for="(column, x) in level.grid.cols" :key="x">
        <circle :cx="x * tileSize" :cy="y * tileSize" r="1" fill="#edeaf4" />
      </g>
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Level from '@/engine/Level';
@Component
export default class BoardDots extends Vue {
  @State level!: Level;
  tileSize = 64;
}
</script>

<style lang="scss" scoped>
.dots {
  width: 100%;
  height: 100%;
}
</style>
