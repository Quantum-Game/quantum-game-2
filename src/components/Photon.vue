<template>
	<svg class="photon" :width="width + 2 * margin" :height="height + 2 * margin">
		<text v-once class="text" :x="width / 2" :y="height + 35">{{ name }}</text>
		<g v-if="displayElectric" class="electric">
			<circle
				v-for="(z, index) in zs"
				:key="`electricPoint-${index}`"
				class="point electric"
				:cx="xScale(z)"
				:cy="yScale(gaussianComplex(are, aim, z, k, sigma))"
				:r="eScale(gaussianComplex(bre, bim, z, k, sigma))"
				:style="{ fill: eColor(gaussianComplex(bre, bim, z, k, sigma)) }"
			/>
		</g>

		<g v-if="displayMagnetic" class="magnetic">
			<circle
				v-for="(z, index) in zs"
				:key="`magneticPoint-${index}`"
				class="point magnetic"
				:cx="xScale(z)"
				:cy="yScale(gaussianComplex(bre, bim, z, k, sigma))"
				:r="mScale(gaussianComplex(are, aim, z, k, sigma))"
				:style="{ fill: mColor(gaussianComplex(bre, bim, z, k, sigma)) }"
			/>
		</g>

		<g v-if="displayGaussian" class="gaussian">
			<circle
				v-for="(z, index) in zs"
				:key="`gaussianPointb-${index}`"
				class="point gaussian"
				:cx="xScale(z)"
				:cy="yScale(gaussian(z))"
				:r="3"
				:style="{ fill: 'hsla(170, 20%, 30%, 0.3)' }"
			/>
			<circle
				v-for="(z, index) in zs"
				:key="`gaussianPointt-${index}`"
				class="point gaussian"
				:cx="xScale(z)"
				:cy="yScale(-gaussian(z))"
				:r="3"
				:style="{ fill: 'hsla(170, 20%, 30%, 0.3)' }"
			/>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';

import { select } from 'd3-selection';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateViridis, interpolateInferno } from 'd3-scale-chromatic';
import { range } from 'd3-array';

const d3 = {
	scaleLinear,
	scaleSequential,
	select,
	range,
	interpolateInferno,
	interpolateViridis
};

@Component
export default class Photon extends Vue {
	@Prop({ default: 'photon' }) readonly name!: string;
	@Prop({ default: 0 }) readonly are!: number;
	@Prop({ default: 0 }) readonly aim!: number;
	@Prop({ default: 0 }) readonly bre!: number;
	@Prop({ default: 0 }) readonly bim!: number;
	@Prop({ default: 300 }) readonly width!: number;
	@Prop({ default: 200 }) readonly height!: number;
	@Prop({ default: 20 }) readonly margin!: number;
	@Prop({ default: 20 }) readonly k!: number;
	@Prop({ default: 0.3 }) readonly sigma!: number;
	@Prop({ default: 0.001 }) readonly range!: number;
	@Prop({ default: true }) readonly displayMagnetic!: boolean;
	@Prop({ default: true }) readonly displayElectric!: boolean;
	@Prop({ default: true }) readonly displayGaussian!: boolean;

	xScale = d3
		.scaleLinear()
		.domain([-1, 1])
		.range([this.margin, this.width - this.margin]);
	yScale = d3
		.scaleLinear()
		.domain([-1, 1])
		.range([this.margin, this.height - this.margin]);
	mScale = d3
		.scaleLinear()
		.domain([-1, 1])
		.range([1, 3]);
	eScale = d3
		.scaleLinear()
		.domain([-1, 1])
		.range([2, 10]);
	eColor = d3.scaleSequential(d3.interpolateInferno).domain([-1, 1]);
	mColor = d3.scaleSequential(d3.interpolateViridis).domain([-1, 1]);
	zs = d3.range(-1, 1, this.range);

	computeComplex(re: number, im: number, z: number, k = 20): number {
		return re * Math.cos(k * z) + im * Math.sin(k * z);
	}

	gaussian(z: number, sigma = 0.3): number {
		return Math.exp((-z * z) / (2 * sigma * sigma));
	}

	gaussianComplex(re: number, im: number, z: number, k = 20, sigma = 0.3): number {
		return this.computeComplex(re, im, z) * Math.exp((-z * z) / (2 * sigma * sigma));
	}
}
</script>

<style lang="scss">
.photon {
	// background-color: black;
	padding: 20px;
	.text {
		fill: lightgrey;
		stroke: lightgrey;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 20px;
		text-anchor: middle;
	}
	.point {
		stroke-width: 3px;
		.electric {
			stroke-width: 3px;
		}
		.magnetic {
			stroke-width: 2px;
		}
		.gaussian {
			stroke-width: 1px;
		}
	}
}
</style>
