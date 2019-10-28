<template>
  <div ref="goals" class="goals-wrapper" :class="{collapsed: !expandGoals}">
    <div class="upper-icons">
      <div>
        <img src="@/assets/keyIcon.svg" alt="Key Icon" width="25" />
        <span> 02</span>
      </div>
      <span class="goalsExpand" @click="handleExpandGoals">{{expandGoals ? 'COLLAPSE' : 'EXPAND'}}</span>
      <div>
        <img src="@/assets/keyIcon.svg" alt="Key Icon" width="25" />
        <span> 25</span>
      </div>
    </div>
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
    </vc-donut>
		<div class="bottom-icons">
			<span v-for="(goal, index) in goals" :key="index">
				<img src="@/assets/detectorIcon.svg" alt="Key Icon" width="30" />
			</span>
			<div>DETECTORS</div>
		</div>
	</div>
    <!-- <div class="bottom-icons">
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
    </div> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {Tween, update as updateTween} from 'es6-tween';

@Component({
  data() {
    return {
      goalHeight: '25px',
      expandGoals: false,
      expandLabel: 'EXPAND'
    }
  },
  components: {}
})
export default class Goals extends Vue {
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

	animateTween(time) {
		const id = requestAnimationFrame(this.animateTween);				
		const result = updateTween(time);
		if(!result) cancelAnimationFrame(id);
	}

	get animatedPercent() {
		return Number(this.tweenedPercent).toFixed(1);
	}
	get sections() {
		return [{ value: Number(this.tweenedPercent.toFixed(1)), color: '#5D00D5' }];
	}

	@Watch('percent')
	onPercentChanged(val, oldVal) {
		console.log(oldVal, val)
		const vm = this;
		new Tween({value: oldVal})
		.to({ value: val }, 500)
		.on('update', ({value}) => {
			vm.tweenedPercent = value;
		})
		.start();
	}
					
	totalParticle(): number {
    let sum = 0;
    this.particles.map((particle) => (sum += particle.opacity));
    return sum * 100;
  }
  
  handleExpandGoals() {
    this.goalHeight = this.expandGoals ? 'auto' : '25px';
    this.expandGoals = !this.expandGoals;
  }

  get goalStyle() {
    return {
      height: this.goalHeight
    }
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition-timing-function: ease-in-out;
  transition: 0.5s 0.1s height;
  height: 350px;
  &.collapsed {
    height: 25px;
  }
  @media screen and (max-width: 1200px) {
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
