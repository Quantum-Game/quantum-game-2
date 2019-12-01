<template>
  <div class="game">
    <!-- DRAG AND DROP CELL -->
    <div class="hoverCell"></div>

    <!-- OVERLAY -->
    <app-overlay :game-state="displayGameState" class="overlay" @click.native="frameIndex = 0">
      <p class="backButton">GO BACK</p>
      <router-link :to="nextLevel">
        <app-button :overlay="true" :inline="false">NEXT LEVEL</app-button>
      </router-link>
    </app-overlay>

    <!-- GENERAL LAYOUT -->
    <game-layout>
      <!-- HEADER-MIDDLE -->
      <h1 v-if="error" slot="header-middle" class="error">{{ error }}</h1>
      <h1 v-else slot="header-middle" class="title">
        <router-link :to="previousLevel">
          <img src="@/assets/graphics/icons/previousLevel.svg" alt="Previous Level" width="32" />
        </router-link>
        {{ level.id + ' - ' + level.name.toUpperCase() }}
        <router-link :to="nextLevel">
          <img src="@/assets/graphics/icons/nextLevel.svg" alt="Next Level" width="32" />
        </router-link>
      </h1>

      <!-- MAIN-LEFT -->
      <section slot="main-left">
        <game-goals :game-state="level.gameState" :percentage="level.gameState.totalAbsorption" />
        <game-graph
          :multiverse="multiverseGraph"
          :active-id="frameIndex"
          @changeActiveFrame="handleChangeActiveFrame"
        />
      </section>

      <!-- MAIN-MIDDLE -->
      <section slot="main-middle">
        <game-board
          :particles="particles"
          :path-particles="pathParticles"
          :fate="displayFate"
          :hints="hints"
          :grid="level.grid"
          :absorptions="filteredAbsorptions"
          @updateSimulation="updateSimulation"
          @updateCell="updateCell"
          @play="play"
        />
        <game-controls
          :frame-index="frameIndex"
          :total-frames="simulation.frames.length"
          @rewind="rewind"
          @step-back="stepBack"
          @play="play"
          @step-forward="stepForward"
          @fast-forward="fastForward"
          @reload="reload"
          @downloadLevel="downloadLevel"
        />
        <game-ket :frame="activeFrame" :grid="level.grid" />
      </section>

      <!-- MAIN-RIGHT -->
      <section slot="main-right">
        <game-toolbox :toolbox="level.toolbox" @updateCell="updateCell" />
        <game-active-cell />
        <game-photons :particles="activeFrame.particles" />
      </section>
    </game-layout>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import { Cell, Grid, Level, Particle } from '@/engine/classes'
import Toolbox from '@/engine/Toolbox'
import MultiverseGraph from '@/engine/MultiverseGraph'
import QuantumFrame from '@/engine/QuantumFrame'
import QuantumSimulation from '@/engine/QuantumSimulation'
import { HintInterface, GameStateEnum } from '@/engine/interfaces'
import levels from '@/assets/data/levels'
import GameGoals from '@/components/GamePage/GameGoals.vue'
import GameActiveCell from '@/components/GamePage/GameActiveCell.vue'
import GameToolbox from '@/components/GamePage/GameToolbox.vue'
import GameControls from '@/components/GamePage/GameControls.vue'
import GamePhotons from '@/components/GamePage/GamePhotons.vue'
import GameKet from '@/components/GamePage/GameKet.vue'
import GameLayout from '@/components/GamePage/GameLayout.vue'
import GameBoard from '@/components/Board/index.vue'
import GameGraph from '@/components/GamePage/GameGraph.vue'
import AppButton from '@/components/AppButton.vue'
import AppOverlay from '@/components/AppOverlay.vue'
import Absorption from '../../engine/Absorption'

@Component({
  components: {
    GameLayout,
    GamePhotons,
    GameKet,
    GameGoals,
    GameActiveCell,
    GameToolbox,
    GameGraph,
    GameControls,
    GameBoard,
    AppButton,
    AppOverlay
  }
})
export default class Game extends Vue {
  level = Level.createDummy()
  @State('currentLevelID') currentLevelID!: number
  @State('activeCell') activeCell!: Cell
  @State('gameState') gameState!: GameStateEnum
  @Mutation('SET_CURRENT_LEVEL_ID') mutationSetCurrentLevelID!: (id: number) => void
  @Mutation('SET_GAME_STATE') mutationSetGameState!: (gameState: GameStateEnum) => void
  @Mutation('SET_SIMULATION_STATE') mutationSetSimulationState!: (simulationState: boolean) => void
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void
  frameIndex: number = 0
  simulation: QuantumSimulation = new QuantumSimulation(Grid.emptyGrid())
  multiverseGraph: MultiverseGraph = new MultiverseGraph(this.simulation)
  error: string = ''
  playInterval: number = 0
  absorptionThreshold: number = 0.0001

