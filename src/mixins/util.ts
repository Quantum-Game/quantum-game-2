import { unref, watchEffect } from 'vue'

export function logWatch(data: Record<string, unknown>): void {
  watchEffect(() =>
    console.log(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, unref(v)])))
  )
}
