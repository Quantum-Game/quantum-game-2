<template>
  <div v-if="particles.length > 0" ref="wrapper" class="simulation-steps-display-wrapper">
    <div class="hoveredPhotons">
      <h3>Visualization</h3>
      <div v-for="(particle, index) in particles" :key="index">
        <app-photon
          :particle="particle"
          :width="width"
          :height="80"
          :margin="0"
          :display-magnetic="true"
          :display-electric="true"
          :display-gaussian="true"
          :display-opacity="false"
          :display-direction="false"
        />
        <div class="info">
          <ul>
            <li>Ket: {{ particle.toKetString() }}</li>
            <li>Coord: [{{ `X: ${particle.x}, Y: ${particle.y}` }}]</li>
            <li>Direction: {{ particle.directionToAscii() }} ({{ particle.direction }}°)</li>
            <li>Probability: {{ particle.probability.toFixed(2) * 100 }}%</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import { CellInterface, CoordInterface } from '@/engine/interfaces';
import Particle from '@/engine/Particle';
import AppPhoton from '@/components/AppPhoton.vue';
import AppButton from '@/components/AppButton.vue';

@Component({
  components: {
    AppPhoton,
    AppButton
  }
})
export default class GamePhotons extends Vue {
  @State hoveredParticles!: Particle[];
  @Prop() readonly particles!: Particle[];
  width: number = 200;
  $refs!: {
    wrapper: HTMLElement;
  };
}
</script>

<style lang="scss" scoped>
.simulation-steps-display-wrapper {
  border-top: 1px solid white;
  width: 100%;
  display: block;
  text-align: left;
  .step {
    font-size: 0.8rem;
    line-height: 150%;
  }
  h3 {
    font-size: 1rem;
  }
  .info {
    display: none;
  }
}
</style>
