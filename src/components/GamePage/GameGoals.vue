<template>
  <div ref="goals" class="goals-wrapper">
    <vc-donut
      class="chart"
      :class="{ highscore: isHighScore }"
      background="#210235"
      foreground="inherit"
      unit="px"
      :size="150"
      :thickness="5"
      :sections="sections"
      :total="100"
      :start-angle="0"
    >
      <div class="inner-circle">{{ animatedPercent }}%</div>
      <div>SUCCESS</div>
    </vc-donut>
    <div class="btn-fake" @click="fakeClick">Click me</div>
    <div class="bottom-icons">
      <span v-for="(goal, index) in goals" :key="index">
        <img src="@/assets/detectorIcon.svg" alt="Key Icon" width="30" />
      </span>
      <div>DETECTORS</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Tween, update as updateTween } from 'es6-tween';

@Component({
  components: {}
})
export default class GameGoals extends Vue {
  @Prop() readonly detectors!: number;
  @Prop() readonly percentage!: number;
  @Prop() readonly goals!: any;
  percent: number = this.percentage;
  tweenedPercent: number = this.percentage;
  isHighScore: boolean = false;
  width = 100;

  fakeClick() {
    this.percent = Math.random() * 100;
    this.isHighScore = this.percent > 50;

    requestAnimationFrame(this.animateTween);
  }

  animateTween(time: number) {
    const id = requestAnimationFrame(this.animateTween);
    const result = updateTween(time);
    if (!result) cancelAnimationFrame(id);
  }

  get animatedPercent() {
    return Number(this.tweenedPercent).toFixed(1);
  }
  get sections() {
    return [{ value: Number(this.tweenedPercent.toFixed(1)), color: '#5D00D5' }];
  }

  @Watch('percent')
  onPercentChanged(val: number, oldVal: number) {
    console.debug(oldVal, val);
    const vm = this;
    new Tween({ value: oldVal })
      .to({ value: val }, 500)
      .on('update', ({ value }: { value: number }) => {
        vm.tweenedPercent = value;
      })
      .start();
  }
}
</script>

<style lang="scss" scoped>
.goals-wrapper {
  // BORDER-TOP TURNED ON WHEN THERE ARE UPPER ICONS
  //border-top: 1px solid white;
  padding-top: 10px;
  padding-bottom: 100px;
  //border-bottom: 1px solid white;
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
  }
  & .chart {
    & div.inner-circle {
      font-size: 2rem;
    }
    margin-bottom: 2rem;

    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 155px;
      height: 155px;
      border: 2px solid rgba(255, 255, 255, 0.6);
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
</style>
