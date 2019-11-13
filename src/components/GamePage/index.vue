<template>
  <div class="game">
    <!-- OVERLAY -->
    <app-overlay :game-state="computedGameState" @click.native="frameIndex = 0">
      <app-button>GO BACK</app-button>
      <router-link :to="nextLevel">
        <app-button>NEXT LEVEL</app-button>
      </router-link>
    </app-overlay>

    <!-- GENERAL LAYOUT -->
    <game-layout>
      <!-- HEADER-MIDDLE -->
      <h1 v-if="error" slot="header-middle" class="error">{{ error }}</h1>
      <h1 v-else slot="header-middle" class="title">
        <router-link :to="previousLevel">
          <img src="@/assets/prevIcon.svg" alt="Previous Level" width="32" />
        </router-link>
        {{ level.id + ' - ' + level.name.toUpperCase() }}

        <router-link :to="nextLevel">
          <img src="@/assets/nextIcon.svg" alt="Next Level" width="32" />
        </router-link>
      </h1>

      <!-- MAIN-LEFT -->
      <section slot="main-left">
        <game-goals
          :percentage="percentage"
          :goals="level.goals"
          :particles="activeFrame.particles"
          :detections="detections"
          :mines="mineCount"
        />
        <game-multiverse-horizontal
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
          :hints="hints"
          :grid="level.grid"
          :probabilities="probabilities"
          @updateSimulation="updateSimulation"
          @updateCell="updateCell"
        />
        <game-controls
          :frame-index="frameIndex"
          :total-frames="simulation.frames.length"
          @step-back="showPrevious"
          @step-forward="showNext"
          @play="play"
        >
          <app-button @click.native="handleSave">exportLevel</app-button>
        </game-controls>
        <!-- <game-multiverse-horizontal
          :multiverse="multiverseGraph"
          :active-id="frameIndex"
          @changeActiveFrame="handleChangeActiveFrame"
        /> -->
        <game-ket :frame="activeFrame" :grid="level.grid" />
      </section>

      <!-- MAIN-RIGHT -->
      <section slot="main-right">
        <game-toolbox :toolbox="toolbox" @updateCell="updateCell" />
        <game-active-cell />
        <game-photons :particles="activeFrame.particles" />
      </section>
    </game-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import cloneDeep from 'lodash.clonedeep';
import { local } from 'd3-selection';
import { warn } from 'vue-class-component/lib/util';
import { Level, Particle, Cell, Coord, Element, Grid, Goal } from '@/engine/classes';
import Toolbox from '@/engine/Toolbox';
import MultiverseGraph from '@/engine/MultiverseGraph';
import QuantumFrame from '@/engine/QuantumFrame';
import QuantumSimulation from '@/engine/QuantumSimulation';
import {
  CellInterface,
  LevelInterface,
  ParticleInterface,
  GoalInterface,
  HintInterface,
  GameState,
  GridInterface
} from '@/engine/interfaces';
import levelData from '@/assets/data/levels';
import GameGoals from '@/components/GamePage/GameGoals.vue';
import GameActiveCell from '@/components/GamePage/GameActiveCell.vue';
import GameToolbox from '@/components/GamePage/GameToolbox.vue';
import GameControls from '@/components/GamePage/GameControls.vue';
import GamePhotons from '@/components/GamePage/GamePhotons.vue';
import GameKet from '@/components/GamePage/GameKet.vue';
import GameLayout from '@/components/GamePage/GameLayout.vue';
import GameBoard from '@/components/Board/index.vue';
import GameMultiverse from '@/components/GamePage/GameMultiverse.vue';
import GameMultiverseHorizontal from '@/components/GamePage/GameMultiverseHorizontal.vue';
import AppButton from '@/components/AppButton.vue';
import AppOverlay from '@/components/AppOverlay.vue';

@Component({
  components: {
    GameLayout,
    GamePhotons,
    GameKet,
    GameGoals,
    GameActiveCell,
    GameToolbox,
    GameMultiverse,
    GameMultiverseHorizontal,
    GameControls,
    GameBoard,
    AppButton,
    AppOverlay
  }
})
export default class Game extends Vue {
  level = Level.createDummy();
  @State('currentLevelID') currentLevelID!: number;
  @State('activeCell') activeCell!: Cell;
  @State('gameState') gameState!: string;
  @Mutation('SET_CURRENT_LEVEL_ID') mutationSetCurrentLevelID!: (id: number) => void;
  @Mutation('SET_GAME_STATE') mutationSetGameState!: (gameState: string) => void;
  @Mutation('SET_SIMULATION_STATE') mutationSetSimulationState!: (simulationState: boolean) => void;
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void;
  frameIndex: number = 0;
  simulation: any = {};
  multiverseGraph: any = {};
  error: string = '';
  playInterval: number = 0;
  absorptionThreshold: number = 0.0001;

