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
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    tileSize: { type: Number, default: 64 },
  },
})
</script>

<style lang="scss" scoped>
.dots {
  width: 100%;
  height: 100%;
}
</style>
