<template>
	<svg>
		<metadata>
			<sfw xmlns="&ns_sfw;">
				<slices></slices>
				<sliceSourceBounds
					bottomLeftOrigin="true"
					height="60"
					width="60"
					x="1.9"
					y="2"
				></sliceSourceBounds>
			</sfw>
		</metadata>
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
	</svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Laser extends Vue {
	@Prop({ default: '' }) readonly border!: string;
}
</script>

<style lang="scss" scoped>
.st0 {
	fill: #ff0055;
}
.st1 {
	fill: #ffffff;
}
</style>
