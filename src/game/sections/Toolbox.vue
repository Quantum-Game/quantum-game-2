+<template>
	<div class="toolbox placeholder">
		<h3 class="title">here's the toolbox!<br />⬇ ️ ⬇ ️ ⬇️</h3>
	</div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Toolbox extends Vue {}
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

	&.toolbox {
		background-color: rgba(255, 187, 0, 0.349);
	}

	&.goals {
		background-color: rgba(255, 0, 85, 0.349);
		height: 400px;
	}

	&.controls {
		background-color: rgba(179, 255, 0, 0.349);
		height: 100px;
	}
}
</style>
