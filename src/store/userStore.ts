/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
import firebase, { db, auth } from '@/config/firebase';

Vue.use(Vuex);

interface progressObj {
  id: number;
  status: 'string';
  score: number;
}

interface userInterface {
  user: {
    loggedIn: boolean;
    rememberMe: boolean;
    data: {
      displayName: string;
      email: string;
    };
  };
  progressArr: progressObj[];
  error: null;
}

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
  },
}
//   getters: {
//     user(state: userInterface) {
//       return state.user;
//     },
//     userName(state: userInterface) {
//       return state.user.data.displayName;
//     },
//     progressArr(state: userInterface) {
//       return state.progressArr;
//     },
//     error(state: userInterface) {
//       return state.error;
//     }
//   },
//   mutations: {
//     SET_LOGGED_IN(state: userInterface, payload) {
//       state.user.loggedIn = payload;
//     },
//     SET_REMEMBER_ME(state: userInterface, payload) {
//       state.user.rememberMe = payload;
//     },
//     SET_USER(state: userInterface, payload) {
//       state.user.data = payload;
//     },
//     SET_ERROR(state: userInterface, payload) {
//       state.error = payload;
//     },
//     SET_PROGRESS(state: userInterface, payload) {
//       state.progressArr = payload;
//     }
//   },
//   actions: {
//     FETCH_USER({ commit, dispatch }, user) {
//       commit('SET_LOGGED_IN', user !== null);
//       if (user) {
//         dispatch('GET_PROGRESS');
//         commit('SET_ERROR', null);
//         commit('SET_USER', {
//           displayName: user.displayName,
//           email: user.email
//         });
//       } else {
//         commit('SET_USER', null);
//       }
//     },
//     SIGN_IN({ commit, getters }, user) {
//       commit('SET_REMEMBER_ME', user.rememberMe);

//       let authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

//       if (!getters.user.rememberMe) {
//         authPersistance = auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
//       }

//       authPersistance
//         .then(() => {
//           return auth.signInWithEmailAndPassword(user.email, user.password);
//         })
//         .then(() => {
//           router.replace({ name: 'myaccount' });
//         })
//         .catch((err) => {
//           commit('SET_ERROR', err.message);
//         });
//     },
//     SIGN_IN_SOCIAL({ commit }, social) {
//       const self = this;
//       let provider = null;
//       if (social === 'github') {
//         provider = new firebase.auth.GithubAuthProvider();
//       } else if (social === 'facebook') {
//         provider = new firebase.auth.FacebookAuthProvider();
//       } else if (social === 'google') {
//         provider = new firebase.auth.GoogleAuthProvider();
//       }

//       auth
//         .signInWithPopup(provider)
//         .then(() => {
//           router.replace({ name: 'myaccount' });
//         })
//         .catch((err: { message: any; }) => {
//           commit('SET_ERROR', err.message);
//         });
//     },
//     SIGN_UP({ commit }, user) {
//       auth
//         .createUserWithEmailAndPassword(user.email, user.password)
//         .then((data) => {
//           data.user!.updateProfile({
//             displayName: user.name
//           });
//         })
//         .then((data) => {
//           router.replace({ name: 'myaccount' });
//         })
//         .catch((err) => {
//           commit('SET_ERROR', err.message);
//         });
//     },
//     SIGN_OUT({ commit }) {
//       auth.signOut().then(() => {
//         router.replace({
//           name: 'login'
//         });
//       });
//     },
//     SAVE_PROGRESS({ commit, getters }) {
//       const { progressArr } = getters;
//       const dbRef = db.collection('users').doc(auth.currentUser!.uid);
//       const data = { uid: auth.currentUser!.uid, progress: progressArr };

//       dbRef
//         .set(data)
//         .then(() => {
//           console.debug('Data stored: ', data);
//         })
//         .catch((err) => {
//           commit('SET_ERROR', err.message);
//         });
//     },
//     GET_PROGRESS({ commit }) {
//       const dbRef = db.collection('users').doc(auth.currentUser!.uid);
//       dbRef
//         .get()
//         .then((doc) => {
//           const { progress } = doc.data();
//           if (doc.exists) {
//             console.debug('Document data:', progress);
//             commit('SET_PROGRESS', progress);
//           } else {
//             console.debug('No such document!');
//           }
//         })
//         .catch((err) => {
//           commit('SET_ERROR', err.message);
//         });
//     }
//   }
// };

export default new Vuex.Store(userStore);
