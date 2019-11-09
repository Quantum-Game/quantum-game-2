<template>
  <g class="dots">
    <g v-for="(row, y) in rows" :key="y">
      <g v-for="(column, x) in cols" :key="x">
        <circle :cx="x * tileSize" :cy="y * tileSize" r="1" fill="#edeaf4" />
      </g>
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import Grid from '@/engine/Grid';
@Component
export default class BoardDots extends Vue {
  @Prop() readonly grid!: Grid;
  tileSize = 64;

  get rows(): number {
    return this.grid.rows + 1;
  }

  get cols(): number {
    return this.grid.cols + 1;
  }
}
</script>

<style lang="scss" scoped>
.dots {
  width: 100%;
  height: 100%;
}
</style>
