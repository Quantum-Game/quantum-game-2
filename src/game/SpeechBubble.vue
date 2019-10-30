<template>
	<transition name="hint">
		<!-- TOOLTIP ITSELF -->
		<foreignObject v-if="shown" :x="offsetX" :y="offsetY" height="500" width="500">
			<div ref="hint" class="hint" :class="hintClass" @click="hide">
				<span>{{ hint.content }}</span>
			</div>
		</foreignObject>
	</transition>
</template>

<script lang="ts">
import { Vue, Mixins, Component, Prop } from 'vue-property-decorator';
import { IHint } from '@/types';
import { getPosition } from '../mixins';

@Component
export default class SpeechBubble extends Mixins(getPosition) {
	@Prop() readonly hint!: IHint;
	@Prop({ default: 64 }) readonly tileSize!: number;

	positionX!: number;
	positionY!: number;

	contentRect = {
		width: 0,
		height: 0
	};
	shown = true;

	$refs!: {
		hint: HTMLElement;
	};

	mounted() {
		this.assessDimensions();
	}

	assessDimensions() {
		this.contentRect = this.$refs.hint.getBoundingClientRect();
	}

	hide() {
		this.shown = false;
	}

	get hintClass() {
		return `hint--${this.hint.color}`;
	}

	get wrapperHeight() {
		return this.contentRect.height;
	}

	get offsetX() {
		return this.positionX - this.contentRect.width / 2 + this.tileSize / 2;
	}
	get offsetY() {
		return this.positionY - this.contentRect.height / 2;
	}
}
</script>

<style lang="scss">
.hint {
	padding: 12px;
	max-width: 120px;
	z-index: 2;
	position: absolute;
	color: #120223;
	&::after {
		content: ' ';
		position: absolute;
		top: 100%; /* At the bottom of the tooltip */
		left: 50%;
		margin-left: -10px;
		border-width: 10px;
		border-style: solid;
	}
}
//FOR VERY IMPORTANT THINGS NOT TO BE MISSED
.hint--red {
	background-color: #ff0055;
	&::after {
		border-color: #ff0055 transparent transparent transparent;
	}
}
//BASIC STYLE, NOT TOO INTRUSIVE
.hint--purple {
	background-color: #5c00d3;
	&::after {
		border-color: #5c00d3 transparent transparent transparent;
	}
}

.hint-enter-active,
.hint-leave-active {
	transition: opacity 0.3s;
}
.hint-enter,
.hint-leave-to {
	opacity: 0;
}
</style>
