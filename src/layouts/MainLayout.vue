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
	flex-direction: row;
	color: white;
	& aside,
	& main {
		padding: 20px;
		align-content: center;
		width: 55%;
		&.left,
		&.right {
			width: 20%;
		}
		&.left {
			padding-top: 30px;
		}
		&.main {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		}
	}
}
</style>
