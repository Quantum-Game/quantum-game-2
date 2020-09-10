import { ICoord } from '@/engine/interfaces'
import { computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePosition(tileSize: () => number, coord: () => ICoord) {
  return {
    position: computed(
      (): ICoord => {
        const size = tileSize()
        const { x, y } = coord()
        return { x: x * size, y: y * size }
      }
    ),
    transformOrigin: computed(
      (): ICoord => {
        const size = tileSize()
        const { x, y } = coord()
        return { x: (x + 0.5) * size, y: (y + 0.5) * size }
      }
    ),
  }
}
