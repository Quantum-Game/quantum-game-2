<template>
  <div>
    <h1>WHAT UP, You're in level number {{stateLevelNumber}}</h1>
    <h2>{{currentLevelData.name}}</h2>
    <button @click="goBack"> no </button>
    <button @click="goOn"> yes </button>
    <div class="play-containter">
      <div
        @click="devClick"
        class="placeholder">
        <h1>placeholder</h1>
      </div>
      <board :level="level" />
      <toolbox :toolsets="groupedTrayCells" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import Board from '@/components/Board.vue';
import Toolbox from '@/components/Toolbox.vue';

@Component({
  components: { Board, Toolbox },
})
export default class Level extends Vue {
  level = {
    rows: this.currentLevelData.rows,
    cols: this.currentLevelData.cols,
  }

  devClick() {
    console.log(this.trayCells)
  }

  mounted() {
    if (this.queryAndStoreLevelNumbersAreNotTheSame) {
      console.log('They do not match!');
      this.$store.dispatch('goToLevel', this.queryLevelNumber);
    }
  }

  goOn() {
    this.$store.dispatch('goToLevel', 'next');
  }

  goBack() {
    this.$store.dispatch('goToLevel', 'back');
  }

  // level store data:
  get currentLevelData() {
    return this.$store.state.currentLevel;
  }

  frozenCells() {
    return this.$store.state.currentLevel.cells.filter(x => x.frozen);
  }

  get trayCells() {
    return this.$store.state.currentLevel.cells.filter(cell => cell.x === -1 && cell.y === -1);
  }

  get groupedTrayCells() {
    const refinedTools: [string, number][] = [];
    const toolNameList: string[] = [];

    // Take every raw cell object and see whether it is included in the toolNameList:
    this.trayCells.forEach((toolObj: {element: string}) => {
      const isAlreadyTooolboxed = toolNameList.includes(toolObj.element);

      // if it is not on the list, add it to it, additionally
      // add it to refinedTools with quantity of 1.
      if (!isAlreadyTooolboxed) {this.$store.state.currentLevel.cells.filter(x => !x.frozen)
        toolNameList.push(toolObj.element);
        refinedTools.push([toolObj.element, 1]);

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
    return this.$store.state.progress.levelNumber;
  }

  get queryLevelNumber() {
    return parseInt(this.$route.params.id, 10);
  }

  get queryAndStoreLevelNumbersAreNotTheSame() {
    return this.stateLevelNumber !== this.queryLevelNumber;
  }

  @Watch('stateLevelNumber')
  syncPathAndLevel(val, oldVal) {
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
  height: 860px;
  width: 20%;
  background-color: rgba(162, 0, 255, 0.301)
}
</style>