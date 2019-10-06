<template>
  <div>
    <h1 v-if="!error">WHAT UP, You're in level number {{stateLevelNumber}}</h1>
    <h1 v-else class="error">NO SUCH LEVEL!</h1>
    <h2>{{currentLevelData.name}}</h2>
    <button @click="goBack"> no </button>
    <button @click="goOn"> yes </button>
    <div class="play-containter">
      <div
        class="placeholder">
        <h1>placeholder</h1>
      </div>
      <board
        :level="boardData"
        @dropFromToolbox="handleDropFromToolbox"
        :dragged-element-status="draggedElementStatus"
        @draggedElementStatusChange="draggedElementStatusChange"
      />
      <toolbox
        :toolsets="groupedTrayCells"
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
  components: { Board, Toolbox }
})
export default class Level extends Vue {
  get levelNumber() {
    return parseInt(this.$route.params.id, 10);
  }

  @Watch('levelNumber')
  updateLevelData(val: number) {
    this.loadALevel(val);
  }

  draggedElementStatus = ''

  error = ''

  currentLevelData = {
    rows: 0,
    cols: 0,
    cells: [],
  }

  handleDropFromToolbox(elementName) {
    console.log(`handledDropFromToolbox! ${elementName}`)
  }

  created() {
    this.loadALevel(this.levelNumber);
    // console.log(this.boardData)
  }

  draggedElementStatusChange(payload) {
    this.draggedElementStatus = payload;
  }

  get boardData() {
    const data = {
      cols: this.currentLevelData.cols,
      rows: this.currentLevelData.rows,
      cells: this.boardCells,
    }
    return data;
  }

  get boardCells() {
    return this.currentLevelData.cells.filter((cell: {x: number, y: number}) => cell.x > -1 && cell.y > -1);
  }

  get toolCells() {
    return this.currentLevelData.cells.filter((cell: {x: number, y: number}) => cell.x === -1 && cell.y === -1)
  }

  loadALevel(number): void {

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
    const refinedTrayElements = rawTrayElements.map((cell) => {
      return { ...cell, x: -1, y: -1, originX: -1, originY: -1 };
    });

    // Get the elements that were not moved and combine them with
    // the altered set for a new cellset:
    const fixedElements = levelBase.cells.filter(x => x.frozen);
    const refinedCellSet = [...fixedElements, ...refinedTrayElements];

    const refinedLevel = { ...levelBase, cells: refinedCellSet };


    this.currentLevelData = refinedLevel;
  }

  mounted() {
    if (this.queryAndStoreLevelNumbersAreNotTheSame) {
      console.log('They do not match!');
      this.$store.dispatch('goToLevel', this.queryLevelNumber);
    }
  }

  goOn() {
    const nextLevelNumber = this.levelNumber + 1;
    if (!levels[nextLevelNumber]) {
      this.error = 'No such level!';
      return;
    }
    if (this.error) {
    }
    this.$router.push(`${this.levelNumber + 1}`)
  }

  goBack() {
    const previousLevelNumber = this.levelNumber - 1;

    if (!levels[previousLevelNumber]) {
      this.error = 'where are you going?';
      return;
    }
    // this.$store.dispatch('goToLevel', 'back');
    this.$router.push(`${this.levelNumber - 1}`)

  }

  // level store data:
  // get currentLevelData() {
  //   return this.$store.state.currentLevel;
  // }

  frozenCells() {
    return this.$store.state.currentLevel.cells.filter(x => x.frozen);
  }

  get groupedTrayCells() {
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

  // computed properties for proper url/state level number matching
  get stateLevelNumber() {
    return this.levelNumber;
  }

  get queryLevelNumber() {
    return parseInt(this.$route.params.id, 10);
  }

  get queryAndStoreLevelNumbersAreNotTheSame() {
    return this.stateLevelNumber !== this.queryLevelNumber;
  }

  @Watch('levelNumber')
  syncPathAndLevel(val) {
    if (this.queryAndStoreLevelNumbersAreNotTheSame) {
      this.$router.push(`${val}`);
    }
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
</style>
