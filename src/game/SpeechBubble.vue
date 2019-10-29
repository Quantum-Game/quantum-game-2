<template>
	<transition name="hint">
		<!-- TOOLTIP ITSELF -->
		<foreignObject v-if="shown" :x="offsetX" :y="offsetY" height="200" width="200">
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
	border-radius: 10px;
	padding: 12px;
	max-width: 120px;
	z-index: 2;
	position: absolute;
	box-shadow: 1px 1px 1px black;
	&::after {
		content: ' ';
		position: absolute;
		top: 100%; /* At the bottom of the tooltip */
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
	}
}

.hint--red {
	background-color: red;
	&::after {
		border-color: red transparent transparent transparent;
	}
}

.hint--purple {
	background-color: purple;
	&::after {
		border-color: purple transparent transparent transparent;
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
