import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { Coord, Element, Cell } from 'quantumweasel';
import { RootState } from '@/types';
import {
	SET_ACTIVE_CELL,
	RESET_ACTIVE_CELL,
	START_MOVING,
	STOP_MOVING,
	SET_CURRENT_TOOLS,
	RESET_CURRENT_TOOLS,
	ADD_TO_CURRENT_TOOLS,
	REMOVE_FROM_CURRENT_TOOLS,
	SET_ACTIVE_CELL_COORDINATES,
	SET_MOVE_SOURCE,
	RESET_MOVE_SOURCE
} from './mutation-types';

const initialCell = new Cell(new Coord(0, 0), Element.fromName('Void'));
Vue.use(Vuex);

const store: StoreOptions<RootState> = {
	state: {
		activeCell: initialCell,
		currentTools: [],
		isMoving: false,
		moveSource: ''
	},
	mutations: {
		// active cell functional
		[SET_ACTIVE_CELL](state, cell) {
			state.activeCell = cell;
		},
		[RESET_ACTIVE_CELL](state) {
			state.activeCell = initialCell;
		},
		[SET_ACTIVE_CELL_COORDINATES](state, coord) {
			state.activeCell.coord = coord;
		},
		// moving functionality
		[START_MOVING](state) {
			state.isMoving = true;
		},
		[STOP_MOVING](state) {
			state.isMoving = false;
		},
		[SET_MOVE_SOURCE](state, source) {
			state.moveSource = source;
		},
		[RESET_MOVE_SOURCE](state) {
			state.moveSource = '';
		},
		// toolbox functionality
		[SET_CURRENT_TOOLS](state, cells) {
			state.currentTools = cells;
		},
		[RESET_CURRENT_TOOLS](state) {
			state.currentTools = [];
		},
		[ADD_TO_CURRENT_TOOLS](state, cell) {
			state.currentTools = [...state.currentTools, cell];
		},
		[REMOVE_FROM_CURRENT_TOOLS](state, cell) {
			const index = state.currentTools.indexOf(cell);
			state.currentTools.splice(index, 1);
		}
	},
	getters: {
		activeCell: (state) => state.activeCell,
		isMoving: (state) => state.isMoving,
		currentTools: (state) => state.currentTools,
		isActiveCellMovable: (state) => !state.activeCell.frozen
	}
};

export default new Vuex.Store<RootState>(store);
