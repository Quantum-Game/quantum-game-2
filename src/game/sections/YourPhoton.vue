<template>
	<div ref="wrapper" class="simulation-steps-display-wrapper">
		<div class="step">
			<h3>YOUR PHOTON: </h3>
				<span>STEP {{ displayedFrame.step }} / {{ frames.length }}
				</span>
			<photon name="" :are="currentQuantum.a.re" :aim="currentQuantum.a.im" :bre="currentQuantum.b.re" :bim="currentQuantum.b.im" :width="width" :height="200" />
			<h3 v-if="displayedFrameNumber === 0">INIT STEP</h3>
			<div v-else class="particle">
				<div>
					A: {{ `im: ${currentQuantum.a.im}, re: ${currentQuantum.a.re}` }} B:
					{{ `im: ${currentQuantum.b.im}, re: ${currentQuantum.b.re}` }} Coord:
					{{ `y: ${currentQuantum.y}, x: ${currentQuantum.x}` }}
				</div>
				<div>
					direction: {{ currentQuantum.direction }} intensity: {{ currentQuantum.intensity }} path length:
					{{ currentQuantum.path.length }} phase: {{ currentQuantum.phase }}
				</div>
			</div>
			<div class="controls">
				<q-button inline @click.native="showPrevious">show previous frame</q-button>
				<q-button inline @click.native="showNext">show next frame</q-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import Photon from './Photon.vue';
import QButton from '../components/QButton.vue';

@Component({
	components: {
		Photon,
		QButton
	}
})
export default class SimulationStepsDisplay extends Vue {
	@Prop() readonly frames!: any[];
	displayedFrameNumber: number = 0;
	width: number = 0;

	$refs!: {
		wrapper: HTMLElement;
	};

	mounted() {
		this.getElementWidth();
	}

	getElementWidth() {
		this.width = this.$refs.wrapper.clientWidth;
	}

	showNext() {
		const newFrameNumber = this.displayedFrameNumber + 1;
		if (newFrameNumber > this.frames.length - 1) return false;
		this.displayedFrameNumber = newFrameNumber;
		return this.displayedFrameNumber;
	}

	showPrevious() {
		const newFrameNumber = this.displayedFrameNumber - 1;
		if (newFrameNumber < 0) return false;
		this.displayedFrameNumber = newFrameNumber;
		return this.displayedFrameNumber;
	}

	get displayedFrame() {
		return this.frames[this.displayedFrameNumber];
	}

	get currentQuantum() {
		const defaultParticle = {
			a: { im: 0, re: 0 },
			b: { im: 0, re: 0 },
			path: [],
			phase: 0
		};
		return this.displayedFrame.quantum[0] || defaultParticle;
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
