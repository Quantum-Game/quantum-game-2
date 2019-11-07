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
  SET_HOVERED_CELL,
  SET_CURRENT_TOOLS,
  RESET_CURRENT_TOOLS,
  ADD_TO_CURRENT_TOOLS,
  REMOVE_FROM_CURRENT_TOOLS
} from './mutation-types';
import optionsModule from './optionsModule';

const initialCell = Cell.createDummy();
const initialLevel = Level.createDummy();
Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    level: initialLevel,
    activeCell: initialCell,
    cellSelected: false,
    hoveredCell: initialCell
  },
  mutations: {
    // set active level
    [SET_ACTIVE_LEVEL](state, level) {
      state.level = level;
      state.cellSelected = false;
      state.activeCell = initialCell;
    },
    // modify grid cell
    [UPDATE_GRID_CELL](state, cell) {
      state.level.grid.set(cell);
    },
    // set active cell
    [SET_ACTIVE_CELL](state, cell) {
      state.activeCell = cell;
      state.cellSelected = true;
    },
    // reset active cell
    [RESET_ACTIVE_CELL](state) {
      state.activeCell = initialCell;
      state.cellSelected = false;
    },
    // hovered cell functional
    [SET_HOVERED_CELL](state, cell) {
      state.hoveredCell = cell;
    },
    // toolbox functionality
    [SET_CURRENT_TOOLS](state, cells) {
      state.level.toolbox = new Toolbox(cells);
    },
    [RESET_CURRENT_TOOLS](state) {
      state.level.toolbox.reset();
    },
    [ADD_TO_CURRENT_TOOLS](state, cell) {
      state.level.toolbox.addTool(cell);
    },
    [REMOVE_FROM_CURRENT_TOOLS](state, cell) {
      state.level.toolbox.removeTool(cell);
    }
  },
  getters: {
    toolbox: (state) => state.level.toolbox,
    gridI: (state) => state.level.grid.exportGrid(),
    cellPositionsArray: (state) => {
      const array: number[] = [];
      state.level.grid.cells
        .filter((cell) => {
          return cell.element.name !== 'Void';
        })
        .map((cell) => {
          array.push(cell.coord.x);
          array.push(cell.coord.y);
          return cell;
        });
      return array;
    }
  },
  modules: {
    optionsModule
  }
};

export default new Vuex.Store<RootState>(store);
