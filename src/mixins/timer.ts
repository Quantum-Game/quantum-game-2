import { onUnmounted } from 'vue'

/**
 * Timer object wrapping `setInterval`, with automatic cleanup when component gets destroyed.
 * @param handler timer interval handler. If omitted, handler must be provided on the first restart.
 */
export function useTimer(handler?: () => void) {
  let interval: number | null = null

  onUnmounted(() => {
    if (interval != null) window.clearInterval(interval)
  })

  return {
    /**
     * Start timer, cancel existing one if already started.
     *
     * If you omit the handler during timer creation, one must be provided on first restart.
     * @param time interval time
     * @param newHandler overwrite existing timer handler with new one
     */
    restart(time: number, newHandler?: () => void) {
      if (newHandler != null) {
        handler = newHandler
      }
      if (interval != null) window.clearInterval(interval)

      if (handler != null) {
        interval = window.setInterval(handler, time)
      } else {
        console.warn('Trying to restart timer without any handler')
      }
    },
    /**
     * Cancel timer
     */
    cancel() {
      if (interval != null) window.clearInterval(interval)
    },
  }
}
