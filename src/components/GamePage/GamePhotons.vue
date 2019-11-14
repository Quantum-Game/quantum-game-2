<template>
  <div v-if="hoveredParticles.length > 0" ref="wrapper" class="hovered-photons-wrapper">
    <div class="hoveredPhotons">
      <h3>Photon</h3>
      <div v-for="(particle, index) in hoveredParticles" :key="index">
        <app-photon
          :particle="particle"
          :width="width"
          :height="120"
          :margin="0"
          :display-magnetic="true"
          :display-electric="true"
          :display-gaussian="true"
          :display-opacity="true"
          :display-direction="false"
        />
        <div class="info">
          <p>Ket: {{ particle.toKetString() }}</p>
          <!-- <p>Coord: [{{ `X: ${particle.x}, Y: ${particle.y}` }}]</p>
          <p>Direction: {{ particle.directionToAscii() }} ({{ particle.direction }}°)</p>
          <p>Probability: {{ particle.probability.toFixed(2) * 100 }}%</p> -->
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
  width: number = 100;
  $refs!: {
    wrapper: HTMLElement;
  };
}
</script>

<style lang="scss" scoped>
.hovered-photons-wrapper {
  border-bottom: 1px solid white;
  width: 100%;
  // width: 150px;
  display: block;
  text-align: left;
  .step {
    font-size: 0.8rem;
    line-height: 150%;
  }
  h3 {
    text-transform: uppercase;
  }
  .info {
    // display: none;
    font-size: 0.8rem;
  }
}
</style>
