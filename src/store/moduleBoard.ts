import levels from '../levels';


const moduleBoard = {
  actions: {
    loadALevel({ commit }, number): void {
      // See if there's such level:
      const rawLevel = levels[number];
      if (!rawLevel) {
        console.log('no such level!');
        return;
      }

      const levelBase = rawLevel.default;

      // Move elements to tray
      // First: extract them
      const rawTrayElements = levelBase.cells.filter(x => !x.frozen);

      // Alter them
      const refinedTrayElements = rawTrayElements.map(cell => ({
        ...cell, x: -1, y: -1, originX: -1, originY: -1,
      }));

      // Get the elements that were not moved and combine them with
      // the altered set for a new cellset:
      const fixedElements = levelBase.cells.filter(x => x.frozen);
      const refinedCellSet = [...fixedElements, ...refinedTrayElements];

      const refinedLevel = { ...levelBase, cells: refinedCellSet };

      commit('SUBSTITUTE_CURRENT_LEVEL', refinedLevel);
    },
  },
  getters: {},
};

export default moduleBoard;
