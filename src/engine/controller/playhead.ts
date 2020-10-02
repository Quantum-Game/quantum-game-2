import { useRaf } from '@/mixins'
import { useTimer } from '@/mixins/timer'
import { storeNamespace } from '@/store'
import { computed, proxyRefs, ref, watch } from 'vue'
import {
  Complex,
  Coord,
  Direction,
  directionChangeMask,
  Frame,
  Particle,
  reverseDirection,
  Rotation,
} from '../model'

const storeOptions = storeNamespace('options')

// function rotate(cx: Complex, a: number): Complex {
//   const sin = Math.sin(a)
//   const cos = Math.cos(a)
//   return new Complex(cx.re * cos + cx.im * sin, cx.re * -sin + cx.im * cos)
// }

export interface InterpolatedParticle {
  // Source particle coord, null for purely visual particles
  readonly coord: Coord | null
  // visually accurate particle coordinate
  readonly position: { x: number; y: number }
  readonly direction: Direction
  readonly a: Complex
  readonly b: Complex
  // Angle for mask through cell center.
  // Used for masking out
  readonly maskRotation: ClipPlane[]
}

export interface ClipPlane {
  origin: Coord
  rotation: Rotation
}

export function playheadController(options: {
  rewindOnUpdate: boolean
  frames: () => Frame[]
}): PlayheadController {
  const frameInterval = storeOptions.useGetter('gameSpeedInterval')
  const targetFrameIndex = ref(0)
  const isPlaying = ref(false)

  const frames = computed(options.frames)
  const totalFrames = computed(() => frames.value.length)
  const frameIndex = computed(() =>
    Math.max(0, Math.min(totalFrames.value - 1, targetFrameIndex.value))
  )
  const isFirstFrame = computed(() => frameIndex.value === 0)
  const isLastFrame = computed(() => frameIndex.value === totalFrames.value - 1)
  const activeFrame = computed((): Frame | null => frames.value[frameIndex.value] ?? null)

  const particlesTime = ref(0)

  // let startFrame = 0;
  let lastTime: number | null = null

  useRaf((time) => {
    if (isPlaying.value) {
      const dt = time - (lastTime ?? time)
      lastTime = time
      const newTime = particlesTime.value + dt / frameInterval.value
      const t = Math.max(0, Math.min(newTime, totalFrames.value))
      particlesTime.value = t
      targetFrameIndex.value = Math.round(t)
    } else {
      lastTime = null
      const f = 0.4
      const dx = targetFrameIndex.value - particlesTime.value
      if (Math.abs(dx) < 0.001) {
        particlesTime.value = targetFrameIndex.value
      } else {
        particlesTime.value += Math.max(f * dx)
      }
    }
  })

  const baseId = computed((): number => {
    const framesArray = frames.value
    const t = Math.max(0, Math.min(particlesTime.value, framesArray.length))
    return Math.floor(t)
  })

  const interpolateFrames = computed((): {
    prev: Frame | null
    curr: Frame
    next: Frame | null
  } | null => {
    const framesArray = frames.value
    const id = baseId.value
    if (id >= framesArray.length) return null
    return {
      prev: framesArray[id - 1] ?? null,
      curr: framesArray[id],
      next: framesArray[id + 1] ?? null,
    }
  })

  const particleHistories = computed((): [Particle[], Particle, Particle[]][] => {
    const frames = interpolateFrames.value
    if (frames == null) return []
    const { prev, curr, next } = frames
    const prevParticles = prev?.particles ?? null
    const currParticles = curr.particles
    const nextParticles = next?.particles ?? null
    return currParticles.map((p) => {
      const coord = p.coord
      const nextCoord = p.coord.neighbour(p.direction)
      const prev: Particle[] =
        prevParticles?.filter((prev) => prev.coord.neighbour(prev.direction) === coord) ?? []
      const next: Particle[] = nextParticles?.filter((next) => next.coord === nextCoord) ?? []

      return [prev, p, next]
    })
  })

  function complexPolarLerp(a: Complex, b: Complex, t: number): Complex {
    const revt = 1 - t
    return Complex.fromPolar(a.r * revt + b.r * t, a.phi * revt + b.phi * t)
  }

  function lerpCoord(a: Coord, b: Coord, t: number): { x: number; y: number } {
    const revt = 1 - t
    return {
      x: a.x * revt + b.x * t,
      y: a.y * revt + b.y * t,
    }
  }

  const interpolatedParticles = computed((): InterpolatedParticle[] => {
    const t = particlesTime.value - Math.floor(particlesTime.value)

    const histories = particleHistories.value

    return histories.flatMap(([prevs, p, nexts]) => {
      const particles: InterpolatedParticle[] = []
      const masks = []

      const fromPrevPropagation = prevs.find((pPrev) => p.direction === pPrev.direction)
      const forwardPropagation = nexts.find((n) => n.direction === p.direction)

      // emit reflection particles back
      for (const pPrev of prevs) {
        const rotation = directionChangeMask(pPrev.direction, p.direction)
        if (rotation != null) {
          const mask = {
            origin: p.coord,
            rotation,
          }
          const coord1 = pPrev.coord.neighbour(pPrev.direction)
          const coord2 = coord1.neighbour(pPrev.direction)

          // if there already is a particle with the same propagation in the current list,
          // ignore, as it would be drawn twice
          const fromForwardPropagation = histories.some(
            ([_, p]) => p.coord === coord1 && p.direction === pPrev.direction
          )

          if (fromPrevPropagation == null) {
            masks.push(mask)
          }

          if (!fromForwardPropagation) {
            particles.push({
              coord: null,
              a: pPrev.a,
              b: pPrev.b,
              direction: pPrev.direction,
              maskRotation: [mask],
              position: lerpCoord(coord1, coord2, t),
            })
          }
        }
      }
      if (forwardPropagation == null) {
        for (const pNext of nexts) {
          const rotation = directionChangeMask(p.direction, pNext.direction)
          if (rotation != null) {
            masks.push({
              origin: pNext.coord,
              rotation,
            })
          }
        }
      }

      let a = p.a
      let b = p.b
      // If the particle is not reflected, interpolate wave function
      if (forwardPropagation != null) {
        a = complexPolarLerp(p.a, forwardPropagation.a, t)
        b = complexPolarLerp(p.b, forwardPropagation.b, t)
      }

      particles.push({
        coord: p.coord,
        a,
        b,
        direction: p.direction,
        maskRotation: masks,
        position: lerpCoord(p.coord, p.coord.neighbour(p.direction), t),
      })

      for (const pNext of nexts) {
        const rotation = directionChangeMask(p.direction, pNext.direction)
        if (rotation != null) {
          const coord1 = pNext.coord.neighbour(reverseDirection(pNext.direction))
          const coord2 = pNext.coord
          particles.push({
            coord: null,
            a: pNext.a,
            b: pNext.b,
            direction: pNext.direction,
            maskRotation: [
              {
                origin: pNext.coord,
                rotation,
              },
            ],
            position: lerpCoord(coord1, coord2, t),
          })
        }
      }

      return particles
    })
  })

  const frameAdvanceTimer = useTimer(() => {
    if (frameIndex.value < totalFrames.value - 1) {
      targetFrameIndex.value += 1
    } else {
      isPlaying.value = false
    }
  })

  if (options.rewindOnUpdate) {
    watch(frames, rewind)
  }

  watch(isPlaying, (playing) => {
    if (playing) {
      frameAdvanceTimer.restart(frameInterval.value)
    } else {
      frameAdvanceTimer.cancel()
    }
  })

  function stepForward() {
    if (isPlaying.value) {
      targetFrameIndex.value = Math.ceil(particlesTime.value)
      isPlaying.value = false
    } else {
      if (frameIndex.value < totalFrames.value - 1) {
        targetFrameIndex.value += 1
      }
    }
  }

  function stepBack() {
    if (isPlaying.value) {
      targetFrameIndex.value = Math.floor(particlesTime.value)
      isPlaying.value = false
    } else {
      if (frameIndex.value > 0) {
        targetFrameIndex.value -= 1
      }
    }
  }

  function fastForward(): void {
    isPlaying.value = false
    targetFrameIndex.value = Math.max(0, totalFrames.value - 1)
  }

  function seek(frame: number): void {
    targetFrameIndex.value = Math.max(0, Math.min(frame, totalFrames.value - 1))
  }

  function rewind(): void {
    targetFrameIndex.value = 0
    isPlaying.value = false
  }

  function play(play: boolean) {
    isPlaying.value = play
    if (play && isLastFrame.value) {
      targetFrameIndex.value = 0
    }
  }

  function toggle() {
    play(!isPlaying.value)
  }

  return proxyRefs({
    isPlaying,
    isFirstFrame,
    isLastFrame,
    activeFrame,
    interpolatedParticles,
    totalFrames,
    frameIndex,
    stepForward,
    stepBack,
    fastForward,
    seek,
    rewind,
    play,
    toggle,
  })
}

export interface PlayheadController {
  readonly isPlaying: boolean
  readonly isFirstFrame: boolean
  readonly isLastFrame: boolean
  readonly activeFrame: Frame | null
  readonly interpolatedParticles: InterpolatedParticle[]
  readonly totalFrames: number
  readonly frameIndex: number
  stepForward(): void
  stepBack(): void
  fastForward(): void
  seek(frame: number): void
  rewind(): void
  play(play: boolean): void
  toggle(): void
}
