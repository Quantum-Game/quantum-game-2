<template>
  <div ref="wrapper" class="simulation-frame-kets" :class="{ ketHidden: ketHidden }">
    <span class="hidebutton" @click="toggleKets"
      >{{ ketHidden ? 'EXPAND' : 'COLLAPSE' }} SIMULATION INFO</span
    >
    <!-- <div class="temp">Ket (old): {{ frame.photons.ketString() }}</div> -->
    <!-- VIEWR -->
    <div class="quantum-state-viewer">
      <span
        v-for="(ketComponent, index) in ketComponents"
        :key="`ket-component-${index}`"
        class="ket-component"
      >
        <span class="ket-component2">
          + {{ renderComplex(ketComponent.amplitude) }}
          <!-- <svg height="16" width="16">
            <circle cx="8" cy="8" r="8" fill="red" />
          </svg> -->
        </span>
        <span
          v-for="(particleCoord, pIndex) in ketComponent.particleCoords"
          :key="`ket-component-${pIndex}`"
          class="ket-component3"
        >
          | {{ particleCoord.x }},{{ particleCoord.y }}
          <span class="ket-coord1">
            {{ renderDir(particleCoord.dir) }}
          </span>
          <span class="ket-coord2">
            {{ renderPol(particleCoord.pol) }}
          </span>
          ⟩
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
      <span v-if="polar" class="smallBtn">
        <span @click="polar = !polar">SHOW CARTESIAN</span>
      </span>
      <span v-else class="smallBtn">
        <span @click="polar = !polar">SHOW POLAR</span>
      </span>
    </div>
    <div v-if="showLegend" class="legend">
      <span class="exp01">amplitude (complex number)</span>
      <span class="exp02"> x,y coordinates</span>
      <span class="exp03">direction</span>
      <span class="exp04">polarization</span>
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
  data() {
    return {
      ketHidden: true
    };
  }

  @Prop() readonly frame!: QuantumFrame;
  @Prop() readonly grid!: Grid;
  @Prop({ default: true }) readonly showLegend!: boolean;

  polar = false;

  toggleKets(): void {
    this.$data.ketHidden = !this.$data.ketHidden;
  }

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
  padding: 6px;
}
.simulation-frame-kets {
  padding-top: 10px;
  width: 100%;
  display: block;
  text-align: center;
  height: 150px;
  transition: height 0.5s;
  overflow: hidden;
  @media screen and (max-width: 1000px) {
    border: none;
  }
}
.quantum-state-viewer {
  padding: 10px;
}

.ket-component {
  padding: 8px 2px 8px 2px;
  background-color: #17013a;
  margin: 5px;
  line-height: 1.4rem;
  display: inline-block;
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
.ket-coord1 {
  color: #ff0055;
}
.ket-coord2 {
  color: #faaa15;
}
.step {
  font-size: 0.8rem;
  line-height: 150%;
}
.smallBtn {
  background-color: inherit;
  //border: dotted 1px purple;
  background: #5c00d3;
  color: white;
  padding: 5px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.8rem;
}
.legend {
  padding: 6px;
  margin-top: 10px;
}
.exp01 {
  color: #0080ff;
  margin: 5px;
  font-size: 0.8rem;
}
.exp02 {
  color: #fff;
  margin: 5px;
  font-size: 0.8rem;
}
.exp03 {
  color: #ff0055;
  margin: 5px;
  font-size: 0.8rem;
}
.exp04 {
  color: #faaa15;
  margin: 5px;
  font-size: 0.8rem;
}
h3 {
  font-size: 1rem;
}

.hidebutton {
  display: none;
  cursor: pointer;
  font-weight: bold;
  @media screen and (max-width: 1000px) {
    display: block;
  }
}

.ketHidden {
  @media screen and (max-width: 1000px) {
    height: 30px;
  }
}
</style>
