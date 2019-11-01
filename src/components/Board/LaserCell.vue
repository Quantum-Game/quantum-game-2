<template>
	<svg>
		<g>
			<circle class="st0" cx="31.9" cy="32" r="30" />
			<polygon class="st1" points="55.7,32 18.7,11 18.7,53 	" />
			<g>
				<rect x="21.4" y="31.5" class="st0" width="20.5" height="1" />
				<rect x="31.1" y="21.8" class="st0" width="1" height="20.5" />

				<rect
					x="31.1"
					y="20.6"
					transform="matrix(0.7071 -0.7071 0.7071 0.7071 -13.3855 31.7159)"
					class="st0"
					width="1"
					height="22.8"
				/>

				<rect
					x="20.2"
					y="31.5"
					transform="matrix(0.7071 -0.7071 0.7071 0.7071 -13.3821 31.7086)"
					class="st0"
					width="22.8"
					height="1"
				/>
				<rect
					x="24"
					y="31.5"
					transform="matrix(0.9238 -0.3828 0.3828 0.9238 -9.8522 14.5299)"
					class="st0"
					width="15.1"
					height="1"
				/>
				<rect
					x="31.1"
					y="24.4"
					transform="matrix(0.9238 -0.3828 0.3828 0.9238 -9.8488 14.5307)"
					class="st0"
					width="1"
					height="15.1"
				/>

				<rect
					x="31.1"
					y="24.4"
					transform="matrix(0.3827 -0.9239 0.9239 0.3827 -10.0805 48.9449)"
					class="st0"
					width="1"
					height="15.2"
				/>
				<rect
					x="24"
					y="31.5"
					transform="matrix(0.3828 -0.9238 0.9238 0.3828 -10.0904 48.9465)"
					class="st0"
					width="15.1"
					height="1"
				/>
			</g>
		</g>
		<!-- OUTLINE FOR ROTATION (ONLY IN SANDBOX MODE) -->
		<g class="st3">
			<path
				class="st0"
				d="M31.9,2c16.6,0,30,13.4,30,30s-13.4,30-30,30s-30-13.4-30-30S15.3,2,31.9,2 M31.9,1c-17.1,0-31,13.9-31,31
				s13.9,31,31,31s31-13.9,31-31S49,1,31.9,1L31.9,1z"
			/>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Piece from './Piece';

@Component
export default class LaserCell extends Piece {}
</script>

<style lang="scss" scoped>
.st0 {
	fill: #ff0055;
}
.st1 {
	fill: #ffffff;
}
.st3 {
	display: none;
}
</style>
