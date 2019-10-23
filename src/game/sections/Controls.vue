<template>
	<div class="controls">
		<span class="playback">
			<b-button :usable="false" which-is="play" @click.native="$emit('play')" />
			<b-button which-is="step-back" @click.native="$emit('stepBack')" />
			<b-button :usable="false" which-is="pause" @click.native="$emit('pause')" />
			<b-button which-is="step-forward" @click.native="$emit('stepForward')" />
			<b-button :usable="false" which-is="stop" @click.native="$emit('stop')" />
			<b-button :usable="false" which-is="reload" @click.native="$emit('reload')" />
		</span>
		<span class="view-mode">
			<b-button :usable="false" which-is="classical" @click.native="$emit('classical')" />
			<b-button :usable="false" which-is="quantum" @click.native="$emit('quantum')" />
			<b-button :usable="false" which-is="multiverse" @click.native="$emit('multiverse')" />
		</span>
		<slot></slot>
	</div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import BButton from '../BButton.vue';

@Component({
	components: {
		BButton
	}
})
export default class Controls extends Vue {}
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
