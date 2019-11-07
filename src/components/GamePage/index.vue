<template>
  <div class="game">
    <!-- OVERLAY -->
    <app-overlay :game-state="gameState" @click.native="frameIndex = 0">
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
      <game-goals
        slot="main-left"
        :percentage="percentage"
        :goals="level.goals"
        :particles="activeFrame.particles"
        :detections="detections"
        :mines="mineCount"
        @gameState="displayOverlay"
      />

      <!-- MAIN-MIDDLE -->
      <section slot="main-middle">
        <game-board
          :particles="particles"
          :hints="hints"
          :paths="paths"
          :probabilities="probabilities"
          @updateSimulation="updateSimulation"
        />
        <game-controls
          :frame-index="frameIndex"
          :total-frames="simulation.frames.length"
          @step-back="showPrevious"
          @step-forward="showNext"
          @play="play"
        />
        <game-ket :frame="activeFrame" />
      </section>

      <!-- MAIN-RIGHT -->
      <section slot="main-right">
        <game-toolbox :toolbox="level.toolbox" />
        <game-active-cell />
        <game-photons :particles="activeFrame.particles" />
      </section>
    </game-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Mutation, State, Getter } from 'vuex-class';
import cloneDeep from 'lodash.clonedeep';
import { Level, Particle, Cell, Coord, Element, Goal } from '@/engine/classes';
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
    GameControls,
    GameBoard,
    AppButton,
    AppOverlay
  }
})
export default class Game extends Vue {
  @State level!: Level;
  @State gameState!: GameState;
  frameIndex: number = 0;
  simulation: any = {};
  multiverseGraph: any = {};
  error: string = '';
  playInterval: number = 0;

  // LIFECYCLE
  created() {
    this.loadLevelFromRoute();
    this.updateSimulation();
    window.addEventListener('keyup', this.handleArrowPress);
  }

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleArrowPress);
  }

  displayOverlay() {}

  /**
   * Used to load level from route
   */
  @Watch('$route')
  loadLevelFromRoute(): void {
    this.error = '';
    const levelName = `level${parseInt(this.$route.params.id, 10)}`;
    const levelI: LevelInterface = levelData[levelName];
    if (!levelI) {
      this.error = 'No such exists!';
    }
    const level = Level.importLevel(levelI);
    this.$store.commit('SET_CURRENT_TOOLS', this.level.toolbox.fullCellList);
    this.$store.commit('SET_GAME_STATE', GameState.Initial);
    this.$store.commit('SET_ACTIVE_LEVEL', level);
    this.updateSimulation();
  }

  /**
   * Level loading and initialization
   * @returns boolean
   */
  updateSimulation(): void {
    this.simulation = QuantumSimulation.importBoard(this.level.exportLevel().grid);
    this.simulation.initializeFromLaser('V');
    this.simulation.nextFrames(30);
    this.multiverseGraph = new MultiverseGraph(this.simulation);
    this.frameIndex = 0;
    // console.log(this.multiverseGraph.graph.edges());
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
      (absorption: { x: number }) => {
        return absorption.x !== -1;
      }
    );
    // Convert to cells format
    const detections: probabilityCellInterface[] = absorptions.map(
      (absorption: { x: number; y: number; probability: number }) => {
        const coord = new Coord(absorption.y, absorption.x);
        const cell = this.level.grid.get(coord);
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
    // console.log(`FRAME %: ${this.activeFrame.probability}`);
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
  get paths(): string[] {
    return this.simulation.allParticles.map((particle: Particle) => {
      return particle.toSvg();
    });
  }

  /**
   * Get the current simulation frame
   */
  get activeFrame(): QuantumFrame {
    return this.simulation.frames[this.frameIndex];
  }

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
        clearInterval(this.playInterval);
      }
    }, 200);
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
    switch (e.keyCode) {
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

  // GETTERS
  get currentLevelName(): string {
    return `level${parseInt(this.$route.params.id, 10)}`;
  }

  get previousLevel(): string {
    return `/level/${parseInt(this.$route.params.id, 10) - 1}`;
  }

  get nextLevel(): string {
    return `/level/${parseInt(this.$route.params.id, 10) + 1}`;
  }

  /** Need to be computed from simulation post-processing */
  // get gameState(): GameState {
  //   return this.gameState;
  // }

  get hints(): HintInterface[] {
    return this.level.hints.map((hint) => hint.exportHint());
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
