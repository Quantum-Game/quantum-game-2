/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
import firebase, { db, auth } from '@/config/firebase';

Vue.use(Vuex);

const userStore = {
  state: {
    user: {
      loggedIn: false,
      rememberMe: true,
      data: {
        displayName: '',
        email: ''
      }
    },
    progressArr: [{ id: 1, status: 'solved', score: 150 }, { id: 2, status: 'solved', score: 100 }],
    error: null
  }
};
// },
// getters: {
//   user(state) {
//     return state.user;
//   },
//   userName(state) {
//     return state.user.data.displayName;
//   },
//   progressArr(state) {
//     return state.progressArr;
//   },
//   error(state) {
//     return state.error;
//   }
// },
// mutations: {
//   SET_LOGGED_IN(state, payload) {
//     state.user.loggedIn = payload;
//   },
//   SET_REMEMBER_ME(state, payload) {
//     state.user.rememberMe = payload;
//   },
//   SET_USER(state, payload) {
//     state.user.data = payload;
//   },
//   SET_ERROR(state, payload) {
//     state.error = payload;
//   },
//   SET_PROGRESS(state, payload) {
//     state.progressArr = payload;
//   }
// },
// actions: {
//   FETCH_USER({ commit, dispatch }, user) {
//     commit('SET_LOGGED_IN', user !== null);
//     if (user) {
//       dispatch('GET_PROGRESS');
//       commit('SET_ERROR', null);
//       commit('SET_USER', {
//         displayName: user.displayName,
//         email: user.email
//       });
//     } else {
//       commit('SET_USER', null);
//     }
//   },
//   SIGN_IN({ commit, getters }, user) {
//     commit('SET_REMEMBER_ME', user.rememberMe);

//     let authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

//     if (!getters.user.rememberMe) {
//       authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
//     }

//     authPersistance
//       .then(() => {
//         return auth.signInWithEmailAndPassword(user.email, user.password);
//       })
//       .then(() => {
//         router.replace({ name: 'myaccount' });
//       })
//       .catch((err) => {
//         commit('SET_ERROR', err.message);
//       });
//   },
//   SIGN_IN_SOCIAL({ commit }, social) {
//     const self = this;
//     let provider = null;
//     if (social === 'github') {
//       provider = new firebase.auth.GithubAuthProvider();
//     } else if (social === 'facebook') {
//       provider = new firebase.auth.FacebookAuthProvider();
//     } else if (social === 'google') {
//       provider = new firebase.auth.GoogleAuthProvider();
//     }

//     auth
//       .signInWithPopup(provider)
//       .then(() => {
//         router.replace({ name: 'myaccount' });
//       })
//       .catch((err) => {
//         commit('SET_ERROR', err.message);
//       });
//   },
//   SIGN_UP({ commit }, user) {
//     auth
//       .createUserWithEmailAndPassword(user.email, user.password)
//       .then((data) => {
//         data.user.updateProfile({
//           displayName: user.name
//         });
//       })
//       .then((data) => {
//         router.replace({ name: 'myaccount' });
//       })
//       .catch((err) => {
//         commit('SET_ERROR', err.message);
//       });
//   },
//   SIGN_OUT({ commit }) {
//     auth.signOut().then(() => {
//       router.replace({
//         name: 'login'
//       });
//     });
//   },
//   SAVE_PROGRESS({ commit, getters }) {
//     const { progressArr } = getters;
//     const dbRef = db.collection('users').doc(auth.currentUser.uid);
//     const data = { uid: auth.currentUser.uid, progress: progressArr };

//     dbRef
//       .set(data)
//       .then(() => {
//         console.log('Data stored: ', data);
//       })
//       .catch((err) => {
//         commit('SET_ERROR', err.message);
//       });
//   },
//   GET_PROGRESS({ commit }) {
//     const dbRef = db.collection('users').doc(auth.currentUser.uid);
//     dbRef
//       .get()
//       .then((doc) => {
//         const { progress } = doc.data();
//         if (doc.exists) {
//           console.log('Document data:', progress);
//           commit('SET_PROGRESS', progress);
//         } else {
//           console.log('No such document!');
//         }
//       })
//       .catch((err) => {
//         commit('SET_ERROR', err.message);
//       });
//   }
// }
// };

export default new Vuex.Store(userStore);
