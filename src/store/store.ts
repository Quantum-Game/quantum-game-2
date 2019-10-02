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
      number: 0,
      boardDimensions: {
        x: 13,
        y: 13,
      },
      availableTools: [
        [
          'mirror',
          3,
        ],
        [
          'beamsplitter',
          2,
        ],

      ],
      cells: [
        {
          x: 6,
          y: 11,
          element: 'laser',
          rotation: 270,
          frozen: true,
        },
        {
          x: 6,
          y: 7,
          element: 'beamsplitter',
          rotation: 135,
          frozen: false,
        },
        {
          x: 6,
          y: 5,
          element: 'beamsplitter',
          rotation: 45,
          frozen: false,
        },
        {
          x: 4,
          y: 7,
          element: 'beamsplitter',
          rotation: 45,
          frozen: false,
        },
        {
          x: 4,
          y: 9,
          element: 'beamsplitter',
          rotation: 45,
          frozen: false,
        },
        {
          x: 6,
          y: 3,
          element: 'detector',
          rotation: 0,
          frozen: false,
        },
        {
          x: 8,
          y: 5,
          element: 'detector',
          rotation: 270,
          frozen: true,
        },
        {
          x: 2,
          y: 7,
          element: 'detector',
          rotation: 90,
          frozen: true,
        },
        {
          x: 2,
          y: 9,
          element: 'detector',
          rotation: 90,
          frozen: true,
        },
        {
          x: 4,
          y: 11,
          element: 'detector',
          rotation: 0,
          frozen: true,
        },
        {
          x: 5,
          y: 9,
          element: 'rock',
          rotation: 0,
          frozen: true,
        },
      ],
    },
  },
  mutations: {
    // TODO: Turn into an action
    goToLevel(state, payload) {
      if (payload) {
        if (typeof payload === 'number') {
          state.currentLevel.number = payload;
          return;
        }
        if (typeof payload === 'string') {
          if (state.currentLevel.number === 0) {
            state.currentLevel.number = 1;
            return;
          }
          if (state.currentLevel.number !== undefined && state.currentLevel.number !== null) {
            state.currentLevel.number += payload === 'next' ? 1 : -1;
            console.log('moved to yet another level');
          }
        }
      } else {
        console.log('no payload specified!');
      }
    },
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

    ADD_TOOL(state, toolIndex) {
      const tool = state.currentLevel.availableTools[toolIndex];
      const newQuantity = tool[1] + 1;

      state.currentLevel.availableTools.splice(toolIndex, 1, [tool[0], newQuantity]);
    },

    REMOVE_TOOL(state, toolIndex) {
      const tool = state.currentLevel.availableTools[toolIndex];
      const newQuantity = tool[1] - 1;

      state.currentLevel.availableTools.splice(toolIndex, 1, [tool[0], newQuantity]);
    },
  },
  actions: {
    // USER INTERACTIONS:
    startDraggingElement({ commit }, arg) {
      console.log('startDraggingElement');
    },


    // TODO: move the conditionality to tile/toolslot componenets
    drop({ commit, dispatch, getters }, payload) {
      const {
        x,
        y,
        originX,
        originY,
        element,
        fromToolslot,
      } = payload;
      const targetTile = getters.cell(y, x);
      const originCell = getters.cell(originY, originX);
      const comingFromTray = originY < 0 || originX < 0;
      const goingToTray = x < 0 || y < 0;

      // 0. does the tile we drop on exist in the "cells" array?
      if (targetTile && !goingToTray) {
        console.log('OCCUPIED!');
        return false;
      }

      if (!goingToTray) {
        dispatch('createCell', payload);
      }

      if (!comingFromTray) {
        dispatch('deleteCell', payload);
      }


      // If it's a tray thing:
      if (comingFromTray || goingToTray) {
        const possibleTool = getters.tools.find((tool: Array<[string, number]>) => tool[0] === element);
        const trayItemIndex = getters.tools.indexOf(possibleTool);

        if (goingToTray && comingFromTray) {
          return false;
        }
        if (goingToTray) {
          return commit('ADD_TOOL', trayItemIndex);
        }
        if (comingFromTray && (possibleTool[1] >= 0)) {
          return commit('REMOVE_TOOL', trayItemIndex);
        }
      }
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
        x,
        y,
        originX,
        originY,
        element,
      } = payload;
      const originalCell = getters.cell(originY, originX);
      const index = state.currentLevel.cells.indexOf(originalCell);

      // TO DO: Tray DELETION

      commit('DELETE_CELL', index);
    },
  },
  getters: {
    cell: state => (y: number, x: number) => state.currentLevel.cells.find((o: {x: number, y: number}) => o.x === x && o.y === y),
    tools: state => state.currentLevel.availableTools,
  },
  modules: {
    progress: moduleProgress,
    board: moduleBoard,
  },
};

export default new Vuex.Store<RootState>(store);
