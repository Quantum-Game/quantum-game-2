<template>
	<div class="q-menu-wrapper">
		<div :class="{ open: isMenuOpen, 'menu-icon': true }" @click="toggleMenu">
			<div class="bar1"></div>
			<div class="bar2"></div>
			<div class="bar3"></div>
		</div>
		<transition name="fade">
			<div v-if="isMenuOpen" class="menu-overlay">
				<menu>
					<router-link to="/level/1" @click.stop.native="closeMenu">QUANTUM GAME</router-link>
					<span>CONTINUE</span>
					<span>LEVELS</span>
					<span>SANDBOX</span>
					<router-link to="/info" @click.stop.native="closeMenu">ENCYCLOPEDIA</router-link>
					<span>OPTIONS</span>
					<span>BLOG</span>
				</menu>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
	isMenuOpen: boolean = false;

	created() {
		window.addEventListener('keyup', this.handleEscPress);
	}

	closeMenu() {
		this.isMenuOpen = false;
	}
	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
	}

	handleEscPress(e: { which: number }) {
		if (e.which === 27) {
			this.toggleMenu();
		}
	}

	beforeDestroy() {
		window.removeEventListener('keyup', this.handleEscPress);
	}
}
</script>

<style lang="scss" scoped>
.menu-icon {
	display: block;
	position: absolute;
	top: 10px;
	left: 10px;
	cursor: pointer;
	z-index: 2;
	&.open {
		position: fixed;
	}
	.bar1,
	.bar2,
	.bar3 {
		width: 35px;
		height: 3px;
		background-color: rgb(255, 255, 255);
		margin: 8px 0;
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
		transform: rotate(45deg) translate(-11px, -9px);
	}
}
.menu-overlay {
	z-index: 1;
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background-color: rgba(33, 2, 53, 0.9);
	display: flex;
	flex-direction: column;
	justify-content: center;
	cursor: unset;
	& menu {
		display:flex;
		flex-direction: column;
		justify-content: space-around;
		height: 50%;
		margin: 0;
		font-size: 2rem;
		padding-inline-start: 0;
		a {
			color: white;
			text-decoration: none;
			&:hover {
				color: white;
				font-weight: bold;
				// text-shadow: 1px 1px 2px white, -1px -1px 2px white;
			}
		}
		span {
			text-decoration: line-through;
		}
	}
}

// Animation:
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
