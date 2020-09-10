import { storeModule } from './storeInterfaces'

export default storeModule({
  namespaced: true,
  state: {
    errors: [] as string[],
  },
  mutations: {
    // errors handling
    SET_ERROR(state, error: string) {
      state.errors = [...state.errors, error]
    },
    RESET_ERRORS(state) {
      state.errors = []
    },
  },
})
