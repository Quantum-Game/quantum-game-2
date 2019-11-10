/* eslint-disable */
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { UserState } from '@/types';
import router from '@/router';
import firebase, { db, auth } from '@/config/firebase';

Vue.use(Vuex);

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
    savedLevelsList: [],
    publicLevels: [],
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
    savedLevelsList(state) {
      return state.savedLevelsList;
    },
    publicLevels(state) {
      return state.publicLevels;
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
    },
    SET_SAVED_LEVELS_LIST(state, payload) {
      state.savedLevelsList = payload;
    },
    SET_PUBLIC_LEVELS(state, payload){
      state.publicLevels = payload;
    },
    SET_PUBLIC(state, payload) {
      state.savedLevelsList.find(x => x.id === payload)!.public = true;
    },
    SET_PRIVATE(state, payload) {
      state.savedLevelsList.find(x => x.id === payload)!.public = false;
    },
    REMOVE_LEVEL(state, payload) {
      state.savedLevelsList = state.savedLevelsList.filter(function( obj ) {
        return obj.id !== payload;
    });
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
        dispatch('FETCH_MY_LEVELS');
        dispatch('FETCH_PUBLIC_LEVELS');
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
    },
    SAVE_LEVEL({commit}, level) {
      if (auth.currentUser) {
        const customLevel: any = {
          userId: auth.currentUser.uid,
          level: {
            currentLevelID: level.currentLevelID,
            gameState: level.gameState
          },
          public: false,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        };

        console.log(level)
        const dbRef = db.collection('levels');

        dbRef
          .add(customLevel)
          .then(data => {
            console.log('Level saved: ', data);
            router.replace({ path: `/level/${level.currentLevelID}/${data.id}` });
          })
          .catch((err) => {
            commit('SET_ERROR', err.message);
          });
      } else {
        console.log('You are not logged!')
      }
    },
    UPDATE_LEVEL({commit}, level) {
      if (auth.currentUser) {
        const customLevel: any = {
          userId: auth.currentUser.uid,
          level: {
            currentLevelID: level.currentLevelID,
            gameState: level.gameState
          },
          //created for firestore update test
          lastModifed: firebase.firestore.Timestamp.fromDate(new Date())
        };
        const levelSaved = router.currentRoute.params.levelsaved;

        const doc = db.collection('levels').doc(levelSaved);

        doc
          .update(customLevel)
          .catch((err) => {
            commit('SET_ERROR', err.message);
          });
      } else {
        console.log('You are not logged!')
      }
    },
    FETCH_MY_LEVELS({commit}) {
      if (auth.currentUser) {
        const myLevels: any = [];
        const docs = db.collection('levels').where("userId", "==", auth.currentUser.uid);

        docs
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(function(doc) {
              myLevels.push({
                id: doc.id,
                link: `/level/${doc.data().level.currentLevelID}/${doc.id}`,
                public: doc.data().public
              })
            });  
          })
          .then(()=> {
            commit('SET_SAVED_LEVELS_LIST', myLevels)
          })
          .catch((err) => {
            commit('SET_ERROR', err.message);
          });
      } else {
        console.log('You are not logged!')
      }
    },
    FETCH_PUBLIC_LEVELS({commit}) {
      if (auth.currentUser) {
        const publicLevels: any = [];
        const docs = db.collection('shared_levels');

        docs
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(function(doc) {
              publicLevels.push({
                link: `/levels/shared/${doc.data().level.currentLevelID}/${doc.id}`,
              })
            });  
          })
          .then(()=> {
            commit('SET_PUBLIC_LEVELS', publicLevels)
          })
          .catch((err) => {
            commit('SET_ERROR', err.message);
          });
      } else {
        console.log('You are not logged!')
      }
    },
    MAKE_LEVEL_PUBLIC({commit}, levelID) {
      if (auth.currentUser) {        

        const docs = db.collection('levels').where("userId", "==", auth.currentUser.uid).where(firebase.firestore.FieldPath.documentId(), '==', levelID);
        const sharedDoc = db.collection('shared_levels');

        docs
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
              if (doc.id === levelID) {
                doc.ref.update({public: true});
                const docShared = Object.assign({},{"guid": doc.id },doc.data());
                sharedDoc
                  .add(docShared)
                  .then(()=> {
                    console.log('data added');
                    commit('SET_PUBLIC', levelID);
                  })
              }
            });            
          })
          .catch((err) => {
            commit('SET_ERROR', err.message);
          });
      } else {
        console.log('You are not logged!')
      }
    },
    MAKE_LEVEL_PRIVATE({commit}, levelID) {
      if (auth.currentUser) {
        const doc = db.collection('levels').doc(levelID);
        const sharedDoc = db.collection('shared_levels').where("userId", "==", auth.currentUser.uid);
        
        doc
          .update({public: false})
          .then(() => {
            sharedDoc
              .where("guid", '==', levelID)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(function(d) {
                  d.ref.delete();
                })
              })
              .then(() => {
                console.log('data removed');
                commit('SET_PRIVATE', levelID);
              })
              .catch((err) => {
                commit('SET_ERROR', err.message);
              });
            
          })
          .catch((err) => {
            commit('SET_ERROR', err.message);
          });
      } else {
        console.log('You are not logged!')
      }
    },
    REMOVE_LEVEL({commit, dispatch}, levelID) {
      const dbRef = db.collection('levels');

      dbRef
        .doc(levelID)
        .delete()
        .then(() => {
          commit('REMOVE_LEVEL', levelID)
          console.log('Level removed', levelID);          
        })
        .catch((err) => {
          commit('SET_ERROR', err.message);
        });
    }
  }
};

export default new Vuex.Store<UserState>(userStore);