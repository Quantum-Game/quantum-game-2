<template>
  <g :style="photonOuterStyle">
    <clipPath v-if="clipPath" :id="`photonClip-${uid}`" clip-path-units="userSpaceOnUse">
      <path :d="clipPath" clip-rule="evenodd" />
    </clipPath>
    <svg :width="64" :height="64" viewBox="-1.2 -1.2 2.4 2.4" style="overflow: visible">
      <g :clip-path="clipPath ? `url(#photonClip-${uid})` : undefined">
        <g class="photon" :style="photonInnerStyle">
          <!-- <circle cx="0" cy="0" r="5.2" fill="white" opacity="0.5" /> -->
          <circle fill="url(#photon-bg-gradient)" cx="0" cy="0" r="1" />
          <path v-if="displayGaussian" class="gaussian" :d="gaussianPath" />
          <g fill="none" stroke-linecap="round">
            <path
              v-for="(p, index) in wavePaths"
              :key="index"
              :d="p.path"
              :stroke="p.color"
              :stroke-width="p.width"
            />
          </g>
        </g>
      </g>
    </svg>
  </g>
</template>

<script lang="ts">
import { range } from 'd3-array'
import { scaleLinear, scaleSequential } from 'd3-scale'
import { interpolateViridis } from 'd3-scale-chromatic'
import { Complex, directionToDegrees } from '@/engine/model'
import { IStyle } from '@/types'
import { computed, defineComponent, PropType } from 'vue'
import { clipPlanePath, InterpolatedParticle } from '@/engine/interpolation'

let uid = 0

/**
 * Magnetic field color scheme.
 */
const mColor = scaleSequential(interpolateViridis).domain([-1, 1])

/**
 * Electric field color scheme.
 * See also: https://github.com/d3/d3-scale-chromatic/
 *
 */
const eColor = scaleLinear<string>()
  .domain([-1, 0, 1])
  .range(['#5c00d3', '#ff0055', '#ffde3e']) // PURPLE RED YELLOW

/**
 * Gaussian distribution curve
 */
function gaussian(z: number, sigma = 0.3): number {
  return Math.exp((-z * z) / (2 * sigma * sigma))
}

/**
 * Gaussian derivative
 */
function gaussianDz(z: number, sigma = 0.3): number {
  const c = 1 / (2 * sigma * sigma)
  return -(2 * z * Math.exp(-z * z * c)) * c
}

const numSteps = 128
const step = 2 / numSteps
const zs = range(-1, 1, step)

function upToFixed(num: number, digits: number): string {
  return num.toFixed(digits).replace(/\.?0+$/, '')
}

let pathUp = ''
let pathDown = ''
zs.forEach((z, index) => {
  const x = upToFixed(z, 3)
  const y = upToFixed(gaussian(z), 3)
  if (index === 0) {
    pathUp += `M${x} ${y}`
  } else {
    pathUp += `L${x} ${y}`
    pathDown = `L${x} ${-y}` + pathDown
  }
})

const gaussianPath = `${pathUp} ${pathDown}z`

const k = 20

function computeWavelet(z: number) {
  const gauss = gaussian(z)
  const gaussDz = gaussianDz(z)

  const sin = Math.sin(k * z)
  const cos = Math.cos(k * z)

  const sinDz = k * cos
  const cosDz = k * -sin

  const a = cos * gauss
  const b = sin * gauss

  const aDz = cosDz * gauss + cos * gaussDz
  const bDz = sinDz * gauss + sin * gaussDz

  return [a, b, aDz, bDz] as const
}

const wavelet = zs.map(computeWavelet)

