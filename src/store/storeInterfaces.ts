/* eslint-disable @typescript-eslint/no-unused-vars */ // required due to linting errors for `infer T`
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  StoreOptions,
  GetterTree,
  ActionTree,
  Store,
  ActionContext,
  MutationTree,
  ActionHandler,
} from 'vuex'
import firebase from '@/config/firebase'
import GameState from '@/engine/GameState'
import { S } from 'quantum-tensors/dist/Gates'
import StateBlock from 'markdown-it/lib/rules_block/state_block'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootState {}

export type Timestamp = firebase.firestore.Timestamp

interface ActionBlock<S, R> {
  [key: string]: ActionHandler<S, R>
}

interface MutationBlock<S> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (state: S, payload?: any) => void
}

/**
 * Map a mutation function declared in the store module to the signature used in components
 */
type MapMutation<T> = T extends (store: any) => void
  ? () => void
  : T extends (store: any, payload: infer P) => void
  ? (payload: P) => void
  : never

/**
 * Map an action function declared in the store module to the signature used in components
 */
type MapAction<T> = T extends (ctx: any) => infer R
  ? () => Promise<R>
  : T extends (ctx: any, payload: infer P) => infer R
  ? (payload: P) => Promise<R>
  : never

export type MapGetters<G> = G extends GetterTree<any, any> & infer T
  ? { [K in keyof T]: T[K] extends (...args: any) => infer R ? R : never }
  : never
export type MapMutations<A> = A extends MutationBlock<any> & infer T
  ? { [K in keyof T]: MapMutation<T[K]> }
  : never
export type MapActions<A> = A extends ActionTree<any, any> & infer T
  ? { [K in keyof T]: MapAction<T[K]> }
  : never

export type TypedModule<
  State,
  Getters extends GetterTree<State, IRootState>,
  Mutations extends MutationBlock<State>,
  Actions extends ActionBlock<State, IRootState>
> = {
  namespaced: true
  state: State
  getters?: Getters | undefined
  mutations?: Mutations | undefined
  actions?: Actions | undefined
  modules?: never // limit complexity, will have to change if we ever need to support recursive modules
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function storeModule<
  State,
  Getters extends GetterTree<State, IRootState>,
  Mutations extends MutationBlock<State>,
  Actions extends ActionBlock<State, IRootState>
>(def: TypedModule<State, Getters, Mutations, Actions>): typeof def {
  return def
}

export function strongStoreOptions<S extends StoreOptions<IRootState>>(def: S): S {
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
