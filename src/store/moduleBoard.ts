import levels from '../levels';


const moduleBoard = {
  state: {
    currentLevel: {
      tiles: 'x',
    },
  },
  actions: {
    loadALevel(state, payload) {
      console.log(`this is a Level loading experience: ${payload.level}`);
    },
  },
  mutations: {},
  getters: {},
};

export default moduleBoard;
