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
      <!-- INNER DONUT -->
      <div :class="computeProbabilityClass">
        <div class="inner-circle">{{ tweenedPercent.toFixed(2) }}%</div>
        <div>PROBABILITY</div>
      </div>
    </vc-donut>

    <!-- GOAL PERCENTAGE -->
    <div class="goalPercentage">
      <div class="mobile_progressBar">
        <div class="mobile_progressBarFill" :style="{width: (gameState.totalGoal + '%')}"></div>
      </div>
      <div>Goal: {{ gameState.totalGoal }} %</div>
    </div>

    <!-- GOALS -->
    <div v-if="gameState.goals.length > 0" :class="computeGoalClass">
      <span
        v-for="(goal, index) in gameState.goalsHit.length"
        :key="'detectorh' + index"
        class="hit"
      >
        <img src="@/assets/graphics/icons/detectorFull.svg" width="30" />
      </span>
      <span v-for="(goal, index) in gameState.goalsUnhit" :key="'detectoru' + index" class="unhit">
        <img src="@/assets/graphics/icons/detectorEmpty.svg" width="30" />
      </span>
      <div>
        <span>
          <b>DETECTORS</b>
        </span>
      </div>
    </div>

    <!-- MINES -->
    <div v-if="gameState.mines.length > 0" :class="computeSafeClass">
      <span v-for="(mine, index) in gameState.minesHit.length" :key="'mineh' + index" class="hit">
        <img src="@/assets/graphics/icons/mineFull.svg" width="34" />
      </span>
      <span v-for="(mine, index) in gameState.minesUnhit" :key="'mineu' + index" class="unhit">
        <img src="@/assets/graphics/icons/mineEmpty.svg" width="34" />
      </span>
      <div>
        <span v-if="gameState.safeFlag" class="success">
          <b>SAFE</b>
        </span>
        <span v-else class="defeat">
          <b>DANGER!</b>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import { Tween, update as updateTween } from 'es6-tween';
import { GameStateEnum } from '@/engine/interfaces';
import Cell from '@/engine/Cell';
import Goal from '@/engine/Goal';
import GameState from '@/engine/GameState';
import AppCell from '@/components/Board/AppCell.vue';
import Game from '@/components/GamePage/index.vue';

@Component({
  components: {
    AppCell
  }
})
export default class GameGoals extends Vue {
  @Prop() readonly gameState!: GameState;
  @Prop() readonly percentage!: number;
  tweenedPercent: number = this.gameState.totalAbsorption;
  width = 100;

  /**
   * Compute success or failure class from the gameState flags
   */
  get computeProbabilityClass(): string {
    return this.gameState.probabilityFlag ? 'success' : 'defeat';
  }
  get computeGoalClass(): string[] {
    return [this.gameState.goalFlag ? 'success' : 'defeat', 'bottom-icons'];
  }
  get computeSafeClass(): string[] {
    return [this.gameState.safeFlag ? 'success' : 'defeat', 'bottom-icons'];
  }

  /**
   * Computes donut slices
   * @returns list of slices with colors
   */
  get sections(): { value: number; color: string }[] {
    return [
      { value: 100 - this.tweenedPercent, color: '#210235' },
      { value: this.tweenedPercent, color: '#5D00D5' }
    ];
  }

  /**
   * Create the donut animation tween
   * @param time tween time
   */
  animateTween(time: number): void {
    const id = requestAnimationFrame(this.animateTween);
    const result = updateTween(time);
    if (!result) cancelAnimationFrame(id);
  }

  /**
   * Animate donut increase / decrease on gameState change
   */
  @Watch('percentage')
  onPercentChanged(val: number, oldVal: number): void {
    new Tween({ value: oldVal })
      .to({ value: val }, 500)
      .on('update', ({ value }: { value: number }) => {
        this.tweenedPercent = value;
      })
      .start();
    requestAnimationFrame(this.animateTween);
  }
}
</script>

<style lang="scss" scoped>
.goals-wrapper {
  padding-top: 10px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1000px) {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 5px;
  }
  & .upper-icons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  & .bottom-icons {
    line-height: 150%;
    padding: 10px;
    @media screen and (max-width: 1000px) {
      line-height: 75%;
      div {
        display: none;
      }
      img {
        width: 4vw !important;
      }
    }
  }
  & .chart {
    margin-bottom: 1rem;
    position: relative;

    & div.inner-circle {
      font-size: 2rem;
    }

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
.goalPercentage {
  font-size: 0.8rem;
  margin-bottom: 2rem;
  position: relative;
  @media screen and (max-width: 1000px) {
    margin-bottom: 0;
    div:last-child {
      text-shadow: 1px 1px 1px black;
      z-index: 2;
      position: relative;
      top: 0;
      left: 0;
    }
    .mobile_progressBar {
      position: absolute;
      width: 110%;
      height: 14px;
      border: 1px solid limegreen;
      border-radius: 4px;
      top: 0;
      left: -5%;
      z-index: 1;

    }
    .mobile_progressBarFill {
      position: absolute;
      width: 0%;
      height: 14px;
      background-color: limegreen;
      border-radius: 4px;
      top: 0;
      left: 0;
      transition: width 1s ease-in-out;
      z-index: 1;
    }
  }
}
.defeat {
  color: white;
  opacity: 0.9;
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
