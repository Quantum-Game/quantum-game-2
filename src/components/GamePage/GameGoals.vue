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
      <div :class="probabilityClass">
        <div class="inner-circle">{{ tweenedPercent.toFixed(2) }}%</div>
        <div>PROBABILITY</div>
      </div>
    </vc-donut>
    <div class="goalPercentage">
      <div>Goal: {{ gameState.totalGoal }} %</div>
    </div>

    <!-- GOALS -->
    <div v-if="gameState.goals.length > 0" :class="goalClass">
      <span
        v-for="(goal, index) in gameState.goalsHit.length"
        :key="'detectorh' + index"
        class="hit"
      >
        <img src="@/assets/graphics/detectorIconRed.svg" alt="Key Icon" width="30" />
      </span>
      <span v-for="(goal, index) in gameState.goalsUnhit" :key="'detectoru' + index" class="unhit">
        <img src="@/assets/graphics/detectorIconGreen.svg" alt="Key Icon" width="30" />
      </span>
      <div>
        <span>
          <b>DETECTORS</b>
        </span>
      </div>
    </div>

    <!-- MINES -->
    <div v-if="gameState.mines.length > 0" :class="safeClass">
      <span v-for="(mine, index) in gameState.minesHit.length" :key="'mineh' + index" class="hit">
        <img src="@/assets/graphics/mineIconRed.svg" alt="Key Icon" width="34" />
      </span>
      <span v-for="(mine, index) in gameState.minesUnhit" :key="'mineu' + index" class="unhit">
        <img src="@/assets/graphics/mineIconEmpty.svg" alt="Key Icon" width="34" />
      </span>
      <div>
        <span v-if="gameState.minesHit > 0" class="defeat">
          <b>DANGER!</b>
        </span>
        <span v-else class="success">
          <b>SAFE</b>
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
  get probabilityClass(): string {
    return this.gameState.probabilityFlag ? 'success' : 'defeat';
  }
  get goalClass(): string[] {
    return [this.gameState.goalFlag ? 'success' : 'defeat', 'bottom-icons'];
  }
  get safeClass(): string[] {
    return [this.gameState.safeFlag ? 'success' : 'defeat', 'bottom-icons'];
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
.goalPercentage {
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
