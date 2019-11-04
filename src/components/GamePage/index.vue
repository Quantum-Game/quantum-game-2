<template>
  <div class="game">
    <!-- OVERLAY -->
    <app-overlay :game-state="gameState" @click.native="frameNumber = 0">
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
        <game-board :grid="level.grid" :photons="activeFrame.quantum" :hints="hints" />
        <game-controls
          :active-frame="activeFrame"
          :total-frames="frames.length"
          @step-back="showPrevious"
          @step-forward="showNext"
        />
      </section>

      <!-- MAIN-RIGHT -->
      <section slot="main-right">
        <game-toolbox :tools="toolboxElements" />
        <game-active-cell />
        <game-photons :active-frame="activeFrame" />
      </section>
    </game-layout>
  </div>
</template>

<script lang="ts">
import cloneDeep from 'lodash.clonedeep';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Level, Frame, Particle, Cell, Coord, Element } from '@/engine/classes';
import {
  CellInterface,
  FrameInterface,
  LevelInterface,
  ParticleInterface,
  GoalInterface
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

const emptyLevelObj = {
  id: 0,
  name: 'default',
  group: 'default',
  description: 'default level',
  grid: {
    cols: 2,
    rows: 2,
    cells: [
      {
        coord: {
          x: 1,
          y: 1
        },
        element: 'Void',
        rotation: 0,
        frozen: false
      }
    ]
  },
  goals: [],
  hints: []
};

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
  // Level interface and instance
  levelObj: LevelInterface = emptyLevelObj;
  level: Level = Level.importLevel(this.levelObj);
  frameNumber: number = 0;
  frames: Frame[] = [];
  toolbox = [];
  error: string = '';
  activeElement = '';

  // LIFECYCLE
  created() {
    this.loadALevel();
    window.addEventListener('keyup', this.handleArrowPress);
  }

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleArrowPress);
  }

  // LEVEL LOADING
  @Watch('$route')
  loadALevel() {
    this.error = '';
    // See if there's such level:
    const levelObjToLoad: LevelInterface = levelData[this.currentLevelName];
    if (!levelObjToLoad) {
      this.error = 'no such level!';
      return false;
    }
    this.levelObj = levelObjToLoad;
    this.level = Level.importLevel(levelObjToLoad);
    this.setupInitFrame();
    this.createFrames();
    this.setUpToolboxElements();
    return true;
  }

  setupInitFrame() {
    this.frames = [];
    this.frameNumber = 0;
    this.level = Level.importLevel(this.levelObj);
    const initFrame = new Frame(this.level);
    this.frames.push(initFrame);
  }

  // FRAME CONTROL
  // TODO: Find the correct amount of frames to compute for the simulation
  createFrames(number = 25) {
    for (let index = 0; index < number; index += 1) {
      const lastFrameCopy = cloneDeep(this.lastFrame);
      const nextFrame = lastFrameCopy.next();
      this.frames.push(nextFrame);
    }
  }

  get activeFrame() {
    return this.frames[this.frameNumber];
  }

  get lastFrame() {
    return this.frames[this.frames.length - 1];
  }

  createNextFrame() {
    const lastFrameCopy = cloneDeep(this.lastFrame);
    const nextFrame = lastFrameCopy.next();
    this.frames.push(nextFrame);
  }

  showNext() {
    const newFrameNumber = this.frameNumber + 1;
    if (newFrameNumber > this.frames.length - 1) {
      console.error("Can't access frames that are not computed yet...");
      return false;
    }
    this.frameNumber = newFrameNumber;
    return this.frameNumber;
  }

  showPrevious() {
    const newFrameNumber = this.frameNumber - 1;
    if (newFrameNumber < 0) {
      console.error("Can't access frames before simulation...");
      return false;
    }
    this.frameNumber = newFrameNumber;
    return this.frameNumber;
  }

  handleArrowPress(e: { keyCode: number }): void {
    // console.debug(e.keyCode);
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

  setUpToolboxElements(): void {
    /*  sorry Philippe
        return this.level.grid.unfrozen.cells.map((cell: any) => cell.exportCell());
        PLEASE MAKE SURE THAT ROUTE CHANGE ALLOWS FOR AUTOMATIC TOOLBOX PROCESSING
    */
    const arrayOfUnfrozenCells = this.level.grid.cells.filter((cell: Cell) => {
      if (cell.element.name !== 'Void' && !cell.frozen) {
        return cell;
      }
      return false;
    });
    this.$store.commit('SET_CURRENT_TOOLS', cloneDeep(arrayOfUnfrozenCells));

    arrayOfUnfrozenCells.map((cell: Cell) => {
      const element = Element.fromName('Void');
      cell.element = element;
      cell.rotation = 0;
      return cell;
    });
  }

  get toolboxElements() {
    return this.$store.state.currentTools;
  }

  // GETTERS
  get currentLevelName() {
    return `level${parseInt(this.$route.params.id, 10)}`;
  }

  get levelLoaded(): boolean {
    return this.level && this.level.grid.cols !== 0;
  }

  get particles(): Particle[] {
    return this.frames[this.frameNumber].quantum;
  }

  get probabilitySum(): number {
    let sum = 0;
    this.frames[this.frameNumber].quantum.forEach((particle: any) => {
      sum += particle.intensity;
    });
    return sum;
  }

  get gameState() {
    return this.activeFrame.gameState;
  }

  get nextLevel() {
    return `/level/${parseInt(this.$route.params.id, 10) + 1}`;
  }

  get hints() {
    return this.levelObj.hints;
  }
}
</script>

<style lang="scss" scoped>
h1 {
  //color:crimson;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title {
  margin-bottom: 30;
  margin-top: 0;
}

.game {
  width: 100%;
  min-height: 100vh;
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
