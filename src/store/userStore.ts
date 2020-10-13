import {
  User,
  ProgressObj,
  SavedLevel,
  SavedLevelMetadata,
  storeModule,
} from '@/store/storeInterfaces'
import router from '@/router'

function importFirebase() {
  return import(/* webpackChunkName: 'chunk-firebase' */ '@/config/firebase')
}

interface UserState {
  user: User
  progressArr: ProgressObj[]
  savedLevelsList: SavedLevelMetadata[]
  publicLevels: SavedLevelMetadata[]
}

export default storeModule({
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
  } as UserState,
  getters: {
    user(state): User {
      return state.user
    },
    userName(state): string {
      return state.user.data.displayName
    },
    progressArr(state): ProgressObj[] {
      return state.progressArr
    },
    savedLevelsList(state): SavedLevelMetadata[] {
      return state.savedLevelsList
    },
    publicLevels(state): SavedLevelMetadata[] {
      return state.publicLevels
    },
    isLoggedIn(state): boolean {
      return state.user.loggedIn
    },
  },
  mutations: {
    SET_LOGGED_IN(state, payload: boolean): void {
      state.user.loggedIn = payload
    },
    SET_REMEMBER_ME(state, payload: boolean): void {
      state.user.rememberMe = payload
    },
    SET_USER(state, payload: User['data']): void {
      state.user.data = payload
    },
    SET_PROGRESS(state, payload: ProgressObj[]): void {
      state.progressArr = payload
    },
    SET_SAVED_LEVELS_LIST(state, payload: SavedLevelMetadata[]): void {
      state.savedLevelsList = payload
    },
    SET_PUBLIC_LEVELS(state, payload: SavedLevelMetadata[]): void {
      state.publicLevels = payload
    },
    SET_PUBLIC(state, payload: string): void {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.savedLevelsList.find((x) => x.id === payload)!.public = true
    },
    SET_PRIVATE(state, payload: string): void {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.savedLevelsList.find((x) => x.id === payload)!.public = false
    },
    REMOVE_LEVEL(state, payload: string): void {
      state.savedLevelsList = state.savedLevelsList.filter(function(obj) {
        return obj.id !== payload
      })
    },
  },
  actions: {
    async SET_INITIAL_PROGRESS({ commit }) {
      const { firebase } = await importFirebase()
      const payload: ProgressObj[] = [
        { id: 0, status: 'won', timeOpened: firebase.firestore.Timestamp.fromDate(new Date()) },
      ]
      commit('SET_PROGRESS', payload)
    },
    FETCH_USER({ commit, dispatch }, user: User['data'] | null): void {
      commit('SET_LOGGED_IN', user != null)
      if (user != null) {
        dispatch('GET_PROGRESS')
        dispatch('FETCH_MY_LEVELS')
        dispatch('FETCH_PUBLIC_LEVELS')
        commit('errors/RESET_ERRORS', null, { root: true })
        commit('SET_USER', {
          displayName: user.displayName,
          email: user.email,
        })
      } else {
        commit('SET_USER', null)
      }
    },
    async SIGN_IN({ commit, getters }, user) {
      const { auth, firebase } = await importFirebase()
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
          commit('errors/SET_ERROR', err.message, { root: true })
        })
    },
    async SIGN_IN_GITHUB({ dispatch }) {
      const { firebase } = await importFirebase()
      const provider = new firebase.auth.GithubAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    async SIGN_IN_FACEBOOK({ dispatch }) {
      const { firebase } = await importFirebase()
      const provider = new firebase.auth.FacebookAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    async SIGN_IN_GOOGLE({ dispatch }) {
      const { firebase } = await importFirebase()
      const provider = new firebase.auth.GoogleAuthProvider()
      dispatch('SIGN_IN_WITH_POPUP', provider)
    },
    async SIGN_IN_WITH_POPUP({ commit }, provider) {
      const { auth } = await importFirebase()
      auth
        .signInWithPopup(provider)
        .then(() => {
          router.replace({ name: 'myaccount' })
        })
        .catch((err) => {
          commit('errors/SET_ERROR', err.message, { root: true })
        })
    },
    async SIGN_UP({ commit }, user) {
      const { auth } = await importFirebase()
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
          commit('errors/SET_ERROR', err.message, { root: true })
        })
    },
    async SIGN_OUT({ commit }) {
      const { auth } = await importFirebase()
      auth.signOut().then(() => {
        commit('SET_LOGGED_IN', false)
        router.replace({
          name: 'login',
        })
      })
    },
    async SAVE_PROGRESS({ commit, getters }) {
      const { auth, db } = await importFirebase()
      if (auth.currentUser) {
        const { progressArr }: { progressArr: ProgressObj } = getters
        const dbRef = db.collection('users').doc(auth.currentUser.uid)
        const data = { uid: auth.currentUser.uid, progress: progressArr }

        dbRef
          .set(data)
          .then(() => {
            console.debug('Data stored: ', data)
          })
          .catch((err) => {
            commit('errors/SET_ERROR', err.message, { root: true })
          })
      }
    },
    /**
     * @todo It should be a database, not a list.
     */
    async GET_PROGRESS({ commit }) {
      const { auth, db } = await importFirebase()
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
            commit('errors/SET_ERROR', err.message, { root: true })
          })
      }
    },
    /**
     * @todo Does not match level structure from levels in JSON.
     */
    async SAVE_LEVEL({ commit, dispatch }, level: SavedLevel['level']) {
      const { auth, firebase, db } = await importFirebase()
      if (auth.currentUser == null) {
        console.log('You are not logged in!')
        return
      }
      const customLevel: SavedLevel = {
        userId: auth.currentUser.uid,
        level,
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
          commit('errors/SET_ERROR', err.message, { root: true })
        })
    },
    async UPDATE_LEVEL({ commit }, level: SavedLevel['level']) {
      const { auth, firebase, db } = await importFirebase()
      if (auth.currentUser == null) {
        console.log('You are not logged in!')
        return
      }

      const customLevel: Partial<SavedLevel> = {
        userId: auth.currentUser.uid,
        level,
        lastModified: firebase.firestore.Timestamp.fromDate(new Date()),
      }
      const levelSaved = router.currentRoute.value.params.id as string

      const doc = db.collection('levels').doc(levelSaved)

      doc.update(customLevel).catch((err) => {
        commit('errors/SET_ERROR', err.message, { root: true })
      })
    },
    async FETCH_MY_LEVELS({ commit }) {
      const { auth, db } = await importFirebase()
      if (auth.currentUser) {
        const myLevels: SavedLevelMetadata[] = []
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
            commit('errors/SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    async FETCH_PUBLIC_LEVELS({ commit }) {
      const { auth, db } = await importFirebase()
      if (auth.currentUser) {
        const publicLevels: SavedLevelMetadata[] = []
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
            commit('errors/SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    async MAKE_LEVEL_PUBLIC({ commit, dispatch }, levelID: string) {
      const { auth, firebase, db } = await importFirebase()
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
            commit('errors/SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    async MAKE_LEVEL_PRIVATE({ commit, dispatch }, levelID: string) {
      const { auth, db } = await importFirebase()
      if (auth.currentUser) {
        const doc = db.collection('levels').doc(levelID)

        doc
          .update({ public: false })
          .then(() => {
            dispatch('UPDATE_LEVEL_LISTS')
          })
          .catch((err) => {
            commit('errors/SET_ERROR', err.message, { root: true })
          })
      } else {
        console.log('You are not logged in!')
      }
    },
    async REMOVE_LEVEL({ commit }, levelID: string) {
      const { db } = await importFirebase()
      const dbRef = db.collection('levels')

      dbRef
        .doc(levelID)
        .delete()
        .then(() => {
          commit('REMOVE_LEVEL', levelID)
          console.log('Level removed', levelID)
        })
        .catch((err) => {
          commit('errors/SET_ERROR', err.message, { root: true })
        })
    },
    // GET_LEVEL_DATA({ commit }, { id }): Promise<void> {
    //   return db
    //     .collection('levels')
    //     .doc(id)
    //     .get()
    //     .then((response) => {
    //       const levelData = response.data()
    //       console.log(levelData)
    //       if (levelData) {
    //         commit('SET_FETCHED_LEVEL', levelData.level.boardState)
    //       } else {
    //         console.log('No Level Data Found!')
    //       }
    //     })
    //     .catch((err) => {
    //       commit('errors/SET_ERROR', err.message, { root: true })
    //     })
    // },
    UPDATE_LEVEL_LISTS({ dispatch }): void {
      dispatch('FETCH_MY_LEVELS')
      dispatch('FETCH_PUBLIC_LEVELS')
    },
  },
})
