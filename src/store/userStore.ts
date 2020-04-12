/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Module } from 'vuex'
import { IUserState } from '@/engine/interfaces'
import router from '@/router'
import firebase, { db, auth } from '@/config/firebase'
import { IRootState } from '@/types'

const userModule: Module<IUserState, IRootState> = {
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
    fetchedLevel: null,
  },
  getters: {
    user(state) {
      return state.user
    },
    userName(state) {
      return state.user.data.displayName
    },
    progressArr(state) {
      return state.progressArr
    },
    savedLevelsList(state) {
      return state.savedLevelsList
    },
    publicLevels(state) {
      return state.publicLevels
    },
    isLoggedIn(state) {
      return state.user.loggedIn
    },
    fetchedLevelBoardState(state) {
      return state.fetchedLevel
    },
  },
  mutations: {
    SET_LOGGED_IN(state, payload) {
      state.user.loggedIn = payload
    },
    SET_REMEMBER_ME(state, payload) {
      state.user.rememberMe = payload
    },
    SET_USER(state, payload) {
      state.user.data = payload
    },
    SET_PROGRESS(state, payload) {
      state.progressArr = payload
    },
    SET_SAVED_LEVELS_LIST(state, payload) {
      state.savedLevelsList = payload
    },
    SET_PUBLIC_LEVELS(state, payload) {
      state.publicLevels = payload
    },
    SET_PUBLIC(state, payload) {
      state.savedLevelsList.find((x) => x.id === payload)!.public = true
    },
    SET_PRIVATE(state, payload) {
      state.savedLevelsList.find((x) => x.id === payload)!.public = false
    },
    REMOVE_LEVEL(state, payload) {
      state.savedLevelsList = state.savedLevelsList.filter(function(obj) {
        return obj.id !== payload
      })
    },
    SET_FETCHED_LEVEL(state, payload) {
      state.fetchedLevel = payload
    },
    RESET_FETCHED_LEVEL(state) {
      state.fetchedLevel = null
    },
  },
  actions: {
    SET_INITIAL_PROGRESS({ commit }) {
      commit('SET_PROGRESS', [
        { id: 1, status: 'solved', score: 150 },
        { id: 2, status: 'no', score: 100 },
      ])
    },
    FETCH_USER({ commit, dispatch }, user) {
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
    SIGN_IN({ commit, getters }, user) {
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
    SIGN_IN_GITHUB({ dispatch }) {
      const provider = new firebase.auth.GithubAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    SIGN_IN_FACEBOOK({ dispatch }) {
      const provider = new firebase.auth.FacebookAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    SIGN_IN_GOOGLE({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    SIGN_IN_WITH_POPUP({ commit }, provider) {
      auth
        .signInWithPopup(provider)
        .then(() => {
          router.replace({ name: 'myaccount' })
        })
        .catch((err) => {
          commit('SET_ERROR', err.message, { root: true })
        })
    },
    SIGN_UP({ commit }, user) {
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
    SIGN_OUT({ commit }) {
      auth.signOut().then(() => {
        commit('SET_LOGGED_IN', false)
        router.replace({
          name: 'login',
        })
      })
    },
    SAVE_PROGRESS({ commit, getters }) {
      if (auth.currentUser) {
        const { progressArr } = getters
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
    GET_PROGRESS({ commit }) {
      if (auth.currentUser) {
        const dbRef = db.collection('users').doc(auth.currentUser.uid)
        dbRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const { progress }: any = doc.data()
              commit('SET_PROGRESS', progress)
            } else {
              console.debug('No such document!')
            }
          })
          .catch((err) => {
            commit('SET_ERROR', err.message, { root: true })
          })
      }
    },
    SAVE_LEVEL({ commit, dispatch }, level) {
      // console.log(level)
      if (auth.currentUser) {
        const customLevel: any = {
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
    UPDATE_LEVEL({ commit }, level) {
      if (auth.currentUser) {
        const customLevel: any = {
          userId: auth.currentUser.uid,
          level: {
            currentLevelID: level.currentLevelID,
            gameState: level.gameState,
            boardState: level.boardState,
          },
          // created for firestore update test
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
    FETCH_MY_LEVELS({ commit }) {
      if (auth.currentUser) {
        const myLevels: any = []
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
    FETCH_PUBLIC_LEVELS({ commit }) {
      if (auth.currentUser) {
        const publicLevels: any = []
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
    MAKE_LEVEL_PUBLIC({ commit, dispatch }, levelID) {
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
    MAKE_LEVEL_PRIVATE({ commit, dispatch }, levelID) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    REMOVE_LEVEL({ commit, dispatch }, levelID) {
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
    GET_LEVEL_DATA({ commit }, { id }) {
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
    CLEAR_LEVEL_DATA({ commit }) {
      commit('RESET_FETCHED_LEVEL')
    },
    UPDATE_LEVEL_LISTS({ dispatch }) {
      dispatch('FETCH_MY_LEVELS')
      dispatch('FETCH_PUBLIC_LEVELS')
    },
  },
}

export default userModule
