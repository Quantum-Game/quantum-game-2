import { Module } from 'vuex'
import firebase from '@/config/firebase'
import { GameStateEnum, ILevel } from '@/engine/interfaces'
import GameState from '@/engine/GameState'
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
  errors: string[]
}

export type Timestamp = firebase.firestore.Timestamp

export function storeModule<S>(def: Module<S, IRootState>): typeof def {
  return def
}

/**
 * @todo Right now really bad, as level does not match the ILevel format
 */
export interface ISavedLevel {
  userId: string
  level: {
    currentLevelID: string
    gameState: GameState
    boardState: string // JSON.stringify format
  }
  public: boolean
  createdAt: Timestamp
  lastModified: Timestamp
}

export interface IUserState {
  user: IUser
  progressArr: IProgressObj[]
  savedLevelsList: ISavedLevelMetadata[]
  publicLevels: ISavedLevelMetadata[]
  fetchedLevel?: ILevel
  error?: null
}

export interface IUser {
  loggedIn: boolean
  rememberMe: boolean
  data: {
    displayName: string
    email: string
  }
}

export interface IProgressObj {
  id: number
  status: string
  timeOpened: Timestamp
  timeWon?: Timestamp
}

export interface ISavedLevelMetadata {
  id: string
  link: string
  createdAt: Timestamp
  lastModified: Timestamp
  public: boolean
}
