<template>
	<div ref="goals" class="goals-wrapper">
		<div class="upper-icons">
			<div>
				<img src="@/assets/keyIcon.svg" alt="Key Icon" width="25" />
				<!-- NUMBER OF KEYS -->
				<span>02</span>
			</div>
			<div>
				<img src="@/assets/keyIcon.svg" alt="Key Icon" width="25" />
				<!-- NUMBER OF POINTS? -->
				<span>25</span>
			</div>
		</div>
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
			<div class="inner-circle">{{ percentage.toFixed(0) }}%</div>
			<div>PROBABILITY</div>
		</vc-donut>
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

@Component({
	components: {}
})
export default class Goals extends Vue {
	@Prop() readonly detectors!: number;
	@Prop() readonly percentage!: number;
	@Prop() readonly goals!: any;
	percent = 10;
	width = 100;

	sections = [{ value: this.percentage, color: '#FF0055' }];
}
</script>

<style lang="scss" scoped>
.goals-wrapper {
	border-top: 1px solid white;
	padding-top: 10px;
	padding-bottom: 100px;
	border-bottom: 1px solid white;
	width: 100%;
	height: 320px;
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
			font-size: 3rem;
		}
		margin-bottom: 2rem;
	}
}
</style>
