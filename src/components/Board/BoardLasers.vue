<template>
  <g>
    <g v-for="(particle, index) in laserParticles" :key="'laser' + index">
      <path class="laser" :d="particle.toSvg()" />
    </g>
  </g>
</template>

<script lang="ts">
import Particle from '@/engine/Particle'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    laserParticles: { type: Array as PropType<Particle[]>, default: [] },
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
