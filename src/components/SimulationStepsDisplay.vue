<template>
	<div class="simulation-steps-display-wrapper">
		<div class="step">
			<h3>STEP {{ displayedFrame.step }}</h3>
			<div class="controls">
				<q-button :inline="true" @click.native="showPrevious">show previous frame</q-button>
				<q-button :inline="true" @click.native="showNext">show next frame</q-button>
			</div>
			<h3 v-if="displayedFrame === 1">INIT STEP</h3>
			<div v-for="(particle, pindex) in displayedFrame.quantum" :key="`particle-${pindex}`" class="particle">
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
				<photon name="yay" :are="particle.a.re" :aim="particle.a.im" :bre="particle.b.re" :bim="particle.b.im" />

				<!-- <photon :are="1" /> -->
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import Photon from './Photon.vue';
import QButton from './QButton.vue';

@Component({
	components: {
		Photon,
		QButton
	}
})
export default class SimulationStepsDisplay extends Vue {
	@Prop() readonly frames!: any[];
	displayedFrameNumber = 0;

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
}
</script>

<style lang="scss">
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
