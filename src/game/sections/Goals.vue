<template>
	<div ref="goals" class="goals-wrapper">
		<div class="upper-icons">
			<span>Key Icon</span>
			<span>Badge Icon</span>
		</div>
		<vc-donut
			class="chart"
			background="#210235"
			foreground="#12012480"
			:size="200"
			unit="px"
			:thickness="10"
			:sections="sections"
			:total="100"
			:start-angle="0"
		>
			<div class="inner-circle">{{ percentage }}%</div>
			<div>SUCCESS</div>
		</vc-donut>
		<div class="bottom-icons">
			<div>TWO DETECTOR ICONS</div>
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
	percent = 10;
	width = 100;

	sections = [{ value: this.percentage, color: 'red' }];

	mounted() {
		// this.width = this.componentWidth();
	}

	get componentWidth() {
		return this.$refs.goals.clientWidth;
	}
}
</script>

<style lang="scss" scoped>
.goals-wrapper {
	width: 100%;
	height: 320px;
	display: flex;
	flex-direction: column;
	& .upper-icons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 2rem;
	}
	& .chart {
		& div.inner-circle {
			font-size: 3rem;
		}
		margin-bottom: 2rem;
	}
}
</style>
