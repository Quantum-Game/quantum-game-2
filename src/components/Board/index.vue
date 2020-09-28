<template>
  <div
    ref="boardScaler"
    class="board_scaler"
    :style="{ maxWidth: `${totalWidth}px`, maxHeight: `${totalHeight}px` }"
  >
    <svg class="grid" :viewBox="`0 0 ${totalWidth} ${totalHeight}`" @mouseup="handleBoardRelease">
      <!-- DOTS -->
      <board-dots :rows="board.height" :cols="board.width" />

      <!-- LASER PATH -->
      <board-lasers v-if="laserParticles.length > 0" :laserParticles="laserParticles" />

      <!-- FATE -->
      <transition name="fate-blink">
        <circle
          v-if="fate != null"
          class="fate"
          fill="purple"
          :cx="fatePos.x"
          :cy="fatePos.y"
          :style="{ transformOrigin: `${fatePos.x}px ${fatePos.y}px` }"
          r="30"
        />
      </transition>

      <!-- PHOTONS -->
      <g
        v-for="(particle, index) in particles"
        :key="'particle' + index"
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
        v-for="{ coord, piece, energized } in cells"
        :key="`cell-${coord.x}-${coord.y}`"
        :coord="coord"
        :piece="piece"
        :energized="energized"
        @touch="$emit('touch', coord)"
        @grab="$emit('grab', coord)"
        @mouseover="handleMouseEnter(coord)"
      />

      <!-- EMPTY CELLS -->
      <template v-if="highlightEmpty">
        <rect
          v-for="{ x, y } in empties"
          :key="`empty-${x}-${y}`"
          class="empty"
          :x="x"
          :y="y"
          :width="tileSize"
          :height="tileSize"
        />
      </template>

      <!-- PROBABILITY -->
      <text
        v-for="[coord, probability] in absorptions"
        :key="`probability-${coord.x}-${coord.y}`"
        :x="(coord.x + 0.5) * 64"
        :y="coord.y * 64"
        text-anchor="middle"
        class="probability"
      >
        {{ (probability * 100).toFixed(1) }}%
      </text>
    </svg>

    <!-- SPEECH BUBBLES -->
    <speech-bubble
      v-for="(hint, index) in hints"
      :key="index"
      :hint="hint"
      :tile-size="scaledTileSize"
    />
  </div>
</template>

<script lang="ts">
import { Coord, Particle, Hint, Board } from '@/engine/model'
import AppCell from '@/components/Board/AppCell.vue'
import BoardLasers from '@/components/Board/BoardLasers.vue'
import BoardDots from '@/components/Board/BoardDots.vue'
import AppPhoton from '@/components/AppPhoton.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import { emitType, IStyle } from '@/types'
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { validateInfoPayload } from '@/mixins/gameInterfaces'
import { useDOMNodeSize } from '@/mixins/event'
import { iFilterMap, iMap } from '@/itertools'
import { ReleaseEvent } from '@/engine/controller'

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
    board: { type: Object as PropType<Board>, required: true },
    hints: { type: Array as PropType<Hint[]>, default: [] },
    laserParticles: { type: Array as PropType<Particle[]>, default: [] },
    particles: { type: Array as PropType<Particle[]>, required: true },
    absorptions: { type: Map as PropType<Map<Coord, number>>, default: [] },
    fate: { type: Object as PropType<Coord>, required: false },
    highlightEmpty: { type: Boolean, default: false },
  },
  emits: {
    grab: Coord.validate,
    release: emitType<ReleaseEvent>(),
    touch: Coord.validate,
    hover: validateInfoPayload,
    'scale-changed': emitType<number>(),
  },
  setup(props, { emit }) {
    const boardScaler = ref<HTMLElement>()
    const boardRect = useDOMNodeSize(boardScaler)

    const tileSize = 64
    const scaledTileSize = ref(64)

    watch(
      boardRect,
      (size) => {
        const currentWidth = size.width
        scaledTileSize.value = tileSize * (currentWidth / 845)
        emit('scale-changed', scaledTileSize.value)
      },
      { immediate: true }
    )

    const cells = computed(() => {
      const absorptions = props.absorptions
      return Array.from(
        iMap(props.board.pieces, ([coord, piece]) => ({
          coord,
          piece,
          energized: absorptions.get(coord) ?? 0,
        }))
      )
    })

    function handleBoardRelease(e: MouseEvent) {
      const x = (e.offsetX / boardRect.value.width) * props.board.width
      const y = (e.offsetY / boardRect.value.height) * props.board.height
      const coord = Coord.new(Math.floor(x), Math.floor(y))
      emit('release', { coord, releasePoint: { x, y } })
    }

    const empties = computed(() => {
      const pieces = props.board.pieces
      return Array.from(
        iFilterMap(Coord.enumerate(props.board.width, props.board.height), (c) =>
          !pieces.has(c) ? c.gridTopLeft(tileSize) : null
        )
      )
    })

    return {
      tileSize,
      scaledTileSize,
      boardScaler,
      totalWidth: computed(() => props.board.width * tileSize),
      totalHeight: computed(() => props.board.height * tileSize),
      fatePos: computed(() => props.fate?.gridCenter(tileSize)),
      handleBoardRelease,
      cells,
      empties,
      handleMouseEnter(coord: Coord): void {
        const piece = props.board.pieces.get(coord)
        const particles = props.particles.filter((particle) => particle.coord === coord)
        if (particles.length > 0) {
          emit('hover', { kind: 'particles', particles })
        }
        if (piece != null) {
          emit('hover', { kind: 'piece', piece })
        }
      },
      computeParticleStyle(particle: Particle): IStyle {
        return {
          transform: `translate(${particle.coord.x * tileSize}px, ${particle.coord.y *
            tileSize}px)`,
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

.empty {
  fill: white;
  opacity: 0;
  transition: opacity 0.2s;
}

.empty:hover {
  transition: opacity 0.3s;
  opacity: 0.1;
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
