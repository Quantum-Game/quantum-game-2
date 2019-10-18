+<template>
	<div class="explanation placeholder">
		<h3 class="title">stuff will be explained here<br />⬇ ️ ⬇ ️ ⬇️</h3>
		<slot></slot>
	</div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Explanation extends Vue {}
</script>

<style lang="scss" scoped>
.placeholder {
	width: 100%;
	height: 200px;
	& h3 {
		margin: 0;
	}

	&.explanation {
		background-color: rgba(0, 225, 255, 0.349);
	}
}
</style>