export default defineComponent({
  name: 'AppPhoton',
  props: {
    particle: { type: Object as PropType<InterpolatedParticle>, required: true },
    k: { type: Number, default: 20 },
    displayMagnetic: { type: Boolean, default: false },
    displayElectric: { type: Boolean, default: true },
    displayGaussian: { type: Boolean, default: true },
    displayOpacity: { type: Boolean, default: true },
    displayDirection: { type: Boolean, default: true },
  },
  setup(props) {
    const intensity = computed((): number => {
      return props.particle.a.abs2() + props.particle.b.abs2()
    })
    const normalization = computed((): number => {
      return Math.sqrt(intensity.value)
    })
    const a = computed(
      (): Complex => {
        const { re, im } = props.particle.a
        const norm = normalization.value
        return new Complex(re / norm, im / norm)
      }
    )
    const b = computed(
      (): Complex => {
        const { re, im } = props.particle.b
        const norm = normalization.value
        return new Complex(re / norm, im / norm)
      }
    )

    const photonInnerStyle = computed(
      (): IStyle => {
        return {
          opacity: `${props.displayOpacity ? intensity.value : 1}`,
          transformOrigin: `$0px 0px`,
          transform: `rotate(${
            props.displayDirection ? directionToDegrees(props.particle.direction) : 0
          }deg)`,
        }
      }
    )
    const photonOuterStyle = computed(
      (): IStyle => {
        const p = props.particle
        return {
          // mixBlendMode: 'screen',
          transform: `translate(${p.position.x * 64}px, ${p.position.y * 64}px)`,
        }
      }
    )

    const clipPath = computed(() => {
      const p = props.particle
      return clipPlanePath(p.maskRotation, p.position)
    })

    const waves = computed(() => {
      const { re: aRe, im: aIm } = a.value
      const { re: bRe, im: bIm } = b.value
      return wavelet.map(
        ([a, b, aDz, bDz]) =>
          [
            aRe * a + aIm * b,
            bRe * a + bIm * b,
            aRe * aDz + aIm * bDz,
            bRe * aDz + bIm * bDz,
          ] as const
      )
    })

    const segmentBatches = computed(() => {
      const yBatches: Record<string, number[]> = {}
      const xBatches: Record<string, number[]> = {}
      const w = waves.value
      for (let i = 0; i < zs.length - 1; i++) {
        const [x1, y1] = w[i]
        const [x2, y2] = w[i + 1]
        const xBatch = (x1 + x2).toFixed(2)
        const yBatch = (y1 + y2).toFixed(2)
        const xArr = xBatches[xBatch]
        const yArr = yBatches[yBatch]
        if (xArr === undefined) {
          xBatches[xBatch] = [i]
        } else {
          xArr.push(i)
        }
        if (yArr === undefined) {
          yBatches[yBatch] = [i]
        } else {
          yArr.push(i)
        }
      }
      return { xBatches: Object.values(xBatches), yBatches: Object.values(yBatches) }
    })

    const dxStep = step * 0.5
    function pathSegment(
      x1: number,
      x2: number,
      y1: number,
      y2: number,
      y1Dx: number,
      y2Dx: number
    ) {
      const c1b = x1 + dxStep
      const c1y = y1 + y1Dx * dxStep
      const c2b = x2 - dxStep
      const c2y = y2 - y2Dx * dxStep
      return `M${x1.toFixed(3)} ${y1.toFixed(3)}C${c1b.toFixed(3)} ${c1y.toFixed(3)} ${c2b.toFixed(
        3
      )} ${c2y.toFixed(3)} ${x2.toFixed(3)} ${y2.toFixed(3)}`
    }

    const electricPaths = computed(() => {
      const batches = segmentBatches.value.yBatches
      const w = waves.value
      return batches.map((batch) => {
        const [_x1, y1] = w[batch[0]]
        const [_x2, y2] = w[batch[0] + 1]
        const yAvg = +((y1 + y2) * 0.5).toFixed(2)

        let path = ''
        for (const i of batch) {
          const [x1, _y1, x1Dz] = w[i]
          const [x2, _y2, x2Dz] = w[i + 1]
          path += pathSegment(zs[i], zs[i + 1], x1, x2, x1Dz, x2Dz)
        }

        return {
          path,
          color: eColor(yAvg),
          width: 0.07 + yAvg * 0.06,
        }
      })
    })

    const magneticPaths = computed(() => {
      const batches = segmentBatches.value.xBatches
      const w = waves.value
      return batches.map((batch) => {
        const [x1] = w[batch[0]]
        const [x2] = w[batch[0] + 1]
        const xAvg = +((x1 + x2) * 0.5).toFixed(2)

        let path = ''
        for (const i of batch) {
          const [_x1, y1, _x1Dz, y1Dz] = w[i]
          const [_x2, y2, _x2Dz, y2Dz] = w[i + 1]
          path += pathSegment(zs[i], zs[i + 1], -y1, -y2, -y1Dz, -y2Dz)
        }

        return {
          path,
          color: mColor(xAvg),
          width: 0.07 + xAvg * 0.06,
        }
      })
    })

    const wavePaths = computed(() => {
      if (props.displayElectric && props.displayMagnetic) {
        return electricPaths.value.concat(magneticPaths.value).sort((a, b) => a.width - b.width)
      } else if (props.displayElectric) {
        return electricPaths.value
      } else if (props.displayMagnetic) {
        return magneticPaths.value
      }
      return []
    })

    return {
      uid: uid++,
      photonInnerStyle,
      photonOuterStyle,
      gaussianPath,
      wavePaths,
      clipPath,
    }
  },
})
</script>

<style lang="scss" scoped>
.photon {
  padding: 0px;
  position: relative;
  .gaussian {
    stroke-width: 0.1px;
    fill: rgba(92, 0, 211, 1);
    stroke: rgba(92, 0, 211, 0.5);
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
