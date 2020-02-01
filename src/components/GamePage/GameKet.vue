<template>
  <div ref="wrapper" class="simulation-frame-kets" :class="{ ketHidden: ketHidden }">
    <div class="btn-group">
      <span v-for="(style, index) in styles" :key="`style-${index}`" @click="selectedStyle = style">
        <button :class="{ selected: style === selectedStyle }">{{ style }}</button>
      </span>
    </div>
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
        <svg v-if="selectedStyle === 'color'" height="16" width="16" class="ket-disk">
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
      <div v-if="absorptions.length > 0" class="absorptions">
        Absorptions:
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
      <div v-if="showLegend && ketComponents.length > 0" class="legend">
        <span v-if="selectedStyle === 'color'">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Complex } from 'quantum-tensors'
import { hslToHex, TAU } from '@/engine/Helpers'
import Grid from '@/engine/Grid'
import AppPhoton from '@/components/AppPhoton.vue'
import AppButton from '@/components/AppButton.vue'
import QuantumFrame, { IKetComponent } from '@/engine/QuantumFrame'
import { IAbsorption } from '@/engine/interfaces'

@Component({
  components: {
    AppPhoton,
    AppButton
  }
})
export default class GameKet extends Vue {
  // TODO: Currently kinda ugly
  // TODO: Move logic to engine Helpers
  @Prop() readonly frame!: QuantumFrame
  @Prop() readonly grid!: Grid
  @Prop({ default: true }) readonly showLegend!: boolean

  styles = ['polar', 'cartesian', 'color']
  selectedStyle = 'polar'

  toPercent(x: number, precision = 1): string {
    return (100 * x).toFixed(precision)
  }

  elementName(x: number, y: number): string {
    return x === -1 && y === -1 ? 'OutOfBoard' : this.grid.cellFromXY(x, y).element.name
  }

  renderComplexPolar(z: Complex, precision = 2): string {
    return `${z.r.toFixed(precision)} exp(i${z.phi.toFixed(precision)})`
  }

  renderComplexCartesian(z: Complex, precision = 2): string {
    return `(${z.re.toFixed(precision)} + i${z.im.toFixed(precision)})`
  }

  discScale(r: number): number {
    return 8 * r
  }

  complexToColor(z: Complex): string {
    const angleInDegrees = ((z.arg() * 360) / TAU + 360) % 360
    return hslToHex(angleInDegrees, 100, 50)
  }

  renderDir(dir: number): string {
    return ['⤑', '⇡', '⇠', '⇣'][dir]
  }

  renderPol(pol: number): string {
    return ['H', 'V'][pol]
  }

  get absorptions(): IAbsorption[] {
    return this.frame.absorptions
  }

  get ketComponents(): IKetComponent[] {
    return this.frame.ketComponents
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
  & .quantum-state-viewer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    & .controls {
      font-size: 0.8rem;
      color: white;
      padding: 10px;
    }
    & .absorptions {
      font-size: 0.8rem;
      color: white;
      padding: 10;
      margin: 10px;
    }
    & .legend {
      padding-top: 10px;
      padding-bottom: 15px;
      width: 100%;
      font-size: 0.6rem;
      & .legend-complex {
        color: #fff;
        margin: 5px;
      }
      & .legend-coord-xy {
        color: #0080ff;
        margin: 5px;
      }
      & .legend-dir {
        color: #ff0055;
        margin: 5px;
      }
      & .legend-pol {
        color: #9d40ff;
        margin: 5px;
      }
    }
    & .ket-component {
      padding: 1px 1px 1px 1px;
      background-color: rgba(0, 0, 0, 0.5);
      margin: 5px;
      line-height: 1.4rem;
      font-size: 0.8rem;
      flex-wrap: nowrap;
      flex-direction: row;
      display: flex;
      align-items: center;
      & .ket-complex {
        background-color: #2e006a;
        color: #fff;
        padding: 2px;
        margin: 5px;
      }
      & .ket-disk {
        margin-left: 5px;
      }
      & .ket-coord {
        color: #0080ff;
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
    max-width: 100%;
    & button {
      font-size: 0.5rem;
      font-family: 'Montserrat', Helvetica, Arial, sans-serif;
      text-transform: uppercase;
      background-color: transparent;
      border: none;
      color: white;
      padding: 5px 10px;
      margin: 5px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        background-color: transparent;
        color: white;
      }
      &.selected {
        text-decoration: underline;
        background-color: transparent;
        color: white;
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
</style>
