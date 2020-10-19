import { iMap } from '@/itertools'
import { computed, proxyRefs, ref, watch } from 'vue'
import { Coord } from '../model'
import { PlayheadController } from './playhead'

export interface ObservationOutcome {
  coord: Coord
  frame: number
  pdf: number
}

interface ExperimentState {
  outcome: ObservationOutcome | null
  repetition: number
}

export function experimentController(options: {
  playhead: PlayheadController
}): ExperimentController {
  const playhead = options.playhead
  const experimentState = ref<ExperimentState | null>(null)

  const histogram = ref(new Map<Coord, number>())
  const samples = ref(0)

  const isRunning = ref(false)

  const possibleOutcomes = computed((): ObservationOutcome[] => {
    const frames = playhead.frames
    let probabilityDensity = 0

    const outcomes = frames.flatMap((f, frame) =>
      Array.from(
        iMap(f.absorptions, ([coord, probability]) => {
          probabilityDensity += probability
          return {
            coord,
            frame,
            pdf: probabilityDensity,
          }
        })
      )
    )
    // normalize pdf
    outcomes.forEach((o) => (o.pdf /= probabilityDensity))
    return outcomes
  })

  function onStopped(complete: boolean) {
    if (!complete) {
      return stop()
    }
    if (!isRunning.value) {
      return
    }

    const outcome = experimentState.value?.outcome ?? null
    if (outcome != null) {
      const h = histogram.value
      const coord = outcome.coord
      h.set(coord, (h.get(coord) ?? 0) + 1)
      samples.value += 1

      if (isRunning.value) {
        simulateOnce()
      }
    }
  }

  function simulateOnce() {
    playhead.rewind(true)
    const outcome = sampleOutcome(possibleOutcomes.value)
    experimentState.value = {
      outcome,
      repetition: (experimentState.value?.repetition ?? 0) + 1,
    }

    if (outcome != null) {
      isRunning.value = true
      const interval =
        experimentState.value.repetition === 1
          ? 250
          : Math.max(5, 200 / experimentState.value.repetition)
      const frame = outcome.frame
      playhead.play({ onStopped, maxFrames: frame + 1, interval })
    }
  }

  function play() {
    isRunning.value = true
    histogram.value.clear()
    samples.value = 0
    experimentState.value = null
    simulateOnce()
  }

  function stop() {
    isRunning.value = false
    histogram.value.clear()
    samples.value = 0
    experimentState.value = null
    playhead.rewind()
  }

  return proxyRefs({
    isRunning,
    samples,
    histogram,
    play,
    stop,
  })
}

export interface ExperimentController {
  readonly isRunning: boolean
  readonly samples: number
  readonly histogram: Map<Coord, number>
  play(): void
  stop(): void
}

function sampleOutcome(outcomes: ObservationOutcome[]): ObservationOutcome | null {
  const choice = Math.random()

  // binary search through probability density
  let start = 0
  let end = outcomes.length - 1
  let repetitions = 0
  while (start < end) {
    const i = (start + end) >> 1
    const pdf = outcomes[i].pdf
    if (pdf < choice) start = i + 1
    else end = i

    if (repetitions++ > 100) {
      console.error('infinite looping in probability density sampling')
      return null
    }
  }
  return outcomes[start] ?? null
}
