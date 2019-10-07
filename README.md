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
[x] track quantities (still got to track the toolbox);
[x] Create elements -> import graphics, extract functionality;
[x] Rotation


[x] limit the ability to take from tray - change architecture so that deagging is a tile / toolslot property, not that of a cell
[x] level changing guards
[x] level loading logic (router/store)
[x] make it load the level on load
[x] deal with substracting tools bug
      turns out it is a matter of from where I derive the cells - dragging from tray means adding a non-frozen cell, wich means it appears in the toolbox etc. In the end, Tile does need to know where cell directly from state, but through props ["plant bug"]
[x] fix routing



07.10
[x] make the Piece a general component only importing graphix from other places
[ ] divide the view
[ ] Figure out Play button / Frame

[ ] Bachground


[ ] add drop event listeners on dots
[ ] move opacity transition up, as board feature
[ ] cleanup :sweaty-smile:
[ ] move board actions && mutations to board module
[ ] move drop logic to components from store
[ ] Real interfaces
[ ] RWD