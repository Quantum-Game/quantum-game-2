<template>
  <div class="game">
    <!-- OVERLAY -->
    <app-overlay :state="overlayGameState" class="overlay" @click="continueAfterWin">
      <p class="backButton">GO BACK</p>
      <router-link :to="nextLevelOrOvelay">
        <app-button :overlay="true" :inline="false">NEXT LEVEL</app-button>
      </router-link>
    </app-overlay>

    <!-- GENERAL LAYOUT -->
    <game-layout>
      <!-- HEADER-MIDDLE -->
      <template #header-middle>
        <div layout="row u2 middle center">
          <router-link :to="previousLevel">
            <img src="@/assets/graphics/icons/previousLevel.svg" alt="Previous Level" width="24" />
          </router-link>
          <h1 class="title">
            {{ gameCtl.level ? gameCtl.level.id + ' - ' + gameCtl.level.name : 'loading' }}
          </h1>
          <router-link :to="nextLevelOrOvelay">
            <img src="@/assets/graphics/icons/nextLevel.svg" alt="Next Level" width="24" />
          </router-link>
        </div>
      </template>

      <!-- MAIN-LEFT -->
      <template #main-left>
        <section>
          <game-toolbox
            v-if="gameCtl.level"
            :toolbox="gameCtl.level.toolbox"
            @grab="gameCtl.grab.grabTool"
            @release="gameCtl.grab.releaseTool"
            @hover="updateInfoPayload"
          />
          <game-infobox :info-payload="infoPayload" />
        </section>
      </template>

      <!-- MAIN-MIDDLE -->
      <template #main-middle>
        <section>
          <board
            v-if="gameCtl.level"
            :board="gameCtl.level.board"
            :hints="gameCtl.level.hints"
            :laser-particles="laserParticles"
            :particles="activeParticles"
            :absorptions="gameCtl.sim.absorptions"
            :highlight-empty="gameCtl.grab.grabState != null"
            @touch="handleTouch"
            @grab="gameCtl.grab.grabPiece"
            @release="gameCtl.grab.releasePiece"
            @hover="updateInfoPayload"
          />
          <game-controls
            :playhead="playheadCtl"
            @reload="reload"
            @download="downloadLevel"
            @upload="loadJsonLevelFromFile"
            @hover="updateInfoPayload"
            @save="handleSave"
          />
        </section>
      </template>

      <!-- MAIN-RIGHT -->
      <template #main-right>
        <section>
          <GameGoals :goals="gameCtl.goals" />
          <div class="ket-viewer-game">
            <ket-viewer
              v-if="playheadCtl.activeFrame"
              class="ket"
              :vector="playheadCtl.activeFrame.vector"
            />
          </div>
        </section>
      </template>
    </game-layout>

    <!-- DRAG AND DROP CELL -->
    <div class="drag-container">
      <svg v-if="dragState" viewBox="0 0 64 64" width="64" height="64" :style="dragState.style">
        <app-cell :piece="dragState.piece" :interacting="true" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { IInfoPayload } from '@/mixins/gameInterfaces'
import levels from '@/assets/data/levels'
import { KetViewer } from 'bra-ket-vue'
import GameGoals from '@/components/GamePage/GameGoals.vue'
import GameInfobox from '@/components/GamePage/GameInfobox.vue'
import GameToolbox from '@/components/GamePage/GameToolbox.vue'
import GameControls from '@/components/GamePage/GameControls.vue'
import GameLayout from '@/components/GamePage/GameLayout.vue'
import Board from '@/components/Board/index.vue'
import AppButton from '@/components/AppButton.vue'
import AppCell from '@/components/Board/AppCell.vue'
import AppOverlay from '@/components/AppOverlay.vue'
import '@/store/store'
import { useRoute } from 'vue-router'
import { computed, defineComponent, ref, watch } from 'vue'
import { useWindowEvent, usePerRouteFlag, useMouseCoords } from '@/mixins'
import {
  GameOutcome,
  gameController,
  playheadController,
  GrabSource,
  GrabState,
} from '@/engine/controller'
import { isInteger } from '@/types'
import { Coord, Elem, Hint, Particle, Piece, pieceFromTool } from '@/engine/model'
import { storeNamespace } from '@/store'

