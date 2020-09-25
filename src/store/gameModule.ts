import { storeModule } from './storeInterfaces'

interface GameState {
  currentLevelID: number | null // check
  errors: string[]
}

export default storeModule({
  namespaced: true,
  state: {
    activeCell: null,
    cellSelected: false,
    hoveredParticles: [],
    simulationState: false,
    currentLevelID: null,
    errors: [],
  } as GameState,
  mutations: {
    // hovered cell functional
    SET_CURRENT_LEVEL_ID(state, id: number | null) {
      state.currentLevelID = id
    },
    // errors handling
    SET_ERROR(state, error: string) {
      state.errors = [...state.errors, error]
    },
    RESET_ERRORS(state) {
      state.errors = []
    },
  },
})
