<template>
	<transition name="hint">
		<!-- GENERAL WRAPPER -->
		<g v-if="shown" :style="hintPosition" class="hint">
			<foreignObject
				ref="forObj"
				class="hint__foreignObject"
				:width="wrapperWidth"
				:height="wrapperHeight"
			>
				<!-- TOOLTIP ITSELF -->
				<div ref="hint" class="hint" :class="hintClass" @click="hide">
					<span>{{ hint.content }}</span>
				</div>
			</foreignObject>
		</g>
	</transition>
</template>

<script lang="ts">
import { Vue, Mixins, Component, Prop } from 'vue-property-decorator';
import { IHint } from '@/types';
import { getPositionStyle } from '../mixins';

@Component
export default class SpeechBubble extends Mixins(getPositionStyle) {
	@Prop({ default: { type: 'regular' } }) readonly hint!: IHint;
	@Prop({ default: 64 }) readonly tileSize!: number;

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

	get wrapperWidth() {
		// this controls how much space does the hint have:
		return this.contentRect.width + 5;
	}

	get wrapperHeight() {
		return this.contentRect.height;
	}

	get hintPosition() {
		const offsetX = this.wrapperWidth / 2;
		const offsetY = (this.wrapperHeight - 5) / 2;
		const styleObj = {
			transform: `translate(${this.positionX - offsetX + this.tileSize / 2}px, ${this.positionY -
				offsetY}px)`
		};
		return styleObj;
	}
}
</script>

<style lang="scss">
.hint {
	border-radius: 10px;
	padding: 12px;
	min-width: 120px;
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
