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
      <div>Goal: {{ totalGoal }} %</div>
    </div>

    <!-- GOALS -->
    <div v-if="gameState.goals.length > 0" class="bottom-icons">
      <span v-for="(goal, index) in goalsHit" :key="'detectorh' + index" class="hit">
        <img src="@/assets/graphics/detectorIconRed.svg" alt="Key Icon" width="30" />
      </span>
      <span v-for="(goal, index) in goalsUnhit" :key="'detectoru' + index" class="unhit">
        <img src="@/assets/graphics/detectorIconGreen.svg" alt="Key Icon" width="30" />
      </span>
      <div>
        <span v-if="detectorsHit !== gameState.goals.length" class="defeat">
          <b>DETECTORS</b>
        </span>
        <span v-else class="success"><b>DETECTORS</b></span>
      </div>
    </div>

    <!-- MINES -->
    <div v-if="gameState.mines > 0" class="bottom-icons">
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
import { GameStateEnum } from '@/engine/interfaces';
import Cell from '@/engine/Cell';
import Goal from '@/engine/Goal';
import GameState from '@/engine/GameState';
import AppCell from '@/components/Board/AppCell.vue';
import Game from './index.vue';

@Component({
  components: {
    AppCell
  }
})
export default class GameGoals extends Vue {
  @Prop() readonly gameState!: GameState;
  @Prop() readonly detections!: { cell: Cell; probability: number }[];
  @Mutation('SET_GAME_STATE') mutationSetGameState!: (gameState: GameStateEnum) => void;
  tweenedPercent: number = this.totalAbsorption;
  width = 100;

  /**
   * Compute the total absorption at goals
   * @returns total absorption
   */
  get totalAbsorption() {
    return this.gameState.totalAbsorption;
  }

  /**
   * Total goal percentage
   * @returns sum of goal threshold
   */
  get totalGoal(): number {
    return this.gameState.totalGoalPercentage;
  }

  /**
   * Compute success or failure class
   * TODO: Should be a boolean
   */
  get gameStateClass(): string {
    return this.totalAbsorption >= this.totalGoal ? 'success' : 'defeat';
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
   */
  get sections() {
    return [
      { value: 100 - this.tweenedPercent, color: '#210235' },
      { value: this.tweenedPercent, color: '#5D00D5' }
    ];
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
    padding-bottom: 0;
    justify-content: space-evenly;
    align-items: center;
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
}
.defeat {
  color: white;
  //opacity: 0.2;
}
.success {
  color: white;
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
