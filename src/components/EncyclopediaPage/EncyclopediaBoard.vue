<template>
  <div class="container">
    <div class="svg-container">
      <svg ref="grid" class="grid" :width="totalWidth" :height="totalHeight">
        <!-- DOTS -->
        <board-dots :rows="grid.rows" :cols="grid.cols" />

        <!-- LASERS -->
        <board-lasers :path-particles="allParticles" />

        <!-- PHOTONS -->
        <g
          v-for="(particle, i) in selectedFrame.polarizationSuperpositions"
          :key="`particle-${i}-(${particle.coord.x},${particle.coord.y})-${particle.direction}`"
          :style="computeParticleStyle(particle)"
          class="photons"
        >
          <app-photon
            name
            :particle="particle"
            :width="64"
            :height="64"
            :margin="0"
            :display-magnetic="false"
            :display-electric="true"
            :display-gaussian="true"
            :display-opacity="true"
            :sigma="0.25"
          />
        </g>

        <!-- CELLS -->
        <app-cell
          v-for="(cell, i) in nonVoidCells"
          :key="`cell-${i}-(${cell.coord.x},${cell.coord.y})-${cell.element.name})`"
          :cell="cell"
          :tileSize="tileSize"
          @click.native="rotate(cell)"
        />
      </svg>
    </div>
    <div class="btn-group">
      <span
        v-for="(frame, index) in frames"
        :key="'frame' + index"
        @mouseover="selectedFrameId = index"
      >
        <button :class="{ selected: selectedFrameId === index }"></button>
      </span>
    </div>
    <div class="ket">
      <ket-viewer :vector="selectedFrame.photons.vector" :initial-pol-basis="initialPolBasis" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import Cell from '@/engine/Cell'
import Grid from '@/engine/Grid'
import { IParticle, IGrid, IIndicator } from '@/engine/interfaces'
import { KetViewer } from 'bra-ket-vue'
import AppPhoton from '@/components/AppPhoton.vue'
import BoardDots from '@/components/Board/BoardDots.vue'
import BoardLasers from '@/components/Board/BoardLasers.vue'
import AppCell from '@/components/Board/AppCell.vue'
import { Vector, Frame, Simulation } from 'quantum-tensors'
import { IStyle } from '@/types'

@Component({
  components: {
    AppPhoton,
    AppCell,
    BoardLasers,
    BoardDots,
    KetViewer,
  },
})
export default class EncyclopediaBoard extends Vue {
  @Prop({ default: () => Grid.dummyIGrid() }) iGrid!: IGrid
  @Prop({ default: () => 10 }) readonly maxSteps!: number
  @Prop({ default: () => 2 }) readonly defaultStep!: number
  @Prop({ default: () => [] }) readonly initialState!: {
    posX: number
    posY: number
    vecDirPol: Vector
  }[]

  @Prop({ default: () => [] }) readonly indicators!: IIndicator[]
  @Prop({ default: false }) readonly exactSteps!: boolean
  @Prop({ default: 64 }) readonly tileSize!: number

  grid = Grid.importGrid(this.iGrid)
  simulation: Simulation = new Simulation(this.grid.exportSimGrid())
  selectedFrameId = this.defaultStep

  $refs!: {
    grid: HTMLElement
  }

  created(): void {
    // eslint-disable-next-line no-return-assign
    this.grid.cells.forEach((cell) => (cell.tool = false))
    this.reset()
  }

  /**
   * Rotate element (e.g. to be used on click).
   */
  rotate(cell: Cell): void {
    cell.rotate()
    this.reset()
    this.$emit('updateRotation', cell)
  }

  /**
   * Recompute quantum simulation
   * Set steps and selected frame
   */
  reset(): void {
    this.simulation = new Simulation(this.grid.exportSimGrid())
    if (this.initialState.length === 1) {
      const d = this.initialState[0]
      // this.simulation.intializeFromXYState(d.posX, d.posY, d.vecDirPol)
      this.simulation.initializeFromIndicator({
        x: d.posX,
        y: d.posY,
        rotation: 'v',
        polarization: 'v',
      })
    } else {
      // to be removed later
      if (this.indicators.length === 0) {
        const indicator = this.simulation.generateLaserIndicator()
        this.simulation.initializeFromIndicator(indicator)
      } else if (this.indicators.length === 1) {
        this.simulation.initializeFromIndicator(this.indicators[0])
      } else {
        throw new Error('EncyclopediaBoard not yet prepared for more photons.')
      }
    }
    if (this.exactSteps) {
      this.simulation.generateFrames(this.maxSteps, -1)
    } else {
      this.simulation.generateFrames(this.maxSteps)
    }
    this.selectedFrameId = Math.min(this.selectedFrameId, this.simulation.frames.length - 1)
  }

  get initialPolBasis(): string {
    if (this.initialState.length === 1) {
      return this.initialState[0].vecDirPol.dimensions.filter(
        (dim) => dim.name === 'polarization'
      )[0].coordString
    } else {
      return 'HV'
    }
  }

  get frames(): Frame[] {
    return this.simulation.frames
  }

  get selectedFrame(): Frame {
    return this.frames[this.selectedFrameId]
  }

  get frameNumber(): number {
    return this.frames.length
  }

  get allParticles(): IParticle[] {
    const result: IParticle[] = []
    this.frames.forEach((frame): void => {
      frame.particles.forEach((particle: IParticle): void => {
        result.push(particle)
      })
    })
    return result
  }

  get nonVoidCells(): Cell[] {
    return this.grid.unvoid.cells
  }

  get totalWidth(): number {
    return this.grid.cols * this.tileSize
  }

  get totalHeight(): number {
    return this.grid.rows * this.tileSize
  }

  centerCoord(val: number): number {
    return (val + 0.5) * this.tileSize
  }

  computeParticleStyle(particle: IParticle): IStyle {
    return {
      transform: `
        translate(${particle.x * this.tileSize}px, ${particle.y * this.tileSize}px)`,
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: inline-block;
  margin-bottom: 30px;
  .svg-container {
    padding: 20px;
  }
}

.ket {
  width: 360px;
  padding: 5px 10px;
  margin-top: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}

.btn-group {
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;

  button {
    background-color: transparent;
    border-radius: 50%;
    border: 1px solid #fff;
    padding: 5px 5px;
    margin: 5px;
    cursor: pointer;
  }

  &:after {
    content: '';
    clear: both;
    display: table;
  }

  button:hover {
    background-color: white;
  }

  .selected {
    background-color: white;
  }
}
</style>
