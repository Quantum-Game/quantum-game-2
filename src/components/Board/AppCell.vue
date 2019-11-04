<template>
  <g
    :style="positionStyle"
    :class="computedClass"
    @click="handleCellClick"
    @mouseover="handleCellHover"
  >
    <rect :width="tileSize" :height="tileSize" :class="rectBackgroundClass" />
    <component
      :is="computedCellName"
      :cell="cell"
      :class="computedCellName"
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
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void;
  @Mutation('RESET_ACTIVE_CELL') mutationResetActiveCell!: () => void;
  @Mutation('ADD_TO_CURRENT_TOOLS') mutationAddToCurrentTools!: (cell: Cell) => void;
  @Mutation('REMOVE_FROM_CURRENT_TOOLS') mutationRemoveFromCurrentTools!: (cell: Cell) => void;
  @Mutation('UPDATE_GRID_CELL') mutationUpdateGridCell!: (cell: Cell) => void;
  @State cellSelected!: boolean;
  @State activeCell!: Cell;
  @State hoveredCell!: Cell;
  @State level!: Level;

  border = '';

  /**
   * Handle mouseover for active cell display
   */
  handleCellHover(): void {
    if (!this.cell.isVoid && this.cell !== this.hoveredCell) {
      this.mutationSetHoveredCell(this.cell);
    }
  }

  handleCellClick(): void {
    // First click unselected tool
    // TODO: if tool from toolbox check availability before selection
    // TODO: swap from grid tool to different toolbox tool
    if (!this.cellSelected) {
      if (this.cell.tool) {
        this.indicateTool();
        this.mutationSetActiveCell(this.cell);
      } else {
        console.log(`INVALID SELECTION : ${this.cell.toString()}`);
        this.indicateFrozen();
        this.mutationResetActiveCell();
      }
    } else {
      // ROTATE CELL
      if (this.isActiveCell) {
        this.cell.rotate();
        this.mutationUpdateGridCell(this.cell);
        this.mutationResetActiveCell();
        return;
      }
      // SOURCE: TOOLBOX - TARGET: GRID
      // console.debug(`TOOLBOX: ${this.activeCell.toString()} ---> GRID: ${this.cell.toString()}`);
      // eslint-disable-next-line
      if (this.cell.isValidTarget()) {
        if (this.activeCell.isFromToolbox && this.cell.isFromGrid) {
          const available = this.level.toolbox.available(this.activeCell.element.name);
          if (available > 0) {
            this.$emit('updateCell', this.cell.coord);
            this.mutationRemoveFromCurrentTools(this.activeCell);
            this.mutationResetActiveCell();
          }
        }
        // SOURCE: GRID - TARGET: GRID
        // console.debug(`GRID: ${this.activeCell.toString()} ---> GRID: ${this.cell.toString()}`);
        else if (this.activeCell.isFromGrid && this.cell.isFromGrid) {
          this.$emit('updateCell', this.cell.coord);
          this.mutationResetActiveCell();
        }
        // SOURCE: GRID - TARGET: TOOLBOX
        // console.debug(`GRID: ${this.activeCell.toString()} ---> TOOLBOX: ${this.cell.toString()}`);
        else if (this.activeCell.isFromGrid && this.cell.isFromToolbox && this.cell.tool) {
          this.$emit('updateCell', this.cell.coord);
          this.mutationAddToCurrentTools(this.activeCell);
          this.mutationUpdateGridCell(this.activeCell.reset());
          this.mutationResetActiveCell();
          // FALLBACK
          // console.log(`ERROR FROM: ${this.activeCell.toString()} ---> TO: ${this.cell.toString()}`);
        } else {
          this.mutationResetActiveCell();
        }
        // INVALID TARGET
        // console.debug(`Invalid target: ${this.cell.toString()}`);
      } else {
        this.mutationResetActiveCell();
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
   * Computed class
   */
  get computedClass(): string[] {
    return [this.computedCellName, this.cell.frozen && !this.cell.isVoid ? 'frozen' : ''];
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
  indicateTool(): void {
    this.border = borderColors.rotable;
  }

  /**
   * changes border color for w given time
   * @returns void
   */
  indicateFrozen(): void {
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
    return [this.shouldTileChangeColor ? 'movable-space' : ''];
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
.frozen rect {
  fill: grey;
  opacity: 0.2;
  transition: 0.3s;
}
</style>
