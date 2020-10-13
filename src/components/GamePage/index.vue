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
    <app-layout>
      <template #header>
        <div layout="row u2 middle center">
          <router-link :to="previousLevel">
            <img src="@/assets/graphics/icons/previousLevel.svg" alt="Previous Level" width="24" />
          </router-link>
          <h1 class="title" :title="'I am &amp;#10; happy to have a newline entity.'">
            {{ gameCtl.level ? gameCtl.level.id + ' - ' + gameCtl.level.name : 'loading' }}
          </h1>
          <router-link :to="nextLevelOrOvelay">
            <img src="@/assets/graphics/icons/nextLevel.svg" alt="Next Level" width="24" />
          </router-link>
        </div>
      </template>

      <!-- MAIN-LEFT -->
      <template #left>
        <section layout="column u10">
          <game-toolbox
            v-if="gameCtl.level"
            :key="gameCtl.level.id"
            :toolbox="gameCtl.level.toolbox"
            :tile-size="scaledTileSize"
            @grab="grabCtl.grabTool"
            @release="grabCtl.releaseTool"
            @hover="updateInfoPayload"
          />
          <game-infobox :info-payload="infoPayload" />
        </section>
      </template>

      <template #main>
        <section>
          <board
            v-if="gameCtl.level"
            :key="gameCtl.level.id"
            :board="gameCtl.level.board"
            :laser-particles="laserParticles"
            :particles="activeParticles"
            :absorptions="gameCtl.sim.absorptions"
            :highlight-empty="grabCtl.grabState != null"
            :playing="playheadCtl.isPlaying"
            @touch="handleTouch"
            @grab="grabCtl.grabPiece"
            @release="grabCtl.releasePiece"
            @hover="updateInfoPayload"
            @scale-changed="scaledTileSize = $event"
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

      <template #right>
        <section>
          <div class="ket-viewer-game">
            <ket-viewer
              v-if="playheadCtl.activeFrame"
              class="ket"
              :vector="playheadCtl.activeFrame.vector"
            />
          </div>
        </section>
      </template>
    </app-layout>

    <!-- DRAG AND DROP CELL -->
    <div class="drag-container">
      <svg
        v-if="dragState"
        viewBox="0 0 64 64"
        :width="scaledTileSize"
        :height="scaledTileSize"
        :style="dragState.style"
      >
        <app-cell :piece="dragState.piece" :interacting="true" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { IInfoPayload } from '@/mixins/gameInterfaces'
import levels from '@/assets/data/levels'
import { KetViewer } from 'bra-ket-vue'
import GameInfobox from '@/components/GamePage/GameInfobox.vue'
import GameToolbox from '@/components/GamePage/GameToolbox.vue'
import GameControls from '@/components/GamePage/GameControls.vue'
import AppLayout from '@/components/AppLayout.vue'
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
  grabController,
  goalsController,
} from '@/engine/controller'
import { isInteger } from '@/types'
import { Coord, Elem, Particle, Piece, pieceFromTool } from '@/engine/model'
import { storeNamespace } from '@/store'

export default defineComponent({
  name: 'GamePage',
  components: {
    AppLayout,
    KetViewer,
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

    const route = useRoute()
    const routeLevelId = computed(() => {
      const rawId = route.params.id as string | undefined
      if (rawId != null && isInteger(+rawId)) {
        return +rawId
      }
      return null
    })

    const alreadyWon = usePerRouteFlag()

    const gameCtl = gameController()

    const goalsCtl = goalsController({
      absorptions: () => gameCtl.sim?.absorptions ?? null,
      level: () => gameCtl.level ?? null,
    })

    const grabCtl = grabController({
      pieces: () => gameCtl.level?.board.pieces ?? null,
      toolbox: () => gameCtl.level?.toolbox ?? null,
    })
    useWindowEvent('mouseup', () => grabCtl.putBack())

    const playheadCtl = playheadController({
      frames: () => gameCtl.sim?.frames ?? [],
      rewindOnUpdate: true,
    })

    function grabbedPiece(state: GrabState): Piece {
      switch (state.source) {
        case GrabSource.Board:
          return state.piece
        case GrabSource.Toolbox:
          return pieceFromTool(state.type, null)
      }
    }

    const scaledTileSize = ref(64)
    const mouse = useMouseCoords()
    const dragState = computed(() => {
      const grab = grabCtl.grabState
      const halfTile = scaledTileSize.value / 2
      if (grab == null) return null
      return {
        piece: grabbedPiece(grab),
        style: {
          transformOrigin: `50% 50%`,
          transform: `translate(${mouse.pageX - halfTile}px, ${mouse.pageY - halfTile}px)`,
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

    // save last visited level id globally, so it can be returned to from the menu screen
    watch(routeLevelId, (id) => writeCurrentLevelId(id), { immediate: true })

    const levelData = computed(() => {
      if (routeLevelId.value != null) {
        return levels[routeLevelId.value]
      } else {
        return levels[0] // sandbox
      }
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
    const activeParticles = computed(() => {
      return playheadCtl.interpolatedParticles
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
      if (!alreadyWon.flag && playheadCtl.isLastFrame && routeLevelId.value != null) {
        switch (goalsCtl.gameOutcome) {
          case GameOutcome.Victory:
            return 'Victory'
          case GameOutcome.MineExploded:
            return 'MineExploded'
        }
      }
      return null
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
      grabCtl,
      goalsCtl,
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
      overlayGameState,
      activeParticles,
      laserParticles,
      infoPayload,
      loadJsonLevelFromFile,
      handleTouch,
      scaledTileSize,
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
  svg {
    overflow: visible;
  }
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
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
