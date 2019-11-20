<template>
  <div ref="goals" class="goals-wrapper">
    <!-- DONUT -->
    <vc-donut
      class="chart"
      background="#210235"
      foreground="inherit"
      unit="px"
      :size="148"
      :thickness="5"
      :total="100"
      :sections="sections"
      :start-angle="0"
    >
      <!-- PROBABILITY -->
      <div :class="gameStateClass">
        <div class="inner-circle">{{ tweenedPercent.toFixed(2) }}%</div>
        <div>PROBABILITY</div>
      </div>
    </vc-donut>
    <div class="temp">
      <div>Goal: {{ totalGoalPercentage }} %</div>
    </div>

    <!-- GOALS -->
    <div v-if="goals.length > 0" class="bottom-icons">
      <span v-for="(goal, index) in detectorsHit" :key="'detectorh' + index" class="hit">
        <img src="@/assets/graphics/detectorIconRed.svg" alt="Key Icon" width="30" />
      </span>
      <span v-for="(goal, index) in detectorsUnhit" :key="'detectoru' + index" class="unhit">
        <img src="@/assets/graphics/detectorIconGreen.svg" alt="Key Icon" width="30" />
      </span>
      <div>
        <span v-if="detectorsHit !== goals.length" class="defeat">
          <b>DETECTORS</b>
        </span>
        <span v-else class="success"><b>DETECTORS</b></span>
      </div>
    </div>

    <!-- MINES -->
    <div v-if="mines > 0" class="bottom-icons">
      <span v-for="(mine, index) in minesHit" :key="'mineh' + index" class="hit">
        <img src="@/assets/graphics/mineIconRed.svg" alt="Key Icon" width="34" />
      </span>
      <span v-for="(mine, index) in minesUnhit" :key="'mineu' + index" class="unhit">
        <img src="@/assets/graphics/mineIconEmpty.svg" alt="Key Icon" width="34" />
      </span>
      <div>
        <span v-if="minesHit > 0" class="defeat">
          <b>DANGER!</b>
        </span>
        <span v-else class="success"><b>SAFE</b></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import { Tween, update as updateTween } from 'es6-tween';
import { GameState } from '@/engine/interfaces';
import Cell from '@/engine/Cell';
import Goal from '@/engine/Goal';
import AppCell from '@/components/Board/AppCell.vue';
import Game from './index.vue';

@Component({
  components: {
    AppCell
  }
})
export default class GameGoals extends Vue {
  @Prop() readonly detectors!: number;
  @Prop() readonly mines!: number;
  @Prop() readonly detections!: { cell: Cell; probability: number }[];
  @Prop() readonly goals!: any;
  @Prop() readonly percentage!: number;
  @Mutation('SET_GAME_STATE') mutationSetGameState!: (state: GameState) => void;
  tweenedPercent: number = this.percentage;
  width = 100;

  /**
   * Compute game state and sets Vuex
   */
  computeGameState() {
    let probabilityFlag = false;
    let goalFlag = false;
    let safeFlag = false;
    // Compute the current detection probability and compare it to goals
    if (this.percentage >= this.totalGoalPercentage) {
      probabilityFlag = true;
    }
    // Check that the current goals are met
    if (this.detectorsUnhit === 0) {
      goalFlag = true;
    }
    // Check that no mines are hit so it's safe
    if (this.minesHit === 0) {
      safeFlag = true;
    }

    if (!safeFlag) {
      this.mutationSetGameState(GameState.MineExploded);
      this.$emit('gameState', GameState.MineExploded);
      return;
    }
    if ((!goalFlag && probabilityFlag) || (goalFlag && !probabilityFlag)) {
      this.mutationSetGameState(GameState.InProgress);
      this.$emit('gameState', GameState.InProgress);
    }
    if (probabilityFlag && goalFlag && safeFlag) {
      this.mutationSetGameState(GameState.Victory);
      this.$emit('gameState', GameState.Victory);
    }
  }

  /**
   * Process the detection events and select the detectors
   * @returns hit detector count
   */
  get detectorsHit(): number {
    const detectorDetected = this.detections.filter((detection) => {
      return detection.cell.isDetector;
    });
    return detectorDetected.length;
  }

