<template>
	<div class="layout-container">
		<aside class="left">
			<app-menu />
			<slot name="left"></slot>
		</aside>
		<main class="main">
			<slot name="main"></slot>
		</main>
		<aside class="right">
			<slot name="right"></slot>
		</aside>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import AppMenu from '@/components/AppMenu.vue';

@Component({
	components: {
		AppMenu
	}
})
export default class AppLayout extends Vue {}
</script>

<style lang="scss" scoped>
.layout-container {
	height: 100%;
	min-height: 100vh;
	display: flex;
	color: white;
	width: 1400px;
	justify-content: center;
	& aside,
	& main {
		padding: 20px;
		align-content: center;
		width: 65%;
		margin: 0;
		padding: 0;
		&.left,
		&.right {
			width: 16%;
			padding: 50px 0 0 0;
			text-transform: uppercase;
			text-align: left;
			color: white;
		}
	}
}
</style>
