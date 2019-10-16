<template>
	<div class="layout-container">
		<aside class="left">
			<q-menu />
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
import QMenu from '../components/QMenu.vue';

@Component({
	components: {
		QMenu
	}
})
export default class MainLayout extends Vue {}
</script>

<style lang="scss">
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
		&.left,
		&.right {
			width: 16%;
			padding: 50px 0 0 0;
		}
	}
}
</style>
