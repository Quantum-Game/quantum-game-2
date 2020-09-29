<template>
  <svg :width="width + 2 * margin" :height="height + 2 * margin">
    <g class="photon" :style="computeStyle">
      <g>
        <radialGradient
          :id="`photon-gradient-${uid}`"
          cx="32"
          cy="32"
          r="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" style="stop-color:#5C00D3" />
          <stop offset="1" style="stop-color:#5C00D3;stop-opacity:0" />
        </radialGradient>
        <circle :fill="`url(#photon-gradient-${uid})`" cx="32" cy="32" r="32" />
      </g>
      <g v-if="displayGaussian" class="gaussian">
        <path class="gaussian" :d="computeGaussianPath.pathUp" />
        <path class="gaussian" :d="computeGaussianPath.pathDown" />
      </g>

      <g v-if="displayElectric" class="electric">
        <path
          v-for="(z, index) in zs"
          :key="index"
          :d="computeElectricPath(z)"
          stroke-linecap="round"
          :stroke-width="eScale(gaussianComplex(b, z, sigma))"
          :stroke="eColor(gaussianComplex(b, z, sigma))"
        />
      </g>

      <g v-if="displayMagnetic" class="magnetic">
        <path
          v-for="(z, index) in zs"
          :key="index"
          :d="computeMagneticPath(z)"
          stroke-linecap="round"
          :stroke-width="mScale(gaussianComplex(a, z, sigma))"
          :stroke="mColor(gaussianComplex(a, z, sigma))"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { range } from 'd3-array'
import { scaleLinear, scaleSequential } from 'd3-scale'
import { interpolateViridis, interpolateInferno } from 'd3-scale-chromatic'
import { Complex, directionToDegrees } from '@/engine/model'
import type { Particle } from '@/engine/model'
import { IStyle } from '@/types'
import { computed, defineComponent, PropType } from 'vue'

const d3 = {
  range,
  scaleLinear,
  scaleSequential,
  interpolateInferno,
  interpolateViridis,
}

let uid = 0;

