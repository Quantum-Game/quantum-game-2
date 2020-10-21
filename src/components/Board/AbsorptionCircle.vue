<template>
  <g fill="none" stroke-width="5">
    <path :d="calculateArc(coord, 1)" stroke="#4F2F7B" />
    <path :d="calculateArc(coord, Math.min(valueTween, thresholdTween))" stroke="red" />
    <path :d="calculateArc(coord, valueTween)" stroke="red" opacity="0.5" />
  </g>
  <g stroke="white">
    <rect
      opacity="0.5"
      :x="coord.x * 64 + 32 - 0.25"
      :y="coord.y * 64 - 47.5"
      :width="0.5"
      height="7"
    />
    <rect
      :x="coord.x * 64 + 32 - 0.25"
      :y="coord.y * 64 - 47.5"
      :width="0.5"
      height="7"
      :style="{
        transform: `rotate(${thresholdTween * 360}deg)`,
        transformOrigin: `${coord.x * 64 + 32}px ${coord.y * 64 - 32}px`,
      }"
    />
  </g>
</template>

<script lang="ts">
import { Coord } from '@/engine/model'
import { Easing, useTween } from '@/mixins'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    coord: { type: Object as PropType<Coord>, required: true },
    value: { type: Number, required: true },
    threshold: { type: Number, required: true },
  },
  setup(props) {
    const valueTween = useTween({
      to: () => props.value,
      easing: Easing.Quartic.Out,
      duration: 200,
    })
    const thresholdTween = useTween({
      to: () => props.threshold,
      easing: Easing.Quartic.Out,
      duration: 200,
    })

    function calculateArc(coord: Coord, value: number): string {
      let cx = coord.x * 64 + 32
      let cy = coord.y * 64 - 32

      const r = 12
      let capped = Math.min(value, 0.999)

      const t1 = (Math.PI * 3) / 2
      const t2 = (Math.PI * 2 * capped) % (Math.PI * 2)

      const sx = cx + r * Math.cos(t1)
      const sy = cy + r * Math.sin(t1)
      const ex = cx + r * Math.cos(t1 + t2)
      const ey = cy + r * Math.sin(t1 + t2)
      const fa = t2 > Math.PI ? 1 : 0
      const fs = t2 > 0 ? 1 : 0
      return `M ${sx} ${sy} A ${r} ${r} 0 ${fa} ${fs} ${ex} ${ey}`
    }

    return { valueTween, thresholdTween, calculateArc }
  },
})
</script>

<style lang="scss" scoped></style>
