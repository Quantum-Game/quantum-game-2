<template>
	<div :class="{ open: isOpen, 'menu-icon': true }" @click="toggleIcon">
		<div class="bar1"></div>
		<div class="bar2"></div>
		<div class="bar3"></div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
	@Prop({ default: false }) isOpen!: boolean;

	@Emit('toggleMenu')
	toggleIcon() {
		return !this.isOpen;
	}
}
</script>

<style lang="scss">
.menu-icon {
	display: block;
	position: relative;
	cursor: pointer;
	z-index: 2;
	top: 10px;
	left: 10px;
	.bar1,
	.bar2,
	.bar3 {
		width: 35px;
		height: 3px;
		background-color: rgb(255, 255, 255);
		margin: 6px 0;
		transition: 0.4s;
	}

	/* Rotate first bar */
	&.open .bar1 {
		transform: rotate(-45deg) translate(-7px, 3px);
	}

	/* Fade out the second bar */
	&.open .bar2 {
		opacity: 0;
	}

	/* Rotate last bar */
	&.open .bar3 {
		transform: rotate(45deg) translate(-9px, -8px);
	}
}
</style>
