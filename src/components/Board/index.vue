<template>
  <div
    ref="boardScaler"
    class="board_scaler"
    :style="{ maxWidth: `${totalWidth}px`, maxHeight: `${totalHeight}px` }"
  >
    <svg class="grid" :viewBox="`0 0 ${totalWidth} ${totalHeight}`" @mouseup="handleBoardRelease">
      <!-- DOTS -->
      <BoardDots :rows="board.height" :cols="board.width" />

      <!-- LASER PATH -->
      <BoardLasers
        v-if="laserParticles.length > 0"
        :opacity="laserOpacity"
        :particles="laserParticles"
        :blur="experiment"
      />

      <!-- PHOTONS -->
      <g v-if="photonOpacity > 0" :style="{ opacity: photonOpacity }">
        <AppPhoton
          v-for="(particle, index) in particles"
          :key="index"
          :particle="particle"
          :displayMagnetic="false"
          :displayElectric="true"
          :displayGaussian="true"
          @mouseenter="handleMouseEnter(particle.coord)"
        />
      </g>

      <!-- FATE -->
      <template v-for="fate in fateCircles" :key="fate.coord">
        <circle
          v-for="key in fate.keys"
          :key="key"
          class="fate"
          :cx="fate.pos.x"
          :cy="fate.pos.y"
          :style="{ transformOrigin: `${fate.pos.x}px ${fate.pos.y}px` }"
          r="30"
        />
      </template>

      <!-- CELLS -->
      <AppCell
        v-for="{ coord, piece, energized } in cells"
        :key="`cell-${coord.x}-${coord.y}`"
        :coord="coord"
        :piece="piece"
        :energized="energized"
        @touch="handleCellTouch(coord)"
        @grab="handleCellGrab"
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

      <ActionHint v-for="hint in hintsCtl.activeActionHighlights" :key="hint" :hint="hint" />
      <BoardAbsorptions
        :absorptions="absorptions"
        :goals="goals"
        :histogram="histogram"
        :useHistogram="experiment"
      />
    </svg>

    <!-- SPEECH BUBBLES -->
    <SpeechBubble
      v-for="hint in hintsCtl.speechBubbles"
      :key="hint"
      :hint="hint"
      :tileSize="scaledTileSize"
    />
  </div>
</template>

<script lang="ts">
import { Coord, Particle, Board, Elem, HintActionType, Vec2 } from '@/engine/model'
import AppCell from '@/components/Board/AppCell.vue'
import BoardLasers from '@/components/Board/BoardLasers.vue'
import ActionHint from '@/components/Board/ActionHint.vue'
import BoardDots from '@/components/Board/BoardDots.vue'
import BoardAbsorptions from '@/components/Board/BoardAbsorptions.vue'
import AppPhoton from '@/components/AppPhoton.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import { emitType } from '@/types'
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { validateInfoPayload } from '@/mixins/gameInterfaces'
import { useDOMNodeSize } from '@/mixins/event'
import { iFilterMap, iMap } from '@/itertools'
import { hintsController, BoardInteraction } from '@/engine/controller'
import { InterpolatedParticle } from '@/engine/interpolation'
import { range } from 'lodash'

