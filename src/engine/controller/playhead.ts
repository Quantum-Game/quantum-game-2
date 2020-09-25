import { useTimer } from '@/mixins/timer'
import { computed, proxyRefs, ref, watch } from 'vue'
import { Frame } from '../model'

export function playheadController(options: {
  rewindOnUpdate: boolean
  frames: () => Frame[]
}): PlayheadController {
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

  const frameAdvanceTimer = useTimer(stepForward)
  if (options.rewindOnUpdate) {
    watch(frames, rewind)
  }

  watch(isPlaying, (playing) => {
    if (playing) {
      frameAdvanceTimer.restart(200)
    } else {
      frameAdvanceTimer.cancel()
    }
  })

  function stepForward() {
    if (frameIndex.value < totalFrames.value - 1) {
      targetFrameIndex.value += 1
    } else {
      isPlaying.value = false
    }
  }

  function stepBack() {
    if (frameIndex.value > 0) {
      targetFrameIndex.value -= 1
    }
  }

  function fastForward(): void {
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
