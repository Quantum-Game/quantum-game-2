<template>
	<div class="controls placeholder">
		<h3 class="title">controls<br />⬇ ️ ⬇ ️ ⬇️</h3>
		<slot></slot>
	</div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Controls extends Vue {}
</script>

<style lang="scss" scoped>
.placeholder {
	width: 100%;
	height: 200px;
	& h3 {
		margin: 0;
	}

	&.controls {
		background-color: rgba(179, 255, 0, 0.349);
		height: 100px;
		min-height: 200px;
	}
}
</style>
