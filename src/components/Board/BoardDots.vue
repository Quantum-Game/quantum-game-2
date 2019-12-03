<template>
  <g class="dots">
    <g v-for="(row, y) in rows + 1" :key="y">
      <g v-for="(column, x) in cols + 1" :key="x">
        <circle :cx="x * tileSize" :cy="y * tileSize" r="1" fill="#edeaf4" />
      </g>
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class BoardDots extends Vue {
  @Prop() readonly rows!: number
  @Prop() readonly cols!: number
  @Prop({ default: 64 }) readonly tileSize!: number
}
</script>

<style lang="scss" scoped>
.dots {
  width: 100%;
  height: 100%;
}
</style>
