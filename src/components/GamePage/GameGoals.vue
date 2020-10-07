<template>
  <div class="goals-wrapper">
    <!-- GOAL PERCENTAGE -->
    <div class="goalPercentage">
      <div :class="computeProbabilityClass">
        <div class="progressBarText">
          <p>You need {{ (goals.totalGoalThreshold * 100).toFixed(1) }}% detection</p>
        </div>
      </div>
      <div class="progressBar">
        <div
          class="progressBarFillGoal"
          :style="{ width: goals.totalGoalThreshold * 100 + '%' }"
        ></div>
        <div class="progressBarFill" :style="{ width: goals.totalAbsorption * 100 + '%' }"></div>
      </div>
      <!-- <div v-if="gameState.totalGoalPercentage < 100" class="goal-text">
        Goal: {{ gameState.totalGoalPercentage }} %
      </div> -->
    </div>
    <!-- DETECTORS -->
    <div v-if="goals.goalsMet + goals.goalsUnmet > 0" :class="computeGoalClass">
      <div>
        <span>
          <p>DETECTORS</p>
        </span>
      </div>
      <span v-for="index in goals.goalsMet" :key="'detectorh' + index" class="hit">
        <img src="@/assets/graphics/icons/detectorFull-2.svg" width="28" />
      </span>
      <span v-for="index in goals.goalsUnmet" :key="'detectoru' + index" class="unhit">
        <img src="@/assets/graphics/icons/detectorEmpty-2.svg" width="28" />
      </span>
    </div>

    <!-- MINES -->
    <div v-if="goals.minesHit + goals.minesUnhit > 0" :class="computeSafeClass">
      <div>
        <span v-if="goals.allMinesSafe" class="success">
          <p>{{ textRiskSafe }}</p>
        </span>
        <span v-else class="defeat">
          <p>{{ textRiskDanger }}</p>
        </span>
      </div>
      <span v-for="(mine, index) in goals.minesHit" :key="'mineh' + index" class="hit">
        <img src="@/assets/graphics/icons/mineFull-2.svg" width="34" />
      </span>
      <span v-for="(mine, index) in goals.minesUnhit" :key="'mineu' + index" class="unhit">
        <img src="@/assets/graphics/icons/mineEmpty-2.svg" width="34" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { GoalsController } from '@/engine/controller'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'GameGoals',
  props: {
    goals: { type: Object as PropType<GoalsController>, required: true },
  },
  setup(props) {
    const computeProbabilityClass = computed((): string => {
      return props.goals.probabilityGoalMet ? 'success' : 'defeat'
    })

    const computeGoalClass = computed((): string[] => {
      return [props.goals.allGoalsMet ? 'success' : 'defeat', 'bottom-icons']
    })

    const computeSafeClass = computed((): string[] => {
      return [props.goals.allMinesSafe ? 'success' : 'defeat', 'bottom-icons']
    })

    const textRiskSafe = computed((): string => {
      if (props.goals.safetyThreshold < 1e-6) {
        return 'SAFE'
      } else {
        return `SAFEISH  (<${(100 * props.goals.safetyThreshold).toFixed(1)}%)`
      }
    })

    const textRiskDanger = computed((): string => {
      if (props.goals.safetyThreshold < 1e-6) {
        return 'DANGER!'
      } else {
        return `PUT DANGER BELOW ${(100 * props.goals.safetyThreshold).toFixed(1)}%`
      }
    })

    return {
      computeProbabilityClass,
      computeGoalClass,
      computeSafeClass,
      textRiskSafe,
      textRiskDanger,
    }
  },
})
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
  @include media('<large') {
    display: none;
  }
}
p {
  font-size: 0.7rem;
  margin: 0rem;
  color: rgba(255, 255, 255, 0.6);
  @include media('<large') {
    font-size: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
.goals-wrapper {
  padding-top: 10px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  @include media('<large') {
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
    @include media('<large') {
      line-height: 75%;
      padding: 0;
      // div {
      //   display: none;
      // }
      img {
        width: 4vw !important;
      }
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
.inner-circle {
  font-size: 1.2rem;
}
.progressBarText {
  margin-top: 5px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

.goalPercentage {
  position: relative;
  margin-bottom: 2rem;
  .progressBar {
    margin-top: 10px;
    margin-bottom: 1rem;
    position: absolute;
    width: 100%;
    height: 18px;
    // top: 0;
    // z-index: 1;
    background-color: rgba(0, 0, 0, 0.1);
    // border-bottom: 1px solid rgba(255, 255, 255, 0.7);
    @include media('<large') {
      margin-top: 0;
    }
  }
  .progressBarFill {
    // position: absolute;
    height: 10px;
    // background-color: #5c00d3;
    background: linear-gradient(to right, #5c00d3, #5c00d3, #ff0055, #fbb03b);
    // top: 0;
    // left: 0;
    transition: width 1s ease-in-out;
    // z-index: 1;
    margin-top: 4px;
  }
  .progressBarFillGoal {
    position: absolute;
    width: 0%;
    height: 18px;
    background-color: rgba(255, 255, 255, 0.1);
    border-right: 1px solid white;
    // top: 0;
    // left: 0;
    transition: width 1s ease-in-out;
    // z-index: 1;
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
  @include media('<large') {
    display: none;
  }
}

.results_simple {
  display: none;
  @include media('<large') {
    display: flex;
    align-items: center;
  }
}
</style>
