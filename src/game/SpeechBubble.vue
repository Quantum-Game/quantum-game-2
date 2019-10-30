<template>
	<transition name="hint">
		<!-- WRAPPER -->
		<foreignObject
			v-if="shown"
			:x="offsetX"
			:y="offsetY"
			:height="wrapperHeight"
			:width="wrapperWidth"
		>
			<!-- TOOLTIP ITSELF -->
			<div ref="hint" class="hint" :class="hintClass" :style="{ maxWidth: maxWidth }" @click="hide">
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

	// this is where the tooltips width is set:
	maxWidth = '120px';

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

	/* 	used to measure the HTML elements dimensions to
			appropriatly wrap it and position
	*/
	assessDimensions() {
		this.contentRect = this.$refs.hint.getBoundingClientRect();
	}

	hide() {
		this.shown = false;
	}

	get hintClass() {
		return `hint--${this.hint.color}`;
	}

	// used to give a bit of margins to the foreginObject
	get wrapperHeight() {
		return this.contentRect.height + 15;
	}

	get wrapperWidth() {
    return this.contentRect.width + 15;
	}

	// used for internal positioning with regard to hint's size
	get offsetX() {
		return this.positionX - this.wrapperWidth / 2 + this.tileSize / 2;
	}

	get offsetY() {
		return this.positionY - this.wrapperHeight / 2;
	}
}
</script>

<style lang="scss">
.hint {
	border-radius: 10px;
	padding: 12px;
	z-index: 2;
	position: absolute;
	box-shadow: 1px 1px 1px black;
	&::after {
		content: ' ';
		position: absolute;
		top: 100%;
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
