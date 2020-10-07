import { PropType } from 'vue'

export interface PieceState {
  hover: boolean
  interacting: boolean
  energized: boolean
}

const defaultState: PieceState = {
  hover: false,
  interacting: false,
  energized: false,
}

export const props = {
  state: { type: Object as PropType<PieceState>, default: defaultState },
}
