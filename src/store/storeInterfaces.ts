import firebase from '@/config/firebase'

import { ILevel } from '@/engine/interfaces'
import GameState from '@/engine/GameState'

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
  createdAt: firebase.firestore.Timestamp
  lastModified: firebase.firestore.Timestamp
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
  timeOpened: firebase.firestore.Timestamp
  timeWon?: firebase.firestore.Timestamp
}

export interface ISavedLevelMetadata {
  id: string
  link: string
  createdAt: firebase.firestore.Timestamp
  lastModified: firebase.firestore.Timestamp
  public: boolean
}
