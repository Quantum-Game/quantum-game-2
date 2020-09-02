import { RESET_OPTIONS, SET_OPTIONS, TOGGLE_SOUND } from './mutation-types'
import { storeModule } from './storeInterfaces'

export interface IOptionsModule {
  /** Delay in ms between game ticks. */
  gameSpeedInterval: number
  /** Sound volume in [0;1] range. Doesn't change to 0 when muted. */
  volume: number
  /** True when all sound is muted. Separate from volume to preserve the value when toggled. */
  mute: boolean
}

const defaultOptionsObj: IOptionsModule = {
  gameSpeedInterval: 200,
  volume: 1,
  mute: false,
}

export default storeModule<IOptionsModule>({
  namespaced: true,
  state: {
    ...defaultOptionsObj,
  },
  mutations: {
    [RESET_OPTIONS](state): void {
      Object.assign(state, defaultOptionsObj)
    },
    [SET_OPTIONS](state, newOptionsObject: Partial<IOptionsModule>): void {
      Object.assign(state, newOptionsObject)
    },
  },
  actions: {
    [TOGGLE_SOUND]({ commit, state }): void {
      if (state.volume === 0) {
        // force unmute if volume is turned down
        commit(SET_OPTIONS, { volume: 1, mute: false })
      } else {
        commit(SET_OPTIONS, { mute: !state.mute })
      }
    },
  },
  getters: {
    gameSpeedInterval: (state): number => state.gameSpeedInterval,
    allOptions: (state) => state,
    soundActive: (state) => !state.mute && state.volume > 0,
    volume: (state) => state.volume,
  },
})
