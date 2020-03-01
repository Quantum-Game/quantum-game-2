<template>
  <div class="game">
    <!-- DRAG AND DROP CELL -->
    <div class="hoverCell"></div>

    <!-- GENERAL LAYOUT -->
    <game-layout>
      <!-- HEADER-MIDDLE -->
      <h1 slot="header-middle" class="title">
        {{ level.name }}
      </h1>
      <h4 slot="header-middle" class="title">
        {{ level.description }}
      </h4>

      <!-- MAIN-LEFT -->
      <section slot="main-left">
        <game-goals
          :game-state="level.gameState"
          :percentage="level.gameState.totalAbsorptionPercentage"
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
          @new-fate="computeNewFate"
          @reload="reload"
          @downloadLevel="downloadLevel"
          @loadedLevel="loadLevel($event)"
        />
        <cell-editor :level="level" @updateSimulation="updateSimulation" />
        <hr />
        <level-editor :level="level" />
      </section>

      <!-- MAIN-RIGHT -->
      <section slot="main-right">
        <game-toolbox :toolbox="level.toolbox" @updateCell="updateCell" />
        <game-active-cell />
        <game-photons :particles="activeFrame.particles" />
        <ket-viewer :vector="activeFrame.photons.vector" />
      </section>
    </game-layout>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import { IHint, GameStateEnum, ILevel } from '@/engine/interfaces'
import { Cell, Grid, Level, Particle } from '@/engine/classes'
import Toolbox from '@/engine/Toolbox'
import MultiverseGraph from '@/engine/MultiverseGraph'
import QuantumFrame from '@/engine/QuantumFrame'
import QuantumSimulation from '@/engine/QuantumSimulation'
import Absorption from '@/engine/Absorption'
import levels from '@/assets/data/levels'
import { KetViewer } from 'bra-ket-vue'
import GameGoals from '@/components/GamePage/GameGoals.vue'
import GameActiveCell from '@/components/GamePage/GameActiveCell.vue'
import GameToolbox from '@/components/GamePage/GameToolbox.vue'
import GameControls from '@/components/GamePage/GameControls.vue'
import GamePhotons from '@/components/GamePage/GamePhotons.vue'
import GameLayout from '@/components/GamePage/GameLayout.vue'
import GameBoard from '@/components/Board/index.vue'
import GameGraph from '@/components/GamePage/GameGraph.vue'
import AppButton from '@/components/AppButton.vue'
import AppOverlay from '@/components/AppOverlay.vue'
import CellEditor from '@/components/SandboxPage/CellEditor.vue'
import LevelEditor from '@/components/SandboxPage/LevelEditor.vue'

@Component({
  components: {
    GameLayout,
    GamePhotons,
    KetViewer,
    GameGoals,
    GameActiveCell,
    GameToolbox,
    GameGraph,
    GameControls,
    GameBoard,
    AppButton,
    AppOverlay,
    CellEditor,
    LevelEditor
  }
})
export default class Game extends Vue {
  level = Level.createDummy()
  @State('currentLevelID') currentLevelID!: number
  @State('fateCells') fateCells!: Cell[]
  @State('activeCell') activeCell!: Cell
  @State('selectedCell') selectedCell!: Cell
  @State('gameState') gameState!: GameStateEnum
  @Mutation('SET_CURRENT_LEVEL_ID') mutationSetCurrentLevelID!: (id: number) => void
  @Mutation('SET_GAME_STATE') mutationSetGameState!: (gameState: GameStateEnum) => void
  @Mutation('SET_SIMULATION_STATE') mutationSetSimulationState!: (simulationState: boolean) => void
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void
  @Mutation('SET_SELECTED_CELL') mutationSetSelectedCell!: (cell: Cell) => void
  @Mutation('SET_FATE_CELLS') mutationSetFateCells!: (cells: Cell[]) => void
  frameIndex = 0
  simulation: QuantumSimulation = new QuantumSimulation(Grid.emptyGrid())
  multiverseGraph: MultiverseGraph = new MultiverseGraph(this.simulation)
  error = ''
  playInterval = 0
  absorptionThreshold = 0.0001

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
   * Watch the current route and update level accordingly
   */
  @Watch('$route')
  changeLevel(): void {
    this.mutationSetCurrentLevelID(this.levelId)
    this.loadLevel(levels[this.levelId])
  }

  /** Reset simulation on selected cell change */
  @Watch('selectedCell')
  reloadSimulation(): void {
    this.updateSimulation()
  }

