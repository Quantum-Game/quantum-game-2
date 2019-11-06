<template>
  <svg :width="width + 2 * margin" :height="height + 2 * margin">
    <animateTransform
      v-if="animate > 0"
      attributeName="transform"
      attributeType="XML"
      type="translate"
      from="0 0"
      :to="toCoord"
      :dur="animate + 's'"
      repeatCount="indefinite"
    />
    <g class="photon" :style="computeStyle">
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
          :r="1"
        />
        <circle
          v-for="(z, index) in zs"
          :key="`gaussianPointt-${index}`"
          class="point gaussian"
          :cx="xScale(z)"
          :cy="yScale(-gaussian(z))"
          :r="1"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import { select } from 'd3-selection';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateViridis, interpolateInferno } from 'd3-scale-chromatic';
import { range } from 'd3-array';
import Particle from '@/engine/Particle';

const d3 = {
  scaleLinear,
  scaleSequential,
  select,
  range,
  interpolateInferno,
  interpolateViridis
};

@Component
export default class AppPhoton extends Vue {
  @Prop() readonly particle!: Particle;
  @Prop({ default: 0 }) readonly animate!: number;
  @Prop({ default: 64 }) readonly width!: number;
  @Prop({ default: 64 }) readonly height!: number;
  @Prop({ default: 20 }) readonly margin!: number;
  @Prop({ default: 20 }) readonly k!: number;
  @Prop({ default: 0.3 }) readonly sigma!: number;
  @Prop({ default: 0.001 }) readonly range!: number;
  @Prop({ default: true }) readonly displayMagnetic!: boolean;
  @Prop({ default: true }) readonly displayElectric!: boolean;
  @Prop({ default: true }) readonly displayGaussian!: boolean;

  /**
   * Getters from particle
   */
  get intensity() {
    return this.particle.intensity;
  }
  get direction() {
    return this.particle.direction;
  }
  get are() {
    return this.particle.are;
  }
  get aim() {
    return this.particle.aim;
  }
  get bre() {
    return this.particle.bre;
  }
  get bim() {
    return this.particle.bim;
  }

  get computeStyle() {
    return {
      opacity: `${this.particle.probability}`,
      'transform-origin': `${this.width / 2}px ${this.height / 2}px`,
      transform: `rotate(${this.particle.direction}deg)`
    };
  }

  /**
   * Get horizontal scaling
   */
  get xScale() {
    return d3
      .scaleLinear()
      .domain([-1, 1])
      .range([this.margin, this.width - this.margin]);
  }
  /**
   * Get vertical scaling
   */
  get yScale() {
    return d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, this.height]);
  }
  /**
   * Get magnetic scaling
   */
  get mScale() {
    return d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0.5, 3]);
  }
  /**
   * Get electric scaling
   */
  get eScale() {
    return d3
      .scaleLinear()
      .domain([-1, 1])
      .range([1, 2]);
  }

  /**
   * Get SVG coordinates of particle animation
   * @returns string
   */
  get toCoord(): string {
    const tileSize = 64;
    const x = this.particle.relativeTarget.x * tileSize;
    const y = this.particle.relativeTarget.y * tileSize;
    console.log(`X:${x} - Y:${y}`);

    return `${x} ${y}`;
  }

  /**
   * Numbers of points to render, should scale with the width
   * @returns a range of steps
   */
  get zs(): number[] {
    return d3.range(-1, 1, 1 / (this.width * 3));
  }
  eColor = d3.scaleSequential(d3.interpolateViridis).domain([-1, 1]);
  mColor = d3.scaleSequential(d3.interpolateInferno).domain([-1, 1]);

  /**
   * Compute graph properties from complex values
   */
  computeComplex(re: number, im: number, z: number, k = 20): number {
    return re * Math.cos(k * z) + im * Math.sin(k * z);
  }

  /**
   * Gaussian scaling
   */
  gaussian(z: number, sigma = 0.3): number {
    return Math.exp((-z * z) / (2 * sigma * sigma));
  }
  /**
   * Gaussian scaling of the graph
   */
  gaussianComplex(re: number, im: number, z: number, k = 20, sigma = 0.3): number {
    return this.computeComplex(re, im, z) * Math.exp((-z * z) / (2 * sigma * sigma));
  }
}
</script>

<style lang="scss" scoped>
.photon {
  padding: 0px;
  position: relative;
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
