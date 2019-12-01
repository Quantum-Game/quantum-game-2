<template>
  <div v-if="hoveredParticles.length > 0" ref="wrapper" class="hovered-photons-wrapper">
    <div class="hoveredPhotons">
      <h3>Photon</h3>
      <div v-for="(particle, index) in hoveredParticles" :key="index">
        <app-photon
          :particle="particle"
          :width="width"
          :height="100"
          :margin="0"
          :display-magnetic="true"
          :display-electric="true"
          :display-gaussian="true"
          :display-opacity="true"
          :display-direction="false"
        />
        <div class="info">
          <p>Ket: {{ particle.toKetString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import Particle from '@/engine/Particle'
import AppPhoton from '@/components/AppPhoton.vue'
import AppButton from '@/components/AppButton.vue'

@Component({
  components: {
    AppPhoton,
    AppButton
  }
})
export default class GamePhotons extends Vue {
  @State hoveredParticles!: Particle[]
  @Prop() readonly particles!: Particle[]
  width: number = 180
  $refs!: {
    wrapper: HTMLElement
  }
}
</script>

<style lang="scss" scoped>
.hovered-photons-wrapper {
  border-bottom: 1px solid white;
  border-top: 1px solid #8e819d;
  width: 100%;
  display: block;
  text-align: left;
  @media screen and (max-width: 1000px) {
    display: none;
  }
  .step {
    font-size: 0.8rem;
    line-height: 150%;
  }
  h3 {
    text-transform: uppercase;
  }
  .info {
    font-size: 0.8rem;
  }
}
</style>
