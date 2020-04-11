<template>
  <div ref="goals" class="goals-wrapper">
    <!-- <p class="title">
      GOALS
    </p> -->
    <!-- DONUT -->
    <vc-donut
      class="chart"
      background="#210235"
      foreground="inherit"
      unit="px"
      :size="110"
      :thickness="5"
      :total="100"
      :sections="sections"
      :start-angle="0"
    >
      <!-- INNER DONUT -->
      <div :class="computeProbabilityClass">
        <div class="inner-circle">{{ tweenedPercent.toFixed(1) }}%</div>
        <div class="inner-circle-probability">GOAL: {{ gameState.totalGoalPercentage }}%</div>
      </div>
    </vc-donut>

    <!-- GOAL PERCENTAGE -->
    <div class="goalPercentage">
      <div class="mobile_progressBar">
        <div
          class="mobile_progressBarFillGoal"
          :style="{ width: gameState.totalGoalPercentage + '%' }"
        ></div>
        <div
          class="mobile_progressBarFill"
          :style="{ width: tweenedPercent.toFixed(1) + '%' }"
        ></div>
      </div>
      <!-- <div v-if="gameState.totalGoalPercentage < 100" class="goal-text">
        Goal: {{ gameState.totalGoalPercentage }} %
      </div> -->
    </div>

    <!-- GOALS -->
    <div v-if="gameState.goals.length > 0" :class="computeGoalClass">
      <span
        v-for="(goal, index) in gameState.goalsHit.length"
        :key="'detectorh' + index"
        class="hit"
      >
        <img src="@/assets/graphics/icons/detectorFull.svg" width="28" />
      </span>
      <span v-for="(goal, index) in gameState.goalsUnhit" :key="'detectoru' + index" class="unhit">
        <img src="@/assets/graphics/icons/detectorEmpty.svg" width="28" />
      </span>
      <div>
        <span>
          <p>DETECTORS</p>
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
          <p>{{ textRiskSafe }}</p>
        </span>
        <span v-else class="defeat">
          <p>{{ textRiskDanger }}</p>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Tween, update as updateTween } from 'es6-tween'
import GameState from '@/engine/GameState'
import AppCell from '@/components/Board/AppCell.vue'

@Component({
  components: {
    AppCell,
  },
})
export default class GameGoals extends Vue {
  @Prop() readonly gameState!: GameState
  @Prop() readonly percentage!: number
  tweenedPercent: number = this.gameState.totalAbsorptionPercentage
  width = 100

  /**
   * Compute success or failure class from the gameState flags
   */
  get computeProbabilityClass(): string {
    return this.gameState.probabilityFlag ? 'success' : 'defeat'
  }

  get computeGoalClass(): string[] {
    return [this.gameState.goalFlag ? 'success' : 'defeat', 'bottom-icons']
  }

  get computeSafeClass(): string[] {
    return [this.gameState.safeFlag ? 'success' : 'defeat', 'bottom-icons']
  }

  get textRiskSafe(): string {
    if (this.gameState.safetyThreshold < 1e-6) {
      return 'SAFE'
    } else {
      return `SAFEISH  (<${(100 * this.gameState.safetyThreshold).toFixed(1)}%)`
    }
  }

  get textRiskDanger(): string {
    if (this.gameState.safetyThreshold < 1e-6) {
      return 'DANGER!'
    } else {
      return `PUT DANGER BELOW ${(100 * this.gameState.safetyThreshold).toFixed(1)}%`
    }
  }

  /**
   * Computes donut slices
   * @returns list of slices with colors
   */
  get sections(): { value: number; color: string }[] {
    return [
      { value: 100 - this.gameState.totalGoalPercentage, color: '#210235' },
      {
        value: this.gameState.totalGoalPercentage - this.tweenedPercent,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      { value: this.tweenedPercent, color: '#5D00D5' },
    ]
  }

  /**
   * Create the donut animation tween
   * @param time tween time
   */
  animateTween(time: number): void {
    const id = requestAnimationFrame(this.animateTween)
    const result = updateTween(time)
    if (!result) cancelAnimationFrame(id)
  }

  /**
   * Animate donut increase / decrease on gameState change
   */
  @Watch('percentage')
  onPercentChanged(val: number, oldVal: number): void {
    new Tween({ value: oldVal })
      .to({ value: val }, 500)
      .on('update', ({ value }: { value: number }) => {
        this.tweenedPercent = value
      })
      .start()
    requestAnimationFrame(this.animateTween)
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: rgba($color: #fff, $alpha: 1);
  font-weight: 900;
  margin: 0px 0px 15px 0px;
  padding-bottom: 15px;
  font-size: 0.8rem;
  text-transform: uppercase;
  width: 100%;
  text-align: center;
  @media screen and (max-width: 1000px) {
    display: none;
  }
}
p {
  font-size: 0.7rem;
  margin: 0rem;
}
.goals-wrapper {
  padding-top: 10px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1000px) {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: top;
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
    margin-top: 10px;
    margin-bottom: 1rem;
    position: relative;

    & div.inner-circle {
      font-size: 1.2rem;
    }
    & .inner-circle-probability {
      font-size: 0.7rem;
    }

    &::after {
      content: '';
      position: absolute;
      width: 120px;
      height: 120px;
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
  position: relative;
  min-width: 80px;
  @media screen and (max-width: 1000px) {
    margin-bottom: 0;
    div:last-child {
      z-index: 2;
      position: relative;
      top: 0;
      left: 0;
    }
    .mobile_progressBar {
      margin-top: 10px;
      margin-bottom: 1rem;
      position: absolute;
      width: 200%;
      height: 18px;
      top: 0;
      left: -5%;
      z-index: 1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.7);
    }
    .mobile_progressBarFill {
      position: absolute;
      width: 0%;
      height: 14px;
      background-color: #5c00d3;
      top: 0;
      left: 0;
      transition: width 1s ease-in-out;
      z-index: 1;
      margin-top: 2px;
    }
    .mobile_progressBarFillGoal {
      position: absolute;
      width: 0%;
      height: 14px;
      background-color: rgba(255, 255, 255, 0.1);
      top: 0;
      left: 0;
      transition: width 1s ease-in-out;
      z-index: 1;
    }
  }
  .goal-text {
    font-size: 1rem;
    padding: 5px;
    color: #5c00d3;
    font-weight: 900;
  }
}
.defeat {
  color: white;
  opacity: 0.9;
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
