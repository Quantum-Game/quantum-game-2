<template>
	<div class="game-layout">
		<!-- games header: menu and level name -->
		<header>
			<div class="left">
				<q-menu />
			</div>
			<div class="middle">
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
			<article class="middle">
				<slot name="main-middle"></slot>
			</article>
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

<style lang="scss" scoped>
.game-layout {
	width: 1400px;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	color: white;
	width: 100%;
	align-items: center;
}
.middle {
	padding: 20px;
	align-content: center;
	justify-content: center;
	width: 65%;
}
.left,
.right {
	height: auto;
	width: 16%;
	padding: 20px;
}

header {
	width: 1400px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding: none;
}

main,
//header,
footer {
	max-width: 1400px;
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.placeholder {
	width: 100%;
	height: 200px;
	& h3 {
		margin: 0;
	}
	&.explanation {
		border-top: 1px solid white;
		//background-color: rgba(0, 225, 255, 0.349);
	}
	&.toolbox {
		border-top: 1px solid white;
		//background-color: rgba(255, 187, 0, 0.349);
	}
	&.goals {
		border-top: 1px solid white;
		//background-color: rgba(255, 0, 85, 0.349);
		height: 400px;
	}
	&.controls {
		//background-color: rgba(179, 255, 0, 0.349);
		border-top: 1px solid white;
		height: 100px;
	}
}
</style>
