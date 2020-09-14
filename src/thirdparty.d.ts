declare module 'vue-confetti' {
  class Confetti {
    start(params: Record<string, unknown>): void
    stop(): void
  }
  export { Confetti }
}
declare module 'tone'

// NOTE: ResizeObserver declaration is temporary, until the builtin typedefs are updated.
declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback)
  disconnect: () => void
  observe: (target: Element, options?: ResizeObserverObserveOptions) => void
  unobserve: (target: Element) => void
}

interface ResizeObserverObserveOptions {
  box?: 'content-box' | 'border-box'
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

interface ResizeObserverEntry {
  readonly borderBoxSize: ResizeObserverEntryBoxSize
  readonly contentBoxSize: ResizeObserverEntryBoxSize
  readonly contentRect: DOMRectReadOnly
  readonly target: Element
}

interface ResizeObserverEntryBoxSize {
  blockSize: number
  inlineSize: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  ResizeObserver: typeof ResizeObserver
}
