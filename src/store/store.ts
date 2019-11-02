import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '@/types';
import Cell from '@/engine/Cell';
import Level from '@/engine/Level';
import Toolbox from '@/engine/Toolbox';
import {
  SET_ACTIVE_LEVEL,
  UPDATE_GRID_CELL,
  SET_ACTIVE_CELL,
  RESET_ACTIVE_CELL,
  CELL_SELECTED,
  CELL_UNSELECTED,
  SET_CURRENT_TOOLS,
  RESET_CURRENT_TOOLS,
  ADD_TO_CURRENT_TOOLS,
  REMOVE_FROM_CURRENT_TOOLS,
  SET_ACTIVE_CELL_COORDINATES,
  SET_MOVE_SOURCE,
  RESET_MOVE_SOURCE
} from './mutation-types';

const initialCell = Cell.createDummy();
const initialLevel = Level.createDummy();
Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    activeLevel: initialLevel,
    activeCell: initialCell,
    cellSelected: false,
    moveSource: ''
  },
  mutations: {
    // set active level
    [SET_ACTIVE_LEVEL](state, level) {
      state.activeLevel = level;
    },
    // modify grid cell
    [UPDATE_GRID_CELL](state, cell) {
      state.activeLevel.grid.set(cell);
    },
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
    [CELL_SELECTED](state) {
      state.cellSelected = true;
    },
    [CELL_UNSELECTED](state) {
      state.cellSelected = false;
    },
    [SET_MOVE_SOURCE](state, source) {
      state.moveSource = source;
    },
    [RESET_MOVE_SOURCE](state) {
      state.moveSource = '';
    },
    // toolbox functionality
    [SET_CURRENT_TOOLS](state, cells) {
      state.activeLevel.toolbox = new Toolbox(cells);
    },
    [RESET_CURRENT_TOOLS](state) {
      state.activeLevel.toolbox.reset();
    },
    [ADD_TO_CURRENT_TOOLS](state, cell) {
      state.activeLevel.toolbox.addTool(cell);
    },
    [REMOVE_FROM_CURRENT_TOOLS](state, cell) {
      state.activeLevel.toolbox.removeTool(cell);
    }
  },
  getters: {
    activeCell: (state) => state.activeCell,
    cellSelected: (state) => state.cellSelected,
    toolbox: (state) => state.activeLevel.toolbox,
    isActiveCellMovable: (state) => state.activeCell.tool
  }
};

export default new Vuex.Store<RootState>(store);
