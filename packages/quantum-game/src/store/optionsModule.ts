import { storeModule } from './storeInterfaces'
import { isObject, tryGetProp } from '@/types'

export interface IOptionsModule {
  /** Delay in ms between game ticks. */
  gameSpeedInterval: number
  /** Sound volume in [0;1] range. Doesn't change to 0 when muted. */
  volume: number
  /** True when all sound is muted. Separate from volume to preserve the value when toggled. */
  mute: boolean
}

const STORAGE_KEY = 'options'

const defaultOptions: IOptionsModule = {
  gameSpeedInterval: 200,
  volume: 1,
  mute: false,
}

function getInitialOptions(): IOptionsModule {
  const options: IOptionsModule = { ...defaultOptions }

  const persistedString = localStorage.getItem(STORAGE_KEY)
  if (persistedString == null) return options
  try {
    const parsed: unknown = JSON.parse(persistedString)
    // validate data types on stored json object
    if (!isObject(parsed)) return options

    for (const key of Object.keys(defaultOptions) as (keyof IOptionsModule)[]) {
      const val = tryGetProp(parsed, key)
      if (typeof val === typeof defaultOptions[key]) {
        ;(options[key] as typeof options[typeof key]) = val as typeof defaultOptions[typeof key]
      }
    }
  } catch (_) {
    // JSON.parse can fail and that's ok
  }
  return options
}

function persistOptions(options: IOptionsModule) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
  } catch (_) {
    // browser prevents localStorage writes, we can safely ignore that and carry on
    console.warn('[optionsModule] localStorage write blocked')
  }
}

export default storeModule({
  namespaced: true,
  state: getInitialOptions(),
  mutations: {
    RESET_OPTIONS(state: IOptionsModule): void {
      Object.assign(state, defaultOptions)
      persistOptions(state)
    },
    SET_OPTIONS(state: IOptionsModule, newOptionsObject: Partial<IOptionsModule>): void {
      Object.assign(state, newOptionsObject)
      persistOptions(state)
    },
  },
  actions: {
    TOGGLE_SOUND({ state, commit }): boolean {
      if (state.volume === 0) {
        // force unmute if volume is turned down
        commit('SET_OPTIONS', { volume: 1, mute: false })
      } else {
        commit('SET_OPTIONS', { mute: !state.mute })
      }
      return state.mute
    },
  },
  getters: {
    gameSpeedInterval: (state): number => state.gameSpeedInterval,
    allOptions: (state) => state,
    soundActive: (state) => !state.mute && state.volume > 0,
    volume: (state) => state.volume,
  },
})
