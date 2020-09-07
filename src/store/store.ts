import { createStore } from 'vuex'
import Cell from '@/engine/Cell'
import Particle from '@/engine/Particle'
import {
  SET_GAME_STATE,
  SET_SIMULATION_STATE,
  SET_ACTIVE_CELL,
  RESET_ACTIVE_CELL,
  SET_CURRENT_LEVEL_ID,
  SET_HOVERED_CELL,
  SET_HOVERED_PARTICLE,
  SET_ERROR,
  RESET_ERRORS,
} from './mutation-types'
import optionsModule from './optionsModule'
import { GameStateEnum } from '@/engine/interfaces'
import userModule from './userStore'
import { IRootState } from './storeInterfaces'

const initialCell = Cell.createDummy()
const initialParticle = Particle.createDummy()

export default createStore<IRootState>({
  state: {
    activeCell: initialCell,
    cellSelected: false,
    hoveredCell: initialCell,
    hoveredParticles: [initialParticle],
    gameState: GameStateEnum.InProgress,
    simulationState: false,
    currentLevelID: 0,
    errors: [],
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
    },
    // errors handling
    [SET_ERROR](state, error): void {
      state.errors = [...state.errors, error]
    },
    [RESET_ERRORS](state): void {
      state.errors = []
    },
  },
  modules: {
    optionsModule,
    userModule,
  },
})
