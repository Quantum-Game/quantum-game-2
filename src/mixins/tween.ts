import { isRef, ref, Ref, watch, WatchSource } from 'vue'

import TWEEN from '@tweenjs/tween.js'

export type EasingFunction = (t: number) => number

export const easing = TWEEN.Easing

/**
 * Tween reactive data
 */
export function useTween(source: WatchSource<number>, easing?: EasingFunction): Ref<number> {
  const initialValue = isRef(source) ? source.value : source()
  const tweened = ref(initialValue)

  const tween = new TWEEN.Tween({ value: initialValue }).onUpdate(({ value }) => {
    tweened.value = value
  })

  if (easing != null) {
    tween.easing(easing)
  }

  watch(source, (value) => {
    tween.to({ value })
    tween.start(0)
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
