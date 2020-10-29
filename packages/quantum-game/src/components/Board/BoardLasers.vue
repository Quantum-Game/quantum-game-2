<template>
  <g :key="blur" :class="{ laserBlur: blur }">
    <path
      v-for="[probability, d] in paths"
      :key="probability"
      class="laser"
      :d="d"
      :style="{ opacity: probability * opacity }"
    />
  </g>
</template>

<script lang="ts">
import { Particle, particleProbability, Coord } from '@/engine/model'
import { iFilterMap } from '@/itertools'
import { groupBy } from 'lodash'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    opacity: { type: Number, default: 1 },
    particles: { type: Array as PropType<Particle[]>, default: [] },
    blur: { type: Boolean, default: false },
  },
  setup(props) {
    const particlesByProbability = computed(() =>
      groupBy(props.particles, (p) => Math.round(particleProbability(p) * 20) / 20)
    )
    const paths = computed(() =>
      Array.from(
        iFilterMap(Object.entries(particlesByProbability.value), ([prob, ps]) =>
          +prob > 0.001 ? [prob, pathForParticles(ps)] : null
        )
      )
    )

    function pathForParticles(particles: Particle[]) {
      let path = ''
      let last: Coord | null = null
      for (const p of particles) {
        const p1 = p.coord
        const p2 = p.coord.neighbour(p.direction)
        if (p1 !== last) {
          const c1 = p1.gridCenter()
          path += `M${c1.x} ${c1.y}`
        }
        const c2 = p2.gridCenter()
        path += `L${c2.x} ${c2.y}`
        last = p2
      }
      return path
    }

    return { paths }
  },
})
</script>

<style lang="scss" scoped>
$red: #ff0055;
.laser {
  fill: none;
  stroke: $red;
  stroke-width: 4; // Use particle.probability * x for scaling
  stroke-dasharray: 4 12;
  animation: dash 3s linear 0s infinite reverse forwards;
  transition: opacity 0.1s ease-out;
}
@keyframes dash {
  to {
    stroke-dashoffset: 64;
  }
}

.laserBlur .laser {
  transition: opacity 0.5s ease-out;
  animation: none;
  stroke-dasharray: initial;
  stroke-width: 10;
}
</style>
