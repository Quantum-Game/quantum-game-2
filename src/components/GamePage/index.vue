<template>
  <div class="game">
    <!-- DRAG AND DROP CELL -->
    <div class="portal-dragdrop"></div>

    <!-- OVERLAY -->
    <app-overlay :game-state="overlayGameState" class="overlay" @click="continueAfterWin">
      <p class="backButton">GO BACK</p>
      <router-link :to="nextLevelOrOvelay">
        <app-button :overlay="true" :inline="false">NEXT LEVEL</app-button>
      </router-link>
    </app-overlay>

    <!-- GENERAL LAYOUT -->
    <game-layout>
      <!-- HEADER-MIDDLE -->
      <template #header-middle>
        <h1 v-if="error" class="error">{{ error }}</h1>
        <div v-else layout="row u2 middle center">
          <router-link :to="previousLevel">
            <img src="@/assets/graphics/icons/previousLevel.svg" alt="Previous Level" width="24" />
          </router-link>
          <h1 class="title">{{ level.id + ' - ' + level.name }}</h1>
          <router-link :to="nextLevelOrOvelay">
            <img src="@/assets/graphics/icons/nextLevel.svg" alt="Next Level" width="24" />
          </router-link>
        </div>
      </template>

      <!-- MAIN-LEFT -->
      <template #main-left>
        <section>
          <game-toolbox
            :toolbox="level.toolbox"
            @update-cell="updateCell"
            @hover="updateInfoPayload"
          />
          <game-infobox :info-payload="infoPayload" />
        </section>
      </template>

      <!-- MAIN-MIDDLE -->
      <template #main-middle>
        <section>
          <board
            :particles="activeParticles"
            :laser-particles="laserParticles"
            :fate="displayFate ? fateCoord : undefined"
            :hints="hints"
            :grid="level.grid"
            :absorptions="level.gameState.absorptions"
            :frame-index="frameIndex"
            @update-cell="updateCell"
            @play="play"
            @hover="updateInfoPayload"
          />
          <game-controls
            :frame-index="frameIndex"
            :total-frames="totalFrames"
            :display-status="displayStatus"
            @rewind="rewind"
            @step-back="stepBack"
            @play="play"
            @step-forward="stepForward"
            @fast-forward="fastForward"
            @reload="reload"
            @download-level="downloadLevel"
            @loaded-level="loadLevel"
            @hover="updateInfoPayload"
            @save-level="handleSave"
          />
        </section>
      </template>

      <!-- MAIN-RIGHT -->
      <template #main-right>
        <section>
          <GameGoals
            :game-state="level.gameState"
            :percentage="level.gameState.totalAbsorptionPercentage"
          />
          <div class="ket-viewer-game">
            <ket-viewer v-if="activeFrame" class="ket" :vector="activeFrame.vector" />
          </div>
        </section>
      </template>
    </game-layout>
  </div>
</template>

<script lang="ts">
import { Simulation, Vector } from 'quantum-tensors'
import { IAbsorption } from 'quantum-tensors/dist/interfaces'
import { IHint, GameStateEnum, ISimGrid } from '@/engine/interfaces'
import { IInfoPayload } from '@/mixins/gameInterfaces'
import { Cell, Level, Particle, Coord } from '@/engine/classes'
import Absorption from '@/engine/Absorption'
import levels from '@/assets/data/levels'
import { KetViewer } from 'bra-ket-vue'
import GameGoals from '@/components/GamePage/GameGoals.vue'
import GameInfobox from '@/components/GamePage/GameInfobox.vue'
import GameToolbox from '@/components/GamePage/GameToolbox.vue'
import GameControls from '@/components/GamePage/GameControls.vue'
import GameLayout from '@/components/GamePage/GameLayout.vue'
import Board from '@/components/Board/index.vue'
import AppButton from '@/components/AppButton.vue'
import AppOverlay from '@/components/AppOverlay.vue'
import { getRockTalkIdByLevelId } from '@/components/RockTalkPage/loadRockTalks'
import { useStore } from 'vuex'
import '@/store/store'
import { useRoute } from 'vue-router'
import { storeNamespace } from '@/store'
import { computed, defineComponent, onMounted, ref, shallowRef, watch } from 'vue'
import { useWindowEvent } from '@/mixins/event'
import { useTimer } from '@/mixins/timer'

/**
 * View data extracted from simulation
 */
