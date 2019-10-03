import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '../types';
import moduleProgress from './moduleProgress';
import moduleBoard from './moduleBoard';

Vue.use(Vuex);

// TODO: Clean-up, figure out initial state structure.
const store: StoreOptions<RootState> = {
  state: {
    currentLevel: {
      id: 0,
      version: 2,
      name: 'Weasel Beamsplitter Wizardry',
      group: 'Dev',
      description: 'Debugging level',
      completed: false,
      rows: 30,
      cols: 20,
      cells: [],
    },
  },
  mutations: {
    setTile(state, payload) {
      const { x, y, element } = payload;

      // 0. Create the cell object
      const alteredObject = {
        element,
        x,
        y,
        rotation: 0,
        frozen: false,
      };

      // 1. Find the cell
      const { cells } = state.currentLevel;
      const possiblyAlreadyExistingCell = cells.find(o => o.x === x && o.y === y);

      // 1b if its there
      if (possiblyAlreadyExistingCell) {
        // if it's frozen, then no:
        if (possiblyAlreadyExistingCell.frozen) {
          return false;
        }

        const index = cells.indexOf(possiblyAlreadyExistingCell);
        return state.currentLevel.cells.splice(index, 1, alteredObject);
      }

      state.currentLevel.cells.push(alteredObject);

      // 1a if it's not, create a new one

      // splicing magic to deal with Vue's reactivity system caveats
      // const alteredObject = { x, y, element };
      // state.currentLevel.elementPositions[y].splice(x, 1, alteredObject);
    },

    CREATE_CELL(state, payload) {
      state.currentLevel.cells.push(payload);
    },

    DELETE_CELL(state, index) {
      state.currentLevel.cells.splice(index, 1);
    },

    REPLACE_CELL(state, WhatWithWhat) {
      const [index, newCell] = WhatWithWhat;

      state.currentLevel.cells.splice(index, 1, newCell);
    },

    SUBSTITUTE_CURRENT_LEVEL(state, levelToSubstituteWith) {
      state.currentLevel = levelToSubstituteWith;
    },
  },
  actions: {
    // USER INTERACTIONS:
    startDraggingElement({ commit }, arg) {
      console.log('startDraggingElement');
    },

    moveCell({ commit }, { index, cellToBeCreated }) {
      commit('DELETE_CELL', index);
      commit('CREATE_CELL', cellToBeCreated);
    },


    // TODO: move the conditionality to tile/toolslot componenets
    drop({ commit, dispatch, getters, state }, payload) {
      const {
        x,
        y,
        originX,
        originY,
        element,
      } = payload;
      const targetTile = getters.cell(y, x);
      const originCell = getters.cell(originY, originX);
      const comingFromTray = originY < 0 || originX < 0;
      const goingToTray = x < 0 || y < 0;

      if (goingToTray && comingFromTray) {
        return false;
      }

      // regular board move
      if (!goingToTray && !comingFromTray) {
        const index = state.currentLevel.cells.indexOf(getters.cell(y, x));
        console.log()
        // dispatch('moveCell', { index, payload });
      }


      // 0. does the tile we drop on exist in the "cells" array?
      if (targetTile && !goingToTray) {
        console.log('OCCUPIED!');
        return false;
      }

      if (goingToTray) {
        dispatch('deleteCell', { originX, originY });
        dispatch('createCell', { ...payload, x: -1, y: -1 });
        return true;
      }
      if (comingFromTray) {
        dispatch('createCell', payload);
        const cellToDeleteIndex = state.currentLevel.cells.indexOf(getters.cell({ x, y, element }));
        dispatch('deleteCell', { originX, originY });
      }

      // // If it's a tray thing:
      // if (comingFromTray || goingToTray) {
      //   const possibleTool = getters.tools.find((tool) => tool.element === element);
      //   const possibleToolAbsoluteIndex = state.currentLevel.cells.indexOf(possibleTool)

      //   if (possibleTool) {
      //     if (goingToTray) {
      //       return commit('ADD_TOOL', possibleToolAbsoluteIndex);
      //     }
      //     if (comingFromTray && (possibleTool[1] > 0)) {
      //       return commit('REMOVE_TOOL', trayItemIndex);
      //     }
      //   }
      // }
    },

    toolboxDrop({ state, getters, commit }, payload) {
      const {
        element,
        originX,
        originY,
      } = payload;
      const itemToDelete = getters.cell(payload);
      const index = state.currentLevel.cells.indexOf(itemToDelete);
      console.log(index)
      commit('DELETE_CELL', index);
      commit('CREATE_CELL', payload);
    },

    rotate({ getters, state, commit }, payload: {y: number, x: number, angle: number}) {
      const { y, x, angle } = payload;
      const cell = getters.cell(y, x);
      const rotationAngle: number = 360 / 8;
      let { rotation } = cell;

      if ((360 + angle) % rotationAngle !== 0) {
        throw new Error('Error in the supplied angle compared to the element rotation angle.');
      } else {
        rotation = ((cell.rotation + angle) % 360 + 360) % 360;
      }

      const rotatedCell = { ...cell, rotation };
      const index = state.currentLevel.cells.indexOf(cell);

      commit('REPLACE_CELL', [index, rotatedCell]);
    },

    // IMPLEMENTATION:
    createCell({ commit }, payload) {
      const {x, y, rotation, element } = payload;

      const alteredObject = {
        element: payload.element,
        y: payload.y,
        x: payload.x,
        rotation: 0,
        frozen: false,
      };
      commit('CREATE_CELL', alteredObject);
    },

    deleteCell({ commit, getters, state }, payload) {
      const {
        originX,
        originY,
        element,
      } = payload;
      const cellToDelete = getters.cell(originY, originX, element);
      const index = state.currentLevel.cells.indexOf(cellToDelete);

      // TO DO: Tray DELETION

      commit('DELETE_CELL', index);
    },
  },
  getters: {
    cell: state => (y: number, x: number) => state.currentLevel.cells.find((o: {x: number, y: number}) => o.x === x && o.y === y),
    tools: state => state.currentLevel.cells.filter(cell => cell.x === -1 && cell.y === -1),
    cellFromTray: state => (element: string) => state.currentLevel.cells.find(o => o.element === element)
  },
  modules: {
    progress: moduleProgress,
    board: moduleBoard,
  },
};

export default new Vuex.Store<RootState>(store);
