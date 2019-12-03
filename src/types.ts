import { GameStateEnum } from '@/engine/interfaces'
import Cell from '@/engine/Cell'
import Particle from '@/engine/Particle'

export interface IRootState {
  activeCell: Cell
  hoveredCell: Cell
  hoveredParticles: [Particle]
  cellSelected: boolean
  gameState: GameStateEnum
  simulationState: boolean
  currentLevelID: number
}

export interface IUserState {
  user: {
    loggedIn: boolean
    rememberMe: boolean
    data: {
      displayName: string
      email: string
    }
  }
  progressArr: IProgressObj[]
  savedLevelsList: ISavedLevel[]
  publicLevels: IPublicLevel[]
  error: null
}

interface IProgressObj {
  id: number
  status: 'string'
  score: number
}

interface ISavedLevel {
  id: 'string'
  link: 'string'
  public: boolean
}

interface IPublicLevel {
  link: 'string'
}
