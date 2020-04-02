import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { IRootState } from '@/types'
import Cell from '@/engine/Cell'
import Particle from '@/engine/Particle'
import {
  SET_GAME_STATE,
  SET_SIMULATION_STATE,
  SET_ACTIVE_CELL,
  RESET_ACTIVE_CELL,
  SET_CURRENT_LEVEL_ID,
  SET_HOVERED_CELL,
  SET_HOVERED_PARTICLE
} from './mutation-types'
import optionsModule from './optionsModule'
import { GameStateEnum } from '@/engine/interfaces'

const initialCell = Cell.createDummy()
const initialParticle = Particle.createDummy()
Vue.use(Vuex)

const store: StoreOptions<IRootState> = {
  state: {
    activeCell: initialCell,
    cellSelected: false,
    hoveredCell: initialCell,
    hoveredParticles: [initialParticle],
    gameState: GameStateEnum.InProgress,
    simulationState: false,
    currentLevelID: 0
  },
  mutations: {
    // set active level
    [SET_GAME_STATE](state, gameState): void {
      state.gameState = gameState
    },
    // set active level
    [SET_SIMULATION_STATE](state, simulationState): void {
      state.simulationState = simulationState
    },
    // set active cell
    [SET_ACTIVE_CELL](state, cell): void {
      state.activeCell = cell
      state.cellSelected = true
    },
    // reset active cell
    [RESET_ACTIVE_CELL](state): void {
      state.activeCell = initialCell
      state.cellSelected = false
    },
    // hovered cell functional
    [SET_HOVERED_CELL](state, cell): void {
      state.hoveredCell = cell
    },
    // hovered cell functional
    [SET_HOVERED_PARTICLE](state, particles): void {
      state.hoveredParticles = particles
    },
    [SET_CURRENT_LEVEL_ID](state, id): void {
      state.currentLevelID = id
    }
  },
  modules: {
    optionsModule
  }
}

export default new Vuex.Store<IRootState>(store)
