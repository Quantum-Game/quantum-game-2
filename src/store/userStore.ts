import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const userStore = {
  state: {
    user: {
      loggedIn: false,
      data: {
        displayName: ''
      }
    }
  },
  getters: {
    user(state){
      return state.user;
    },
    userName(state) {
      return state.user.data.displayName
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    }
  }
};

export default new Vuex.Store(userStore);
