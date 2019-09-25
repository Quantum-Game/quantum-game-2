# quantum-game-2
Quantum Game 2 from CQT

## develop
`yarn` followed by `yarn serve`

## TODO:
- board of tiles:
  [x] Tile;
  [x] customizable dimentions;
  [x] position tracking system (vuex);
  [x] fix the `Argument of type 'number' is not assignable to parameter of type 'never'` error in src/views/Levels.vue;

- Drag & Drop
  [x] enable dragging and dropping;
  [x] ensure the correct data is being passed;
  [~] track quantities (still got to track the toolbox);
  [ ] define conditions for an allowed drop;
  [ ] verify successful drop before cleaning the Tile;
  [~] Refactor: give up on emmitting up to Board, let Tiles have full store access;
  [ ] make it so you move the actual elements, not the tiles;
  [ ] turn drag and drop functionality within the SFCs into a mixin;
  [ ] create type interfaces for dtObject and newTileStatus;
  [ ] custom DragEvent MIME type?