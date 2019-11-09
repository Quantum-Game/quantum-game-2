<template>
  <!-- LASER PATH -->
  <g v-if="!simulationState" class="lasers">
    <g v-for="(particle, index) in pathParticles" :key="'laser' + index">
      <path
        :d="computePath(particle)"
        stroke-dasharray="8 8"
        fill="transparent"
        stroke="#FF0055"
        :stroke-width="computeSize(particle)"
        class="laserPath"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { ParticleInterface } from '@/engine/interfaces';
import Particle from '@/engine/Particle';
import Grid from '@/engine/Grid';
import Level from '@/engine/Level';

@Component
export default class Board extends Vue {
  @Prop({ default: '' }) readonly pathParticles!: Particle[];
  @State simulationState!: boolean;
  tileSize: number = 64;

  computePath(particle: Particle): string {
    return particle.toSvg();
  }

  computeSize(particle: Particle): number {
    return 2 + particle.probability * 3;
  }
}
</script>

<style lang="scss" scoped>
.lasers {
  width: 100%;
  height: 100%;
  .laserPath {
    stroke-dasharray: 8;
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
