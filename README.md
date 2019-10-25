# quantum-game-2
Quantum Game 2 from CQT

## develop
`yarn` followed by `yarn serve`

14.10:
- [x] Scaffold menu
- [x] Include Menu button into the layout
- [x] serve images in entries
- [x] make the isOpen in entry section be prop-derived

15.10
- [x] review push
- [x] get the menu icon into the foreground
- [x] make the q-menu listen to enc key press
- [x] menu enter/leave animation
- [x] make the entry sections titles uppercase
- [x] create turning arrows indicating folded panes
- [x] qMenu items are offsetted right with width of the icon
- [x] adjustments by from Klem I

16.10
- [x] Host in on Firebase
- [x] Have as dependency https://github.com/sneakyweasel/quantumweasel;
- [x] type levelData

17.10
- [x] displaying frames
- [x] propertly order frames without overwriting the last one (thanks lodash deep clone! :*);
- [x] Create a working GameContainer - meanning initializing the Game object
- [x] Simplify Cells as per https://github.com/sneakyweasel/QuantumDisplay
- [x] Adjust the board
- [x] display elements graphix;
- [x] have the simulation going

18.10
- [x] enhance q-button with inline,
- [x] enhance simulator viewer with internal viewing control
- [x] create layout for Game
- [x] Turn simulation into Your Photon section;
- [x] move components into game directory
- [x] create a component placeholder for goals;
- [x] create a component placeholder for controls
- [x] create a component placeholder for tools
- [x] get rid of conflicting prettier configs, editorconfig
- [x] scope styles across the app


21.10
- [x] Level Changing Buttons on top (for devving)
- [x] clean up
- [x] RESETTING FUNCTION
- [x] implement the donut
- [x] set up Goals props
- [x] General CntrlBtn Component
- [x] set up variants
- [x] start adding handlers
- [x] prepare tray

22.10
- [x] board as background
- [x] enhance entries structure
- [x] Victory overlay
- [x] donut chart

23.10
- [x] refine elements
- [x] set up Controls props
- [x] elements' border / roatation
- [x] laser path
- [x] ERROR in /home/kuba/Desktop/190913QUANTUM/quantum-game-2/src/views/GameContainer.vue 32:23 Could not find a declaration file for module '../game/levels'. '/home/kuba/Desktop/190913QUANTUM/quantum-game-2/src/game/levels/index.js' implicitly has an 'any' type.

24.10
- [x] fix cell in tray so it displays elements
- [x] move cells on top of lasers
- [x] Defeat Overlay
- [x] Style it so it fits in


25.10


## TODO:

### GAME:
### GRID
- [ ] Add common ancestor for all the elements
- [ ] have the elements not leak the attributes
- [ ] make the grid responsive by passing the cell-size prop on resize
- [ ] Polarizer functiobality
- [ ] Speech Bubble

after talk:
- [ ] photon dispersing animation
- [ ] key concepts
- [ ] make levels same size?

### GOALS METER
- [ ] our own implementation

### EXPLANATION
- reimplement activeElement logic


### YOUR PHOTON(S)

### ENCYCLOPEDIAs
- [ ] add inline styling for images
- [ ] add aria attributes for folded panes

### MAINTENANCE

### BUGS
- [ ] entry seciton scrollHeight bug, where the open entry section max height is ill-calculated, resulting in the text not fitting in. Might be correlated to flex / screen width;