<template>
  <g :style="positionStyle" :class="computedCellClass" @click="handleCellClick">
    <rect
      :width="tileSize"
      :height="tileSize"
      :class="rectBackgroundClass"
      :style="rectPositionStyle"
    />
    <component
      :is="computedCellName"
      :cell="cell"
      :class="computedCellName"
      :cell-size="tileSize"
      :border="computeBorder()"
    />
  </g>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import Cell from '@/engine/Cell';
import Level from '@/engine/Level';
import Particle from '@/engine/Particle';
import { getPosition } from '@/mixins';
import {
  LaserCell,
  NonLinearCrystalCell,
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
    NonLinearCrystalCell,
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
  @Prop() readonly tileSize!: number;
  @Prop({ default: true }) readonly available!: boolean;
  @Mutation('SET_ACTIVE_CELL') mutationSetActiveCell!: (cell: Cell) => void;
  @Mutation('RESET_ACTIVE_CELL') mutationResetActiveCell!: () => void;
  @Mutation('SET_HOVERED_CELL') mutationSetHoveredCell!: (cell: Cell) => void;
  @State activeCell!: Cell;
  @State cellSelected!: boolean;
  border = '';

  /**
   *  handles clicking, namely
   *  1. distinguishes a selecting vs a placing click
   *  2. determines if the updateCell event should be emitted
   *  @returns void
   */

  handleCellClick(): void {
    // TODO: if tool from toolbox check availability before selection
    // TODO: swap from grid tool to different toolbox tool

    // do nothing, if:
    if (
      this.cell.frozen ||
      // if it s a click on a tool thats unavailable:
      (!this.cellSelected && this.cell.isFromToolbox && !this.available) ||
      // if there is a cell selected in the toolbox and you click it once more:
      (this.cellSelected && this.isActiveCell && this.cell.isFromToolbox)
    ) {
      this.mutationResetActiveCell();
    } else {
      if (!this.cellSelected) {
        // FIRST CLICK
        // If from toolbox needs to have available elements
        if (this.cell.tool && (this.cell.isFromGrid || this.cell.isFromToolbox)) {
          this.border = 'white';
          this.mutationSetActiveCell(this.cell);
          return;
        }
        this.border = '';
        this.mutationResetActiveCell();
        return;
      }
      // ROTATE CELL
      if (this.isActiveCell && this.cell.isFromGrid) {
        this.cell.rotate();
      }

      this.$emit('updateCell', this.cell);
      this.mutationResetActiveCell();
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
  get computedCellClass(): string[] {
    return [
      this.computedCellName,
      this.cell.tool && !this.cell.isVoid && this.available ? 'active' : '',
      (this.cell.frozen && !this.cell.isVoid) || (this.cell.tool && !this.available)
        ? 'frozen'
        : '',
      this.cell.isFromToolbox && !this.available ? 'transparent' : ''
    ];
  }

  /**
   * Compute the cell class name
   * @returns Computed cell name string
   */
  get computedCellName(): string {
    if (this.cell.element.name === 'PolarizerH' || this.cell.element.name === 'PolarizerV') {
      return 'PolarizerCell';
    }
    if (
      this.cell.element.name === 'QuarterWavePlateH' ||
      this.cell.element.name === 'QuarterWavePlateV'
    ) {
      return 'QuarterWavePlateCell';
    }
    return `${this.cell.element.name}Cell`;
  }

  /**
   * changes border color indicating
   * it can be moved
   * @returns void
   */
  computeBorder() {
    if (this.border !== '') {
      return this.border;
    }
    if (this.cell.energized) {
      return '#ff0055';
    }
    return '';
  }

  indicateTool(): void {
    this.border = borderColors.rotable;
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
   * Undoes the parent element rotation
   */
  get rectPositionStyle(): any {
    let styleObj = {};
    const halfSize = this.tileSize / 2;
    styleObj = {
      'transform-origin': `${halfSize}px ${halfSize}px`,
      transform: `
        rotate(${this.cell.rotation}deg)`
    };
    return styleObj;
  }

  /**
   * highlight tile during a move
   * @returns highlight class
   */
  get rectBackgroundClass() {
    return [this.shouldTileChangeColor ? 'movable-space' : '', 'inner-rect'];
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
.frozen {
  cursor: not-allowed;
  // cursor: pointer;
}
.active {
  cursor: grab;
  .inner-rect {
    fill: white;
    opacity: 0.1;
  }
  .transparent {
    opacity: 0.5;
  }
}
</style>
