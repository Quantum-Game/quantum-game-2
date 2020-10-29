<template>
  <div class="game">
    <!-- OVERLAY -->
    <AppOverlay :victory="showVictoryOverlay" class="overlay" @bgClick="continueAfterWin">
      <p class="backButton" tabindex="0" @click="continueAfterWin">GO BACK</p>
      <router-link v-if="nextLevelOrOvelay" :to="nextLevelOrOvelay">
        <AppButton :overlay="true" :inline="false">NEXT LEVEL</AppButton>
      </router-link>
    </AppOverlay>

    <!-- GENERAL LAYOUT -->
    <AppLayout>
      <template #header>
        <div layout="row u2 middle center">
          <router-link v-if="previousLevel != null" :to="previousLevel">
            <img src="@/assets/graphics/icons/previousLevel.svg" alt="Previous Level" width="24" />
          </router-link>
          <h1 class="title">{{ title }}</h1>
          <router-link v-if="nextLevelOrOvelay != null" :to="nextLevelOrOvelay">
            <img src="@/assets/graphics/icons/nextLevel.svg" alt="Next Level" width="24" />
          </router-link>
        </div>
      </template>

      <!-- MAIN-LEFT -->
      <template #left>
        <section layout="column u10">
          <GameToolbox
            v-if="showToolbox"
            :key="gameCtl.level.id"
            :toolbox="gameCtl.level.toolbox"
            :tileSize="scaledTileSize"
            @grab="grabCtl.grabTool"
            @release="grabCtl.releaseTool"
            @hover="updateInfoPayload"
          />
          <GameInfobox :infoPayload="infoPayload" />
        </section>
      </template>

      <template #main>
        <section class="main-section">
          <Board
            v-if="gameCtl.level"
            :key="gameCtl.level.id"
            :board="gameCtl.level.board"
            :histogram="experimentCtl.histogram"
            :laserParticles="laserParticles"
            :laserOpacity="laserOpacity"
            :experiment="visCtl.isExperiment"
            :particles="activeParticles"
            :absorptions="absorptions"
            :highlightEmpty="grabCtl.grabState != null"
            :playing="playheadCtl.isPlaying"
            @touch="handleTouch"
            @menu="handleMenu"
            @grab="grabCtl.grabPiece"
            @release="grabCtl.releasePiece"
            @hover="updateInfoPayload"
            @scaleChanged="scaledTileSize = $event"
          >
            <EditorBubble
              v-if="isLab"
              :gameCtl="gameCtl"
              :coord="menuCoord"
              :tileSize="scaledTileSize"
              @close="hideMenu"
            />
          </Board>
          <GameControls
            :playhead="playheadCtl"
            :promptExperiment="isVictory"
            :visMode="visCtl.visMode"
            @mode-laser="visCtl.setMode(SimulationVisMode.Laser)"
            @mode-wave="visCtl.setMode(SimulationVisMode.QuantumWave)"
            @mode-experiment="visCtl.setMode(SimulationVisMode.Experiment)"
            @reload="reload"
            @download="downloadLevel"
            @upload="loadJsonLevelFromFile"
            @hover="updateInfoPayload"
            @save="handleSave"
          />
        </section>
      </template>

      <template #right>
        <transition name="fade">
          <section v-if="visCtl.visMode !== SimulationVisMode.Experiment">
            <div class="ket-viewer-game">
              <KetViewer
                v-if="playheadCtl.activeFrame"
                class="ket"
                :vector="playheadCtl.activeFrame.vector"
              />
            </div>
          </section>
        </transition>
      </template>
    </AppLayout>

    <!-- DRAG AND DROP CELL -->
    <DragContainer :grabCtl="grabCtl" :tileSize="scaledTileSize" />
  </div>
</template>

