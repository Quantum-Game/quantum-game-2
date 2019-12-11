<template>
  <div ref="boardScaler" class="board_scaler" :style="{ height: boardHeight + 'px' }">
    <svg
      ref="gridWrapper"
      :style="scalerStyle"
      class="grid"
      :width="totalWidth"
      :height="totalHeight"
    >
      <!-- DOTS -->
      <board-dots :rows="grid.rows" :cols="grid.cols" />

      <!-- LASER PATH -->
      <board-lasers :pathParticles="pathParticles" />

      <!-- FATE -->
      <g class="fate">
        <circle
          :cx="(fate.coord.x + 0.5) * tileSize"
          :cy="(fate.coord.y + 0.5) * tileSize"
          fill="purple"
          r="30"
          stroke="purple"
          stroke-width="2"
        >
          <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="1" />
          <animate attributeName="r" from="32" to="64" dur="1.5s" begin="0s" repeatCount="1" />
        </circle>
      </g>

      <!-- PHOTONS -->
      <g
        v-for="(particle, index) in particles"
        :key="'particle' + index"
        :v-if="particles.length > 0"
        :style="computeParticleStyle(particle)"
        class="photons"
        @mouseenter.native="handleMouseEnter(particle.coord)"
      >
        <app-photon
          name
          :particle="particle"
          :animate="2"
          :margin="2"
          :display-magnetic="false"
          :display-electric="true"
          :display-gaussian="true"
          :sigma="0.25"
        />
      </g>

      <!-- CELLS -->
      <app-cell
        v-for="(cell, i) in grid.cells"
        :key="'cell' + i"
        :cell="cell"
        :tileSize="tileSize"
        @updateCell="updateCell"
        @mouseover.native="handleMouseEnter(cell.coord)"
        @mouseleave.native="handleMouseLeave(cell.coord)"
        @play="play"
      />

      <!-- PROBABILITY -->
      <text
        v-for="(absorption, i) in absorptions"
        :key="'probability' + i"
        :x="(absorption.cell.coord.x + 0.5) * 64"
        :y="absorption.cell.coord.y * 64"
        text-anchor="middle"
        class="probability"
      >
        {{ (absorption.probability * 100).toFixed(1) }}%
      </text>

      <!-- SPEECH BUBBLES -->
      <speech-bubble
        v-for="(hint, index) in hints"
        :key="`hint${index}`"
        :hint="hint"
        :tileSize="tileSize"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import Coord from '@/engine/Coord'
import Cell from '@/engine/Cell'
import Grid from '@/engine/Grid'
import Particle from '@/engine/Particle'
import { IHint } from '@/engine/interfaces'
import AppCell from '@/components/Board/AppCell.vue'
import BoardLasers from '@/components/Board/BoardLasers.vue'
import BoardDots from '@/components/Board/BoardDots.vue'
import AppPhoton from '@/components/AppPhoton.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import Absorption from '../../engine/Absorption'

@Component({
  components: {
    AppCell,
    AppPhoton,
    BoardLasers,
    BoardDots,
    SpeechBubble
  }
})
export default class Board extends Vue {
  @Prop() readonly grid!: Grid
  @Prop() readonly fate!: Cell
  @Prop({ default: [] }) readonly hints!: IHint[]
  @Prop({ default: [] }) readonly particles!: Particle[]
  @Prop({ default: [] }) readonly pathParticles!: Particle[]
  @Prop({ default: [] }) readonly absorptions!: Absorption[]
  @Mutation('SET_HOVERED_PARTICLE') mutationSetHoveredParticles!: (particles: Particle[]) => void
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void
  @State hoveredParticles!: Particle[]
  @State hoveredCell!: Cell
  @State activeCell!: Cell

  tileSize = 64
  boardHeight = 0
  scalerStyle = {
    transform: `scale(1)`
  }

  $refs!: {
    gridWrapper: HTMLElement
    boardScaler: HTMLElement
  }

  mounted(): void {
    window.addEventListener('resize', this.assessTileSize)
    this.assessTileSize()
  }

  /**
   * Drilling from appCell to Game to allow clicking laser to start simulation
   */
  play(): void {
    this.$emit('play', true)
  }

  /**
   * Drilling from appCell to updateCell
   */
  updateCell(cell: Cell): void {
    this.$emit('updateCell', cell)
  }

  /**
   * Handle mouse over from cell and photons
   */
  handleMouseEnter(coord: Coord): void {
    const cell = this.grid.get(coord)
    const particles = this.particles.filter((particle) => {
      return particle.coord.equal(coord)
    })
    if (cell !== this.hoveredCell && !cell.isVoid) {
      this.mutationSetHoveredCell(cell)
    }
    if (particles.length > 0) {
      this.mutationSetHoveredParticles(particles)
    }
  }

  /**
   * Handle mouse over from cell and photons
   */
  handleMouseLeave(coord: Coord): void {
    const particles = this.particles.filter((particle) => {
      return particle.coord.equal(coord)
    })
    if (particles.length > 0) {
      this.mutationSetHoveredParticles([])
    }
  }

  assessTileSize(): void {
    const currentWidth = this.$refs.boardScaler.getBoundingClientRect().width
    this.$data.scalerStyle = {
      transform: `scale(${currentWidth / 845})`
    }
    setTimeout(() => {
      const currentHeight = this.$refs.gridWrapper.getBoundingClientRect().height
      this.$data.boardHeight = currentHeight
    }, 1)
    this.tileSize = 64
  }

  get totalWidth(): number {
    return this.grid.cols * this.tileSize
  }

  get totalHeight(): number {
    return this.grid.rows * this.tileSize
  }

  /**
   * Compute fate cell position
   */
  computeFateStyle(): {} {
    console.log(`FATE: ${this.fate.toString()}`)
    return {
      transform: `translate: ${this.fate.coord.x * this.tileSize}px ${this.fate.coord.y *
        this.tileSize}px`
    }
  }

  /**
   * Compute photon grid position
   */
  computeParticleStyle(particle: Particle): {} {
    return {
      transform: `translate(${particle.coord.x * this.tileSize}px, ${particle.coord.y *
        this.tileSize}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
.probability {
  fill: #ff0055;
  font-size: 0.8rem;
}

.board_scaler {
  max-width: 1400px;
  @media screen and (min-width: 1001px) {
    // margin-bottom: 100px;
  }
}
.grid {
  transform-origin: 0 0%;
  @media screen and (max-width: 1000px) {
    transform-origin: 0 0;
  }
}
</style>
