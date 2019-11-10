<template>
  <div ref="wrapper" class="simulation-frame-kets">
    <!-- <div class="temp">Ket (old): {{ frame.photons.ketString() }}</div> -->
    <!-- VIEWR -->
    <div class="quantum-state-viewer">
      <span
        v-for="(ketComponent, index) in ketComponents"
        :key="`ket-component-${index}`"
        class="ket-component"
      >
        <span class="ket-component2"> + {{ renderComplex(ketComponent.amplitude) }} </span>
        <span
          v-for="(particleCoord, pIndex) in ketComponent.particleCoords"
          :key="`ket-component-${pIndex}`"
          class="ket-component3"
        >
          | {{ particleCoord.x }},{{ particleCoord.y }} {{ renderDir(particleCoord.dir) }}
          {{ renderPol(particleCoord.pol) }} ⟩
        </span>
      </span>
    </div>
    <!-- VIEWR -->
    <div v-if="absorptions.length > 0" class="controls">
      Absorptions:
      <span
        v-for="(absorption, index) in absorptions"
        :key="`absorption-${index}`"
        class="absorption"
      >
        {{ toPercent(absorption.probability) }}% in {{ elementName(absorption.x, absorption.y) }} at
        ({{ absorption.x }}, {{ absorption.y }})
      </span>
    </div>
    <div class="controls">
      <span v-if="polar">
        <span @click="polar = !polar">Show cartesian</span>
      </span>
      <span v-else>
        <span @click="polar = !polar">Show polar</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { Complex } from 'quantum-tensors';
import { CellInterface, CoordInterface } from '@/engine/interfaces';
import Particle from '@/engine/Particle';
import Grid from '@/engine/Grid';
import AppPhoton from '@/components/AppPhoton.vue';
import AppButton from '@/components/AppButton.vue';
import QuantumFrame from '@/engine/QuantumFrame';

@Component({
  components: {
    AppPhoton,
    AppButton
  }
})
export default class GameKet extends Vue {
  @Prop() readonly frame!: QuantumFrame;
  @Prop() readonly grid!: Grid;

  polar = false;

  toPercent(x: number, precision = 1): string {
    return (100 * x).toFixed(precision);
  }

  elementName(x: number, y: number): string {
    return this.grid.cellFromXY(x, y).element.name;
  }

  renderComplex(z: Complex, precision = 2) {
    if (this.polar) {
      return `${z.r.toFixed(precision)} exp(i${z.phi.toFixed(precision)})`;
    }
    return `(${z.re.toFixed(precision)} + i${z.im.toFixed(precision)})`;
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
.temp {
  font-size: 0.6rem;
  color: gray;
  padding: 10px;
}
.controls {
  //font-size: 0.8rem;
  color: #9229ed;
}
.simulation-frame-kets {
  padding-top: 10px;
  border-top: 1px solid white;
  width: 100%;
  display: block;
  text-align: center;
}
.quantum-state-viewer {
  padding: 10px;
}

.ket-component {
  padding: 8px 2px 8px 2px;
  background-color: #17013a;
  margin: 5px;
}
.ket-component2 {
  background-color: #2e006a;
  color: #0080ff;
  padding: 2px;
  margin: 5px;
}
.ket-component3 {
  background-color: #2e006a;
  color: white;
  padding: 2px;
  margin: 5px;
}

.step {
  font-size: 0.8rem;
  line-height: 150%;
}

h3 {
  font-size: 1rem;
}
</style>
