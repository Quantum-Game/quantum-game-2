<template>
  <div class="toolbox" @click="handleToolboxClick">
    <svg v-for="(toolName, index) in toolboxKeys" :key="index" class="tool">
      <app-cell :cell="getFakeCell(toolName)" :tool="true" />
      <text class="counter" x="25" y="80">x {{ toolbox[toolName] }}</text>
    </svg>
    <slot> isMoving: {{ isMoving }} activeCell: {{ activeCell.toString() }} </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import countBy from 'lodash.countby';
import { State, Mutation } from 'vuex-class';
import { Cell, Element, Coord } from '@/engine/classes';
import { REMOVE_FROM_CURRENT_TOOLS } from '@/store/mutation-types';
import AppCell from '@/components/Board/AppCell.vue';

interface Tool {
  [symbol: string]: number;
}

@Component({
  components: {
    AppCell
  }
})
export default class GameToolbox extends Vue {
  @Prop() readonly tools!: Cell[];
  toolbox: Tool = {};
  @State isMoving!: boolean;
  @State activeCell!: Cell;
  @Mutation('ADD_TO_CURRENT_TOOLS') mutationAddToCurrentTools!: (cell: Cell) => void;

  created() {
    this.processTools();
  }

  addTool(cell: Cell) {
    const { name } = cell.element;
    this.toolbox[name] += 1;
  }

  getFakeCell(name: string): Cell {
    const coord = new Coord(-1, -1);
    const element = Element.fromName(name);
    return new Cell(coord, element);
  }

  handleToolboxClick() {
    if (this.isMoving && !this.activeCell.frozen && this.activeCell.coord.x > -1) {
      this.mutationAddToCurrentTools(this.activeCell);
    }
  }

  get toolboxKeys(): string[] {
    return Object.keys(this.toolbox);
  }

  /*  watcher here is a provisional way of the internal
      toolbox property reevaluated on props change
  */
  @Watch('tools')
  processTools() {
    const elements = this.tools.map((cell) => cell.element.name);
    this.toolbox = countBy(elements);
  }

  removeTool(cell: Cell) {
    const { name } = cell.element;
    this.toolbox[name] -= 1;
  }
}
</script>

<style lang="scss" scoped>
.toolbox {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  border-top: 1px solid white;
  padding-top: 10px;
  padding-bottom: 10px;
  min-height: 300px;
  & h3 {
    margin: 0;
  }
  .tool {
    width: 30%;
    min-width: 64px;
    padding: 0.5rem 0rem;
    height: 90px;
  }
  .counter {
    fill: white;
    stroke: white;
  }
}
</style>
