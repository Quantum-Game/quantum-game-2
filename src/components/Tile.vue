<template>
	<div class="tile" :class="calculatedClass" :style="calculatedStyle"></div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import { ICell } from '@/types';

@Component
export default class Tile extends Vue {
	@Prop() readonly cell!: ICell;

	get calculatedClass() {
		let classObj = {};
		if (this.cell.element) {
			classObj = {
				element: true,
				[this.cell.element]: true,
				active: this.cell.active
			};
		}
		return classObj;
	}

	get calculatedStyle() {
		let styleObj = {};
		if (this.cell.element) {
			styleObj = { backgroundImage: `url(${require(`../assets/pieces/${this.cell.element}.svg`)})` };	// eslint-disable-line
		}
		return styleObj;
	}
}
</script>

<style lang="scss">
.tile {
	background-color: rgba(0, 98, 255, 0.294);
	width: 64px;
	min-height: 64px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: white;
	font-size: 1.3rem;
	&:hover {
		background-color: yellow;
		color: black;
	}

	&.element {
		background-repeat: no-repeat;
		background-size: contain;
	}
}
</style>
