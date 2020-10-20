<template>
  <rect fill="#4F2F7B" :x="coord.x * 64 + 2" :y="coord.y * 64 - 8" :width="64 - 4" height="5" />
  <rect
    fill="url(#progress-gradient)"
    :x="coord.x * 64 + 2"
    :y="coord.y * 64 - 8"
    :width="(64 - 4) * value"
    height="5"
    class="progress-bar"
  />
  <rect
    stroke="white"
    :x="coord.x * 64 + 2 + (64 - 4) * threshold"
    :y="coord.y * 64 - 9"
    :width="0.01"
    height="7"
  />
</template>

<script lang="ts">
import { Coord } from '@/engine/model'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    coord: { type: Object as PropType<Coord>, required: true },
    value: { type: Number, required: true },
    threshold: { type: Number, required: true },
  },
})
</script>

<style lang="scss" scoped>
.progress-bar {
  transition: width 0.3s ease-out;
}
</style>
