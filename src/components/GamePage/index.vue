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
        <router-link :to="`/level/${parseInt(this.$route.params.id, 10) - 1}`">
          <img src="@/assets/prevIcon.svg" alt="Previous Level" width="32" />
        </router-link>
        {{ level.name.toUpperCase() }}
        <router-link :to="`/level/${parseInt(this.$route.params.id, 10) + 1}`">
          <img src="@/assets/nextIcon.svg" alt="Next Level" width="32" />
        </router-link>
      </h1>

      <!-- MAIN-LEFT -->
      <game-goals
        slot="main-left"
        :percentage="70"
        :goals="activeFrame.level.goals"
        :particles="activeFrame.quantum"
      />

      <!-- MAIN-MIDDLE -->
      <section slot="main-middle">
        <game-board :grid="activeLevel.grid" :photons="activeFrame.quantum" :hints="hints" />
        <game-controls
          :active-frame="activeFrame"
          :total-frames="frames.length"
          @step-back="showPrevious"
          @step-forward="showNext"
        />
      </section>

      <!-- MAIN-RIGHT -->
      <section slot="main-right">
        <game-toolbox :toolbox="level.toolbox" />
        <game-active-cell />
        <game-photons :active-frame="activeFrame" />
      </section>
    </game-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import cloneDeep from 'lodash.clonedeep';
import { Level, Frame, Particle, Cell, Coord, Element } from '@/engine/classes';
import {
  CellInterface,
  FrameInterface,
  LevelInterface,
  ParticleInterface,
  GoalInterface,
  HintInterface,
  GameState
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
  level: Level = Level.createDummy();
  levelI: LevelInterface = this.level.exportLevel();
  frameIndex: number = 0;
  frames: Frame[] = [];
  error: string = '';
  activeElement = '';
  @State activeLevel!: Level;
  grid = this.$store.state.activeLevel;

  // LIFECYCLE
  created() {
    this.loadLevel();
    window.addEventListener('keyup', this.handleArrowPress);
  }

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleArrowPress);
  }

  /**
   * Level loading and initialization
   * @returns boolean
   */
  @Watch('$route')
  loadLevel() {
    // Check for level existence
    this.error = '';
    const levelName = `level${parseInt(this.$route.params.id, 10)}`;
    const levelI: LevelInterface = levelData[levelName];
    if (!levelI) {
      this.error = 'No such exists!';
      return false;
    }
    // Process
    this.levelI = levelI;
    this.level = Level.importLevel(this.levelI);
    this.$store.commit('SET_CURRENT_TOOLS', this.level.toolbox.fullCellList);
    this.$store.commit('SET_ACTIVE_LEVEL', this.level);
    this.createFrames();
    return true;
  }

  /**
   * Compute frames until there are no more particles
   * @param max number of frames to compute before simulation stops
   */
  createFrames(max = 25): void {
    this.frames = [];
    this.frameIndex = 0;
    const initFrame = new Frame(this.level);
    this.frames.push(initFrame);
    this.frames.push(initFrame.next());
    for (let index = 0; index < max; index += 1) {
      const nextFrame = this.createNextFrame();
      if (nextFrame.quantum.length > 0) {
        this.frames.push(nextFrame);
      } else {
        break;
      }
    }
    this.frameIndex = 1;
  }

  /**
   * Compute the next frame
   * @returns Frame
   */
  createNextFrame(): Frame {
    const lastFrameCopy = cloneDeep(this.lastFrame);
    const nextFrame = lastFrameCopy.next();
    return nextFrame;
  }

  /**
   * Get the last computed frame
   */
  get lastFrame(): Frame {
    return this.frames[this.frames.length - 1];
  }

  /**
   * Get the current simulation frame
   */
  get activeFrame(): Frame {
    return this.frames[this.frameIndex];
  }

  /**
   * Show next frame and check it exists
   *  @returns frameIndex
   */
  showNext() {
    const newframeIndex = this.frameIndex + 1;
    if (newframeIndex > this.frames.length - 1) {
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

  get nextLevel(): string {
    return `/level/${parseInt(this.$route.params.id, 10) + 1}`;
  }

  get particles(): Particle[] {
    return this.activeFrame.quantum;
  }

  get probabilitySum(): number {
    let sum = 0;
    this.frames[this.frameIndex].quantum.forEach((particle: any) => {
      sum += particle.intensity;
    });
    return sum;
  }

  get gameState(): GameState {
    return this.activeFrame.gameState;
  }

  get hints(): HintInterface[] {
    return this.levelI.hints;
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
