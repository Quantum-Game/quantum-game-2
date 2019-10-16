# quantum-game-2
Quantum Game 2 from CQT

## develop
`yarn` followed by `yarn serve`

## TODO:
### GENERAL
- [ ] Clean up

### GAME
- [ ] Have as dependency https://github.com/sneakyweasel/quantumweasel;
- [ ] Create a working GameContainer
- [ ] Adjust the board
- [ ] Simplify Cells as per https://github.com/sneakyweasel/QuantumDisplay
- [ ] adddrag and drop

### ENCYCLOPEDIAs
- [ ] add inline styling for images
- [ ] add aria attributes for folded panes

### LAYOUT

### USAGE
- [ ] Host in on Firebase

### BUGS
- [ ] entry seciton scrollHeight bug, where the open entry section max height is ill-calculated, resulting in the text not fitting in. Might be correlated to flex / screen width;

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