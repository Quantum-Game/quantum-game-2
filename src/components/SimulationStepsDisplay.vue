<template>
 <div class="simulation-steps-display-wrapper">
  <div v-for="(frame, index) in frames" :key="index" class="step">
   <h3>STEP {{ frame.step }}</h3>
   <div v-for="(particle, pindex) in frame.quantum" :key="`particle-${pindex}`" class="particle">
    <div>
     A:
     {{ `im: ${particle.a.im}, re: ${particle.a.re}` }}
     B:
     {{ `im: ${particle.b.im}, re: ${particle.b.re}` }}
     Coord: {{ `y: ${particle.y}, x: ${particle.x}` }}
    </div>
    <div>
     direction: {{ particle.direction }} intensity: {{ particle.intensity }} path length:
     {{ particle.path.length }} phase: {{ particle.phase }}
    </div>
    <photon
     name="yay"
     :are="particle.a.re"
     :aim="particle.a.im"
     :bre="particle.b.re"
     :bim="particle.b.im"
    />
   </div>
  </div>
 </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import Photon from './Photon.vue';

@Component({
 components: {
  Photon
 }
})
export default class SimulationStepsDisplay extends Vue {
 @Prop() readonly frames!: any[];
}
</script>

<style lang="scss" scoped>
.simulation-steps-display-wrapper {
 width: 100%;
 display: block;
 text-align: left;
}
</style>
