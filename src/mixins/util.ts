import { proxyRefs, readonly, ref, unref, watchEffect } from 'vue'
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