  /**
   * Decoupling the level loading and the route changing
   * Default to the route level
   */
  loadLevel(iLevel: ILevel = levels[this.levelId]): void {
    this.error = ''
    this.level = Level.importLevel(iLevel)
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
    this.mutationSetFateCells([this.simulation.fate])
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
   * Launch overlay if it's the last frame and the player has a game state set
   */
  get displayGameState(): string {
    if (this.frameIndex === this.simulation.frames.length - 1) {
      return this.gameState
    }
    return 'InProgress'
  }

  /**
   * Get fate from simulation random realization
   * Display on the last frame of simulation, death then fate
   */
  get displayFate(): Cell {
    if (this.frameIndex === this.simulation.frames.length - 1) {
      return this.fateCells[0]
    }
    return Cell.createDummy({ x: -1, y: -1 })
  }

  /**
   * Set the energized cells from the simulation
   */
  setEnergizedCells(): void {
    this.level.grid.resetEnergized()
    const coords = this.fateCells.map((fateCell) => {
      return fateCell.coord
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
  get framePercentage(): number {
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
   * Compute another fate for the simulation
   */
  computeNewFate(): void {
    const newFate = this.simulation.fate
    this.mutationSetFateCells([newFate])
    this.setEnergizedCells()
  }

  /**
   * Show previous frame and check it exists
   *  @returns frameIndex
   */
  rewind(): void {
    this.frameIndex = 0
  }

  /**
   * Show previous frame and check it exists
   *  @returns frameIndex
   */
  stepBack(): number {
    const newframeIndex = this.frameIndex - 1
    if (newframeIndex < 0) {
      console.error("Can't access frames before simulation...")
      return 0
    }
    this.frameIndex = newframeIndex
    return this.frameIndex
  }

  /**
   *  Reset frameIndex, flip it up for every frame,
   *  then clear the interval
   * @returns void
   */
  play(): void {
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
  stepForward(): number {
    const newframeIndex = this.frameIndex + 1
    if (newframeIndex > this.simulation.frames.length - 1) {
      console.error("Can't access frames that are not computed yet...")
      return this.simulation.frames.length - 1
    }
    this.frameIndex = newframeIndex
    return this.frameIndex
  }

  /**
   * Reload the current page
   */
  fastForward(): void {
    this.frameIndex = this.simulation.frames.length - 1
  }

  /**
   * Reload the current page
   */
  reload(): void {
    window.location.reload(false)
  }

  /**
   * Export the level in JSON format and uploads it
   * @returns level in JSON format
   */
  downloadLevel(): void {
    const json = JSON.stringify(this.level.exportLevelForDownload(), null, 2)
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

  removeFromCurrentTools(cell: Cell): void {
    this.level.toolbox.removeTool(cell)
  }

  addToCurrentTools(cell: Cell): void {
    this.level.toolbox.addTool(cell, this.activeCell)
  }

  setCurrentTools(cells: Cell[]): void {
    this.level.toolbox = new Toolbox(cells)
  }

  resetCurrentTools(): void {
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
    if (
      // handle moving from toolbox to grid
      this.activeCell.isFromToolbox &&
      cell.isFromGrid &&
      cell.isVoid
    ) {
      this.removeFromCurrentTools(this.activeCell)
    } else if (
      // handle moving from grid to toolbox
      this.activeCell.isFromGrid &&
      cell.isFromToolbox &&
      !this.activeCell.isVoid &&
      !cell.isVoid
    ) {
      this.addToCurrentTools(cell)
      this.level.grid.set(this.activeCell.reset())
    }
    // FIXME: unify moving logic
    this.level.grid.move(sourceCell, targetCell)
    // const mutatedCells = this.level.grid.move(sourceCell, targetCell)
    // mutatedCells.forEach((mutatedCell: Cell) => {
    //   this.level.grid.set(mutatedCell)
    // })
    this.saveLevelToStore()
    this.updateSimulation()
  }

  // Used to store in local storage the current state of the game
  saveLevelToStore(): void {
    const currentStateJSONString = JSON.stringify(this.level.exportLevel())
    localStorage.setItem(this.currentLevelName, currentStateJSONString)
  }

  clearLS(): void {
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

  get hints(): IHint[] {
    return this.level.hints.map((hint) => hint.exportHint())
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
  text-transform: uppercase;
  flex-direction: row;
  justify-content: center;
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
