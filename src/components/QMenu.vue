<template>
	<div :class="{ open: isMenuOpen, 'menu-icon': true }" @click.stop="openMenu">
		<div class="bar1"></div>
		<div class="bar2"></div>
		<div class="bar3"></div>
		<div v-if="isMenuOpen" class="menu-overlay">
			<menu>
				<span>Quantum Game</span>
				<span>Continue</span>
				<span>Levels</span>
				<span>Sandbox</span>
				<router-link to="/info" @click.stop.native="closeMenu">Encyclopedia</router-link>
				<span>Options</span>
				<span>Blog</span>
			</menu>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
	isMenuOpen: boolean = false;

	closeMenu() {
		this.isMenuOpen = false;
	}
	openMenu() {
		this.isMenuOpen = true;
	}
}
</script>

<style lang="scss" scoped>
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
.menu-overlay {
	z-index: 1;
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	overflow: auto;
	background-color: rgba(82, 2, 128, 0.87);
	display: flex;
	flex-direction: column;
	& menu {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 65%;
		margin: 0;
		font-size: 2rem;
		a {
			color: white;
			text-decoration: none;
			&:hover {
				color: white;
				text-shadow: 1px 1px 2px white, -1px -1px 2px white;
			}
		}
	}
}
</style>
