<template>
  <svg :width="width + 2 * margin" :height="height + 2 * margin">
    <!-- <animateTransform
      v-if="animate > 0"
      attributeName="transform"
      attributeType="XML"
      type="translate"
      from="0 0"
      :to="toCoord"
      :dur="animate + 's'"
      repeatCount="indefinite"
    />-->
    <g class="photon" :style="computeStyle">
      <g v-if="displayGaussian" class="gaussian">
        <path class="gaussian" :d="computeGaussianPath.pathUp" />
        <path class="gaussian" :d="computeGaussianPath.pathDown" />
      </g>

      <g v-if="displayElectric" class="electric">
        <path
          v-for="(z, index) in zs"
          :key="`electricPath-${index}`"
          :d="computeElectricPath(z)"
          :stroke-width="eScale(gaussianComplex(bre, bim, z, k, sigma))"
          :stroke="eColor(gaussianComplex(bre, bim, z, k, sigma))"
        />
      </g>

      <g v-if="displayMagnetic" class="magnetic">
        <path
          v-for="(z, index) in zs"
          :key="`magneticPath-${index}`"
          :d="computeMagneticPath(z)"
          :stroke-width="mScale(gaussianComplex(are, aim, z, k, sigma))"
          :stroke="mColor(gaussianComplex(bre, bim, z, k, sigma))"
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
  @Prop({ default: false }) readonly displayMagnetic!: boolean;
  @Prop({ default: true }) readonly displayElectric!: boolean;
  @Prop({ default: true }) readonly displayGaussian!: boolean;
  @Prop({ default: true }) readonly displayOpacity!: boolean;
  @Prop({ default: true }) readonly displayDirection!: boolean;
  @Prop({ default: true }) readonly normalize!: boolean;
  @Prop({ default: 1.3 }) readonly squeezeFactor!: number;

  /**
   * Getters from particle
   */
  get step() {
    return 1 / this.width;
  }

  get normalization() {
    if (this.normalize) {
      const { are, aim, bre, bim } = this.particle;
      return Math.sqrt(are ** 2 + aim ** 2 + bre ** 2 + bim ** 2);
    }
    return 1;
  }

  get intensity() {
    return this.particle.intensity;
  }
  get direction() {
    return this.particle.direction;
  }
  get are() {
    return this.particle.are / this.normalization;
  }
  get aim() {
    return this.particle.aim / this.normalization;
  }
  get bre() {
    return this.particle.bre / this.normalization;
  }
  get bim() {
    return this.particle.bim / this.normalization;
  }

  get opacity(): number {
    const scalingPow = 0.5;
    return this.particle.probability ** scalingPow;
  }

  get computeStyle() {
    return {
      opacity: `${this.displayOpacity ? this.opacity : 1}`,
      'transform-origin': `${this.width / 2}px ${this.height / 2}px`,
      transform: `rotate(${this.displayDirection ? this.particle.direction : 0}deg)`
    };
  }

  /**
   * Compute electric path from points
   */
  computeElectricPath(z: number): string {
    let path = '';
    const ox = this.xScale(z - this.step);
    const oy = this.yScale(
      this.gaussianComplex(this.are, this.aim, z - this.step, this.k, this.sigma)
    );
    const tx = this.xScale(z);
    const ty = this.yScale(this.gaussianComplex(this.are, this.aim, z, this.k, this.sigma));
    path += `M ${ox} ${oy} `;
    path += `L ${tx} ${ty} `;
    return path;
  }

  /**
   * Compute electric path from points
   */
  computeMagneticPath(z: number): string {
    let path = '';
    const ox = this.xScale(z - this.step);
    const oy = this.yScale(
      this.gaussianComplex(this.bre, this.bim, z - this.step, this.k, this.sigma)
    );
    const tx = this.xScale(z);
    const ty = this.yScale(this.gaussianComplex(this.bre, this.bim, z, this.k, this.sigma));
    path += `M ${ox} ${oy} `;
    path += `L ${tx} ${ty}`;
    return path;
  }

  /**
   * Compute electric path from points
   * @return bots svg paths as strings
   */
  get computeGaussianPath(): { pathUp: string; pathDown: string } {
    let pathUp = '';
    let pathDown = '';
    this.zs.forEach((z, index) => {
      const x = this.xScale(z);
      const y = this.yScale(this.gaussian(z));
      if (index === 0) {
        pathUp += `M ${x} ${y} `;
        pathDown += `M ${x} ${this.availableHeight - y} `;
      } else {
        pathUp += `L ${x} ${y} `;
        pathDown += `L ${x} ${this.availableHeight - y} `;
      }
    });
    return { pathUp, pathDown };
  }

  get availableHeight() {
    return this.height - this.margin;
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
   * FIXME: squeezeFactor
   */
  get yScale() {
    return d3
      .scaleLinear()
      .domain([-this.squeezeFactor, this.squeezeFactor])
      .range([0, this.availableHeight]);
  }
  /**
   * Get magnetic scaling
   */
  get mScale() {
    return d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0.5, 6]);
  }
  /**
   * Get electric scaling
   */
  get eScale() {
    return d3
      .scaleLinear()
      .domain([-1, 1])
      .range([1, 4]);
  }

  /**
   * Get SVG coordinates of particle animation
   * @returns string
   */
  get toCoord(): string {
    const tileSize = 64;
    const x = this.particle.relativeTarget.x * tileSize;
    const y = this.particle.relativeTarget.y * tileSize;
    return `${x} ${y}`;
  }

  /**
   * Numbers of points to render, should scale with the width
   * @returns a range of steps
   */
  get zs(): number[] {
    return d3.range(-1, 1, this.step);
  }

  /**
   * Magnetic field color scheme.
   */
  mColor = d3.scaleSequential(d3.interpolateViridis).domain([-1, 1]);

  /**
   * Electric field color scheme.
   * See also: https://github.com/d3/d3-scale-chromatic/
   *
   */
  eColor = d3
    .scaleLinear<string>()
    .domain([-1, 0, 1])
    .range(['#ffbb3b', '#ff0055', '#5c00d3']); // YELLOW RED PURPLE

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
  .electric {
    fill: transparent;
  }
  .magnetic {
    fill: transparent;
  }
  .gaussian {
    stroke-width: 6px;
    fill: #5c00d3;
    stroke: #5c00d3;
  }
}
</style>