export default defineComponent({
  name: 'GamePage',
  components: {
    GameLayout,
    KetViewer,
    GameGoals,
    GameInfobox,
    GameToolbox,
    GameControls,
    Board,
    AppButton,
    AppOverlay,
    AppCell,
  },
  setup() {
    const game = storeNamespace('game')
    const writeCurrentLevelId = game.useMutation('SET_CURRENT_LEVEL_ID')

    // const activeCell = game.useState('activeCell') // this need to me removed ASASP - the same fate as... fate
    const route = useRoute()
    const alreadyWon = usePerRouteFlag()

    const gameCtl = gameController()
    const playheadCtl = playheadController({
      frames: () => gameCtl.sim?.frames ?? [],
      rewindOnUpdate: true,
    })

    const mouse = useMouseCoords()

    useWindowEvent('mouseup', () => {
      gameCtl.grab.putBack()
    })

    function grabbedPiece(state: GrabState): Piece {
      switch (state.source) {
        case GrabSource.Board:
          return state.piece
        case GrabSource.Toolbox:
          return pieceFromTool(state.type, null)
      }
    }

    const dragState = computed(() => {
      const grab = gameCtl.grab.grabState
      if (grab == null) return null
      return {
        piece: grabbedPiece(grab),
        style: {
          transformOrigin: `50% 50%`,
          transform: `translate(${mouse.x - 32}px, ${mouse.y - 32}px)`,
        },
      }
    })

    useWindowEvent('keydown', (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault()
          return playheadCtl.toggle()
        case 'ArrowLeft':
          return playheadCtl.stepBack()
        case 'ArrowRight':
          return playheadCtl.stepForward()
      }
    })

    const infoPayload = ref({
      kind: 'ui',
      particles: [],
      text: 'Hover on a element for more information.',
    } as IInfoPayload)

    // TODO: FATE
    // const fateCoord = ref<Coord>()
    // const fateStep = ref(999)
    // const displayFate = ref(false)
    //  function computeNewFate(simulation: Simulation) {
    //     const fate = simulation.sampleRandomRealization()
    //     displayFate.value = false
    //     fateCoord.value = Coord.importCoord({ x: fate.x, y: fate.y })
    //     fateStep.value = fate.step
    //   }
    const routeLevelId = computed(() => {
      const rawId = route.params.id as string | undefined
      if (rawId != null && isInteger(+rawId)) {
        return +rawId
      }
      return null
    })

    // save last visited level id globally, so it can be returned to from the menu screen
    watch(routeLevelId, (id) => writeCurrentLevelId(id), { immediate: true })

    const levelData = computed(() => {
      if (routeLevelId.value != null) {
        return levels[routeLevelId.value]
      }
      return null
    })

    watch(
      levelData,
      (data) => {
        gameCtl.importLevel(data)
      },
      { immediate: true }
    )

    function reload() {
      gameCtl.importLevel(levelData.value)
    }

    /**
     * Retrieve all particles for laser paths
     * @returns list of all particles from the sim
     */
    const laserParticles = computed((): Particle[] => {
      return gameCtl.sim?.frames.flatMap((f) => f.particles) ?? []
    })

    /**
     * Current active frame particles
     * @returns particles
     */
    const activeParticles = computed((): Particle[] => {
      return playheadCtl.activeFrame?.particles ?? []
    })

    /**
     * Actual 'save' button handling
     */
    function handleSave(): void {
      // TODO: save level
      console.error('not yet implemented')
    }

    const previousLevel = computed(() => {
      return `/level/${(routeLevelId.value ?? 1) - 1}`
    })
    const nextLevel = computed(() => {
      return `/level/${(routeLevelId.value ?? -1) + 1}`
    })

    const overlayGameState = computed(() => {
      if (!alreadyWon.flag && playheadCtl.isLastFrame) {
        switch (gameCtl.goals.gameOutcome) {
          case GameOutcome.Victory:
            return 'Victory'
          case GameOutcome.MineExploded:
            return 'MineExploded'
        }
      }
      return null
    })

    const hints = computed(() => {
      return gameCtl.level?.board.hints ?? new Map<Coord, Hint>()
    })
    /**
     * Should an overlay be shown when progressing
     * to the next level?
     * @returns an router link :to attribute string
     */
    const nextLevelOrOvelay = computed((): string => {
      const rockTalkId = gameCtl.level?.rockTalkId
      return rockTalkId != null ? `/rocks/${rockTalkId}` : nextLevel.value
    })

    function updateInfoPayload(payload: IInfoPayload): void {
      infoPayload.value = payload
    }

    function continueAfterWin(): void {
      alreadyWon.set()
      playheadCtl.rewind()
    }

    /**
     * Export the level in JSON format and uploads it
     * @returns level in JSON format
     */
    function downloadLevel(): void {
      const json = JSON.stringify(gameCtl.exportLevel(), null, 2)
      const blob = new Blob([json], { type: 'octet/stream' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'level.json'
      link.click()
    }

    function loadJsonLevelFromFile(event: Event): void {
      const target = event.target as HTMLInputElement
      if (target.files == null) return
      const reader = new FileReader()
      reader.readAsText(target.files[0])
      reader.onload = (): void => {
        if (reader.result !== undefined && reader.result !== null) {
          const result: string = reader.result.toString()
          gameCtl.importLevel(JSON.parse(result))
        }
      }
    }

    function handleTouch(coord: Coord) {
      const piece = gameCtl.level?.board.pieces.get(coord)
      if (piece == null) return
      if (piece.type === Elem.Laser) {
        playheadCtl.toggle()
      } else {
        gameCtl.rotateCcw(coord)
      }
    }

    return {
      gameCtl,
      playheadCtl,
      dragState,
      previousLevel,
      nextLevel,
      handleSave,
      downloadLevel,
      reload,
      continueAfterWin,
      updateInfoPayload,
      nextLevelOrOvelay,
      hints,
      overlayGameState,
      activeParticles,
      laserParticles,
      infoPayload,
      loadJsonLevelFromFile,
      handleTouch,
    }
  },
})
</script>

<style lang="scss" scoped>
// Drag & drop
.drag-container {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
// Overlay
.overlay {
  .backButton {
    font-size: 0.8rem;
    opacity: 0.8;
    cursor: pointer;
  }
}

// Title
h1.title {
  font-size: 1.5rem;
  margin-top: 30px;
  margin-bottom: 30px;
  text-transform: uppercase;
  @include media('<large') {
    a img {
      width: 6vw !important;
    }
  }
}

.game {
  width: 100%;
  &.goals {
    height: 600px;
  }
}
.ket-viewer-game {
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
