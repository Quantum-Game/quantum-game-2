<template>
  <div>
    <button @click="goBack">
      Next Level
    </button>
    <h1 v-if="!error">
      WHAT UP, You're in level number {{ levelNumber }}
    </h1>
    <h1
      v-else
      class="error"
    >
      NO SUCH LEVEL!
    </h1>
    <button @click="goOn">
      Next Level
    </button>
    <h2>{{ currentLevelData.name }}</h2>
    <div class="play-containter">
      <div
        class="placeholder"
      >
        <h1>placeholder</h1>
      </div>
      <board
        :board-data="boardData"
        :draggedElement="elementBeingDragged"
      />
      <toolbox
        :toolsets="groupedTrayCells"
        @elementDragging="setDraggedElement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import Board from '@/components/Board.vue';
import Toolbox from '@/components/Toolbox.vue';
import levels from '../levels';

@Component({
  components: { Board, Toolbox },
})
export default class Level extends Vue {
  // initial states:

  currentLevelData = {
    rows: 0,
    cols: 0,
    cells: [],
  }

  error = ''

  elementBeingDragged = {}

  // 1. handle level loading based on the url:
  get levelNumber() {
    return parseInt(this.$route.params.id, 10);
  }

  loadALevel(number: number): void {
    this.error = '';

    // See if there's such level:
    const rawLevel = levels[number];
    if (!rawLevel) {
      this.error = 'no such level!';
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

    this.currentLevelData = refinedLevel;
  }

  @Watch('levelNumber')
  updateLevelData(val: number) {
    this.loadALevel(val);
  }

  created() {
    this.loadALevel(this.levelNumber);
    // this.setup();
  }

  // 2. Preparing data for both the board and the toolbox:

  setup() {
    const { cells } = this.currentLevelData;
    const cellsMovedToTheirPlace = cells.map((cell, index) => {
      if (cell.x > this.currentLevelData.cols || cell.y > this.currentLevelData.rows) {
        console.warn(`Cell number ${index + 1} (${cell.element}) is out of bounds`);
      }
      if (!cell.frozen && cell.x > -1 && cell.y > -1) {
        return { ...cell, x: -1, y: -1 };
      }
      return cell;
    });
    this.currentLevelData.cells = cellsMovedToTheirPlace;
  }

  get boardCells() {
    return this.currentLevelData.cells.filter((cell: {x: number, y: number}) => {
      return cell.x > -1 && cell.y > -1;
    });
  }

  get toolCells() {
    return this.currentLevelData.cells.filter((cell: {x: number, y: number}) => {
      return cell.x === -1 && cell.y === -1;
    });
  }

  get boardData() {
    const data = {
      cols: this.currentLevelData.cols,
      rows: this.currentLevelData.rows,
      cells: this.boardCells,
    };
    return data;
  }

  get groupedTrayCells() {
    if (!this.toolCells.length) {
      return false;
    }
    const refinedTools: [object, number][] = [];
    const toolNameList: string[] = [];

    // Take every raw cell object and see whether it is included in the toolNameList:
    this.toolCells.forEach((toolObj: {element: string}) => {
      const isAlreadyTooolboxed = toolNameList.includes(toolObj.element);

      // if it is not on the list, add it to it, additionally
      // add it to refinedTools with quantity of 1.
      if (!isAlreadyTooolboxed) {
        toolNameList.push(toolObj.element);
        refinedTools.push([toolObj, 1]);

      // If the toolNameList consists element's name,
      // find its index and assess its quantity
      } else {
        const index = toolNameList.indexOf(toolObj.element);
        const quantity = refinedTools[index][1];

        // Update the refinedTools array entry:
        const updatedRefinedTool = [refinedTools[index][0], quantity + 1];
        refinedTools[index] = updatedRefinedTool;
      }
    });
    return refinedTools;
  }

  // 3. Level navigation:
  goOn() {
    const nextLevelNumber = this.levelNumber + 1;
    if (!levels[nextLevelNumber]) {
      this.error = 'No such level!';
      return;
    }
    this.$router.push(`${nextLevelNumber}`);
  }

  goBack() {
    const previousLevelNumber = this.levelNumber - 1;

    if (!levels[previousLevelNumber]) {
      this.error = 'where are you going?';
      return;
    }
    // this.$store.dispatch('goToLevel', 'back');
    this.$router.push(`${previousLevelNumber}`);
  }
  setDraggedElement(payload) {
    this.elementBeingDragged = payload;
  }
}
</script>

<style>

.play-containter {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.placeholder {
  height: 500px;
  width: 20%;
  background-color: rgba(162, 0, 255, 0.301)
}

.error {
  color: red;
}

/* dev */
h1,
button {
  display: inline;
}
</style>