  // LIFECYCLE
  created(): void {
    this.loadLevel()
    window.addEventListener('keyup', this.handleArrowPress)
  }

  beforeDestroy(): void {
    window.removeEventListener('keyup', this.handleArrowPress)
  }

  /**
   * Parse url to extract level number
   * if missing then fallback to '0' for infinity level / sandbox
   */
  get levelId(): number {
    return parseInt(this.$route.params.id || '0', 10)
  }

  /**
   * Load level and process simulation
   */
  @Watch('$route')
  loadLevel(): void {
    this.error = ''
    this.mutationSetCurrentLevelID(this.levelId)
    const levelI = levels[this.levelId]
    this.level = Level.importLevel(levelI)
    // Set hovered cell as first element of toolbox
    if (this.level.toolbox.uniqueCellList.length > 0) {
      this.mutationSetHoveredCell(this.level.toolbox.uniqueCellList[0])
    }
    // Process simulation
    this.updateSimulation()
  }

  /**
   * Level loading and initialization
   * @returns boolean
   */
  updateSimulation(): void {
    // Compute simulation frames
    this.simulation = new QuantumSimulation(this.level.grid)
    this.simulation.initializeFromLaser()
    this.simulation.computeFrames(40)
    // Post-process simulation to create particle graph
    this.multiverseGraph = new MultiverseGraph(this.simulation)
    // Set absorption events to compute gameState
    this.level.gameState.absorptions = this.filteredAbsorptions
    // Reset simulation variables
    this.frameIndex = 0
    this.setEnergizedCells()
    this.mutationSetGameState(this.level.gameState.gameState)
    this.mutationSetSimulationState(false)
    console.debug(this.level.gameState.toString())
  }

  /**
   * Get fate from simulation random realization
   * Display on the last frame of simulation, death then fate
   */
  get displayFate(): Cell {
    if (this.frameIndex === this.simulation.frames.length - 1) {
      return this.simulation.fate
    }
    return Cell.createDummy({ x: -1, y: -1 })
  }

  /**
   * Launch overlay if it's the last frame and the player has a game state set
   */
  get displayGameState() {
    if (this.frameIndex === this.simulation.frames.length - 1) {
      return this.gameState
    }
    return 'InProgress'
  }

  /**
   * Set the energized cells from the simulation
   */
  setEnergizedCells() {
    this.level.grid.resetEnergized()
    const coords = this.filteredAbsorptions.map((absorption) => {
      return absorption.cell.coord
    })
    this.level.grid.setEnergized(coords)
  }

  /**
   * Output cells linked to detection events
   * @returns Cell and percentage
   */
  get filteredAbsorptions(): Absorption[] {
    // Filter out of grid cells
    return this.simulation.absorptions.filter((absorption: Absorption) => {
      return absorption.cell.coord.x !== -1 && absorption.probability > this.absorptionThreshold
    })
  }

  /**
   * Change active frame with provided Id
   */
  handleChangeActiveFrame(activeId: number): void {
    this.frameIndex = activeId
  }

  /**
   * Process the goals from level with the results of the quantum simulation
   *  @returns goals
   */
  get framePercentage() {
    return this.activeFrame.probability * 100
  }

  /**
   * compute paths for quantum laser paths
   * @returns individual paths
   */
  get pathParticles(): Particle[] {
    return _.uniq(this.simulation.allParticles)
  }

  /**
   * Get the current simulation frame
   */
  get activeFrame(): QuantumFrame {
    return this.simulation.frames[this.frameIndex]
  }

  /**
   * Current simulation frame particles
   */
  get particles(): Particle[] {
    return this.activeFrame.particles
  }

  /**
   * Show previous frame and check it exists
   *  @returns frameIndex
   */
  rewind() {
    this.frameIndex = 0
  }

  /**
   * Show previous frame and check it exists
   *  @returns frameIndex
   */
  stepBack() {
    const newframeIndex = this.frameIndex - 1
    if (newframeIndex < 0) {
      console.error("Can't access frames before simulation...")
      return false
    }
    this.frameIndex = newframeIndex
    return this.frameIndex
  }

  /**
   *  Reset frameIndex, flip it up for every frame,
   *  then clear the interval
   * @returns void
   */
  play() {
    this.frameIndex = 0
    this.playInterval = setInterval(() => {
      if (this.frameIndex < this.simulation.frames.length - 1) {
        this.frameIndex += 1
      } else {
        this.mutationSetSimulationState(false)
        clearInterval(this.playInterval)
      }
    }, 200)
    this.mutationSetSimulationState(true)
  }

