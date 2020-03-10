<template>
  <!-- LASER PATH -->
  <g v-if="!simulationState" class="lasers">
    <g v-for="(particle, index) in pathParticles" :key="'laser' + index">
      <path
        :d="computePath(particle)"
        stroke-dasharray="8 8"
        fill="transparent"
        stroke="#FF0055"
        stroke-width="3"
        class="laserPath"
        :stroke-opacity="computeSize(particle)"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import Particle from '@/engine/Particle'

@Component
export default class Board extends Vue {
  @Prop({ default: '' }) readonly pathParticles!: Particle[]
  @Prop({ default: 64 }) readonly tileSize!: number
  @State simulationState!: boolean

  /**
   * Compute the laser path
   * @returns SVG path
   */
  computePath(particle: Particle): string {
    let pathStr = ''
    const originX = (particle.coord.x + 0.5) * this.tileSize
    const originY = (particle.coord.y + 0.5) * this.tileSize
    pathStr += `M ${originX} ${originY} `
    switch (particle.direction) {
      case 0:
        pathStr += ` H ${(particle.coord.x + 1) * this.tileSize}`
        break
      case 90:
        pathStr += ` V ${(particle.coord.y - 1) * this.tileSize}`
        break
      case 180:
        pathStr += ` H ${(particle.coord.x - 1) * this.tileSize}`
        break
      case 270:
        pathStr += ` V ${(particle.coord.y + 1) * this.tileSize}`
        break
      default:
        throw new Error(`Laser has wrong direction: ${particle.direction}°`)
    }
    return pathStr
  }

  /**
   * Compute laser path width according to probability
   * @returns laser path width
   */
  computeSize(particle: Particle): number {
    return 1 + particle.probability * 1.5
  }
}
</script>

<style lang="scss" scoped>
.lasers {
  width: 100%;
  height: 100%;
  .laserPath {
    stroke-dasharray: 4 12;
    animation-name: dash;
    animation-duration: 4s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: reverse;
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 64;
    }
  }
}
</style>
