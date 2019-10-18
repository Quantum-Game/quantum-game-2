<template>
	<div class="game-layout">
		<aside class="left"></aside>
		<slot name="left"></slot>
		<q-menu />
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
export default class GameLayout extends Vue {}
</script>

<style lang="scss">
.game-layout {
	// height: 100%;
	min-height: 100vh;
	display: flex;
	color: white;
	width: 100%;
	justify-content: center;
	& aside,
	& main {
		padding: 20px;
		align-content: center;
		// width: 65%;
		&.left,
		&.right {
			height: 100%;
			width: 16%;
			padding: 50px 0 0 0;
		}
	}
}
</style>
