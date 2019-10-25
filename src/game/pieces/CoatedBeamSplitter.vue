<template>
	<svg>
		<metadata>
			<sfw xmlns="&ns_sfw;">
				<slices></slices>
				<sliceSourceBounds
					bottomLeftOrigin="true"
					height="18"
					width="62"
					x="1"
					y="23"
				></sliceSourceBounds>
			</sfw>
		</metadata>
		<g>
			<rect x="2" y="24" class="st0" width="60" height="16" />
			<path class="st1" d="M36.4,24h16c-9.5,7.8-18.3,11.9-24.2,14h-16C18,35.9,26.9,31.8,36.4,24z" />
			<path class="st2" d="M52.4,24H62v14H28.2C34,35.9,42.9,31.8,52.4,24z" />
			<rect x="2" y="38" class="st3" width="60" height="2" />
		</g>
		<g v-if="border" id="_x3C_Qoutline_x3E_">
			<path
				class="st4"
				:style="{ fill: border }"
				d="M62,24v16H2V24H62 M63,23h-1H2H1v1v16v1h1h60h1v-1V24V23L63,23z"
			/>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Piece from './Piece';

@Component
export default class CoatedBeamSplitter extends Piece {}
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
.st3 {
	fill: #5a4278;
}
</style>
