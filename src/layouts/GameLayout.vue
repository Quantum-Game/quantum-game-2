<template>
	<div class="game-layout">

		<!-- games header: menu and level name -->
		<header>
			<div class="left">
				<q-menu />
			</div>
			<div class="middle" v-if="this.$slots['header-middle']">
				<slot name="header-middle"></slot>
			</div>
			<div class="right">
				<slot name="header-right"></slot>
			</div>
		</header>

		<!-- games main: goals, board, toolbox and explanations -->
		<main>
			<aside class="left">
				<slot name="main-left"></slot>
			</aside>
			<slot name="main-middle"></slot>
			<aside class="right">
				<slot name="main-right"></slot>
			</aside>
		</main>

		<!-- a generic footer for now -->
		<footer>
			<slot name="footer"></slot>
		</footer>
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
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	color: white;
	width: 100%;
}

.left,
.right {
	height: auto;
	width: 16%;
}

main,
header,
footer {
	display: flex;
	flex-direction: row;
	justify-content: center;

}

</style>
