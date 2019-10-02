

const moduleProgress = {
  state: {
    currentLevel: {
      number: 1,
    },
  },
  mutations: {
    GO_TO_LEVEL(state, payload) {
      state.currentLevel.number = payload;
      // rootState.levels.dispatch('loadALevel', payload )
    },
    PROGRESS_A_LEVEL(state) {
      state.currentLevel.number += 1;
    },
    GO_BACK_A_LEVEL(state) {
      state.currentLevel.number -= 1;
    },
  },
  actions: {
    goToLevel({state, commit, rootState}, payload) {
      if (payload) {
        if (typeof payload === 'number') {
          commit('GO_TO_LEVEL', payload);
        }
        if (typeof payload === 'string') {
          let direction;
          if (payload === 'next') {
            direction = state.currentLevel.number + 1;
          } else if (payload === 'back') {
            direction = state.currentLevel.number - 1;
          }
          commit('GO_TO_LEVEL', direction);
        }
      } else {
        console.log('no payload specified!');
      }
    },
  },
  getters: {

  },
};

export default moduleProgress;
