import { PropType } from 'vue'

export interface PieceState {
  hover: boolean
  interacting: boolean
  energized: boolean
  goalProgress: number
}

const defaultState: PieceState = {
  hover: false,
  interacting: false,
  energized: false,
  goalProgress: 0,
}

export const props = {
  state: { type: Object as PropType<PieceState>, default: defaultState },
}
