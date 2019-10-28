<template>
	<div class="controls">
		<span class="playback">
			<b-button
				v-for="btn in playBackControls"
				:key="btn"
				:which-is="btn"
				@click.native="$emit(btn)"
			/>
		</span>

		<span><b>STEP {{ activeFrame.step }} / {{totalFrames}}</b></span>
		<span class="view-mode">
			<b-button v-for="btn in viewControls" :key="btn" :which-is="btn" @click.native="$emit(btn)" />
		</span>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import BButton from '../BButton.vue';
import { FrameInterface } from 'quantumweasel';

@Component({
	components: {
		BButton
	}
})
export default class Controls extends Vue {
	@Prop() readonly activeFrame!: FrameInterface;
	@Prop() readonly totalFrames!: number;
	playBackControls = ['play', 'step-back', 'pause', 'step-forward', 'stop', 'reload'];
	viewControls = ['classical', 'quantum', 'multiverse'];
}
</script>

<style lang="scss" scoped>
.controls {
	width: 100%;
	border-top: 1px solid white;
	display: flex;
	padding-top: 0.7rem;
	justify-content: space-between;
	align-items: center;
	& .view-mode {
		display: flex;
		align-items: center;
		line-height: 20px;
	}
}
</style>
