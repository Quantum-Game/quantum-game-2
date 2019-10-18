<template>
	<div ref="wrapper" class="simulation-steps-display-wrapper">
		<div class="step">
			<h3>PHOTONS:</h3>
			<span>STEP {{ activeFrame.step }}</span>
			<div v-for="(particle, index) in particles" :key="index">
				<photon
					name
					:are="particle.a.re"
					:aim="particle.a.im"
					:bre="particle.b.re"
					:bim="particle.b.im"
					:width="width"
					:height="150"
				/>
				<div>
					A:
					{{ `im: ${particle.a.im}, re: ${particle.a.re}` }}
					B:
					{{ `im: ${particle.b.im}, re: ${particle.b.re}` }}
					Coord: {{ `y: ${particle.y}, x: ${particle.x}` }}
				</div>
				<div>
					direction: {{ particle.direction }} intensity: {{ particle.intensity }} path length:
					{{ particle.path.length }} phase: {{ particle.phase }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import Photon from './Photon.vue';
import QButton from './QButton.vue';
import { ICell, ICoord, FrameInterface } from '@/types';

@Component({
	components: {
		Photon,
		QButton
	}
})
export default class SimulationStepsDisplay extends Vue {
	@Prop() readonly activeFrame!: FrameInterface;
	width: number = 0;

	mounted() {
		this.getElementWidth();
	}

	getElementWidth() {
		// this.width = this.$refs.wrapper.clientWidth;
		this.width = 200;
	}

	get particles() {
		return (
			this.activeFrame.quantum || [
				{
					a: { re: 1, im: 0 },
					b: { re: 0, im: 0 },
					path: [],
					phase: 0
				}
			]
		);
	}
}
</script>

<style lang="scss" scoped>
.simulation-steps-display-wrapper {
	width: 100%;
	display: block;
	text-align: left;
	& .controls {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
}
</style>