interface SimFrame {
  particles: Particle[]
  vector: Vector
}

export default defineComponent({
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
  },
  setup() {
    const user = storeNamespace('user')
    const game = storeNamespace('game')

    const activeCell = game.useState('activeCell') // this need to me removed ASASP - the same fate as... fate
    const gameState = game.useState('gameState')
    const simulationState = game.useState('simulationState')
    const actionSaveLevel = user.useAction('SAVE_LEVEL')
    const actionUpdateLevel = user.useAction('UPDATE_LEVEL')
    const actionGetLevelStoreData = user.useAction('GET_LEVEL_DATA')
    const actionClearLevelStoreData = user.useAction('CLEAR_LEVEL_DATA')
    const fetchedLevel = user.useGetter('fetchedLevelBoardState')
    const mutationSetCurrentLevelID = game.useMutation('SET_CURRENT_LEVEL_ID')
    const mutationSetGameState = game.useMutation('SET_GAME_STATE')
    const mutationSetSimulationState = game.useMutation('SET_SIMULATION_STATE')
    const store = useStore()
    const route = useRoute()

    const level = ref(Level.createDummy())

    const frameIndex = ref(0)
    const acceptedWin = ref<number | null>(null)
    // sim derived state (separate to avoid proxying Simulation object)
    const simFrames = shallowRef<SimFrame[]>([])
    const filteredAbsorptions = ref([] as Absorption[])

    let lastSimulation: Simulation | null = null

    function runSimulation(simGrid: ISimGrid): Simulation {
      const newSim = new Simulation(simGrid)
      newSim.initializeFromIndicator(newSim.generateLaserIndicator())
      newSim.generateFrames(40)
      return newSim
    }

    const simGrid = computed(() => level.value.grid.exportSimGrid())

    function updateSimulation(): void {
      // Compute simulation frames
      const simulation = runSimulation(simGrid.value)
      lastSimulation = simulation
      computeNewFate(simulation)

      simFrames.value = simulation.frames.map((frame) => {
        return {
          particles: frame.particles.map(Particle.importParticle),
          vector: frame.vector,
        }
      })

      filteredAbsorptions.value = filterAbsorptions(simulation.totalAbsorptionPerTile)

      // Set absorption events to compute gameState
      level.value.gameState.absorptions = filteredAbsorptions.value
      // Reset simulation variables
      frameIndex.value = 0
      displayFate.value = false
      setEnergizedCells()
      if (routeLevelId() !== 0) {
        mutationSetGameState(level.value.gameState.gameState)
      }
      mutationSetSimulationState(false)
      console.debug(level.value.gameState.toString())
    }

    watch(simGrid, updateSimulation)

    let error: string | null = null

    const frameAdvanceTimer = useTimer(() => {
      if (frameIndex.value < totalFrames.value - 1) {
        frameIndex.value += 1
      } else {
        mutationSetSimulationState(false)
        setEnergizedCellAtTheEnd()
      }
    })

    watch(simulationState, (simulate) => {
      if (simulate) {
        frameAdvanceTimer.restart(200)
      } else {
        frameAdvanceTimer.cancel()
      }
    })

    const absorptionThreshold = 0.0001
    const infoPayload = ref({
      kind: 'ui',
      particles: [],
      text: 'Hover on a element for more information.',
    } as IInfoPayload)

    const fateCoord = ref<Coord>()
    const fateStep = ref(999)
    const displayFate = ref(false)

    /**
     * Step back one frame
     */
    function stepBack(): void {
      mutationSetSimulationState(false)
      frameIndex.value = Math.max(0, frameIndex.value - 1)
    }

    /**
     *  Rewind and play or pause simulation state
     * @returns void
     */
    function play(): void {
      if (simulationState.value) {
        mutationSetSimulationState(false)
        return
      }
      level.value.grid.resetEnergized()
      frameIndex.value = 0
      mutationSetSimulationState(true)
      if (lastSimulation != null) {
        computeNewFate(lastSimulation)
      }
    }

    /**
     * Show next frame and check it exists
     */
    function stepForward() {
      mutationSetSimulationState(false)
      frameIndex.value = Math.max(0, Math.min(totalFrames.value, frameIndex.value + 1))
      level.value.grid.resetEnergized()
    }

    /**
     * Reload the current page
     */
    function fastForward(): void {
      frameIndex.value = Math.max(0, totalFrames.value - 1)
    }

    /**
     * Reload the current page
     */
    function reload(): void {
      window.location.reload(false)
    }

    /**
     * Export the level in JSON format and uploads it
     * @returns level in JSON format
     */
    function downloadLevel(): void {
      const json = JSON.stringify(level.value.exportLevelForDownload(), null, 2)
      const blob = new Blob([json], { type: 'octet/stream' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'level.json'
      link.click()
    }

    function routeLevelId(): number {
      return +route.params.id || 0
    }

    onMounted(() => {
      loadLevel()
      mutationSetCurrentLevelID(routeLevelId())
    })

    watch(routeLevelId, () => {
      mutationSetCurrentLevelID(routeLevelId())
      loadLevel()
    })

    /**
     * Left and right keys to see frames
     * TODO: Implement dev mode
     */
    useWindowEvent('keydown', (e) => {
      switch (e.keyCode) {
        case 32:
          return play()
        case 37:
          return stepBack()
        case 39:
          return stepForward()
      }
    })

    /**
     * Depending on whether the level at hand is a custom
     * or a default one, appropriate level loading logic is applied.
     * @returns an answear to whether the level is a custom one
     * @remarks In the future we need a more flexible way
     * to determine this.
     */
    function isCustomLevel(): boolean {
      return routeLevelId() >= 1000
    }

    /**
     * Level Loading Logic
     * @params none, the function evaluates which level should be loaded
     * @returns nothing, function substitures this.level
     * @remarks the 'saved' variable determines whether the level should
     * be loaded out of app data, or fetched from db
     */
    function loadLevel(): void {
      error = null

      if (isCustomLevel()) {
        // 1) dispatch action for vuex to get the level, the "shared" parameter
        //    handles which db we target
        actionGetLevelStoreData({ id: routeLevelId() }).then(() => {
          const fetchedLevelBoardObj = fetchedLevel.value
          if (fetchedLevelBoardObj != null) {
            level.value = Level.importLevel(fetchedLevelBoardObj)
            actionClearLevelStoreData()
          }
        })
      } else {
        level.value = Level.importLevel(levels[routeLevelId()])
      }
    }

    /**
     * Set the energized cells from the simulation
     */
    function setEnergizedCells(): void {
      level.value.grid.resetEnergized()
      const coords = filteredAbsorptions.value.map((absorption) => absorption.coord)
      level.value.grid.setEnergized(coords)
    }

    /**
     * Set the energized cells from the simulation
     */
    function setEnergizedCellAtTheEnd(): void {
      const coord = fateCoord.value
      if (coord != null) {
        displayFate.value = true
        level.value.grid.setEnergized([coord])
      }
    }

    /**
     * Convert IAbsorption to Absorption class instances
     * Filter the escaping particle absorption events
     * @param IAbsorption[]
     * @returns absorption instance list (cell, probability)
     */
    function filterAbsorptions(totalAbsorptionPerTile: IAbsorption[]): Absorption[] {
      const absorptions: Absorption[] = []
      totalAbsorptionPerTile.forEach((absorption): void => {
        const coord = Coord.importCoord({ x: absorption.x, y: absorption.y })
        if (!coord.outOfGrid) {
          const cell = level.value.grid.get(coord)
          cell.energized = true

          // Filter out of grid cells
          if (cell.coord.x !== -1 && absorption.probability > absorptionThreshold) {
            absorptions.push(new Absorption(cell, absorption.probability))
          }
        }
      })
      return absorptions
    }

    /**
     * Retrieve all particles for laser paths
     * @returns list of all particles from the sim
     */
    const laserParticles = computed((): Particle[] => {
      return simFrames.value.reduce(
        (frames, frame) => [...frames, ...frame.particles],
        [] as Particle[]
      )
    })

    /**
     * Current active frame particles
     * @returns particles
     */
    const activeParticles = computed((): Particle[] => {
      return activeFrame.value?.particles || []
    })

    /**
     * Get the current simulation frame
     */
    const activeFrame = computed((): SimFrame | undefined => {
      return simFrames.value[frameIndex.value] as SimFrame | undefined
    })

    /**
     * Compute another fate for the simulation
     */
    function computeNewFate(simulation: Simulation) {
      const fate = simulation.sampleRandomRealization()
      displayFate.value = false
      fateCoord.value = Coord.importCoord({ x: fate.x, y: fate.y })
      fateStep.value = fate.step
    }

    /**
     * Utilized by updateCell to keep level in localStorage
     */
    function saveLevelToStore(): void {
      const currentStateJSONString = JSON.stringify(level.value.exportLevel())
      localStorage.setItem(`level${routeLevelId()}`, currentStateJSONString)
    }

    /**
     * Actual 'save' button handling
     */
    function handleSave(): void {
      const currentStateJSONString = JSON.stringify(level.value.exportLevel())
      const newState = { ...store.state, boardState: currentStateJSONString }
      if (isCustomLevel()) {
        actionUpdateLevel(newState)
      } else {
        actionSaveLevel(newState)
      }
    }

    const previousLevel = computed(() => {
      return `/level/${isCustomLevel() ? routeLevelId() : routeLevelId() - 1}`
    })
    const nextLevel = computed(() => {
      return `/level/${isCustomLevel() ? routeLevelId() : routeLevelId() + 1}`
    })

    const displayStatus = computed(() => {
      if (simulationState.value) {
        // (each time a random outcome)
        return 'Quantum simulation (live)'
      } else if (frameIndex.value > 0) {
        return 'Quantum simulation (step-by-step)'
      } else {
        // (still with polarization & interference)
        return 'Classical laser beam'
      }
    })
    const overlayGameState = computed(
      (): GameStateEnum => {
        const ignoreWin = acceptedWin.value === routeLevelId()
        if (!ignoreWin && frameIndex.value === totalFrames.value - 1) {
          return gameState.value
        }
        return GameStateEnum.InProgress
      }
    )
    const hints = computed((): IHint[] => {
      return level.value.hints.map((hint) => hint.exportHint())
    })
    /**
     * Should an overlay be shown when progressing
     * to the next level?
     * @returns an router link :to attribute string
     */
    const nextLevelOrOvelay = computed((): string => {
      const possibleOverlay = getRockTalkIdByLevelId(routeLevelId())
      return possibleOverlay ? `/rocks/${possibleOverlay}` : nextLevel.value
    })

    function updateInfoPayload(payload: IInfoPayload): void {
      infoPayload.value = payload
    }

    function rewind(): void {
      frameIndex.value = 0
    }

    function continueAfterWin(): void {
      acceptedWin.value = routeLevelId()
      rewind()
    }

    /**
     * the main level grid state updating method
     * checks the updated cell details, compares them
     * with the active cell and proceeds accordingly
     * @param cell
     * @returns void
     */
    function updateCell(cell: Cell): void {
      const grid = level.value.grid
      const toolbox = level.value.toolbox

      const sourceCell = activeCell.value
      const targetCell = cell

      if (sourceCell == null || sourceCell.frozen || targetCell.frozen) {
        return
      }

      if (
        // handle moving from toolbox to grid
        sourceCell.isFromToolbox &&
        targetCell.isFromGrid &&
        targetCell.isVoid
      ) {
        toolbox.removeTool(sourceCell.element.name)
        const newCell = sourceCell.exportCell()
        newCell.coord = targetCell.coord
        grid.set(Cell.importCell(newCell))
      } else if (
        // handle moving from grid to toolbox
        sourceCell.isFromGrid &&
        targetCell.isFromToolbox &&
        !sourceCell.isVoid &&
        !cell.isVoid
      ) {
        toolbox.addTool(sourceCell.element.name)
        level.value.grid.remove(sourceCell.coord)
      } else if (sourceCell.isFromGrid && targetCell.isFromGrid) {
        // handle swapping grids on board
        grid.swap(sourceCell.coord, targetCell.coord)
      }

      saveLevelToStore()
    }

    const totalFrames = computed(() => simFrames.value.length)

    return {
      error,
      previousLevel,
      nextLevel,
      level,
      handleSave,
      downloadLevel,
      loadLevel,
      fastForward,
      reload,
      updateCell,
      rewind,
      continueAfterWin,
      stepBack,
      stepForward,
      updateInfoPayload,
      nextLevelOrOvelay,
      hints,
      overlayGameState,
      displayStatus,
      activeParticles,
      laserParticles,
      totalFrames,
      fateCoord,
      displayFate,
      play,
      infoPayload,
      activeFrame,
      frameIndex,
      simGrid,
    }
  },
})
</script>

<style lang="scss" scoped>
// Drag & drop
.portal-dragdrop {
  pointer-events: none;
  position: absolute;
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
