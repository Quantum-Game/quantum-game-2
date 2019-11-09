<template>
  <g class="dots">
    <g v-for="(row, y) in gridDimensions.rows" :key="y">
      <g v-for="(column, x) in gridDimensions.cols" :key="x">
        <circle
          :cx="x * gridDimensions.tileSize"
          :cy="y * gridDimensions.tileSize"
          r="1"
          fill="#edeaf4"
        />
      </g>
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BoardDots extends Vue {
  @Prop() readonly gridDimensions!: { x: number; y: number; tileSize: number };
}
</script>

<style lang="scss" scoped>
.dots {
  width: 100%;
  height: 100%;
}
</style>
