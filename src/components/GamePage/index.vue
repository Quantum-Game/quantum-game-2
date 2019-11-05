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
        :percentage="70"
        :goals="level.goals"
        :particles="activeFrame.particles"
      />

      <!-- MAIN-MIDDLE -->
      <section slot="main-middle">
        <game-board :particles="particles" :hints="hints" @updateSimulation="updateSimulation" />
        <game-controls
          :frame-index="frameIndex"
          :total-frames="simulation.frames.length"
          @step-back="showPrevious"
          @step-forward="showNext"
        />
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
import { Level, Frame, Particle, Cell, Coord, Element } from '@/engine/classes';
import QuantumFrame from '@/engine/QuantumFrame';
import QuantumSimulation from '@/engine/QuantumSimulation';
import {
  CellInterface,
  FrameInterface,
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
import GameLayout from '@/components/GamePage/GameLayout.vue';
import GameBoard from '@/components/Board/index.vue';
import AppButton from '@/components/AppButton.vue';
import AppOverlay from '@/components/AppOverlay.vue';

@Component({
  components: {
    GameLayout,
    GamePhotons,
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
  frameIndex: number = 0;
  simulation: any = {};
  error: string = '';

  // LIFECYCLE
  created() {
    this.loadLevelFromRoute();
    this.updateSimulation();
    window.addEventListener('keyup', this.handleArrowPress);
  }

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleArrowPress);
  }

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
    this.$store.commit('SET_ACTIVE_LEVEL', level);
    this.updateSimulation();
  }

  /**
   * Level loading and initialization
   * @returns boolean
   */
  updateSimulation() {
    console.log('FIRE');
    this.simulation = QuantumSimulation.importBoard(this.level.exportLevel().grid);
    this.simulation.initializeFromLaser('V');
    this.simulation.nextFrames(20);
    this.frameIndex = 0;
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
  get gameState(): GameState {
    return GameState.InProgress;
  }

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
