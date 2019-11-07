<template>
  <div ref="wrapper" class="simulation-frame-kets">
    <div>
      Ket (old): {{ frame.photons.ketString() }}
    </div>
    <div>
      <span v-for="(ketComponent, index) in ketComponents" :key="`ket-component-${index}`" class="ket-component">
        <span>
          + {{ renderComplex(ketComponent.amplitude) }}
        </span>
        <span v-for="(particleCoord, index) in ketComponent.particleCoords" :key="`ket-component-${index}`" class="ket-component">
          | {{ particleCoord.x }},{{ particleCoord.y }} {{ renderDir(particleCoord.dir) }} {{ renderPol(particleCoord.pol) }}  ⟩
        </span>
      </span>
    </div>
    <div>
      Absorptions: 
      <span v-for="(absorption, index) in absorptions" :key="`absorption-${index}`" class="absorption">
        {{ toPercent(absorption.probability)}}% at ({{ absorption.x }}, {{ absorption.y }})
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { CellInterface, CoordInterface } from '@/engine/interfaces';
import Particle from '@/engine/Particle';
import AppPhoton from '@/components/AppPhoton.vue';
import AppButton from '@/components/AppButton.vue';
import QuantumFrame from '@/engine/QuantumFrame';
import { Complex } from 'quantum-tensors'; 

@Component({
  components: {
    AppPhoton,
    AppButton
  }
})
export default class GameKet extends Vue {
  @Prop() readonly frame!: QuantumFrame;

  toPercent(x: number, precision = 1): string {
    return (100 * x).toFixed(precision)
  }

  renderComplex(z: Complex, precision = 2) {
    return `${z.r.toFixed(precision)} exp(i${z.phi.toFixed(precision)})`;
  }

  renderDir(dir: number) {
    return ['⤑', '⇡', '⇠', '⇣'][dir];
    // or return ["⟷", "↕︎"][pol];
  }

  renderPol(pol: number) {
    return ['H', 'V'][pol];
    // or return ["⟷", "↕︎"][pol];
  }

  get absorptions() {
    return this.frame.absorptions;
  }

  get ketComponents() {
    return this.frame.ketComponents;
  }

}
</script>

<style lang="scss" scoped>
.simulation-frame-kets {
  padding-top: 10px;
  border-top: 1px solid white;
  width: 100%;
  display: block;
  text-align: center;
}

.step {
  font-size: 0.8rem;
  line-height: 150%;
}

h3 {
  font-size: 1rem;
}
</style>
