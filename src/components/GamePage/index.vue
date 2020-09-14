<template>
  <div class="game">
    <!-- DRAG AND DROP CELL -->
    <div class="portal-dragdrop"></div>

    <!-- OVERLAY -->
    <app-overlay :game-state="overlayGameState" class="overlay" @click="frameIndex = 0">
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
        <h1 v-else class="title">
          <router-link :to="previousLevel">
            <img src="@/assets/graphics/icons/previousLevel.svg" alt="Previous Level" width="24" />
          </router-link>
          {{ level.id + ' - ' + level.name }}
          <router-link :to="nextLevelOrOvelay">
            <img src="@/assets/graphics/icons/nextLevel.svg" alt="Next Level" width="24" />
          </router-link>
        </h1>
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
          <game-board
            :particles="activeParticles"
            :laser-particles="laserParticles"
            :fate="fateCoord"
            :display-fate="displayFate"
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
            :total-frames="simulation.frames.length"
            :display-status="displayStatus"
            @rewind="rewind"
            @step-back="stepBack"
            @play="play"
            @step-forward="stepForward"
            @fast-forward="fastForward"
            @new-fate="computeNewFate"
            @reload="reload"
            @download-level="downloadLevel"
            @loaded-level="loadLevel($event)"
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
            <ket-viewer class="ket" :vector="activeFrame.vector" />
          </div>
        </section>
      </template>
    </game-layout>
  </div>
</template>

<script lang="ts">
import { Frame, Simulation } from 'quantum-tensors'
import { Vue, Options, setup } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { IHint, GameStateEnum, IParticle } from '@/engine/interfaces'
import { IInfoPayload } from '@/mixins/gameInterfaces'
import { Cell, Grid, Level, Particle, Coord } from '@/engine/classes'
import Toolbox from '@/engine/Toolbox'
import Absorption from '@/engine/Absorption'
import levels from '@/assets/data/levels'
import { KetViewer } from 'bra-ket-vue'
import GameGoals from '@/components/GamePage/GameGoals.vue'
import GameInfobox from '@/components/GamePage/GameInfobox.vue'
import GameToolbox from '@/components/GamePage/GameToolbox.vue'
import GameControls from '@/components/GamePage/GameControls.vue'
import GamePhotons from '@/components/GamePage/GamePhotons.vue'
import GameLayout from '@/components/GamePage/GameLayout.vue'
import GameBoard from '@/components/Board/index.vue'
import AppButton from '@/components/AppButton.vue'
import AppOverlay from '@/components/AppOverlay.vue'
import { getRockTalkIdByLevelId } from '@/components/RockTalkPage/loadRockTalks'
import { useStore } from 'vuex'
import '@/store/store'
import { useRoute } from 'vue-router'
import { storeNamespace } from '@/store'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useWindowEvent } from '@/mixins/event'
import { useTimer } from '@/mixins/timer'

