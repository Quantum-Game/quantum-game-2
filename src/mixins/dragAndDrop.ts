import { ref } from 'vue'

interface IDragData {
  deltaX: number
  deltaY: number
  absoluteX: number
  absoluteY: number
}

interface DragOptions {
  onDragStart?(data: IDragData): void
  onDrag?(data: IDragData): void
  onDragEnd?(data: IDragData): void
}

interface DragMixing {
  dragStart: (event: MouseEvent) => void
  readonly dragging: boolean
}

export function useDrag(options: DragOptions): DragMixing {
  const dragging = ref(false)
  let absoluteX = 0
  let absoluteY = 0

  function dragMove(event: MouseEvent) {
    const deltaX = event.pageX - absoluteX
    const deltaY = event.pageY - absoluteY
    absoluteX = event.pageX
    absoluteY = event.pageY
    options.onDrag?.({ deltaX, deltaY, absoluteX, absoluteY })
  }

  function dragEnd() {
    dragging.value = false
    options.onDragEnd?.({ deltaX: 0, deltaY: 0, absoluteX, absoluteY })
    window.removeEventListener('mousemove', dragMove)
    window.removeEventListener('mouseup', dragEnd)
  }

  function dragStart(event: MouseEvent) {
    if (dragging.value) return
    dragging.value = true

    absoluteX = event.pageX
    absoluteY = event.pageY

    options.onDragStart?.({ deltaX: 0, deltaY: 0, absoluteX, absoluteY })

    window.addEventListener('mousemove', dragMove)
    window.addEventListener('mouseup', dragEnd)
  }

  return {
    dragStart,
    get dragging() {
      return dragging.value
    },
  }
}
