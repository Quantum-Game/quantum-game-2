import { GameStateEnum } from '@/engine/interfaces'
import Cell from '@/engine/Cell'
import Particle from '@/engine/Particle'

export interface IRootState {
  activeCell: Cell
  fateCells: Cell[]
  hoveredCell: Cell
  hoveredParticles: [Particle]
  cellSelected: boolean
  gameState: GameStateEnum
  simulationState: boolean
  currentLevelID: number
}