export default defineComponent({
  components: {
    GameLayout,
    GamePhotons,
    KetViewer,
    GameGoals,
    GameInfobox,
    GameToolbox,
    GameControls,
    GameBoard,
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
    const mutationSetHoveredCell = game.useMutation('SET_HOVERED_CELL')
    const store = useStore()
    const route = useRoute()

    const level = ref(Level.createDummy())

    const frameIndex = ref(0)
    let simulation = new Simulation(Grid.emptyGrid().exportSimGrid())
    let error: string | null = null

    const frameAdvanceTimer = useTimer(() => {
      if (frameIndex.value < fateStep.value) {
        frameIndex.value += 1
      } else {
        mutationSetSimulationState(false)
        setEnergizedCellAtTheEnd()
        setTimeout(() => {
          updateSimulation()
        }, 1000)
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

    const fateCoord = ref(Coord.importCoord({ x: -1, y: -1 }))
    const fateStep = ref(999)
    const displayFate = ref(false)
    const showVictory = ref(false)

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
      computeNewFate()
      frameIndex.value = 0
      mutationSetSimulationState(true)
    }

    /**
     * Show next frame and check it exists
     */
    function stepForward() {
      mutationSetSimulationState(false)
      frameIndex.value = Math.max(0, Math.min(simulation.frames.length, frameIndex.value + 1))
      level.value.grid.resetEnergized()
    }

    /**
     * Reload the current page
     */
    function fastForward(): void {
      frameIndex.value = Math.max(0, simulation.frames.length - 1)
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
    useWindowEvent('keypress', (e) => {
      // console.log(e.keyCode);
      switch (e.keyCode) {
        // case 81:
        //   level.value.grid.moveAll(180);
        //   break;
        // case 68:
        //   level.value.grid.moveAll(0);
        //   break;
        // case 90:
        //   level.value.grid.moveAll(90);
        //   break;
        // case 83:
        //   level.value.grid.moveAll(270);
        //   break;
        // case 65:
        //   level.value.grid.rotateAll();
        //   break;
        // case 69:
        //   level.value.grid.reflectAll();
        //   break;
        case 32:
          play()
          break
        case 37:
          stepBack()
          break
        case 39:
          stepForward()
          break
        default:
          break
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
            setFirstToolAsHovered()
            updateSimulation()
            actionClearLevelStoreData()
          }
        })
      } else {
        level.value = Level.importLevel(levels[routeLevelId()])
        setFirstToolAsHovered()
        updateSimulation()
      }
    }

    // Set hovered cell as first element of toolbox
    function setFirstToolAsHovered(): void {
      if (level.value.toolbox.uniqueCellList.length > 0) {
        mutationSetHoveredCell(level.value.toolbox.uniqueCellList[0])
      }
    }

    /**
     * Level loading and initialization
     * @returns boolean
     */
    function updateSimulation(): void {
      console.log('updateSimulation')
      // Compute simulation frames
      simulation = new Simulation(level.value.grid.exportSimGrid())
      const indicator = simulation.generateLaserIndicator()
      simulation.initializeFromIndicator(indicator)
      simulation.generateFrames(40)

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
      displayFate.value = true
      level.value.grid.setEnergized([fateCoord.value])
    }

    /**
     * Convert IAbsorption to Absorption class instances
     * Filter the escaping particle absorption events
     * @param IAbsorption[]
     * @returns absorption instance list (cell, probability)
     */
    const filteredAbsorptions = computed((): Absorption[] => {
      const absorptions: Absorption[] = []
      simulation.totalAbsorptionPerTile.forEach(
        (absorptionI: { x: number; y: number; probability: number }): void => {
          const coord = Coord.importCoord({ x: absorptionI.x, y: absorptionI.y })
          if (!coord.outOfGrid) {
            const cell = level.value.grid.get(coord)
            cell.energized = true
            absorptions.push(new Absorption(cell, absorptionI.probability))
          }
        }
      )
      // Filter out of grid cells
      return absorptions.filter((absorption: Absorption) => {
        return absorption.cell.coord.x !== -1 && absorption.probability > absorptionThreshold
      })
    })

    /**
     * Retrieve all particles for laser paths
     * @returns list of all particles from the sim
     */
    const laserParticles = computed((): Particle[] => {
      return simulation.frames
        .map((frame: Frame) => {
          return frame.particles
        })
        .flat()
        .map((particle) => Particle.importParticle(particle))
    })

    /**
     * Current active frame particles
     * @returns particles
     */
    const activeParticles = computed((): Particle[] => {
      return activeFrame.value.particles.map(Particle.importParticle)
    })

    /**
     * Get the current simulation frame
     */
    const activeFrame = computed(
      (): Frame => {
        return simulation.frames[frameIndex.value]
      }
    )

    /**
     * Compute another fate for the simulation
     */
    function computeNewFate() {
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

    return {
      displayStatus: computed(() => {
        if (simulationState.value) {
          // (each time a random outcome)
          return 'Quantum simulation (live)'
        } else if (frameIndex.value > 0) {
          return 'Quantum simulation (step-by-step)'
        } else {
          // (still with polarization & interference)
          return 'Classical laser beam'
        }
      }),
      overlayGameState: computed(
        (): GameStateEnum => {
          if (frameIndex === fateStep) {
            return gameState.value
          }
          return GameStateEnum.InProgress
        }
      ),
      hints: computed((): IHint[] => {
        return level.value.hints.map((hint) => hint.exportHint())
      }),
      /**
       * Should an overlay be shown when progressing
       * to the next level?
       * @returns an router link :to attribute string
       */
      nextLevelOrOvelay: computed((): string => {
        const possibleOverlay = getRockTalkIdByLevelId(routeLevelId())
        return possibleOverlay ? `/rocks/${possibleOverlay}` : nextLevel.value
      }),
      /**
       * The next/previous level url getters
       * They get blocked in case it is a custom level
       * with its hashed ID.
       */

      updateInfoPayload(payload: IInfoPayload): void {
        infoPayload.value = payload
      },
      rewind(): void {
        frameIndex.value = 0
      },
      /**
       * the main level grid state updating method
       * checks the updated cell details, compares them
       * with the active cell and proceeds accordingly
       * @param cell
       * @returns void
       */
      updateCell(cell: Cell): void {
        const sourceCell = activeCell.value
        const targetCell = cell
        if (
          // handle moving from toolbox to grid
          activeCell.value.isFromToolbox &&
          cell.isFromGrid &&
          cell.isVoid
        ) {
          level.value.toolbox.removeTool(activeCell.value)
        } else if (
          // handle moving from grid to toolbox
          activeCell.value.isFromGrid &&
          cell.isFromToolbox &&
          !activeCell.value.isVoid &&
          !cell.isVoid
        ) {
          level.value.toolbox.addTool(cell, activeCell.value)
          level.value.grid.set(activeCell.value.reset())
        }
        // FIXME: unify moving logic
        level.value.grid.move(sourceCell, targetCell)

        saveLevelToStore()
        updateSimulation()
      },
      error,
      previousLevel,
      nextLevel,
      level,
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.5rem;
  margin-bottom: 30;
  margin-top: 0;
  text-transform: uppercase;
  @media screen and (max-width: 1000px) {
    a img {
      width: 6vw !important;
    }
  }
}

.game {
  width: 100%;
  min-height: 100vh;
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
