<template>
	<div :class="{ open: menuOpen, 'menu-icon': true }" @click="toggleIcon">
		<div class="bar1"></div>
		<div class="bar2"></div>
		<div class="bar3"></div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
	menuOpen: boolean = false;

	toggleIcon() {
		this.menuOpen = !this.menuOpen;
	}
}
</script>

<style lang="scss">
.menu-icon {
	display: inline-block;
	cursor: pointer;

	.bar1,
	.bar2,
	.bar3 {
		width: 35px;
		height: 5px;
		background-color: rgb(255, 255, 255);
		margin: 6px 0;
		transition: 0.4s;
	}

	/* Rotate first bar */
	&.open .bar1 {
		transform: rotate(-45deg) translate(-9px, 6px);
		transform: rotate(-45deg) translate(-9px, 6px);
	}

	/* Fade out the second bar */
	&.open .bar2 {
		opacity: 0;
	}

	/* Rotate last bar */
	&.open .bar3 {
		transform: rotate(45deg) translate(-8px, -8px);
		transform: rotate(45deg) translate(-8px, -8px);
	}
}
</style>
