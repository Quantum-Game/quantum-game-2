<template>
	<svg>
		<metadata>
			<sfw xmlns="&ns_sfw;">
				<slices></slices>
				<sliceSourceBounds
					bottomLeftOrigin="true"
					height="59.5"
					width="54"
					x="5.1"
					y="2.1"
				></sliceSourceBounds>
			</sfw>
		</metadata>
		<g>
			<path
				class="st0"
				d="M47.7,9.9H16.5c-5.2,0-9.4,4.2-9.4,9.4v31.2c0,5.2,4.2,9.4,9.4,9.4h31.2c5.2,0,9.4-4.2,9.4-9.4V19.3
				C57.1,14.1,52.9,9.9,47.7,9.9z"
			/>
			<path
				class="st1"
				d="M47.7,9.9H16.5c-5.2,0-9.4,4.2-9.4,9.4v31.2c0,5.2,4.2,9.4,9.4,9.4h31.2c5.2,0,9.4-4.2,9.4-9.4V19.3
				C57.1,14.1,52.9,9.9,47.7,9.9z M53.1,50.5c0,3-2.4,5.4-5.4,5.4H16.5c-3,0-5.4-2.4-5.4-5.4V19.3c0-3,2.4-5.4,5.4-5.4h31.2
				c3,0,5.4,2.4,5.4,5.4V50.5z"
			/>
			<path
				class="st2"
				d="M47.7,8.9h-0.6H47V6.4h0.1h4v-3h-39v3H16v2.5c-5.5,0.3-9.9,4.8-9.9,10.4v31.2c0,5.7,4.7,10.4,10.4,10.4h31.2
				c5.7,0,10.4-4.7,10.4-10.4V19.3C58.1,13.5,53.5,8.9,47.7,8.9z M57.1,50.5c0,5.2-4.2,9.4-9.4,9.4H16.5c-5.2,0-9.4-4.2-9.4-9.4V19.3
				c0-5.2,4.2-9.4,9.4-9.4h31.2c5.2,0,9.4,4.2,9.4,9.4V50.5z"
			/>
		</g>
		<g v-if="border" id="Qoutline">
			<path
				class="st3"
				:style="{ fill: border }"
				d="M51.1,3.4v3h-4H47v2.5h0.1h0.6c5.7,0,10.4,4.7,10.4,10.4v31.2c0,5.7-4.7,10.4-10.4,10.4H16.5
				c-5.7,0-10.4-4.7-10.4-10.4V19.3c0-5.6,4.4-10.1,9.9-10.4V6.4h-3.9v-3H51.1 M52.1,2.4h-1h-39h-1v1v3v1h1H15V8
				c-5.6,0.7-9.9,5.5-9.9,11.3v31.2c0,6.3,5.1,11.4,11.4,11.4h31.2c6.3,0,11.4-5.1,11.4-11.4V19.3C59.1,13.1,54.2,8,48,7.9V7.4h3.1h1
				v-1v-3V2.4L52.1,2.4z"
			/>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Piece from './Piece';

@Component
export default class VacuumJar extends Piece {}
</script>

<style lang="scss" scoped>
.st0 {
	opacity: 0.4;
	fill: #120223;
	enable-background: new;
}
.st1 {
	opacity: 0.27;
	fill: #61dbef;
	enable-background: new;
}
.st2 {
	fill: #61dbef;
}
</style>