export default defineComponent({
  name: 'AppPhoton',
  props: {
    particle: { type: Object as PropType<Particle>, required:  true },
    width: { type: Number, default: 64 },
    height: { type: Number, default: 64 },
    margin: { type: Number, default: 20 },
    k: { type: Number, default: 20 },
    sigma: { type: Number, default: 0.3 },
    range: { type: Number, default: 0.001 },
    displayMagnetic: { type: Boolean, default: false },
    displayElectric: { type: Boolean, default: true },
    displayGaussian: { type: Boolean, default: true },
    displayOpacity: { type: Boolean, default: true },
    displayDirection: { type: Boolean, default: true },
    normalize: { type: Boolean, default: true },
    squeezeFactor: { type: Number, default: 1.3 },
  },
  setup(props) {

      const step = computed((): number => {
        return 1 / props.width
      })

      const normalization = computed((): number => {
        if (props.normalize) {
          return Math.sqrt(intensity.value)
        }
        return 1
      })

      const intensity = computed((): number => {
        return props.particle.a.abs2() + props.particle.b.abs2()
      })

      const a = computed((): Complex => {
        const { re, im } = props.particle.a
        const norm = normalization.value
        return new Complex(re / norm, im / norm)
      })

      const b = computed((): Complex => {
        const { re, im } = props.particle.b
        const norm = normalization.value
        return new Complex(re / norm, im / norm)
      })

      const opacity = computed((): number => {
        return Math.sqrt(intensity.value)
      })

      const computeStyle = computed((): IStyle => {
        return {
          opacity: `${props.displayOpacity ? opacity.value : 1}`,
          'transform-origin': `${props.width / 2}px ${props.height / 2}px`,
          transform: `rotate(${props.displayDirection ? directionToDegrees(props.particle.direction) : 0}deg)`,
        }
      })


      const availableHeight = computed((): number => {
        return props.height - props.margin
      })

      /**
       * Get horizontal scaling
       */
      /* eslint-disable-next-line */
      const xScale = computed(() => {
        return d3
          .scaleLinear()
          .domain([-1, 1])
          .range([props.margin, props.width - props.margin])
      })

      /**
       * Get vertical scaling
       * FIXME: squeezeFactor
       */
      /* eslint-disable-next-line */
      const yScale = computed(() => {
        return d3
          .scaleLinear()
          .domain([-props.squeezeFactor, props.squeezeFactor])
          .range([0, availableHeight.value])
      })

      /**
       * Get magnetic scaling
       */
      /* eslint-disable-next-line */
      const mScale = computed(() => {
        return d3
          .scaleLinear()
          .domain([-1, 1])
          .range([0.5, 6])
      })

      /**
       * Get electric scaling
       */
      /* eslint-disable-next-line */
      const eScale = computed(() => {
        return d3
          .scaleLinear()
          .domain([-1, 1])
          .range([1, 4])
      })

      /**
       * Numbers of points to render, should scale with the width
       * @returns a range of steps
       */
      const zs = computed((): number[] => {
        return d3.range(-1, 1, step.value)
      })



      /**
       * Compute electric path from points
       */
      function computeElectricPath(z: number): string {
        let path = ''
        const ox = xScale.value(z - step.value)
        const oy = yScale.value(gaussianComplex(a.value, z - step.value, props.sigma))
        const tx = xScale.value(z)
        const ty = yScale.value(gaussianComplex(a.value, z, props.sigma))
        path += `M ${ox} ${oy} `
        path += `L ${tx} ${ty} `
        return path
      }

      /**
       * Compute electric path from points
       */
      function computeMagneticPath(z: number): string {
        let path = ''
        const ox = xScale.value(z - step.value)
        const oy = yScale.value(gaussianComplex(b.value, z - step.value, props.sigma))
        const tx = xScale.value(z)
        const ty = yScale.value(gaussianComplex(b.value, z, props.sigma))
        path += `M ${ox} ${oy} `
        path += `L ${tx} ${ty}`
        return path
      }

      /**
       * Compute electric path from points
       * @return bots svg paths as strings
       */
      const computeGaussianPath = computed((): { pathUp: string; pathDown: string } => {
        let pathUp = ''
        let pathDown = ''
        zs.value.forEach((z, index) => {
          const x = xScale.value(z)
          const y = yScale.value(gaussian(z))
          if (index === 0) {
            pathUp += `M ${x} ${y} `
            pathDown += `M ${x} ${availableHeight.value - y} `
          } else {
            pathUp += `L ${x} ${y} `
            pathDown += `L ${x} ${availableHeight.value - y} `
          }
        })
        return { pathUp, pathDown }
      })


      /**
       * Magnetic field color scheme.
       */
      const mColor = d3.scaleSequential(d3.interpolateViridis).domain([-1, 1])

      /**
       * Electric field color scheme.
       * See also: https://github.com/d3/d3-scale-chromatic/
       *
       */
      const eColor = d3
        .scaleLinear<string>()
        .domain([-1, 0, 1])
        .range(['#5c00d3', '#ff0055', '#ffde3e']) // PURPLE RED YELLOW

      /**
       * Gaussian scaling
       */
      function gaussian(z: number, sigma = 0.3): number {
        return Math.exp((-z * z) / (2 * sigma * sigma))
      }

      /**
       * Gaussian scaling of the graph
       */
      function gaussianComplex(c: Complex, z: number, sigma = 0.3): number {
        return computeComplex(c, z) * Math.exp((-z * z) / (2 * sigma * sigma))
      }

      /**
       * Compute graph properties from complex values
       */
      function computeComplex(c: Complex, z: number, k = 20): number {
        return c.re * Math.cos(k * z) + c.im * Math.sin(k * z)
      }

      return {
        uid: uid++,
        zs,
        computeStyle,
        computeGaussianPath,
        computeElectricPath,
        computeMagneticPath,
        eScale,
        mScale,
        eColor,
        mColor,
        gaussianComplex,
        b,
        a,
      }
  }
})
</script>

<style lang="scss" scoped>
.photon {
  padding: 0px;
  position: relative;
  perspective: 100px;

  .electric {
    fill: transparent;
    transform-origin: 32px;
  }
  .magnetic {
    fill: transparent;
    transform-origin: 32px;
  }
  .gaussian {
    stroke-width: 3px;
    fill: rgba(92, 0, 211, 1);
    stroke: rgba(92, 0, 211, 0.5);
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
