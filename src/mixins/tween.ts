import { isRef, ref, Ref, watch, WatchSource } from 'vue'

import TWEEN from '@tweenjs/tween.js'

export type EasingFunction = (t: number) => number

export const Easing = TWEEN.Easing

interface TweenSettings {
  /**
   * Tween easing function
   * @default Easing.Cubic.InOut
   */
  easing?: EasingFunction
  /**
   * Tween duration in milliseconds
   * @default 250
   */
  duration?: number
}

function createTween(
  source: WatchSource<number>,
  settings?: TweenSettings,
  preprocessStart?: (current: number, next: number) => number,
  postprocess?: (out: number) => number
) {
  const initialValue = isRef(source) ? source.value : source()
  const tweened = ref(initialValue)
  const tween = new TWEEN.Tween({ value: initialValue }).onUpdate(({ value }) => {
    tweened.value = postprocess ? postprocess(value) : value
  })

  settings = settings ?? {}
  tween.easing(settings.easing ?? Easing.Cubic.InOut)
  const duration = settings.duration ?? 250

  watch(source, (next) => {
    const start = preprocessStart ? preprocessStart(tweened.value, next) : tweened.value
    tween.stop()
    // eslint-disable-next-line dot-notation
    tween['_valuesStart'] = { value: start }
    tween.to({ value: next }, duration).start(TWEEN.now())
    kickstartTweens()
  })

  return tweened
}

let animating = false

function kickstartTweens() {
  if (animating === false) {
    animating = true
    updateTweens(window.performance.now())
  }
}

function updateTweens(time: number) {
  if (TWEEN.update(time)) {
    requestAnimationFrame(updateTweens)
  } else {
    animating = false
  }
}

/**
 * Tween reactive data
 */
export function useTween(source: WatchSource<number>, settings?: TweenSettings): Ref<number> {
  return createTween(source, settings)
}

export function useAngleTween(source: WatchSource<number>, settings?: TweenSettings): Ref<number> {
  return createTween(
    source,
    settings,
    (current, next) => next - shortestAngleDifference(current, next),
    (out) => (out + 360) % 360
  )
}

/**
 * Find the shortest angle difference between two angles
 * @param a angle in degrees in range [-360, 360]
 * @param b angle in degrees in range [-360, 360]
 * @returns shortest angle difference in degrees in range [-180, 180]
 */
function shortestAngleDifference(a: number, b: number): number {
  const diff = ((b - a + 900) % 360) - 180
  return diff < -180 ? diff + 360 : diff
}
