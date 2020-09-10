import { storeModule } from './storeInterfaces'
import Cell from '@/engine/Cell'
import Particle from '@/engine/Particle'
import { GameStateEnum } from '@/engine/interfaces'

const initialCell = Cell.createDummy()
const initialParticle = Particle.createDummy()

export default storeModule({
  namespaced: true,
  state: {
    activeCell: initialCell,
    cellSelected: false,
    hoveredCell: initialCell,
    hoveredParticles: [initialParticle],
    gameState: GameStateEnum.InProgress,
    simulationState: false,
    currentLevelID: 0,
    errors: [] as string[],
  },
  mutations: {
    // set active level
    SET_GAME_STATE(state, gameState: GameStateEnum) {
      state.gameState = gameState
    },
    // set active level
    SET_SIMULATION_STATE(state, simulationState: boolean) {
      state.simulationState = simulationState
    },
    // set active cell
    SET_ACTIVE_CELL(state, cell: Cell) {
      state.activeCell = cell
      state.cellSelected = true
    },
    // reset active cell
    RESET_ACTIVE_CELL(state) {
      state.activeCell = initialCell
      state.cellSelected = false
    },
    // hovered cell functional
    SET_HOVERED_CELL(state, cell: Cell) {
      state.hoveredCell = cell
    },
    // hovered cell functional
    SET_HOVERED_PARTICLE(state, particles: Particle[]) {
      state.hoveredParticles = particles
    },
    SET_CURRENT_LEVEL_ID(state, id: number) {
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
