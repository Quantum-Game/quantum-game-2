<template>
  <div class="toolbox" @click="handleToolboxClick">
    <svg v-for="(cell, index) in toolbox.uniqueCellList" :key="index" class="tool">
      <app-cell :cell="cell" :tool="true" />
      <text class="counter" x="50%" y="80">
        {{ toolbox.getCount(cell.element.name) }}
        ({{ toolbox.getCountOriginal(cell.element.name) }})
      </text>
    </svg>
    <slot>isMoving: {{ isMoving }} activeCell: {{ activeCell.toString() }}</slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import countBy from 'lodash.countby';
import { State, Mutation } from 'vuex-class';
import Cell from '@/engine/Cell';
import Toolbox from '@/engine/Toolbox';
import { REMOVE_FROM_CURRENT_TOOLS } from '@/store/mutation-types';
import AppCell from '@/components/Board/AppCell.vue';

@Component({
  components: {
    AppCell
  }
})
export default class GameToolbox extends Vue {
  @Prop() readonly toolbox!: Toolbox;
  @State isMoving!: boolean;
  @State activeCell!: Cell;
  @Mutation('ADD_TO_CURRENT_TOOLS') mutationAddToCurrentTools!: (cell: Cell) => void;

  handleToolboxClick() {
    if (this.isMoving && !this.activeCell.frozen && this.activeCell.coord.x > -1) {
      this.mutationAddToCurrentTools(this.activeCell);
    }
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
  .tool {
    width: 30%;
    min-width: 64px;
    padding: 0.5rem 0rem;
    height: 90px;
  }
  .counter {
    fill: white;
    stroke: white;
    text-anchor: middle;
    margin: 0;
  }
}
</style>
