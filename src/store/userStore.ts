// /* eslint-disable */
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { UserState } from '@/types';
import router from '@/router';
import firebase, { db, auth } from '@/config/firebase';

// Vue.use(Vuex);

const userStore: StoreOptions<UserState> = {
  state: {
    user: {
      loggedIn: false,
      rememberMe: true,
      data: {
        displayName: '',
        email: ''
      }
    },
    progressArr: [],
    error: null
  },
  getters: {
    user(state) {
      return state.user;
    },
    userName(state) {
      return state.user.data.displayName;
    },
    progressArr(state) {
      return state.progressArr;
    },
    error(state) {
      return state.error;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, payload) {
      state.user.loggedIn = payload;
    },
    SET_REMEMBER_ME(state, payload) {
      state.user.rememberMe = payload;
    },
    SET_USER(state, payload) {
      state.user.data = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    SET_PROGRESS(state, payload) {
      state.progressArr = payload;
    }
  },
  actions: {
    SET_INITIAL_PROGRESS({commit}){
      commit('SET_PROGRESS',
      [{ id: 1, status: 'solved', score: 150 },
      { id: 2, status: 'no', score: 100 }]
      );
    },
    FETCH_USER({ commit, dispatch }, user) {
      commit('SET_LOGGED_IN', user !== null);
      if (user) {
        dispatch('GET_PROGRESS');
        commit('SET_ERROR', null);
        commit('SET_USER', {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit('SET_USER', null);
      }
    },
    SIGN_IN({ commit, getters }, user) {
      commit('SET_REMEMBER_ME', user.rememberMe);

      let authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      if (!getters.user.rememberMe) {
        authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }

      authPersistance
        .then(() => {
          return auth.signInWithEmailAndPassword(user.email, user.password);
        })
        .then(() => {
          router.replace({ name: 'myaccount' });
        })
        .catch((err) => {
          commit('SET_ERROR', err.message);
        });
    },
    SIGN_IN_GITHUB({ dispatch }) {
      const provider = new firebase.auth.GithubAuthProvider();
      dispatch('SIGN_IN_WITH_POPUP', provider);
    },
    SIGN_IN_FACEBOOK({ dispatch }) {
      const provider = new firebase.auth.FacebookAuthProvider();
      dispatch('SIGN_IN_WITH_POPUP', provider);
    },
    SIGN_IN_GOOGLE({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      dispatch('SIGN_IN_WITH_POPUP', provider);
    },
    SIGN_IN_WITH_POPUP({commit}, provider) {
      auth
        .signInWithPopup(provider)
        .then(() => {
          router.replace({ name: 'myaccount' });
        })
        .catch((err) => {
          commit('SET_ERROR', err.message);
        });
    },
    SIGN_UP({ commit }, user) {
      auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((data) => {
          if(data.user) {
            data.user.updateProfile({
              displayName: user.name
            });
          }
        })
        .then(() => {
          router.replace({ name: 'myaccount' });
        })
        .catch((err) => {
          commit('SET_ERROR', err.message);
        });
    },
    SIGN_OUT() {
      auth.signOut().then(() => {
        router.replace({
          name: 'login'
        });
      });
    },
    SAVE_PROGRESS({ commit, getters }) {
      if (auth.currentUser) {
        const { progressArr } = getters;
        const dbRef = db.collection('users').doc(auth.currentUser.uid);
        const data = { uid: auth.currentUser.uid, progress: progressArr };

        dbRef
          .set(data)
          .then(() => {
            console.log('Data stored: ', data);
          })
          .catch((err) => {
            commit('SET_ERROR', err.message);
          });
      }
    },
    GET_PROGRESS({ commit }) {
      if (auth.currentUser) {
      const dbRef = db.collection('users').doc(auth.currentUser.uid);
      dbRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const { progress }: any = doc.data();
            commit('SET_PROGRESS', progress);
          } else {
            console.log('No such document!');
          }
        })
        .catch((err) => {
          commit('SET_ERROR', err.message);
        });
      }
    }
  }
};

export default new Vuex.Store<UserState>(userStore);
