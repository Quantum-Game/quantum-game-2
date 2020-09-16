<template>
  <div
    ref="boardScaler"
    class="board_scaler"
    :style="{ maxWidth: `${totalWidth}px`, maxHeight: `${totalHeight}px` }"
  >
    <svg class="grid" :viewBox="`0 0 ${totalWidth} ${totalHeight}`">
      <!-- DOTS -->
      <board-dots :rows="grid.rows" :cols="grid.cols" />

      <!-- LASER PATH -->
      <board-lasers v-if="classicalView" :laserParticles="laserParticles" />

      <!-- FATE -->
      <g
        v-if="fate != null"
        :transform="`translate(${(fate.x + 0.5) * tileSize}, ${(fate.y + 0.5) * tileSize})`"
      >
        <transition name="fate-blink">
          <circle class="fate" fill="purple" r="30" />
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
        v-for="(cell, i) in grid.cells.values()"
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
      :key="index"
      :hint="hint"
      :tile-size="updatedTileSize"
    />
  </div>
</template>

<script lang="ts">
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
import { computed, defineComponent, PropType, reactive, ref, toRefs, watch } from 'vue'
import { validateInfoPayload } from '@/mixins/gameInterfaces'
import { useDOMNodeSize } from '@/mixins/event'
import { storeNamespace } from '@/store'

const game = storeNamespace('game')

export default defineComponent({
  name: 'Board',
  components: {
    AppCell,
    AppPhoton,
    BoardLasers,
    BoardDots,
    SpeechBubble,
  },
  props: {
    grid: { type: Object as PropType<Grid>, required: true },
    fate: { type: Coord },
    hints: { type: Array as PropType<IHint[]>, default: [] },
    particles: { type: Array as PropType<Particle[]>, default: [] },
    laserParticles: { type: Array as PropType<Particle[]>, default: [] },
    absorptions: { type: Array as PropType<Absorption[]>, default: [] },
    frameIndex: { type: Number, default: 0 },
  },
  emits: {
    'update-cell': null,
    play: null,
    hover: validateInfoPayload,
  },
  setup(props, { emit }) {
    const mutationSetHoveredParticles = game.useMutation('SET_HOVERED_PARTICLE')
    const simulationState = game.useState('simulationState')

    const boardScaler = ref<HTMLElement>()
    const boardRect = useDOMNodeSize(boardScaler)

    const data = reactive({
      tileSize: 64,
      updatedTileSize: 64, // this is the actual, dynamic tile size
    })

    watch(boardRect, (size) => {
      const currentWidth = size.width
      data.updatedTileSize = 64 * (currentWidth / 845) // the dynamic one, used for tooltip positioning
    })

    return {
      ...toRefs(data),
      boardScaler,
      classicalView: computed(() => props.frameIndex === 0 && !simulationState.value),
      totalWidth: computed(() => props.grid.cols * data.tileSize),
      totalHeight: computed(() => props.grid.rows * data.tileSize),
      play: () => emit('play', true),
      updateCell: (cell: Cell) => emit('update-cell', cell),
      handleMouseEnter(coord: Coord): void {
        const cell = props.grid.get(coord)
        const particles = props.particles.filter((particle) => {
          return particle.coord.equal(coord)
        })
        if (!cell.isVoid) {
          emit('hover', { kind: 'element', cell, particles: [], text: '' })
        }
        if (particles.length > 0) {
          mutationSetHoveredParticles(particles)
          emit('hover', { kind: 'particles', particles, text: '' })
        }
      },
      /**
       * Handle mouse over from cell and photons
       */
      handleMouseLeave(coord: Coord): void {
        const particles = props.particles.filter((particle) => {
          return particle.coord.equal(coord)
        })
        if (particles.length > 0) {
          mutationSetHoveredParticles([])
        }
      },
      computeParticleStyle(particle: Particle): IStyle {
        return {
          transform: `translate(${particle.coord.x * data.tileSize}px, ${particle.coord.y *
            data.tileSize}px)`,
        }
      },
    }
  },
})
</script>

<style lang="scss" scoped>
.probability {
  fill: $fuchsia;
  font-size: 0.8rem;
}

.board_scaler {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  @media screen and (min-width: 1001px) {
    // margin-bottom: 100px;
  }
}
.grid {
  transform-origin: 0 0%;
  @include media('<large') {
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
