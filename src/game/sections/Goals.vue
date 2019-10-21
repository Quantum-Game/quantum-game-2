<template>
	<div class="goals placeholder" ref="goals">
		<h3 class="title">GOALS:<br />⬇ ️ ⬇ ️ ⬇️</h3>
		<doughnut-chart :percent="percent">Basic donut</doughnut-chart>
	</div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import DoughnutChart from 'vue-doughnut-chart'


@Component({
	components: {
		DoughnutChart
	}
})
export default class Goals extends Vue {
	// @Prop() readonly detectors
	percent = 10
	width = 100

	mounted() {
		this.width = this.componentWidth();
	}

	get componentWidth() {
		return this.$refs.goals.clientWidth
	}
}
</script>

<style lang="scss" scoped>
.placeholder {
	width: 100%;
	height: 200px;
	& h3 {
		margin: 0;
	}

	&.explanation {
		background-color: rgba(0, 225, 255, 0.349);
	}

	&.toolbox {
		background-color: rgba(255, 187, 0, 0.349);
	}

	&.goals {
		background-color: rgba(255, 0, 85, 0.349);
		height: 400px;
	}

	&.controls {
		background-color: rgba(179, 255, 0, 0.349);
		height: 100px;
	}
}
</style>
