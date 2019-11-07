<template>
  <div ref="goals" class="goals-wrapper">
    <!-- DONUT -->
    <vc-donut
      class="chart"
      background="#210235"
      foreground="inherit"
      unit="px"
      :size="150"
      :thickness="5"
      :sections="sections"
      :total="100"
      :start-angle="0"
    >
      <div class="inner-circle">{{ tweenedPercent.toFixed(2) }}%</div>
      <div>SUCCESS</div>
    </vc-donut>

    <!-- GOALS -->
    <div class="bottom-icons">
      <span v-for="(goal, index) in detectorsHit" :key="'detectorh' + index" class="hit">
        <img src="@/assets/detectorIconGreen.svg" alt="Key Icon" width="30" />
      </span>
      <span v-for="(goal, index) in detectorsUnhit" :key="'detectoru' + index" class="unhit">
        <img src="@/assets/detectorIconRed.svg" alt="Key Icon" width="30" />
      </span>
      <div>DETECTORS</div>
    </div>

    <!-- MINES -->
    <div class="bottom-icons">
      <span v-for="(mine, index) in minesHit" :key="'mineh' + index" class="hit">
        <img src="@/assets/detectorIconGreen.svg" alt="Key Icon" width="30" />
      </span>
      <span v-for="(mine, index) in minesUnhit" :key="'mineu' + index" class="unhit">
        <img src="@/assets/detectorIconRed.svg" alt="Key Icon" width="30" />
      </span>
      <div>MINES</div>
    </div>

    <!-- DETECTION EVENTS -->
    <!-- <svg v-for="(detection, index) in detections" :key="'detection' + index" class="detection">
      <g>
        <app-cell :cell="detection.cell" />
        <text class="counter" x="100px" y="50%">
          {{ (detection.probability * 100).toFixed(2) }}%
        </text>
      </g>
    </svg>
    <div>DETECTION EVENTS</div>-->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Tween, update as updateTween } from 'es6-tween';
import Cell from '@/engine/Cell';
import AppCell from '@/components/Board/AppCell.vue';

@Component({
  components: {
    AppCell
  }
})
export default class GameGoals extends Vue {
  @Prop() readonly detectors!: number;
  @Prop() readonly mines!: number;
  @Prop() readonly detections!: { cell: Cell; probability: number }[];
  @Prop() readonly percentage!: number;
  @Prop() readonly goals!: any;
  tweenedPercent: number = this.percentage;
  width = 100;

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
      return detection.cell.element.name === 'Mine' && detection.probability > 0.1;
    });
    console.log(`HIT:${minesDetected.length}`);
    console.log(`TOTAL:${this.mines}`);

    return minesDetected.length;
  }

  /**
   * Process the detection events and select the detectors
   * @returns hit detector count
   */
  get minesUnhit(): number {
    return this.mines - this.minesHit;
  }

  animateTween(time: number) {
    const id = requestAnimationFrame(this.animateTween);
    const result = updateTween(time);
    if (!result) cancelAnimationFrame(id);
  }

  get sections() {
    return [{ value: Number(this.tweenedPercent).toFixed(1), color: '#5D00D5' }];
  }

  @Watch('percentage')
  onPercentChanged(val: number, oldVal: number) {
    console.log('COME ON');
    new Tween({ value: oldVal })
      .to({ value: val }, 500)
      .on('update', ({ value }: { value: number }) => {
        this.tweenedPercent = value;
        console.log(`TWEEN:${this.tweenedPercent}`);
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
.detection {
  width: 100%;
  max-height: 64px;
  .counter {
    fill: white;
    stroke: white;
    text-anchor: middle;
  }
}
</style>
