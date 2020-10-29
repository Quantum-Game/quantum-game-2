import { createStore } from 'vuex'

import optionsModule from './optionsModule'
import userModule from './userStore'
import { IRootState, strongStoreOptions } from './storeInterfaces'
import gameModule from './gameModule'
import errorsModule from './errorsModule'

const storeOptions = strongStoreOptions({
  modules: {
    options: optionsModule,
    user: userModule,
    game: gameModule,
    errors: errorsModule,
  },
})

export type StoreModules = typeof storeOptions['modules']

export const store = createStore<IRootState>(storeOptions)
