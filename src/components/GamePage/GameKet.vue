<template>
  <div ref="wrapper" class="simulation-frame-kets" :class="{ ketHidden: ketHidden }">
    <span class="hidebutton" @click="toggleKets"
      >{{ ketHidden ? 'EXPAND' : 'COLLAPSE' }} SIMULATION INFO</span
    >
    <!-- VIEWER -->
    <div class="quantum-state-viewer">
      <span
        v-for="(ketComponent, index) in ketComponents"
        :key="`ket-component-${index}`"
        class="ket-component"
      >
        <span v-if="selectedStyle === 'polar'" class="ket-complex">
          {{ renderComplexPolar(ketComponent.amplitude) }}
        </span>
        <span v-if="selectedStyle === 'cartesian'" class="ket-complex">
          {{ renderComplexCartesian(ketComponent.amplitude) }}
        </span>
        <svg v-if="selectedStyle === 'color-disk'" height="16" width="16" class="ket-disk">
          <circle
            cx="8"
            cy="8"
            :r="discScale(ketComponent.amplitude.r)"
            :fill="complexToColor(ketComponent.amplitude)"
          />
        </svg>
        <span
          v-for="(particleCoord, pIndex) in ketComponent.particleCoords"
          :key="`ket-component-${pIndex}`"
          class="ket-coord"
        >
          | {{ particleCoord.x }},{{ particleCoord.y }}
          <span class="ket-dir">
            {{ renderDir(particleCoord.dir) }}
          </span>
          <span class="ket-pol">
            {{ renderPol(particleCoord.pol) }}
          </span>
          ⟩
        </span>
      </span>
      <div v-if="showLegend && ketComponents.length > 0" class="legend">
        <span v-if="selectedStyle === 'color-disk'">
          <span class="legend-coord-xy"> x,y coordinates</span>
          <span class="legend-dir">direction</span>
          <span class="legend-pol">polarization</span>
        </span>
        <span v-else>
          <span class="legend-complex">amplitude (complex number)</span>
          <span class="legend-coord-xy"> x,y coordinates</span>
          <span class="legend-dir">direction</span>
          <span class="legend-pol">polarization</span>
        </span>
      </div>
      <div v-if="absorptions.length > 0" class="controls">
        ABSORPTIONS:
        <span
          v-for="(absorption, index) in absorptions"
          :key="`absorption-${index}`"
          class="absorption"
        >
          {{ toPercent(absorption.probability) }}% in
          {{ elementName(absorption.coord.x, absorption.coord.y) }} at ({{ absorption.coord.x }},
          {{ absorption.coord.y }})
        </span>
      </div>
    </div>
    <div class="btn-group">
      <span v-for="(style, index) in styles" :key="`style-${index}`" @click="selectedStyle = style">
        <button :class="{ selected: style === selectedStyle }">{{ style }}</button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { Complex } from 'quantum-tensors';
import { CellInterface, CoordInterface } from '@/engine/interfaces';
import { hslToHex, TAU } from '@/engine/Helpers';
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
  // TODO: Currently kinda ugly
  // TODO: Move logic to engine Helpers
  @Prop() readonly frame!: QuantumFrame;
  @Prop() readonly grid!: Grid;
  @Prop({ default: true }) readonly showLegend!: boolean;

  ketHidden = true;
  styles = ['polar', 'cartesian', 'color-disk'];
  selectedStyle = 'polar';

  toggleKets(): void {
    this.ketHidden = !this.ketHidden;
  }

  toPercent(x: number, precision = 1): string {
    return (100 * x).toFixed(precision);
  }

  elementName(x: number, y: number): string {
    return x === -1 && y === -1 ? 'OutOfBoard' : this.grid.cellFromXY(x, y).element.name;
  }

  renderComplexPolar(z: Complex, precision = 2): string {
    return `${z.r.toFixed(precision)} exp(i${z.phi.toFixed(precision)})`;
  }

  renderComplexCartesian(z: Complex, precision = 2): string {
    return `(${z.re.toFixed(precision)} + i${z.im.toFixed(precision)})`;
  }

  discScale(r: number): number {
    return 8 * r;
  }

  complexToColor(z: Complex): string {
    const angleInDegrees = ((z.arg() * 360) / TAU + 360) % 360;
    return hslToHex(angleInDegrees, 100, 50);
  }

  renderDir(dir: number) {
    return ['⤑', '⇡', '⇠', '⇣'][dir];
  }

  renderPol(pol: number) {
    return ['H', 'V'][pol];
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
.simulation-frame-kets {
  padding-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  transition: height 0.5s;
  overflow: hidden;
  align-content: space-between;
  @media screen and (max-width: 1000px) {
    padding: 0;
    display: none;
  }
  & .quantum-state-viewer {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    & .controls {
      font-size: 0.8rem;
      color: white;
      padding: 6px;
    }
    & .legend {
      padding-bottom: 6px;
      width: 100%;
      & .legend-complex {
        color: #0080ff;
        margin: 5px;
        font-size: 0.8rem;
      }
      & .legend-coord-xy {
        color: #fff;
        margin: 5px;
        font-size: 0.8rem;
      }
      & .legend-dir {
        color: #ff0055;
        margin: 5px;
        font-size: 0.8rem;
      }
      & .legend-pol {
        color: #9d40ff;
        margin: 5px;
        font-size: 0.8rem;
      }
    }
    & .ket-component {
      padding: 1px 1px 1px 1px;
      background-color: #17013a;
      margin: 5px;
      line-height: 1.4rem;
      flex-wrap: nowrap;
      flex-direction: row;
      display: flex;
      align-items: center;
      & .ket-complex {
        background-color: #2e006a;
        color: #0080ff;
        padding: 2px;
        margin: 5px;
      }
      & .ket-disk {
        margin-left: 5px;
      }
      & .ket-coord {
        color: white;
        padding: 1px;
        margin: 5px;
        & .ket-dir {
          color: #ff0055;
        }
        & .ket-pol {
          color: #9d40ff;
        }
      }
    }
  }
  & .btn-group {
    text-align: center;
    display: flex;
    justify-content: center;
    & button {
      font-size: 0.8rem;
      font-family: 'Montserrat', Helvetica, Arial, sans-serif;
      text-transform: uppercase;
      background-color: #5c00d3;
      border: none;
      color: white;
      padding: 5px 10px;
      margin: 5px;
      cursor: pointer;
      &:hover {
        background-color: #4302bf;
        color: white;
      }
      &.selected {
        background-color: white;
        color: #5c00d3;
      }
    }
  }
  @media screen and (max-width: 1000px) {
    border: none;
  }
}

.step {
  font-size: 0.8rem;
  line-height: 150%;
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
    height: 20px;
  }
}
</style>
