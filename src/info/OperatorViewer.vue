<template>
	<svg class="operator-viewer" :width="width" :height="height">
		<g class="labels-in" :transform="`translate(${1.5 * margin}, ${0.5 * margin})`">
			<text
				v-for="(label, i) in labelsIn"
				:key="`label-in-${label}`"
				class="label-in"
				:x="scale(i)"
				:y="0"
			>
				⟨{{ label }}|
			</text>
		</g>
		<g class="labels-out" :transform="`translate(${0.5 * margin}, ${1.5 * margin})`">
			<text
				v-for="(label, i) in labelsOut"
				:key="`label-out-${label}`"
				class="label-out"
				:x="0"
				:y="scale(i)"
				dy="0.5em"
			>
				|{{ label }}⟩
			</text>
		</g>
		<g :transform="`translate(${margin}, ${margin})`">
			<rect
				v-for="(d, i) in matrixElements"
				:key="i"
				class="tile"
				:x="scale(d.i)"
				:y="scale(d.j)"
				:width="size"
				:height="size"
				:style="{ fill: colorComplex(d.re, d.im) }"
				@mouseover="tileMouseOver(d)"
			/>
		</g>
		<text class="description" :x="scale(4.5)" :y="scale(10)">{{ description }}</text>
	</svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

const TAU = 2 * Math.PI;

/**
 * Stolen from https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
 * Alternatively: d3.hsl
 */
function hslToHex(hParam: number, sParam: number, lParam: number) {
	let h = hParam;
	let s = sParam;
	let l = lParam;
	h /= 360;
	s /= 100;
	l /= 100;
	let r;
	let g;
	let b;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = (x: number) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

@Component
export default class OperatorViewer extends Vue {
	@Prop({ default: () => 800 }) private width!: number;
	@Prop({ default: () => 600 }) private height!: number;
	@Prop({ default: () => 40 }) private size!: number;
	@Prop({ default: () => 40 }) private margin!: number;
	// @Prop() private height = 600  // generates error
	@Prop({ default: () => [] }) private matrixElements!: {
		i: number;
		j: number;
		re: number;
		im: number;
	}[];
	@Prop({ default: () => [] }) private labelsIn!: number[];
	@Prop({ default: () => [] }) private labelsOut!: number[];

	scale = (i: number) => i * this.size;
	description = '';

	// https://github.com/stared/quantum-game/blob/master/js/transition_heatmap.js
	colorComplex = (re: number, im: number) => {
		const angleInDegrees = ((Math.atan2(im, re) * 360) / TAU + 360) % 360;
		const r = Math.sqrt(re * re + im * im); // for pure color it should be always 1
		return hslToHex(angleInDegrees, 100, 100 - 50 * r);
	};

	tileMouseOver(d: { i: number; j: number; re: number; im: number }) {
		this.description = `i: ${d.i}, j: ${d.j}:   (${d.re.toFixed(2)} + ${d.im.toFixed(2)} i)|${
			this.labelsOut[d.i]
		}⟩⟨${this.labelsIn[d.j]}|`;
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.operator-viewer {
	display: inline-block;
}

.label-in,
.label-out,
.description {
	font-size: 16px;
	text-align: center;
	text-anchor: middle;
	fill: white;
}

.tile {
	cursor: pointer;
}
</style>
