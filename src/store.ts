import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    progress: 0,
  },
  mutations: {
    goOn(state) {
      state.progress += state.progress;
    },
  },
  actions: {},
};

export default new Vuex.Store<RootState>(store);
