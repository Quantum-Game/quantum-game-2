<template>
	<svg x="0px" y="0px" viewBox="0 0 64 64">
		<g>
			<rect x="25" y="2" class="st0" width="14" height="60" />
			<g>
				<path class="st1" d="M39,36.4v16c-7.8-9.46-11.91-18.35-14-24.24v-16C27.09,18.05,31.2,26.94,39,36.4z" />
				<path class="st2" d="M39,52.4V62H25V28.16C27.09,34.05,31.2,42.94,39,52.4z" />
			</g>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BeamSplitter extends Vue {}
</script>

<style lang="scss" scoped>
.st0 {
	fill: #61dbef;
}
.st1 {
	fill: #4ad1d8;
}
.st2 {
	fill: #4ac4d1;
}
</style>
