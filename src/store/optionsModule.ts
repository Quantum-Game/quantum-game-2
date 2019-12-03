import { Module } from 'vuex'
import { SET_GAME_SPEED_INTERVAL, RESET_OPTIONS, SET_OPTIONS } from './mutation-types'
import { IRootState } from '@/types'

export interface IOptionsModule {
  gameSpeedInterval: number
  [index: string]: number | string
}

const defaultOptionsObj: IOptionsModule = {
  gameSpeedInterval: 200
}

const optionsModule: Module<IOptionsModule, IRootState> = {
  namespaced: true,
  state: {
    gameSpeedInterval: 1000
  },
  mutations: {
    [SET_GAME_SPEED_INTERVAL](state, newInterval: number): void {
      state.gameSpeedInterval = newInterval
    },
    [RESET_OPTIONS](state): void {
      Object.keys(state).forEach((optionName: string): void => {
        state[optionName.toString()] = defaultOptionsObj[optionName]
      })
    },
    [SET_OPTIONS](state, newOptionsObject): void {
      Object.keys(state).forEach((optionName: string): void => {
        state[optionName.toString()] = newOptionsObject[optionName]
      })
    }
  },
  getters: {
    gameSpeedInterval: (state): number => state.gameSpeedInterval
  }
}

export default optionsModule
