<template>
	<svg>
		<metadata>
			<sfw xmlns="&ns_sfw;">
				<slices></slices>
				<sliceSourceBounds
					bottomLeftOrigin="true"
					height="51.8"
					width="53.6"
					x="3.3"
					y="6"
				></sliceSourceBounds>
			</sfw>
		</metadata>
		<g>
			<g id="lemon">
				<g>
					<circle class="st0" cx="47.3" cy="23.2" r="7.6" />
					<path
						class="st1"
						d="M47.3,16.6c3.6,0,6.6,3,6.6,6.6s-3,6.6-6.6,6.6s-6.6-3-6.6-6.6C40.7,19.5,43.7,16.6,47.3,16.6 M47.3,14.6
						c-4.7,0-8.6,3.8-8.6,8.6s3.8,8.6,8.6,8.6s8.6-3.8,8.6-8.6S52.1,14.6,47.3,14.6L47.3,14.6z"
					/>
				</g>
				<g>
					<rect x="46.9" y="18" class="st1" width="1" height="10" />
				</g>
				<g>
					<rect x="42.4" y="22.5" class="st1" width="10" height="1" />
				</g>
				<g>
					<rect
						x="46.9"
						y="18"
						transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.3732 40.2507)"
						class="st1"
						width="1"
						height="9.9"
					/>
				</g>
				<g>
					<rect
						x="42.5"
						y="22.5"
						transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.3732 40.2507)"
						class="st1"
						width="9.9"
						height="1"
					/>
				</g>
				<g>
					<circle class="st0" cx="47.3" cy="23.2" r="2.1" />
				</g>
			</g>
			<path
				id="straw"
				class="st2"
				d="M27.6,55.5L15.5,11c-0.1-0.6-0.5-0.7-0.7-0.8c-0.2-0.1-0.5,0-0.8,0.3l-7,8.9l-2.4-1.9l7-8.9
				c1-1.2,2.4-1.7,3.9-1.3c1.5,0.4,2.6,1.5,2.9,3l12.1,44.4L27.6,55.5z"
			/>
			<polygon class="st3" points="47.4,57 17.4,57 17.4,23 47.4,23 	" />
			<rect x="18.4" y="37" class="st2" width="28" height="19" />
			<polygon class="st4" points="22.4,24 25.4,57 27.4,57 24.4,24 	" />
			<polygon class="st4" points="26.4,24 29.4,57 31.4,57 28.4,24 	" />
			<path class="st2" d="M46.4,24v32h-28V24H46.4 M47.4,23h-30v34h30V23L47.4,23z" />
		</g>
		<g v-if="border" id="Qoutline">
			<path
				class="st5"
				:style="{ fill: border }"
				d="M14.7,7.2c0.3,0,0.6,0,0.9,0.1c1.5,0.4,2.6,1.5,2.9,3L21.9,23h16.8c0.1-4.7,4-8.4,8.6-8.4
				c4.8,0,8.6,3.8,8.6,8.6c0,4.8-3.7,8.5-8.5,8.6V57h-16h-2h-2h-2h-8V23h1.4l-3.3-12c-0.1-0.6-0.5-0.7-0.7-0.8c-0.1,0-0.1,0-0.2,0
				c-0.2,0-0.4,0.1-0.6,0.3l-7,8.9l-2.4-1.9l7-8.9C12.5,7.7,13.6,7.2,14.7,7.2 M14.7,6.2L14.7,6.2c-1.4,0-2.8,0.7-3.7,1.8l-7,8.9
				l-0.6,0.8l0.8,0.6l2.4,1.9l0.8,0.6L7.9,20l6.8-8.6L17.5,22h-0.1h-1v1v34v1h1h8h2h2h2h16h1v-1V32.7c4.8-0.5,8.5-4.5,8.5-9.5
				c0-5.4-4.2-9.6-9.6-9.6c-4.8,0-8.9,3.7-9.5,8.4H22.7l-3.2-11.9c-0.4-1.9-1.8-3.3-3.6-3.8C15.5,6.3,15.1,6.2,14.7,6.2L14.7,6.2z"
			/>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SugarSolution extends Vue {
	@Prop({ default: '' }) readonly border!: string;
}
</script>

<style lang="scss" scoped>
.st0 {
	fill: #faff1f;
}
.st1 {
	fill: #ffd31a;
}
.st2 {
	fill: #61dbef;
}
.st3 {
	opacity: 0.25;
	fill: #61dbef;
	enable-background: new;
}
.st4 {
	opacity: 0.5;
	fill: #fafcfc;
	enable-background: new;
}
</style>
