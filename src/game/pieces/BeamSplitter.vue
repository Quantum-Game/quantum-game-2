<template>
	<svg>
		<metadata>
			<sfw xmlns="&ns_sfw;">
				<slices></slices>
				<sliceSourceBounds
					bottomLeftOrigin="true"
					height="16"
					width="62"
					x="1"
					y="24"
				></sliceSourceBounds>
			</sfw>
		</metadata>
		<g>
			<rect x="2" y="25" class="st0" width="60" height="14" />
			<path class="st1" d="M36.4,25h16c-9.5,7.8-18.3,11.9-24.2,14h-16C18,36.9,26.9,32.8,36.4,25z" />
			<path class="st2" d="M52.4,25H62v14H28.2C34,36.9,42.9,32.8,52.4,25z" />
		</g>
		<!-- OUTLINE -->
		<g v-if="border" id="Qoutline">
			<path
				class="st3"
				:style="{ fill: border }"
				d="M62,25v14H2V25H62 M63,24h-1H2H1v1v14v1h1h60h1v-1V25V24L63,24z"
			/>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BeamSplitter extends Vue {
	@Prop({ default: '' }) readonly border!: string;
}
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
