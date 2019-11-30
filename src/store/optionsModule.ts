import { Module } from 'vuex'
import { SET_GAME_SPEED_INTERVAL, RESET_OPTIONS, SET_OPTIONS } from './mutation-types'
import { RootState } from '@/types'

const defaultOptionsObj: optionsModuleInterface = {
  gameSpeedInterval: 200
}

export interface optionsModuleInterface {
  gameSpeedInterval: number
  [index: string]: number | string
}

const optionsModule: Module<optionsModuleInterface, RootState> = {
  namespaced: true,
  state: {
    gameSpeedInterval: 1000
  },
  mutations: {
    [SET_GAME_SPEED_INTERVAL](state, newInterval: number) {
      state.gameSpeedInterval = newInterval
    },
    [RESET_OPTIONS](state) {
      Object.keys(state).forEach((optionName: string) => {
        state[optionName.toString()] = defaultOptionsObj[optionName]
      })
    },
    [SET_OPTIONS](state, newOptionsObject) {
      Object.keys(state).forEach((optionName: string) => {
        state[optionName.toString()] = newOptionsObject[optionName]
      })
    }
  },
  getters: {
    gameSpeedInterval: (state) => state.gameSpeedInterval
  }
}

export default optionsModule
