import { useRaf } from '@/mixins'
import { useTimer } from '@/mixins/timer'
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
      targetFrameIndex.value = Math.floor(t)
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

  const interpolatedParticles = computed((): InterpolatedParticle[] => {
    const t = particlesTime.value - Math.floor(particlesTime.value)
    const histories = particleHistories.value
    const all = interpolateFrames.value?.curr.particles ?? []
    return histories.flatMap(([prevs, p, nexts]) => interpolateParticle(t, prevs, p, nexts, all))
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
      particlesTime.value = 0
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
