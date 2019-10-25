<template>
  <div ref="goals" class="goals-wrapper">
    <!-- <div class="upper-icons">
      <div>
        <img src="@/assets/keyIcon.svg" alt="Key Icon" width="25" />
        <span>02</span>
      </div>
      <div>
        <img src="@/assets/keyIcon.svg" alt="Key Icon" width="25" />
        <span>25</span>
      </div>
    </div>-->
    <vc-donut
      class="chart"
      background="inherit"
      foreground="rgba(255, 255, 255, 0.1)"
      unit="px"
      :size="200"
      :thickness="30"
      :sections="sections"
      :total="100"
      :start-angle="0"
    >
      <div class="inner-circle">{{ this.totalPercentage() }}%</div>
      <div>TO GO</div>
    </vc-donut>
    <div class="bottom-icons">
      <span v-for="(goal, index) in goals" :key="index">
        <div v-if="goal.value >= goal.threshold">
          <img src="@/assets/detectorIcon.svg" alt="Key Icon" width="30" class="happy" />
        </div>
        <div v-else>
          <img src="@/assets/detectorIcon.svg" alt="Key Icon" width="30" />
          {{goal.value * 100 }} / {{goal.threshold * 100}} %
        </div>
      </span>
      <div>DETECTORS</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Goal } from 'quantumweasel';

@Component({
  components: {}
})
export default class Goals extends Vue {
  @Prop() readonly detectors!: number;
  @Prop() readonly percentage!: number;
  @Prop() readonly goals!: Goal[];
  // percent = 10;
  width = 100;

  sections = [
    { value: this.totalPercentage(), color: '#FF0055' },
    { value: 100 - this.totalPercentage(), color: '#FFEEEE' }
  ];

  totalPercentage(): number {
    let sum = 0;
    this.goals.map((goal: Goal) => (sum += goal.value));
    return sum * 100;
  }
}
</script>

<style lang="scss" scoped>
.goals-wrapper {
  border-top: 1px solid white;
  padding-top: 10px;
  padding-bottom: 100px;
  border-bottom: 1px solid white;
  width: 100%;
  // height: 320px;
  display: flex;
  flex-direction: column;

  & .upper-icons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //justify-content: left;
    margin-bottom: 2rem;
  }
  & .bottom-icons {
    line-height: 150%;
    & .happy {
      background-color: green;
    }
  }
  & .chart {
    & div.inner-circle {
      font-size: 3rem;
    }
    margin-bottom: 2rem;
  }
}
</style>
