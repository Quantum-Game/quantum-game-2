<template>
  <div class="toolbox" :cell="cell" @mouseup="handleCellDrop(toolbox.uniqueCellList[0])">
    <svg v-for="(cell, index) in toolbox.uniqueCellList" :key="index" class="tool">
      <g :class="computedClass(cell)">
        <app-cell
          :cell="cell"
          :available="isAvailable(cell)"
          :tool="true"
          @updateCell="updateCell"
          @mouseover.native="handleMouseEnter(cell)"
        />
        <text class="counter" x="50%" y="85">
          {{ toolbox.getCount(cell.element.name) }}
          ({{ toolbox.getCountOriginal(cell.element.name) }})
        </text>
      </g>
    </svg>
    <slot> </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import countBy from 'lodash.countby';
import { State, Mutation } from 'vuex-class';
import Toolbox from '@/engine/Toolbox';
import { REMOVE_FROM_CURRENT_TOOLS } from '@/store/mutation-types';
import AppCell from '@/components/Board/AppCell.vue';
import { Coord, Cell } from '@/engine/classes';
@Component({
  components: {
    AppCell
  }
})
export default class GameToolbox extends Vue {
  @Prop() readonly toolbox!: Toolbox;
  @Mutation('SET_ACTIVE_CELL') mutationSetActiveCell!: (cell: Cell) => void;
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void;
  cell = {};

  handleMouseEnter(cell: Cell) {
    this.mutationSetHoveredCell(cell);
  }

  handleCellDrop(cell: Cell) {
    this.mutationSetHoveredCell(cell);
    this.$emit('updateCell', cell);
  }

  computedClass(cell: Cell): string {
    return this.isAvailable(cell) ? 'active' : 'inactive';
  }

  isAvailable(cell: Cell): boolean {
    return this.toolbox.getCount(cell.element.name) > 0;
  }

  updateCell(cell: Cell) {
    // events drilling up...
    this.$emit('updateCell', cell);
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
  // min-height: 300px;
  @media screen and (max-width: 1000px) {
    justify-content: space-evenly;
  }
  .tool {
    width: 30%;
    min-width: 64px;
    padding: 0.5rem 0rem;
    height: 90px;
    @media screen and (max-width: 1000px) {
      width: 64px;
      margin-right: 5px;
      height: 90px;
      margin: -30px 0;
    }
    .counter {
      transform-origin: 50% 100%;
    }
  }
  .inactive {
    opacity: 0.5;
  }
  .active {
    opacity: 1;
    visibility: visible !important;
  }
  .counter {
    fill: white;
    text-anchor: middle;
    margin: 0;
    font-size: 0.8rem;
  }
}
</style>
