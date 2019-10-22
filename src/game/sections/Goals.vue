<template>
	<div class="goals placeholder">
		<h3 class="title">GOALS</h3>
	</div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Goals extends Vue {}
</script>

<style lang="scss" scoped>
.placeholder {
	width: 100%;
	height: 200px;
	& h3 {
		margin: 0;
	}
	&.goals {
		//background-color: rgba(255, 0, 85, 0.349);
		height: 400px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
}
</style>
