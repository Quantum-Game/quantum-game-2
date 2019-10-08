

const moduleProgress = {
  state: {
    levelNumber: 1,
  },
  mutations: {
    SET_LEVEL_NUMBER(state, payload) {
      state.levelNumber = payload;
    },
    PROGRESS_A_LEVEL(state) {
      state.levelNumber += 1;
    },
    GO_BACK_A_LEVEL(state) {
      state.levelNumber -= 1;
    },
  },
  actions: {
    goToLevel({ state, commit, dispatch }, payload) {
      if (payload) {
        if (typeof payload === 'number') {
          commit('SET_LEVEL_NUMBER', payload);
          dispatch('loadALevel', payload);
        }

        // in case we want to use phrases like 'next' instead of a number:
        if (typeof payload === 'string') {
          let direction;
          if (payload === 'next') {
            direction = state.levelNumber + 1;
          } else if (payload === 'back') {
            direction = state.levelNumber - 1;
          }
          commit('SET_LEVEL_NUMBER', direction);
          dispatch('loadALevel', direction);
        }
      } else {
        console.log('no level specified!');
      }
    },
  },
  getters: {

  },
};

export default moduleProgress;
