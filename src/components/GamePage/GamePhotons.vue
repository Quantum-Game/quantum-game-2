<template>
  <div ref="wrapper" class="simulation-steps-display-wrapper">
    <div class="step">
      <h3>YOUR PHOTONS</h3>
      <!-- <span>STEP {{ activeFrame.step }}</span> -->
      <!-- <span>STATUS: {{ activeFrame.gameState }}</span> -->
      <div v-for="(particle, index) in particles" :key="index">
        <app-photon
          name
          :are="particle.a.re"
          :aim="particle.a.im"
          :bre="particle.b.re"
          :bim="particle.b.im"
          :width="width"
          :height="80"
          :display-magnetic="true"
          :display-electric="true"
          :display-gaussian="false"
        />
        <div class="info">
          <ul>
            <li>A: {{ `${particle.a.re.toFixed(2)} + ${particle.a.im.toFixed(2)}i` }}</li>
            <li>B: {{ `${particle.b.re.toFixed(2)} + ${particle.b.im.toFixed(2)}i` }}</li>
            <li>Coord: [{{ `X: ${particle.x}, Y: ${particle.y}` }}]</li>
            <li>Direction: {{ particle.direction }}</li>
            <li>Probability: {{ particle.probability.toFixed(2) * 100 }}%</li>
            <li>Path length: {{ particle.path.length }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { CellInterface, CoordInterface, FrameInterface } from '@/engine/interfaces';
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
}

.step {
  font-size: 0.8rem;
  line-height: 150%;
}

h3 {
  font-size: 1rem;
}
</style>