<script lang="ts">
import { IInfoPayload } from '@/mixins/gameInterfaces'
import { campaignLevel, campaignLink, LevelId, LevelKind, sandboxLevel } from '@/assets/data/levels'
import { KetViewer } from 'bra-ket-vue'
import GameInfobox from '@/components/GamePage/GameInfobox.vue'
import GameToolbox from '@/components/GamePage/GameToolbox.vue'
import GameControls from '@/components/GamePage/GameControls.vue'
import DragContainer from '@/components/GamePage/DragContainer.vue'
import AppLayout from '@/components/AppLayout.vue'
import Board from '@/components/Board/index.vue'
import AppButton from '@/components/AppButton.vue'
import AppOverlay from '@/components/AppOverlay.vue'
import EditorBubble from '@/components/EditorBubble.vue'
import '@/store/store'
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { useWindowEvent, usePerRouteFlag } from '@/mixins'
import {
  GameOutcome,
  gameController,
  playheadController,
  grabController,
  goalsController,
  SimulationVisMode,
  experimentController,
  simulationVisCtl,
} from '@/engine/controller'
import { Coord, Elem, hasFlags, Particle, PieceFlags } from '@/engine/model'
import { storeNamespace } from '@/store'
import { mapEntries } from '@/itertools'
import { useRouter } from 'vue-router'

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
    DragContainer,
    EditorBubble,
  },
  props: {
    levelId: { type: Object as PropType<LevelId>, required: true },
  },
  setup(props) {
    const router = useRouter()
    const game = storeNamespace('game')
    const writeCurrentLevelId = game.useMutation('SET_CURRENT_LEVEL_ID')

    const scaledTileSize = ref(64)
    const menuCoord = ref<Coord | null>(null)
    const alreadyWon = usePerRouteFlag()

    const gameCtl = gameController()

    const totalAbsorptions = computed(() => {
      let absorptions = gameCtl.sim?.upToFrameAbsorptions ?? []
      return absorptions[absorptions.length - 1] ?? new Map()
    })

    const goalsCtl = goalsController({
      absorptions: () => totalAbsorptions.value,
      level: () => gameCtl.level ?? null,
    })

    const grabCtl = grabController({
      pieces: () => gameCtl.level?.board.pieces ?? null,
      toolbox: () => gameCtl.level?.toolbox ?? null,
    })
    useWindowEvent('mouseup', () => grabCtl.putBack())

    const playheadCtl = playheadController({
      frames: () => gameCtl.sim?.frames ?? [],
    })

    watch(
      () => gameCtl.sim?.frames,
      () => {
        experimentCtl.stop()
        // playheadCtl.rewind(false)
      }
    )
    const experimentCtl = experimentController({
      playhead: playheadCtl,
    })
    const visCtl = simulationVisCtl({ playheadCtl, experimentCtl })

    const laserOpacity = computed(() => {
      switch (visCtl.visMode) {
        case SimulationVisMode.Laser:
          return 1
        case SimulationVisMode.QuantumWave:
          return 0
        case SimulationVisMode.Experiment:
          return experimentCtl.fadeProgress
      }
    })

    const stochasticAbsorptions = computed(() => {
      const total = experimentCtl.samples
      // const trueAbsorptions = totalAbsorptions.value
      // const fade = experimentFadeProgress.value
      // const negFade = 1 - fade
      return mapEntries(experimentCtl.histogram, ([coord, samples]) => {
        const sampled = samples / total
        return [coord, sampled]
        // const ideal = trueAbsorptions.get(coord) ?? 0
        // return [coord, sampled * negFade + ideal * fade]
      })
    })

    const absorptions = computed(
      (): Map<Coord, number> => {
        switch (visCtl.visMode) {
          case SimulationVisMode.Laser:
            return totalAbsorptions.value
          case SimulationVisMode.QuantumWave:
            return gameCtl.sim?.upToFrameAbsorptions[playheadCtl.frameIndex] ?? new Map()
          case SimulationVisMode.Experiment:
            return stochasticAbsorptions.value
        }
      }
    )

    useWindowEvent('keyup', (e) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (e.shiftKey && !playheadCtl.isPlaying) {
          experimentCtl.play()
        } else {
          playheadCtl.toggle()
        }
      }
    })

    useWindowEvent('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (!experimentCtl.isRunning) playheadCtl.stepBack()
          break
        case 'ArrowRight':
          if (!experimentCtl.isRunning) playheadCtl.stepForward()
          break
      }
    })

    const infoPayload = ref({
      kind: 'ui',
      particles: [],
      text: 'Hover on a element for more information.',
    } as IInfoPayload)

    watch(() => props.levelId, reload, { immediate: true })
    const isLab = computed(() => props.levelId.kind === LevelKind.Lab)

    function reload() {
      let levelId = props.levelId
      grabCtl.putBack()
      hideMenu()
      // save last visited level id globally, so it can be returned to from the menu screen
      writeCurrentLevelId(levelId)
      switch (levelId.kind) {
        case LevelKind.Campaign:
          let rawData = campaignLevel(levelId.index)
          if (rawData == null) {
            return router.replace('/levels')
          }
          gameCtl.importLevel(rawData)
          break
        case LevelKind.User:
          console.error('User levels not yet implemented')
        // fall-through
        case LevelKind.Lab:
          gameCtl.importLevel(sandboxLevel)
          break
      }
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

    const showToolbox = computed(() => {
      return isLab.value || !(gameCtl.level?.toolbox.initializedEmpty() ?? true)
    })

    /**
     * Actual 'save' button handling
     */
    function handleSave(): void {
      // TODO: save level
      console.error('not yet implemented')
    }

    const previousLevel = computed(() => campaignLink(props.levelId, -1))
    const nextLevel = computed(() => campaignLink(props.levelId, 1))

    const showVictoryOverlay = computed(() => {
      return (
        goalsCtl.gameOutcome === GameOutcome.Victory &&
        !isLab.value &&
        !alreadyWon.flag &&
        visCtl.isExperiment &&
        experimentCtl.fadeProgress === 1
      )
    })

    const isVictory = computed(() => !isLab.value && goalsCtl.gameOutcome === GameOutcome.Victory)

    /**
     * Should an overlay be shown when progressing
     * to the next level?
     * @returns an router link :to attribute string
     */
    const nextLevelOrOvelay = computed((): string | null => {
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
          grabCtl.putBack()
          gameCtl.importLevel(JSON.parse(result))
        }
      }
    }

    function handleTouch(coord: Coord) {
      const piece = gameCtl.level?.board.pieces.get(coord)
      if (piece == null) return
      if (piece.type === Elem.Laser && !hasFlags(piece.flags, PieceFlags.Rotateable)) {
        playheadCtl.toggle()
      } else {
        gameCtl.rotateCcw(coord)
      }
    }

    function hideMenu() {
      if (menuCoord.value != null) {
        menuCoord.value = null
      }
    }

    function handleMenu(coord: Coord) {
      if (gameCtl.level?.board.pieces.get(coord) == null) {
        hideMenu()
      } else {
        menuCoord.value = coord
      }
    }

    const title = computed(() => {
      const levelId = props.levelId
      switch (levelId.kind) {
        case LevelKind.Lab:
          return 'Virtual Lab'
        case LevelKind.Campaign:
          if (gameCtl.level != null) {
            return `${gameCtl.level.id} - ${gameCtl.level.name}`
          }
          break
        case LevelKind.User:
          // TODO
          break
      }
      if (props.levelId.kind === LevelKind.Campaign) if (isLab.value) return 'Virtual Lab'
      if (props.levelId.kind === LevelKind.Campaign)
        if (gameCtl.level) {
        }
      return 'Loading...'
    })

    return {
      gameCtl,
      grabCtl,
      playheadCtl,
      experimentCtl,
      visCtl,
      previousLevel,
      nextLevelOrOvelay,
      handleSave,
      downloadLevel,
      reload,
      continueAfterWin,
      updateInfoPayload,
      showVictoryOverlay,
      activeParticles,
      laserParticles,
      laserOpacity,
      infoPayload,
      loadJsonLevelFromFile,
      handleTouch,
      handleMenu,
      hideMenu,
      menuCoord,
      scaledTileSize,
      absorptions,
      isVictory,
      SimulationVisMode,
      showToolbox,
      title,
      isLab,
    }
  },
})
</script>

<style lang="scss" scoped>
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

.main-section {
  position: relative;
}
</style>