export default defineComponent({
  name: 'Board',
  components: {
    ActionHint,
    AppCell,
    AppPhoton,
    BoardLasers,
    BoardDots,
    SpeechBubble,
    BoardAbsorptions,
  },
  props: {
    board: { type: Object as PropType<Board>, required: true },
    laserOpacity: { type: Number, default: 1 },
    laserParticles: { type: Array as PropType<Particle[]>, default: [] },
    experiment: { type: Boolean, default: false },
    alwaysShowLaser: { type: Boolean, default: true },
    particles: { type: Array as PropType<InterpolatedParticle[]>, required: true },
    absorptions: { type: Map as PropType<Map<Coord, number>>, default: [] },
    histogram: { type: Map as PropType<Map<Coord, number>>, required: false },
    highlightEmpty: { type: Boolean, default: false },
    playing: { type: Boolean, default: false },
  },
  emits: {
    grab: emitType<BoardInteraction>(),
    release: emitType<BoardInteraction>(),
    touch: Coord.validate,
    hover: validateInfoPayload,
    'scale-changed': emitType<number>(),
  },
  setup(props, { emit }) {
    const boardScaler = ref<HTMLElement>()
    const boardRect = useDOMNodeSize(boardScaler)

    const tileSize = 64
    const scaledTileSize = ref(64)

    const hintsCtl = hintsController({
      board: () => props.board ?? null,
    })

    const fateCircles = computed(() => {
      if (props.histogram == null || props.histogram.size === 0) return []

      const circles: { coord: Coord; pos: Vec2; keys: number[] }[] = []
      for (const [coord, num] of props.histogram) {
        let pos = coord.gridCenter()
        circles.push({ coord, pos, keys: range(Math.max(0, num - 5), num) })
      }
      return circles
    })

    // trigger laser hint on play
    watch(
      () => props.playing,
      (playing) => {
        if (props.board != null && playing) {
          for (const [coord, piece] of props.board.pieces) {
            if (piece.type === Elem.Laser) {
              hintsCtl.advanceHighlights(coord, [HintActionType.Pulse])
            }
          }
        }
      }
    )

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

    const goals = computed(() => {
      return new Map(
        iFilterMap(props.board.pieces, ([coord, piece]) =>
          piece.goalThreshold > 0 ? ([coord, piece.goalThreshold] as const) : null
        )
      )
    })

    function getInteraction(clientX: number, clientY: number): BoardInteraction {
      const rect = boardScaler.value?.getBoundingClientRect()
      if (rect == null) throw new Error('Missing board rect on interaction')
      const x = ((clientX - rect.x) / rect.width) * props.board.width
      const y = ((clientY - rect.y) / rect.height) * props.board.height
      const coord = Coord.new(Math.floor(x), Math.floor(y))
      return { coord, interactPoint: { x, y } }
    }

    function handleBoardRelease(e: MouseEvent) {
      emit('release', getInteraction(e.clientX, e.clientY))
    }

    const empties = computed(() => {
      const pieces = props.board.pieces
      return Array.from(
        iFilterMap(Coord.enumerate(props.board.width, props.board.height), (c) =>
          !pieces.has(c) ? c.gridTopLeft(tileSize) : null
        )
      )
    })

    const photonOpacity = computed(() => {
      return props.experiment ? 1 - props.laserOpacity : 1
    })

    return {
      hintsCtl,
      goals,
      tileSize,
      scaledTileSize,
      boardScaler,
      totalWidth: computed(() => props.board.width * tileSize),
      totalHeight: computed(() => props.board.height * tileSize),
      handleBoardRelease,
      cells,
      empties,
      fateCircles,
      photonOpacity,
      handleMouseEnter(coord: Coord): void {
        const piece = props.board.pieces.get(coord)
        const particles = props.particles.filter(
          (particle) => particle.coord === coord
        ) as Particle[]

        if (particles.length > 0) {
          emit('hover', { kind: 'particles', particles })
        }
        if (piece != null) {
          emit('hover', { kind: 'piece', piece })
        }
      },
      handleCellTouch(coord: Coord): void {
        hintsCtl.advanceHighlights(coord, [HintActionType.Pulse, HintActionType.Rotation])
        emit('touch', coord)
      },
      handleCellGrab(clientPos: Vec2): void {
        const interaction = getInteraction(clientPos.x, clientPos.y)
        hintsCtl.advanceHighlights(interaction.coord, [HintActionType.Drag])
        emit('grab', interaction)
      },
    }
  },
})
</script>

<style lang="scss" scoped>
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

.empty {
  fill: white;
  opacity: 0;
  transition: opacity 0.2s;
}

.empty:hover {
  transition: opacity 0.3s;
  opacity: 0.1;
}

.fate {
  // opacity: 0;
  fill: $orange;
  animation: fate-blink-in 0.1s ease-out forwards;
}

@keyframes fate-blink-in {
  0% {
    opacity: 1;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
}
</style>
