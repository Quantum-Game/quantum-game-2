import { useRaf } from '@/mixins'
import { storeNamespace } from '@/store'
import { computed, proxyRefs, ref, watch } from 'vue'
import { InterpolatedParticle, interpolateParticle } from '../interpolation'
import { Coord, Frame, Particle } from '../model'

const storeOptions = storeNamespace('options')

export interface ObservationOutcome {
  coord: Coord
  frame: number
}

interface ExperimentState {
  outcome: ObservationOutcome | null
  repetition: number
}

export function playheadController(options: {
  rewindOnUpdate: boolean
  frames: () => Frame[]
  pickOutcome?: () => ObservationOutcome | null
  onExperimentOutcome?: (outcome: ObservationOutcome | null) => void
  onExperimentStart?: () => void
}): PlayheadController {
  const frameInterval = storeOptions.useGetter('gameSpeedInterval')
  const targetFrameIndex = ref(0)
  const isPlaying = ref(false)
  const experimentState = ref<ExperimentState | null>(null)

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

  const expectedLastFrame = computed(() => {
    if (visType.value === SimulationVisType.Stochastic && experimentState.value != null) {
      return Math.min(experimentState.value.outcome?.frame ?? 0, totalFrames.value - 1)
    } else {
      return totalFrames.value - 1
    }
  })

  const speedOfLight = computed(() => {
    if (experimentState.value != null) {
      return (experimentState.value.repetition + 1) / frameInterval.value
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

    if (particlesTime.value >= expectedLastFrame.value) {
      const experiment = experimentState.value
      if (visType.value === SimulationVisType.Stochastic && experiment != null) {
        options.onExperimentOutcome?.(experiment.outcome)
        if (experiment.outcome != null) {
          particlesTime.value = 0
          targetFrameIndex.value = 0
          experiment.repetition += 1
          experiment.outcome = options.pickOutcome?.() ?? null
        }
      } else {
        isPlaying.value = false
      }
    }
  })

  if (options.rewindOnUpdate) {
    watch(frames, rewind)
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

  const visType = computed(() => {
    if (experimentState.value != null) {
      return SimulationVisType.Stochastic
    } else if (!isPlaying.value && isFirstFrame.value) {
      return SimulationVisType.Laser
    } else {
      return SimulationVisType.QuantumWave
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
      experimentState.value = null
    } else {
      if (frameIndex.value > 0) {
        targetFrameIndex.value -= 1
      }
    }
  }

  function fastForward(): void {
    isPlaying.value = false
    experimentState.value = null
    targetFrameIndex.value = Math.max(0, totalFrames.value - 1)
  }

  function seek(frame: number): void {
    experimentState.value = null
    targetFrameIndex.value = Math.max(0, Math.min(frame, totalFrames.value - 1))
  }

  function rewind(): void {
    targetFrameIndex.value = 0
    isPlaying.value = false
    experimentState.value = null
  }

  function play(play: boolean, observation = false) {
    if (observation && options.pickOutcome == null) {
      console.warn('trying to run experiment without outcome selector')
    }

    if (play && isLastFrame.value) {
      targetFrameIndex.value = 0
      particlesTime.value = 0
    }

    if (observation) {
      targetFrameIndex.value = 0
      particlesTime.value = 0

      options.onExperimentStart?.()
      experimentState.value = {
        outcome: options.pickOutcome?.() ?? null,
        repetition: 0,
      }
    }

    isPlaying.value = play
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
    visType,
    stepForward,
    stepBack,
    fastForward,
    seek,
    rewind,
    play,
    toggle,
  })
}

export const enum SimulationVisType {
  Laser,
  QuantumWave,
  Stochastic,
}

export interface PlayheadController {
  readonly isPlaying: boolean
  readonly isFirstFrame: boolean
  readonly isLastFrame: boolean
  readonly activeFrame: Frame | null
  readonly interpolatedParticles: InterpolatedParticle[]
  readonly totalFrames: number
  readonly frameIndex: number
  readonly visType: SimulationVisType
  stepForward(): void
  stepBack(): void
  fastForward(): void
  seek(frame: number): void
  rewind(): void
  play(play: boolean): void
  toggle(): void
}
