import { computed, isRef, ref, Ref, triggerRef, watch, watchEffect, WatchSource } from 'vue'

import TWEEN from '@tweenjs/tween.js'
import { cloneDeep } from 'lodash'
import { isObject } from '@/types'

export type EasingFunction = (t: number) => number

export const Easing = TWEEN.Easing

interface TweenSettings<T> {
  from?: WatchSource<T | null>
  to: WatchSource<T>
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

function evalWatchSource<T>(src: WatchSource<T>): T {
  return isRef(src) ? src.value : src()
}

function createTween<T extends number | Record<string, number>>(
  settings: TweenSettings<T>,
  preprocessStart?: (start: T, next: T) => T,
  postprocess?: (out: T) => T
) {
  const from = computed(() => (settings.from != null ? evalWatchSource(settings.from) : null))
  const to = computed(() => evalWatchSource(settings.to))
  const initialValue = from.value ?? to.value
  const tweened = ref<T>(cloneDeep(initialValue)) as Ref<T>

  let tween: InstanceType<typeof TWEEN.Tween> | null = null

  watch(
    () => ({ from: from.value, to: to.value }),
    ({ from, to }) => {
      const initial = from ?? tweened.value
      const start = preprocessStart ? preprocessStart(initial, to) : initial
      if (tween != null) {
        tween.stop()
      }

      const isWrapped = !isObject(to)
      const wrappedStart = isObject(start) ? start : { value: start }
      const wrappedTarget = isObject(to) ? to : { value: to }
      tween = new TWEEN.Tween(wrappedStart)
        .onUpdate((tween) => {
          const value = isWrapped ? (tween.value as T) : (tween as T)
          tweened.value = postprocess ? postprocess(value) : value
          triggerRef(tweened)
        })
        .easing(settings.easing ?? Easing.Cubic.InOut)
        .to(wrappedTarget, settings.duration ?? 250)
        .start(TWEEN.now())

      kickstartTweens()
    },
    { immediate: true }
  )

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
export function useTween<T extends number | Record<string, number>>(
  settings: TweenSettings<T>
): Ref<T> {
  return createTween(settings)
}

export function useAngleTween(settings: TweenSettings<number>): Ref<number> {
  return createTween(
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
