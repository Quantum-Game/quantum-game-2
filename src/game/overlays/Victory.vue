<template>
	<div class="victory">
		<h2>THIS IS A WIN</h2>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class Victory extends Vue {}
</script>

<style lang="scss">
.victory {
	height: 100%;
	width: 100%;
	background-color: rgba(179, 7, 136, 0.856);
	position: fixed;
	z-index: 3;
	h2 {
		color: white;
		font-size: 16rem;
	}
}
</style>
