import {
  IUserState,
  IUser,
  IProgressObj,
  ISavedLevel,
  ISavedLevelMetadata,
  storeModule,
} from '@/store/storeInterfaces'
import { ILevel } from '@/engine/interfaces'
import router from '@/router'
import firebase, { db, auth } from '@/config/firebase'

export default storeModule<IUserState>({
  namespaced: true,
  state: {
    user: {
      loggedIn: false,
      rememberMe: true,
      data: {
        displayName: '',
        email: '',
      },
    },
    progressArr: [],
    savedLevelsList: [],
    publicLevels: [],
    fetchedLevel: undefined,
  },
  getters: {
    user(state): IUser {
      return state.user
    },
    userName(state): string {
      return state.user.data.displayName
    },
    progressArr(state): IProgressObj[] {
      return state.progressArr
    },
    savedLevelsList(state): ISavedLevelMetadata[] {
      return state.savedLevelsList
    },
    publicLevels(state): ISavedLevelMetadata[] {
      return state.publicLevels
    },
    isLoggedIn(state): boolean {
      return state.user.loggedIn
    },
    fetchedLevelBoardState(state): ILevel | undefined {
      return state.fetchedLevel
    },
  },
  mutations: {
    SET_LOGGED_IN(state, payload): void {
      state.user.loggedIn = payload
    },
    SET_REMEMBER_ME(state, payload): void {
      state.user.rememberMe = payload
    },
    SET_USER(state, payload): void {
      state.user.data = payload
    },
    SET_PROGRESS(state, payload): void {
      state.progressArr = payload
    },
    SET_SAVED_LEVELS_LIST(state, payload): void {
      state.savedLevelsList = payload
    },
    SET_PUBLIC_LEVELS(state, payload): void {
      state.publicLevels = payload
    },
    SET_PUBLIC(state, payload): void {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.savedLevelsList.find((x) => x.id === payload)!.public = true
    },
    SET_PRIVATE(state, payload): void {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.savedLevelsList.find((x) => x.id === payload)!.public = false
    },
    REMOVE_LEVEL(state, payload): void {
      state.savedLevelsList = state.savedLevelsList.filter(function(obj) {
        return obj.id !== payload
      })
    },
    SET_FETCHED_LEVEL(state, payload: ILevel): void {
      state.fetchedLevel = payload
    },
    RESET_FETCHED_LEVEL(state): void {
      state.fetchedLevel = undefined
    },
  },
  actions: {
    SET_INITIAL_PROGRESS({ commit }): void {
      commit('SET_PROGRESS', [
        { id: 0, status: 'won', timeOpened: firebase.firestore.Timestamp.fromDate(new Date()) },
      ])
    },
    FETCH_USER({ commit, dispatch }, user): void {
      commit('SET_LOGGED_IN', user !== null)
      if (user) {
        dispatch('GET_PROGRESS')
        dispatch('FETCH_MY_LEVELS')
        dispatch('FETCH_PUBLIC_LEVELS')
        commit('RESET_ERRORS', null, { root: true })
        commit('SET_USER', {
          displayName: user.displayName,
          email: user.email,
        })
      } else {
        commit('SET_USER', null)
      }
    },
    SIGN_IN({ commit, getters }, user): void {
      commit('SET_REMEMBER_ME', user.rememberMe)

      let authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

      if (!getters.user.rememberMe) {
        authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      }

      authPersistance
        .then(() => {
          return auth.signInWithEmailAndPassword(user.email, user.password)
        })
        .then(() => {
          router.replace({ name: 'myaccount' })
        })
        .catch((err) => {
          commit('SET_ERROR', err.message, { root: true })
        })
    },
    SIGN_IN_GITHUB({ dispatch }): void {
      const provider = new firebase.auth.GithubAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    SIGN_IN_FACEBOOK({ dispatch }): void {
      const provider = new firebase.auth.FacebookAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    SIGN_IN_GOOGLE({ dispatch }): void {
      const provider = new firebase.auth.GoogleAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    SIGN_IN_WITH_POPUP({ commit }, provider): void {
      auth
        .signInWithPopup(provider)
        .then(() => {
          router.replace({ name: 'myaccount' })
        })
        .catch((err) => {
          commit('SET_ERROR', err.message, { root: true })
        })
    },
    SIGN_UP({ commit }, user): void {
      auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((data) => {
          if (data.user) {
            data.user.updateProfile({
              displayName: user.name,
            })
          }
        })
        .then(() => {
          router.replace({ name: 'myaccount' })
        })
        .catch((err) => {
          commit('SET_ERROR', err.message, { root: true })
        })
    },
    SIGN_OUT({ commit }): void {
      auth.signOut().then(() => {
        commit('SET_LOGGED_IN', false)
        router.replace({
          name: 'login',
        })
      })
    },
    SAVE_PROGRESS({ commit, getters }): void {
      if (auth.currentUser) {
        const { progressArr }: { progressArr: IProgressObj } = getters
        const dbRef = db.collection('users').doc(auth.currentUser.uid)
        const data = { uid: auth.currentUser.uid, progress: progressArr }

        dbRef
          .set(data)
          .then(() => {
            console.debug('Data stored: ', data)
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      }
    },
    /**
     * @todo It should be a database, not a list.
     */
    GET_PROGRESS({ commit }): void {
      if (auth.currentUser) {
        const dbRef = db.collection('users').doc(auth.currentUser.uid)
        dbRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data()
              if (data != null) {
                commit('SET_PROGRESS', data.progress)
              }
            } else {
              console.debug('No such document!')
            }
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      }
    },
    /**
     * @todo Does not match level structure from levels in JSON.
     */
    SAVE_LEVEL({ commit, dispatch }, level: ISavedLevel['level']): void {
      if (auth.currentUser) {
        const customLevel: ISavedLevel = {
          userId: auth.currentUser.uid,
          level: {
            currentLevelID: level.currentLevelID,
            gameState: level.gameState,
            boardState: level.boardState,
          },
          public: false,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          lastModified: firebase.firestore.Timestamp.fromDate(new Date()),
        }

        const dbRef = db.collection('levels')

        dbRef
          .add(customLevel)
          .then((data) => {
            console.log('Level saved: ', data.id)
            router.replace({ path: `/level/${data.id}` })
            commit('SET_PUBLIC', data.id)
            dispatch('UPDATE_LEVEL_LISTS')
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    UPDATE_LEVEL({ commit }, level): void {
      if (auth.currentUser) {
        const customLevel: Partial<ISavedLevel> = {
          userId: auth.currentUser.uid,
          level: {
            currentLevelID: level.currentLevelID,
            gameState: level.gameState,
            boardState: level.boardState,
          },
          lastModified: firebase.firestore.Timestamp.fromDate(new Date()),
        }
        const levelSaved = router.currentRoute.params.id

        const doc = db.collection('levels').doc(levelSaved)

        doc.update(customLevel).catch((err) => {
          commit('SET_ERROR', err.message, { root: true })
        })
      } else {
        console.log('You are not logged in!')
      }
    },
    FETCH_MY_LEVELS({ commit }): void {
      if (auth.currentUser) {
        const myLevels: ISavedLevelMetadata[] = []
        const docs = db.collection('levels').where('userId', '==', auth.currentUser.uid)

        docs
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
              myLevels.push({
                id: doc.id,
                link: `/level/${doc.id}`,
                public: doc.data().public,
                createdAt: doc.data().createdAt,
                lastModified: doc.data().lastModified,
              })
            })
          })
          .then(() => {
            commit('SET_SAVED_LEVELS_LIST', myLevels)
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    FETCH_PUBLIC_LEVELS({ commit }): void {
      if (auth.currentUser) {
        const publicLevels: ISavedLevelMetadata[] = []
        const docs = db.collection('levels').where('public', '==', true)

        docs
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
              publicLevels.push({
                id: doc.id,
                link: `/levels/${doc.id}`,
                public: doc.data().public, // always true
                createdAt: doc.data().createdAt,
                lastModified: doc.data().lastModified,
              })
            })
          })
          .then(() => {
            commit('SET_PUBLIC_LEVELS', publicLevels)
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    MAKE_LEVEL_PUBLIC({ commit, dispatch }, levelID): void {
      if (auth.currentUser) {
        const docs = db
          .collection('levels')
          .where('userId', '==', auth.currentUser.uid)
          .where(firebase.firestore.FieldPath.documentId(), '==', levelID)

        docs
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
              if (doc.id === levelID) {
                doc.ref.update({ public: true })
              }
            })
          })
          .then(() => {
            dispatch('UPDATE_LEVEL_LISTS')
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    MAKE_LEVEL_PRIVATE({ commit, dispatch }, levelID): void {
      if (auth.currentUser) {
        const doc = db.collection('levels').doc(levelID)

        doc
          .update({ public: false })
          .then(() => {
            dispatch('UPDATE_LEVEL_LISTS')
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    REMOVE_LEVEL({ commit }, levelID): void {
      const dbRef = db.collection('levels')

      dbRef
        .doc(levelID)
        .delete()
        .then(() => {
          commit('REMOVE_LEVEL', levelID)
          console.log('Level removed', levelID)
        })
        .catch((err) => {
          commit('SET_ERROR', err.message, { root: true })
        })
    },
    GET_LEVEL_DATA({ commit }, { id }): void {
      db.collection('levels')
        .doc(id)
        .get()
        .then((response) => {
          const levelData = response.data()
          console.log(levelData)
          if (levelData) {
            commit('SET_FETCHED_LEVEL', levelData.level.boardState)
          } else {
            console.log('No Level Data Found!')
          }
        })
        .catch((err) => {
          commit('SET_ERROR', err.message, { root: true })
        })
    },
    CLEAR_LEVEL_DATA({ commit }): void {
      commit('RESET_FETCHED_LEVEL')
    },
    UPDATE_LEVEL_LISTS({ dispatch }): void {
      dispatch('FETCH_MY_LEVELS')
      dispatch('FETCH_PUBLIC_LEVELS')
    },
  },
})
