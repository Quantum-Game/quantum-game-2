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
        y: 10,
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
      ],
    },
  },
  mutations: {
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

      // splicing magic to deal with Vue's reactivity system caveats
      const alteredObject = { x, y, element };
      state.currentLevel.elementPositions[y].splice(x, 1, alteredObject);
    },
  },
  actions: {},
};

export default new Vuex.Store<RootState>(store);