  /**
   * Show next frame and check it exists
   *  @returns frameIndex
   */
  stepForward() {
    const newframeIndex = this.frameIndex + 1
    if (newframeIndex > this.simulation.frames.length - 1) {
      console.error("Can't access frames that are not computed yet...")
      return false
    }
    this.frameIndex = newframeIndex
    return this.frameIndex
  }

  /**
   * Reload the current page
   */
  fastForward() {
    this.frameIndex = this.simulation.frames.length - 1
  }

  /**
   * Reload the current page
   */
  reload() {
    window.location.reload(false)
  }

  /**
   * Export the level in JSON format and uploads it
   * @returns level in JSON format
   */
  downloadLevel(): void {
    const json = JSON.stringify(this.level.exportLevel(), null, 2)
    const blob = new Blob([json], { type: 'octet/stream' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'level.json'
    link.click()
  }

  /**
   * Left and right keys to see frames
   * TODO: Implement dev mode
   */
  handleArrowPress(e: { keyCode: number }): void {
    // console.log(e.keyCode);
    switch (e.keyCode) {
      // case 81:
      //   this.level.grid.moveAll(180);
      //   break;
      // case 68:
      //   this.level.grid.moveAll(0);
      //   break;
      // case 90:
      //   this.level.grid.moveAll(90);
      //   break;
      // case 83:
      //   this.level.grid.moveAll(270);
      //   break;
      // case 65:
      //   this.level.grid.rotateAll();
      //   break;
      // case 69:
      //   this.level.grid.reflectAll();
      //   break;
      case 32:
        this.play()
        break
      case 37:
        this.stepBack()
        break
      case 39:
        this.stepForward()
        break
      default:
        break
    }
  }

  removeFromCurrentTools(cell: Cell) {
    this.level.toolbox.removeTool(cell)
  }

  addToCurrentTools(cell: Cell) {
    this.level.toolbox.addTool(cell, this.activeCell)
  }

  setCurrentTools(cells: Cell[]) {
    this.level.toolbox = new Toolbox(cells)
  }

  resetCurrentTools() {
    this.level.toolbox.reset()
  }

  /**
   * the main level grid state updating method
   * checks the updated cell details, compares them
   * with the active cell and proceeds accordingly
   * @param cell
   * @returns void
   */
  updateCell(cell: Cell): void {
    const sourceCell = this.activeCell
    const targetCell = cell
    // handle moving from from / to toolbox
    if (this.activeCell.isFromToolbox && cell.isFromGrid && cell.isVoid) {
      this.removeFromCurrentTools(this.activeCell)
    } else if (
      this.activeCell.isFromGrid &&
      cell.isFromToolbox &&
      !this.activeCell.isVoid &&
      !cell.isVoid
    ) {
      this.addToCurrentTools(cell)
      this.level.grid.set(this.activeCell.reset())
    }
    const mutatedCells: Cell[] = this.level.grid.move(sourceCell, targetCell)
    mutatedCells.forEach((mutatedCell: Cell) => {
      this.level.grid.set(mutatedCell)
    })
    this.saveLevelToStore()
    this.updateSimulation()
  }

  // Used to store in local storage the current state of the game
  saveLevelToStore() {
    const currentStateJSONString = JSON.stringify(this.level.exportLevel())
    localStorage.setItem(this.currentLevelName, currentStateJSONString)
  }

  clearLS() {
    localStorage.removeItem(this.currentLevelName)
  }

  // GETTERS
  get currentLevelName(): string {
    return `level${this.levelId}`
  }

  get previousLevel(): string {
    return `/level/${this.levelId - 1}`
  }

  get nextLevel(): string {
    return `/level/${this.levelId + 1}`
  }

  get hints(): HintInterface[] {
    return this.level.hints.map((hint) => hint.exportHint())
  }

  get cellPositionsArray() {
    const array: number[] = []
    this.level.grid.cells
      .filter((cell) => {
        return cell.element.name !== 'Void'
      })
      .map((cell) => {
        array.push(cell.coord.x)
        array.push(cell.coord.y)
        return cell
      })
    return array
  }
}
</script>

<style lang="scss" scoped>
// Drag & drop
.hoverCell {
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
  .groupTitle {
    font-size: 14px;
    color: grey;
  }
  @media screen and (max-width: 1000px) {
    a img {
      width: 6vw !important;
    }
  }
}

.grid {
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .row {
    display: flex;
    flex-direction: row;
    & .tile {
      width: 64px;
      min-height: 64px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      font-size: 1rem;
      margin: none;
      &:hover {
        color: black;
      }
    }
  }
}
.game {
  width: 100%;
  min-height: 100vh;
  &.goals {
    height: 600px;
    a:link,
    a:visited {
      color: white;
      font-size: 12;
      text-decoration: none;
    }
  }
}
.levelLink {
  text-decoration: none;
}
</style>
