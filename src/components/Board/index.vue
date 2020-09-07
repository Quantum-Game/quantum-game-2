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
      <board-lasers v-if="classicalView" :pathParticles="pathParticles" />

      <!-- FATE -->
      <g :transform="`translate(${(fate.x + 0.5) * tileSize}, ${(fate.y + 0.5) * tileSize})`">
        <transition name="fate-blink">
          <circle v-if="displayFate" class="fate" fill="purple" r="30" />
        </transition>
      </g>

      <!-- PHOTONS -->
      <g
        v-for="(particle, index) in particles"
        :key="'particle' + index"
        :v-if="particles.length > 0"
        :style="computeParticleStyle(particle)"
        class="photons"
        @mouseenter="handleMouseEnter(particle.coord)"
      >
        <app-photon
          name
          :particle="particle"
          :animate="2"
          :margin="2"
          :display-magnetic="false"
          :display-electric="true"
          :display-gaussian="true"
          :sigma="0.3"
        />
      </g>

      <!-- CELLS -->
      <app-cell
        v-for="(cell, i) in grid.cells"
        :key="'cell' + i"
        :cell="cell"
        :tileSize="tileSize"
        @update-cell="updateCell"
        @mouseover="handleMouseEnter(cell.coord)"
        @mouseleave="handleMouseLeave(cell.coord)"
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
    </svg>

    <!-- SPEECH BUBBLES -->
    <speech-bubble
      v-for="(hint, index) in hints"
      :key="`${url}-${index}`"
      :hint="hint"
      :tile-size="updatedTileSize"
      :wrapper-rect="boardClientRect"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import Absorption from '@/engine/Absorption'
import Cell from '@/engine/Cell'
import Coord from '@/engine/Coord'
import Grid from '@/engine/Grid'
import Particle from '@/engine/Particle'
import { IHint } from '@/engine/interfaces'
import AppCell from '@/components/Board/AppCell.vue'
import BoardLasers from '@/components/Board/BoardLasers.vue'
import BoardDots from '@/components/Board/BoardDots.vue'
import AppPhoton from '@/components/AppPhoton.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import { IStyle } from '@/types'
import { nextTick } from 'vue'

@Options({
  components: {
    AppCell,
    AppPhoton,
    BoardLasers,
    BoardDots,
    SpeechBubble,
  },
})
export default class Board extends Vue {
  @Prop() readonly grid!: Grid
  @Prop() readonly fate!: Coord
  @Prop({ default: [] }) readonly hints!: IHint[]
  @Prop({ default: [] }) readonly particles!: Particle[]
  @Prop({ default: [] }) readonly pathParticles!: Particle[]
  @Prop({ default: [] }) readonly absorptions!: Absorption[]
  @Prop({ default: 0 }) readonly frameIndex!: number // dirty for classical vs quantum
  @Prop({ default: false }) readonly displayFate!: boolean
  @Mutation('SET_HOVERED_PARTICLE') mutationSetHoveredParticles!: (particles: Particle[]) => void
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void
  @State hoveredParticles!: Particle[]
  @State hoveredCell!: Cell
  @State activeCell!: Cell
  @State simulationState!: boolean

  tileSize = 64
  updatedTileSize = 64 // this is the actual, dynamic tile size
  boardHeight = 0
  scalerStyle = {
    transform: `scale(1)`,
  }

  $refs!: {
    gridWrapper: HTMLElement
    boardScaler: HTMLElement
  }

  boardClientRect = {}

  mounted(): void {
    window.addEventListener('resize', this.assessSize)
    this.assessSize()
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.assessSize)
  }

  get classicalView(): boolean {
    return this.frameIndex === 0 && !this.simulationState
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
    this.$emit('update-cell', cell)
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
      this.$emit('hover', { kind: 'element', cell, particles: [], text: '' })
    }
    if (particles.length > 0) {
      this.mutationSetHoveredParticles(particles)
      this.$emit('hover', { kind: 'particles', particles, text: '' })
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

  @Watch('url')
  assessSize(): void {
    const currentWidth = this.$refs.boardScaler.getBoundingClientRect().width
    this.scalerStyle = {
      transform: `scale(${currentWidth / 845})`,
    }
    setTimeout(() => {
      const currentHeight = this.$refs.gridWrapper.getBoundingClientRect().height
      this.boardHeight = currentHeight
    }, 1)
    // this.tileSize = 64 // apparently, the property is hard-coded, no need to change it
    nextTick(() => {
      this.updatedTileSize = 64 * (currentWidth / 845) // the dynamic one, used for tooltip positioning
      this.boardClientRect = this.$refs.gridWrapper.getBoundingClientRect()
    })
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
  computeFateStyle(): IStyle {
    return {
      transform: `translate: ${this.fate.x * this.tileSize}px ${this.fate.y * this.tileSize}px`,
    }
  }

  /**
   * Compute photon grid position
   */
  computeParticleStyle(particle: Particle): IStyle {
    return {
      transform: `translate(${particle.coord.x * this.tileSize}px, ${particle.coord.y *
        this.tileSize}px)`,
    }
  }

  /**
   * For convenience, as is used both in template
   * and in the size-assesing watcher
   * @returns url
   */
  get url(): string {
    return this.$route.params.id as string
  }
}
</script>

<style lang="scss" scoped>
.probability {
  fill: $fuchsia;
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

.fate {
  opacity: 0;
}

.fate-blink-enter-active {
  animation: fate-blink-in 1.5s;
}

@keyframes fate-blink-in {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(3);
  }
}
</style>
