<template>
  <g :style="positionStyle" @click="handleCellClick">
    <rect :width="tileSize" :height="tileSize" :class="rectBackgroundClass" />
    <component
      :is="computedCellName"
      :cell="cell"
      :class="cell.element.name"
      :cell-size="tileSize"
      :border="border"
    />
  </g>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import Cell from '@/engine/Cell';
import Level from '@/engine/Level';
import { getPosition } from '@/mixins';
import {
  LaserCell,
  MirrorCell,
  BeamSplitterCell,
  PolarizingBeamSplitterCell,
  CoatedBeamSplitterCell,
  CornerCubeCell,
  DetectorCell,
  RockCell,
  MineCell,
  AbsorberCell,
  DetectorFourCell,
  PolarizerCell,
  QuarterWavePlateCell,
  SugarSolutionCell,
  FaradayRotatorCell,
  GlassCell,
  VacuumJarCell
} from '@/components/Board/Cell/index';
import { CELL_SELECTED } from '../../store/mutation-types';

const borderColors = {
  active: 'transparent',
  frozen: 'turquoise',
  rotable: 'white',
  energized: 'blue'
};

@Component({
  components: {
    LaserCell,
    MirrorCell,
    BeamSplitterCell,
    PolarizingBeamSplitterCell,
    CoatedBeamSplitterCell,
    CornerCubeCell,
    DetectorCell,
    RockCell,
    MineCell,
    AbsorberCell,
    DetectorFourCell,
    PolarizerCell,
    QuarterWavePlateCell,
    SugarSolutionCell,
    FaradayRotatorCell,
    GlassCell,
    VacuumJarCell
  }
})
export default class AppCell extends Mixins(getPosition) {
  @Prop() readonly cell!: Cell;
  @Prop() readonly lasers!: any[];
  @Prop() readonly tileSize!: number;
  @Mutation('SET_ACTIVE_CELL') mutationSetActiveCell!: (cell: Cell) => void;
  @Mutation('RESET_ACTIVE_CELL') mutationResetActiveCell!: () => void;
  @Mutation('CELL_SELECTED') mutationCellSelected!: () => void;
  @Mutation('CELL_UNSELECTED') mutationCellUnselected!: () => void;
  @Mutation('ADD_TO_CURRENT_TOOLS') mutationAddToCurrentTools!: (cell: Cell) => void;
  @Mutation('REMOVE_FROM_CURRENT_TOOLS') mutationRemoveFromCurrentTools!: (cell: Cell) => void;
  @Mutation('UPDATE_GRID_CELL') mutationUpdateGridCell!: (cell: Cell) => void;
  @State cellSelected!: boolean;
  @State activeCell!: Cell;
  @State activeLevel!: Level;

  border = '';

  handleCellClick(): void {
    // First click unselected tool
    if (!this.cellSelected) {
      if (this.cell.tool) {
        this.indicateMovable();
        this.mutationSetActiveCell(this.cell);
        this.mutationCellSelected();
      } else {
        console.log(`INVALID SELECTION : ${this.cell.toString()}`);
        this.indicateUnmovable();
        this.mutationResetActiveCell();
        this.mutationCellUnselected();
      }
    } else {
      // ROTATE CELL
      if (this.isActiveCell) {
        this.cell.rotate();
        this.mutationUpdateGridCell(this.cell);
        // this.$emit('rotate', this.cell);
        return;
      }
      // SOURCE: TOOLBOX - TARGET: GRID
      // eslint-disable-next-line
      if (this.cell.isValidTarget()) {
        if (this.activeCell.isFromToolbox && this.cell.isFromGrid) {
          // console.debug(`TOOLBOX: ${this.activeCell.toString()} ---> GRID: ${this.cell.toString()}`);
          const available = this.activeLevel.toolbox.available(this.activeCell.element.name);
          // console.debug(`There are ${available} ${this.activeCell.element.name}`);
          if (available > 0) {
            this.$emit('add-cell-here', this.cell.coord);
            this.mutationRemoveFromCurrentTools(this.activeCell);
            this.mutationResetActiveCell();
            this.mutationCellUnselected();
          }
        }
        // SOURCE: GRID - TARGET: GRID
        else if (this.activeCell.isFromGrid && this.cell.isFromGrid) {
          // console.debug(`GRID: ${this.activeCell.toString()} ---> GRID: ${this.cell.toString()}`);
          this.$emit('add-cell-here', this.cell.coord);
          this.mutationResetActiveCell();
          this.mutationCellUnselected();
        }
        // SOURCE: GRID - TARGET: TOOLBOX
        else if (this.activeCell.isFromGrid && this.cell.isFromToolbox) {
          // console.debug(`GRID: ${this.activeCell.toString()} ---> TOOLBOX: ${this.cell.toString()}`);
          this.$emit('add-cell-here', this.cell.coord);
          this.mutationAddToCurrentTools(this.activeCell);
          this.mutationUpdateGridCell(this.activeCell.reset());
          this.mutationResetActiveCell();
          this.mutationCellUnselected();
          // FALLBACK
        } else {
          // console.log(`ERROR FROM: ${this.activeCell.toString()} ---> TO: ${this.cell.toString()}`);
          this.mutationResetActiveCell();
          this.mutationCellUnselected();
        }
      } else {
        // INVALID TARGET
        this.mutationResetActiveCell();
        this.mutationCellUnselected();
        // console.debug(`Invalid target: ${this.cell.toString()}`);
      }
    }
  }

  /**
   * Is current cell the active cell
   */
  get isActiveCell(): boolean {
    return this.activeCell === this.cell;
  }

  /**
   * Compute the cell class
   */
  get computedCellName(): string {
    return `${this.cell.element.name}Cell`;
  }

  /**
   * changes border color indicating
   * it can be moved
   * @returns void
   */
  indicateMovable() {
    this.border = borderColors.rotable;
  }

  /**
   * changes border color for w given time
   * @returns void
   */
  indicateUnmovable(): void {
    this.border = borderColors.active;
    const timeout = setTimeout(() => {
      this.border = '';
    }, 200);
  }

  /**
   * styles used for wrapper positioning
   * using the getPosition mixin;
   * @returns a style object
   */
  get positionStyle(): any {
    let styleObj = {};
    styleObj = {
      'transform-origin': `${this.transformOriginX}px ${this.transformOriginY}px`,
      transform: `
        rotate(-${this.cell.rotation}deg)
        translate(${this.positionX}px, ${this.positionY}px)`
    };
    return styleObj;
  }

  /**
   * highlight tile during a move
   * @returns highlight class
   */
  get rectBackgroundClass() {
    return this.shouldTileChangeColor ? 'movable-space' : '';
  }

  /**
   * determines whether the tile should
   * indeed be highlighted
   * @returns boolean
   */
  get shouldTileChangeColor() {
    return this.cellSelected && this.cell.isVoid;
  }

  /**
   * watches active cell changes and resets border
   * in case the cell is not the new active cell
   * @params previous and current active cell
   * @returns void
   */
  @Watch('activeCell')
  stopIndicatingMovability(newActiveCell: Cell, oldActiveCell: Cell): void {
    if (newActiveCell !== oldActiveCell && this.cell !== newActiveCell) {
      this.border = '';
    }
  }
}
</script>

<style lang="scss">
rect {
  fill: transparent;
}
.movable-space:hover {
  fill: white;
  opacity: 0.1;
  transition: 0.3s;
}
</style>