  /**
   * Process the detection events and select the detectors
   * @returns hit detector count
   */
  get detectorsUnhit(): number {
    return this.goals.length - this.detectorsHit;
  }

  /**
   * Process the detection events and select the mines
   * @returns hit mines count
   */
  get minesHit(): number {
    const minesDetected = this.detections.filter((detection) => {
      return detection.cell.element.name === 'Mine';
    });
    return minesDetected.length;
  }

  /**
   * Process the detection events and select the detectors
   * @returns hit detector count
   */
  get minesUnhit(): number {
    return this.mines - this.minesHit;
  }

  /**
   * Compute the total absorption at goals
   * @returns total absorption
   */
  get updatePercentage() {
    let sum = 0;
    this.detections.forEach((detection) => {
      this.goals.forEach((goal: Goal) => {
        if (goal.coord.equal(detection.cell.coord)) {
          sum += detection.probability;
        }
      });
    });
    return sum;
  }

  /**
   * Total goal percentage
   * @returns sum of goal threshold
   */
  get totalGoalPercentage() {
    let sum = 0;
    this.goals.forEach((goal: Goal) => {
      sum += goal.threshold;
    });
    return sum * 100;
  }

  /**
   * Total goal percentage
   * @returns sum of goal threshold
   */
  get unavailableGoalPercentage() {
    return 100 - this.totalGoalPercentage;
  }

  /**
   * @param time tween time
   */
  animateTween(time: number): void {
    const id = requestAnimationFrame(this.animateTween);
    const result = updateTween(time);
    if (!result) cancelAnimationFrame(id);
  }

  /**
   * Computes donut slices
   * @returns list of slices with colors
   * FIXME: See level 7 problem
   */
  get sections() {
    return [
      { value: 100 - this.tweenedPercent, color: '#210235' },
      { value: this.tweenedPercent, color: '#5D00D5' }
    ];
  }

  get gameStateClass() {
    return this.percentage >= this.totalGoalPercentage ? 'success' : 'defeat';
  }

  @Watch('percentage')
  onPercentChanged(val: number, oldVal: number) {
    new Tween({ value: oldVal })
      .to({ value: val }, 500)
      .on('update', ({ value }: { value: number }) => {
        this.tweenedPercent = value;
      })
      .start();
    requestAnimationFrame(this.animateTween);
    this.computeGameState();
  }
}
</script>

<style lang="scss" scoped>
.goals-wrapper {
  // BORDER-TOP TURNED ON WHEN THERE ARE UPPER ICONS
  //border-top: 1px solid white;
  padding-top: 10px;
  padding-bottom: 20px;
  //border-bottom: 1px solid white;
  width: 100%;
  // height: 320px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1000px) {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  & .upper-icons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //justify-content: left;
    margin-bottom: 2rem;
  }
  & .bottom-icons {
    line-height: 150%;
    padding: 10px;
    @media screen and (max-width: 1000px) {
      line-height: 75%;
      img {
        width: 4vw !important;
      }
    }
  }
  & .chart {
    & div.inner-circle {
      font-size: 2rem;
    }
    margin-bottom: 1rem;

    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 155px;
      height: 155px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
    }
  }

  & .btn-fake {
    border: 1px solid;
    width: 50%;
    margin: 0 auto 50px;
    padding: 10px;
    cursor: pointer;
  }
}
.detection {
  width: 100%;
  max-height: 64px;
  .counter {
    fill: white;
    stroke: white;
    text-anchor: middle;
  }
}
.temp {
  font-size: 0.8rem;
  margin-bottom: 2rem;
  @media screen and (max-width: 1000px) {
    margin-bottom: 0;
  }
}
.defeat {
  color: white;
  //opacity: 0.2;
  @media screen and (max-width: 1000px) {
    b {
      font-size: calc(8px + 4 * ((100vw - 320px) / 680));
    }
  }
}
.success {
  color: white;
  @media screen and (max-width: 1000px) {
    b {
      font-size: calc(8px + 4 * ((100vw - 320px) / 680));
    }
  }
}

.cdc-container {
  @media screen and (max-width: 1000px) {
    display: none;
  }
}

.results_simple {
  display: none;
  @media screen and (max-width: 1000px) {
    display: flex;
    align-items: center;
  }
}
</style>
