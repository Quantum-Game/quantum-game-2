import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';

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
      elementPositions: [
        [
          { element: 'A' },
          { element: 'B' },
          { element: 'C' },
        ],
        Array(13),
        Array(13),
        Array(13),
        Array(13),
        Array(13),
        Array(13),
        Array(13),
        Array(13),
        Array(13),
        Array(13),
      ],
      availableTools: [
        [
          'Mirror',
          3,
        ],
        [
          'Beam Splitter',
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
  },
  actions: {
    // USER INTERACTIONS:
    startDraggingElement({ commit }, arg) {
      console.log('hello from startDraggingElement action');
    },

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

      // 0. does the tile we drop on exist in the "cells" array?
      if (targetTile) {
        console.log('OCCUPIED!');
        return false;
      }
      // commit('CREATE_CELL', payload);
      dispatch('createCell', payload);
      if (!fromToolslot) {
        dispatch('deleteCell', payload);
      }
    },

    rotate({getters, state, commit }, payload: {y: number, x: number, angle: number}) {
      const { y, x, angle } = payload;
      const cell = getters.cell(y, x);

      // TODO: refine calculation
      let newRotation = cell.rotation + angle;
      if (newRotation >= 360) {
        newRotation %= 360;
      }

      const rotatedCell = { ...cell, rotation: newRotation };
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
    cell: state => (y: number, x: number) => {
      return state.currentLevel.cells.find((o: {x: number, y: number}) => o.x === x && o.y === y);
    },
  },
};

export default new Vuex.Store<RootState>(store);
