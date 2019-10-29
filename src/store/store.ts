import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '../types';

Vue.use(Vuex);

// TODO: Clean-up, figure out initial state structure.
const store: StoreOptions<RootState> = {};

export default new Vuex.Store<RootState>(store);
