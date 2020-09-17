import { PropType } from 'vue'

export interface PieceState {
  hover: boolean
  interacting: boolean
  energized: boolean
}

export const props = {
  state: { type: Object as PropType<PieceState>, required: true },
}
