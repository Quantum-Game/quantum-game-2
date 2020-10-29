import { useBodyClass } from '@/mixins'
import { computed, proxyRefs, ref } from 'vue'
import { ExperimentController } from './experiment'
import { PlayheadController } from './playhead'

export enum SimulationVisMode {
  Laser,
  QuantumWave,
  Experiment,
}

export function simulationVisCtl(options: {
  playheadCtl: PlayheadController
  experimentCtl: ExperimentController
}): SimulationVisController {
  const rewindingWave = ref(false)

  const visMode = computed<SimulationVisMode>(() => {
    if (options.experimentCtl.isRunning) return SimulationVisMode.Experiment
    if (!options.playheadCtl.isPlaying && options.playheadCtl.isFirstFrame && !rewindingWave.value)
      return SimulationVisMode.Laser
    return SimulationVisMode.QuantumWave
  })

  function setMode(mode: SimulationVisMode) {
    if (mode === SimulationVisMode.Experiment) {
      options.experimentCtl.stop()
      options.experimentCtl.play()
    } else if (mode === SimulationVisMode.Laser) {
      options.experimentCtl.stop()
      options.playheadCtl.rewind(false)
    } else if (mode === SimulationVisMode.QuantumWave) {
      options.experimentCtl.stop()
      rewindingWave.value = true
      options.playheadCtl
        .rewind(false)
        .then(() => {
          options.playheadCtl.play()
        })
        .finally(() => (rewindingWave.value = false))
    }
  }

  const isExperiment = computed(() => visMode.value === SimulationVisMode.Experiment)
  useBodyClass(() => {
    return {
      'mode-laser': visMode.value === SimulationVisMode.Laser,
      'mode-wave': visMode.value === SimulationVisMode.QuantumWave,
      'mode-experiment': visMode.value === SimulationVisMode.Experiment,
    }
  })

  return proxyRefs({
    visMode,
    isExperiment,
    setMode,
  })
}

interface SimulationVisController {
  readonly visMode: SimulationVisMode
  readonly isExperiment: boolean
  setMode(mode: SimulationVisMode): void
}
