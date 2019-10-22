+<template>
	<div class="explanation placeholder">
		<!-- <h3 class="title">stuff will be explained here<br />⬇ ️ ⬇ ️ ⬇️</h3> -->
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
	padding-top: 10px;
	padding-bottom: 10px;
	& h3 {
		margin: 0;
	}

	&.explanation {
		border-top: 1px solid #8e819d;
	}
}
</style>
