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

  const particleHistories = computed((): (readonly [
    Particle | null,
    Particle,
    Particle | null
  ])[] => {
    const frames = interpolateFrames.value
    if (frames == null) return []
    const { prev, curr, next } = frames
    const prevParticles = prev?.particles ?? null
    const currParticles = curr.particles
    const nextParticles = next?.particles ?? null
    return currParticles.flatMap((p1) => {
      const coord = p1.coord
      const nextCoord = p1.coord.neighbour(p1.direction)
      const prev: (Particle | null)[] =
        prevParticles?.filter((prev) => prev.coord.neighbour(prev.direction) === coord) ?? []
      const next: (Particle | null)[] =
        nextParticles?.filter((next) => next.coord === nextCoord) ?? []
      if (prev.length === 0) prev.push(null)
      if (next.length === 0) prev.push(null)

      return prev.flatMap((p0) => next.map((p2) => [p0, p1, p2] as const))
    })
  })

  function complexPolarLerp(a: Complex, b: Complex, t: number): Complex {
    const revt = 1 - t
    return Complex.fromPolar(a.r * revt + b.r * t, a.phi * revt + b.phi * t)
  }

  const interpolatedParticles = computed((): InterpolatedParticle[] => {
    const tbFract = particlesTime.value - Math.floor(particlesTime.value)
    const taFract = 1 - tbFract

    return particleHistories.value.flatMap(([pPrev, p, pNext]) => {
      const particles = []
      const masks = []
      if (pPrev != null) {
        const rotation = directionChangeMask(pPrev.direction, p.direction)
        if (rotation != null) {
          masks.push({
            origin: p.coord,
            rotation,
          })
        }
      }
      if (pNext != null) {
        const rotation = directionChangeMask(p.direction, pNext.direction)
        if (rotation != null) {
          masks.push({
            origin: pNext.coord,
            rotation,
          })
        }
      }

      const a = pNext == null ? p.a : complexPolarLerp(p.a, pNext.a, tbFract)
      const b = pNext == null ? p.b : complexPolarLerp(p.b, pNext.b, tbFract)

      // particle comes from a different direction, emit extra copy
      if (pPrev != null && p.direction !== pPrev.direction) {
        const coord1 = pPrev.coord.neighbour(pPrev.direction)
        const coord2 = coord1.neighbour(pPrev.direction)
        const x = coord1.x * taFract + coord2.x * tbFract
        const y = coord1.y * taFract + coord2.y * tbFract
        particles.push({
          coord: null,
          a,
          b,
          direction: pPrev.direction,
          maskRotation: masks,
          position: { x, y },
        })
      }

      // same direction or particle is being destroyed - just propagate
      {
        const coord2 = p.coord.neighbour(p.direction)
        const x = p.coord.x * taFract + coord2.x * tbFract
        const y = p.coord.y * taFract + coord2.y * tbFract
        particles.push({
          coord: p.coord,
          a,
          b,
          direction: p.direction,
          maskRotation: masks,
          position: { x, y },
        })
      }

      if (pNext != null && p.direction !== pNext.direction) {
        // emit two particles with different directions
        const coord0 = pNext.coord.neighbour(reverseDirection(pNext.direction))
        const x = coord0.x * taFract + pNext.coord.x * tbFract
        const y = coord0.y * taFract + pNext.coord.y * tbFract
        particles.push({
          coord: null,
          a,
          b,
          direction: pNext.direction,
          maskRotation: masks,
          position: { x, y },
        })
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
