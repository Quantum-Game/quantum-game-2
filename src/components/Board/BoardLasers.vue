<template>
  <g>
    <g v-for="[opacity, d] in paths" :key="opacity">
      <path class="laser" :d="d" :style="{ opacity }" />
    </g>
  </g>
</template>

<script lang="ts">
import { Particle, particleProbability, Coord } from '@/engine/model'
import { iFilterMap } from '@/itertools'
import { groupBy } from 'lodash'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    laserParticles: { type: Array as PropType<Particle[]>, default: [] },
  },
  setup(props) {
    const particlesByProbability = computed(() =>
      groupBy(props.laserParticles, particleProbability)
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
  fill: transparent;
  stroke: $red;
  stroke-width: 4; // Use particle.probability * x for scaling
  stroke-dasharray: 4 12;
  animation: dash 3s linear 0s infinite reverse forwards;
}
@keyframes dash {
  to {
    stroke-dashoffset: 64;
  }
}
</style>
