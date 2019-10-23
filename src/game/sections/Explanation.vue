+<template>
	<div class="explanation placeholder">
		<h3 class="title">ELEMENT NAME</h3>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
		<slot> </slot>
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
	height: fit-content;
	padding-top: 10px;
	padding-bottom: 10px;
	& h3 {
		margin: 0;
		font-size: 1rem;
	}

	&.explanation {
		border-top: 1px solid #8e819d;
		text-align: left;
		font-size: 1rem;
		line-height: 150%;
	}
}
</style>
