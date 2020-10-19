import { useRaf } from '@/mixins'
import { storeNamespace } from '@/store'
import { computed, proxyRefs, ref, watch } from 'vue'
import { InterpolatedParticle, interpolateParticle } from '../interpolation'
import { Frame, Particle } from '../model'

const storeOptions = storeNamespace('options')

export function playheadController(options: {
  rewindOnUpdate: boolean
  frames: () => Frame[]
}): PlayheadController {
  const frameInterval = storeOptions.useGetter('gameSpeedInterval')
  const targetFrameIndex = ref(0)
  const isPlaying = ref(false)
  const limitFrames = ref<number | null>(null)
  const overrideInterval = ref<number | null>(null)

  const frames = computed(options.frames)
  const totalFrames = computed(() => frames.value.length)
  const frameIndex = computed(() =>
    Math.max(0, Math.min(totalFrames.value - 1, targetFrameIndex.value))
  )
  const isFirstFrame = computed(() => frameIndex.value === 0)
  const isLastFrame = computed(() => frameIndex.value === totalFrames.value - 1)
  const activeFrame = computed((): Frame | null => frames.value[frameIndex.value] ?? null)

  const particlesTime = ref(0)
  let onStopped: ((completed: boolean) => void) | null = null

  // let startFrame = 0;
  let lastTime: number | null = null

  const expectedLastFrame = computed(() => {
    const limit = limitFrames.value ?? totalFrames.value
    return Math.min(limit - 1, totalFrames.value - 1)
  })

  const speedOfLight = computed(() => {
    if (overrideInterval.value != null) {
      return 1 / overrideInterval.value
    } else {
      return 1 / frameInterval.value
    }
  })

  useRaf((time) => {
    if (isPlaying.value) {
      const dt = time - (lastTime ?? time)
      lastTime = time
      const newTime = particlesTime.value + dt * speedOfLight.value
      const t = Math.max(0, Math.min(newTime, totalFrames.value - 1))
      particlesTime.value = t
      targetFrameIndex.value = Math.floor(t)

      if (particlesTime.value >= expectedLastFrame.value) {
        isPlaying.value = false
        onStopped?.(true)
      }
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

  if (options.rewindOnUpdate) {
    watch(frames, () => rewind(false))
  }

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

  const interpolatedParticles = computed((): InterpolatedParticle[] => {
    const t = particlesTime.value - Math.floor(particlesTime.value)
    const histories = particleHistories.value
    const all = interpolateFrames.value?.curr.particles ?? []
    return histories.flatMap(([prevs, p, nexts]) => interpolateParticle(t, prevs, p, nexts, all))
  })

  function stepForward() {
    if (isPlaying.value) {
      targetFrameIndex.value = Math.ceil(particlesTime.value)
      isPlaying.value = false
      onStopped?.(false)
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
      onStopped?.(false)
    } else {
      if (frameIndex.value > 0) {
        targetFrameIndex.value -= 1
      }
    }
  }

  function fastForward(): void {
    targetFrameIndex.value = Math.max(0, totalFrames.value - 1)
    if (isPlaying.value) {
      isPlaying.value = false
      onStopped?.(true)
    }
  }

  function seek(frame: number): void {
    targetFrameIndex.value = Math.max(0, Math.min(frame, totalFrames.value - 1))
  }

  function rewind(instant = false): void {
    targetFrameIndex.value = 0
    if (instant) {
      particlesTime.value = 0
    }
    if (isPlaying.value) {
      isPlaying.value = false
      onStopped?.(false)
    }
  }

  function play(options?: {
    maxFrames?: number
    onStopped?: (completed: boolean) => void
    interval?: number
  }) {
    limitFrames.value = options?.maxFrames ?? null
    onStopped = options?.onStopped ?? null
    overrideInterval.value = options?.interval ?? null
    isPlaying.value = true
  }

  function toggle() {
    if (!isPlaying.value) {
      play()
    } else {
      isPlaying.value = false
      onStopped?.(false)
    }
  }

  return proxyRefs({
    frames,
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
  readonly frames: Frame[]
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
  rewind(instant?: boolean): void
  play(options?: {
    maxFrames?: number
    onStopped?: (complete: boolean) => void
    interval?: number
  }): void
  toggle(): void
}
