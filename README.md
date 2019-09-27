# quantum-game-2
Quantum Game 2 from CQT

## develop
`yarn` followed by `yarn serve`

## TODO:
board of tiles:
  [x] Tile;
  [x] customizable dimentions;
  [x] position tracking system (vuex);
  [x] fix the `Argument of type 'number' is not assignable to parameter of type 'never'` error in src/views/Levels.vue;

Drag & Drop
  [x] enable dragging and dropping;
  [x] ensure the correct data is being passed;
  [x] define conditions for an allowed drop;
  [x] verify successful drop before cleaning the Tile;
  [x] custom DragEvent MIME type?
  [x] Refactor: give up on emmitting up to Board, let Tiles have full store access;
  [~] track quantities (still got to track the toolbox);
  [ ] Create elements -> import graphics, extract functionality;
  [ ] create type interfaces for dtObject and newTileStatus;
  [ ] RWD