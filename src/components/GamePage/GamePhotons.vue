<template>
  <div v-if="hoveredParticles.length > 0" ref="wrapper" class="hovered-photons-wrapper">
    <div class="hoveredPhotons">
      <h3>Photon</h3>
      <div v-for="(particle, index) in hoveredParticles" :key="index" class="photon">
        <app-photon
          :particle="particle"
          :width="width"
          :height="100"
          :margin="0"
          :display-magnetic="true"
          :display-electric="true"
          :display-gaussian="false"
          :display-opacity="true"
          :display-direction="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import Particle from '@/engine/Particle'
import AppPhoton from '@/components/AppPhoton.vue'
import AppButton from '@/components/AppButton.vue'

@Options({
  components: {
    AppPhoton,
    AppButton,
  },
})
export default class GamePhotons extends Vue {
  @State hoveredParticles!: Particle[]
  @Prop() readonly particles!: Particle[]
  width = 180
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
  padding-top: 10px;
  padding-bottom: 10px;
  @media screen and (max-width: 1000px) {
    display: none;
  }
  h3 {
    text-transform: uppercase;
    margin-top: 8px;
    font-size: 0.8rem;
    font-weight: 300;
  }
}
</style>