  // LIFECYCLE
  created() {
    this.loadLevel();
    window.addEventListener('keyup', this.handleArrowPress);
  }

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleArrowPress);
  }

  handleSave() {
    const json = JSON.stringify(this.level.exportLevel(), null, 2);
    const blob = new Blob([json], { type: 'octet/stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'level.json';
    link.click();
  }

  handleChangeActiveFrame(activeId: number) {
    this.frameIndex = activeId;
  }

  get levelId() {
    // if missing then fallback to '0' for infinity level / sandbox
    return parseInt(this.$route.params.id || '0', 10);
  }

  @Watch('$route')
  loadLevel(): void {
    this.error = '';
    this.mutationSetCurrentLevelID(this.levelId);
    const levelI = levelData[`level${this.levelId}`];
    this.level = Level.importLevel(levelI);
    this.mutationSetGameState('InProgress');
    // console.log(this.level.toolbox.uniqueCellList);

    if (this.level.toolbox.uniqueCellList.length > 0) {
      this.mutationSetHoveredCell(this.level.toolbox.uniqueCellList[0]);
    }
    this.updateSimulation();
  }

  /**
   * Level loading and initialization
   * @returns boolean
   */
  updateSimulation(): void {
    this.simulation = QuantumSimulation.importBoard(this.level.exportLevel().grid);
    this.simulation.initializeFromLaser('H');
    this.simulation.nextFrames(30);
    this.multiverseGraph = new MultiverseGraph(this.simulation);
    this.frameIndex = 0;
    this.level.grid.resetEnergized();
    this.mutationSetSimulationState(false);
  }

  /**
   * Output cells linked to detection events
   * @returns Cell and percentage
   */

  get detections(): { cell: Cell; probability: number }[] {
    interface probabilityCellInterface {
      cell: Cell;
      probability: number;
    }
    // Filter out of grid cells
    const absorptions = this.simulation.totalAbsorptionPerTile.filter(
      (absorption: { x: number; probability: number }) => {
        return absorption.x !== -1 && absorption.probability > this.absorptionThreshold;
      }
    );
    // Convert to cells format
    const detections: probabilityCellInterface[] = absorptions.map(
      (absorption: { x: number; y: number; probability: number }) => {
        const coord = new Coord(absorption.y, absorption.x);
        const cell = this.level.grid.get(coord);
        cell.energized = true;
        return { cell, probability: absorption.probability };
      }
    );
    return detections;
  }

  /**
   * Process the goals from level with the results of the quantum simulation
   *  @returns goals
   */
  get probabilities() {
    const absorptions = this.simulation.totalAbsorptionPerTile.filter(
      (absorption: { x: number }) => {
        return absorption.x !== -1;
      }
    );
    return absorptions;
  }

  /**
   * Get the total number of the mines of the level
   * @returns number of mines in the level
   */
  get mineCount() {
    return this.level.grid.mines.cells.length;
  }

  /**
   * Process the goals from level with the results of the quantum simulation
   *  @returns goals
   */
  get framePercentage() {
    return this.activeFrame.probability * 100;
  }

  /**
   * Compute the total absorption at goals
   * @returns total absorption
   */
  get percentage() {
    let sum = 0;
    this.detections.forEach((detection) => {
      this.level.goals.forEach((goal: Goal) => {
        if (goal.coord.equal(detection.cell.coord)) {
          sum += detection.probability;
        }
      });
    });
    return sum * 100;
  }

  /**
   * compute paths for quantum laser paths
   * @returns individual paths
   */
  get pathParticles(): string[] {
    return this.simulation.allParticles;
  }

  /**
   * Get the current simulation frame
   */
  get activeFrame(): QuantumFrame {
    return this.simulation.frames[this.frameIndex];
  }

  /**
   * Current simulation frame particles
   */
  get particles(): Particle[] {
    return this.activeFrame.particles;
  }

  /**
   *  Reset frameIndex, flip it up for every frame,
   *  then clear the interval
   * @returns void
   */
  play() {
    this.frameIndex = 0;
    this.playInterval = setInterval(() => {
      if (this.frameIndex < this.simulation.frames.length - 1) {
        this.frameIndex += 1;
      } else {
        this.$store.commit('SET_SIMULATION_STATE', false);
        clearInterval(this.playInterval);
      }
    }, 200);
    this.$store.commit('SET_SIMULATION_STATE', true);
  }

  /**
   * Launch overlay if it's the last frame and the player has a game state set
   */
  get computedGameState() {
    if (this.frameIndex === this.simulation.frames.length - 1) {
      return this.gameState;
    }
    return 'InProgress';
  }

  /**
   * Show next frame and check it exists
   *  @returns frameIndex
   */
  showNext() {
    const newframeIndex = this.frameIndex + 1;
    if (newframeIndex > this.simulation.frames.length - 1) {
      console.error("Can't access frames that are not computed yet...");
      return false;
    }
    this.frameIndex = newframeIndex;
    return this.frameIndex;
  }

  /**
   * Show previous frame and check it exists
   *  @returns frameIndex
   */
  showPrevious() {
    const newframeIndex = this.frameIndex - 1;
    if (newframeIndex < 0) {
      console.error("Can't access frames before simulation...");
      return false;
    }
    this.frameIndex = newframeIndex;
    return this.frameIndex;
  }

  /**
   * Left and right keys to see frames
   */
  handleArrowPress(e: { keyCode: number }): void {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 81:
        this.level.grid.moveAll(180);
        break;
      case 68:
        this.level.grid.moveAll(0);
        break;
      case 90:
        this.level.grid.moveAll(90);
        break;
      case 83:
        this.level.grid.moveAll(270);
        break;
      case 65:
        this.level.grid.rotateAll();
        break;
      case 37:
        this.showPrevious();
        break;
      case 39:
        this.showNext();
        break;
      default:
        break;
    }
  }

  removeFromCurrentTools(cell: Cell) {
    this.level.toolbox.removeTool(cell);
  }

  addToCurrentTools(cell: Cell) {
    this.level.toolbox.addTool(cell);
  }

  setCurrentTools(cells: Cell[]) {
    this.level.toolbox = new Toolbox(cells);
  }

  resetCurrentTools() {
    this.level.toolbox.reset();
  }

  /**
   * the main level grid state updating method
   * checks the updated cell details, compares them
   * with the active cell and proceeds accordingly
   * @param cell
   * @returns void
   */
  updateCell(cell: Cell): void {
    const sourceCell = this.activeCell;
    const targetCell = cell;

    // handle moving from from / to toolbox
    if (this.activeCell.isFromToolbox) {
      this.removeFromCurrentTools(this.activeCell);
    } else if (this.activeCell.isFromGrid && cell.isFromToolbox) {
      this.addToCurrentTools(cell);
      this.level.grid.set(this.activeCell.reset());
    }

    const mutatedCells: Cell[] = this.level.grid.move(sourceCell, targetCell);
    mutatedCells.forEach((mutatedCell: Cell) => {
      this.level.grid.set(mutatedCell);
    });
    this.saveLevelToStore();
    this.updateSimulation();
  }

  saveLevelToStore() {
    // console.error(this.cellPositionsArray);
    const currentStateJSONString = JSON.stringify(this.level.exportLevel());
    localStorage.setItem(this.currentLevelName, currentStateJSONString);
  }

  clearLS() {
    // console.error(localStorage.getItem(this.$route.params.id));
    localStorage.removeItem(this.currentLevelName);
  }

  saveLS() {
    const currentStateJSONString = JSON.stringify(this.level.exportLevel());
    localStorage.setItem(this.currentLevelName, currentStateJSONString);
  }

  // GETTERS
  get currentLevelName(): string {
    return `level${this.levelId}`;
  }

  get previousLevel(): string {
    return `/level/${this.levelId - 1}`;
  }

  get nextLevel(): string {
    return `/level/${this.levelId + 1}`;
  }

  get hints(): HintInterface[] {
    return this.level.hints.map((hint) => hint.exportHint());
  }

  get toolbox() {
    return this.level.toolbox;
  }

  get cellPositionsArray() {
    const array: number[] = [];
    this.level.grid.cells
      .filter((cell) => {
        return cell.element.name !== 'Void';
      })
      .map((cell) => {
        array.push(cell.coord.x);
        array.push(cell.coord.y);
        return cell;
      });
    return array;
  }
}
</script>

<style lang="scss" scoped>
h1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title {
  margin-bottom: 30;
  margin-top: 0;
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
