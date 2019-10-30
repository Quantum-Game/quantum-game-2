import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { Coord, Element, Cell } from '@/engine/main';
import { RootState } from '@/types';
import { SET_ACTIVE_CELL, RESET_ACTIVE_CELL } from './mutation-types';

const initialCell = new Cell(new Coord(0, 0), Element.fromName('Void'));
Vue.use(Vuex);

const store: StoreOptions<RootState> = {
	state: {
		activeCell: initialCell
	},
	mutations: {
		[SET_ACTIVE_CELL](state, cell) {
			state.activeCell = cell;
		},
		[RESET_ACTIVE_CELL](state) {
			state.activeCell = initialCell;
		}
	}
};

export default new Vuex.Store<RootState>(store);
