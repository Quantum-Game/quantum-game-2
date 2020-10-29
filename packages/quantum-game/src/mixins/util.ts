import {
  proxyRefs,
  readonly,
  Ref,
  ref,
  shallowRef,
  unref,
  watch,
  watchEffect,
  WatchStopHandle,
} from 'vue'
import { useRouter } from 'vue-router'

/**
 * `console.log` reactive data as it changes
 *
 * ```
 * watchEffect({ someValue, other })
 * ```
 *
 * @param data object of reactive data to watch
 */
export function logWatch(data: Record<string, unknown>): void {
  watchEffect(() =>
    console.log(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, unref(v)])))
  )
}

/**
 * A boolean flag that resets to `false` on every route change
 */
export function usePerRouteFlag(): { flag: boolean; set(): void } {
  const flag = ref(false)
  useRouter().afterEach(() => {
    flag.value = false
  })

  return proxyRefs({
    flag: readonly(flag),
    set: () => {
      flag.value = true
    },
  })
}

/**
 * A computed ref that only notifies it's deps when the computed value actually changed.
 * @param getter the function that returns computed value
 * @param compare comparison function. When not passed, a strong comparison (`===`) operator is used.
 */
export function memoized<T>(getter: () => T, compare?: (a: T, b: T) => boolean): Ref<T> {
  const val = shallowRef()
  watch(
    getter,
    (valA, valB) => {
      if (valB === undefined || !(compare != null ? compare(valA, valB) : valA === valB)) {
        val.value = valA
      }
    },
    { immediate: true }
  )
  return val
}

const bodyClasses: Record<string, number> = {}
/**
 * Compute classes to apply to a body tag.
 * @param src classes getter
 */
export function useBodyClass(src: () => Record<string, boolean>): WatchStopHandle {
  return watch(src, (classes, _, onInvalidate) => {
    for (const c in classes) {
      if (classes[c]) {
        bodyClasses[c] = (bodyClasses[c] ?? 0) + 1
        if (bodyClasses[c] > 0) {
          document.body.classList.add(c)
        }
      }
    }
    onInvalidate(() => {
      for (const c in classes) {
        if (classes[c]) {
          bodyClasses[c] = bodyClasses[c] - 1
          if (bodyClasses[c] <= 0) {
            document.body.classList.remove(c)
          }
        }
      }
    })
  })
}
