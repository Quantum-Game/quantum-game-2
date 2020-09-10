import { onMounted, onUnmounted } from 'vue'

/**
 * Add an event listener on window for the duration of component lifetime.
 * @param event name of event to register
 * @param handler event handler
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void
): void {
  onMounted(() => {
    window.addEventListener(event, handler)
  })
  onUnmounted(() => {
    window.removeEventListener(event, handler)
  })
}
