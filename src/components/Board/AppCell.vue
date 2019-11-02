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
import { Cell } from '@/engine/classes';
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
  @Prop({ default: false }) readonly tool!: boolean;
  @Prop() readonly tileSize!: number;
  @Mutation('SET_ACTIVE_CELL') mutationSetActiveCell!: (cell: Cell) => void;
  @Mutation('RESET_ACTIVE_CELL') mutationResetActiveCell!: () => void;
  @Mutation('CELL_SELECTED') mutationCellSelected!: () => void;
  @Mutation('CELL_UNSELECTED') mutationCellUnselected!: () => void;
  @State cellSelected!: boolean;
  @State activeCell!: Cell;

  border = '';

  handleCellClick(): void {
    // First click unselected tool
    if (!this.cellSelected) {
      if (this.cell.tool) {
        this.indicateMovable();
        this.mutationSetActiveCell(this.cell);
        this.mutationCellSelected();
      } else {
        this.indicateUnmovable();
        this.mutationResetActiveCell();
        this.mutationCellUnselected();
      }
    } else {
      // SOURCE: TOOLBOX - TARGET: GRID
      // eslint-disable-next-line
      if (this.cell.isValidTarget()) {
        if (this.activeCell.isFromToolbox && this.cell.isFromGrid) {
          console.log(`FROM: ${this.activeCell.toString()} ---> TO: ${this.cell.toString()}`);
          this.$emit('add-cell-here', this.cell.coord);
          this.mutationResetActiveCell();
        }
        // SOURCE: GRID - TARGET: GRID
        else if (this.activeCell.isFromGrid && this.cell.isFromGrid) {
          console.log(`FROM: ${this.activeCell.toString()} ---> TO: ${this.cell.toString()}`);
          this.$emit('add-cell-here', this.cell.coord);
          this.mutationResetActiveCell();
        }
        // SOURCE: GRID - TARGET: TOOLBOX
        else if (this.activeCell.isFromGrid && this.cell.isFromToolbox) {
          console.log(`FROM: ${this.activeCell.toString()} ---> TO: ${this.cell.toString()}`);
          this.$emit('add-cell-here', this.cell.coord);
          this.mutationResetActiveCell();
          // FALLBACK
        } else {
          console.log(`FROM: ${this.activeCell.toString()} ---> TO: ${this.cell.toString()}`);
          this.mutationResetActiveCell();
          this.mutationCellUnselected();
        }
      } else {
        // INVALID TARGET
        console.log(`Invalid target: ${this.cell.toString()}`);
      }
    }
  }

  /**
   * Moving logic
   */
  // handleCellClick(): void {
  //   this.indicateMovable();
  //   this.$emit('rotate', this.cell);
  // }
  //   // Only void and tool are valid cells
  //   if (this.cell.isValidTarget()) {
  //       // activecell is another tool
  //     } else if (!this.isMoving) {
  //       this.handleFirstClick();
  //     } else {
  //       this.handleSecondClick();
  //     }
  //   }
  // }

  // /**
  //  * Handle first click
  //  */
  // handleFirstClick(): void {
  //   console.log('First click!');
  //   if (this.cell.tool) {
  //     console.log(`Valid source cell: ${this.cell.toString()}`);
  //     this.mutationSetActiveCell(this.cell);
  //     this.mutationStartMoving();
  //   } else {
  //     console.log(`Invalid source cell: ${this.cell.toString()}`);
  //     this.indicateUnmovable();
  //     this.mutationResetActiveCell();
  //     this.mutationStopMoving();
  //   }
  // }

  // handleSecondClick(): void {
  //   console.log('Second click!');
  //   if (!this.cell.isValidTarget()) {
  //     console.log(`Invalid target cell: ${this.cell.toString()}`);
  //   } else {
  //     if (this.cell.isFromToolbox()) {
  //       this.mutationSetMoveSource('toolbox');
  //     } else {
  //       this.mutationSetMoveSource('grid');
  //     }
  //     console.log(`Valid target cell: ${this.cell.toString()}`);
  //     this.$emit('add-cell-here', this.cell.coord);
  //     this.mutationResetActiveCell();
  //     this.mutationStopMoving();
  //   }
  // }

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
    if (!this.tool) {
      styleObj = {
        'transform-origin': `${this.transformOriginX}px ${this.transformOriginY}px`,
        transform: `
        rotate(-${this.cell.rotation}deg)
        translate(${this.positionX}px, ${this.positionY}px)`
      };
    }
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
// /**
//  * used to handle clicking,
//  * including setting an active cell,
//  * rotation, border color changes
//  * @returns void
//  */
// handleCellClick(): void {
//   // first click: see if valid drag target;
//   if (!this.isMoving) {
//     this.mutationSetActiveCell(this.cell);
//     if (this.cell.validSource) {
//       // can drag
//       this.mutationStartMoving();
//       this.indicateMovable();
//       // set the vuex property indicating the
//       // movement source
//       if (this.tool) {
//         this.mutationSetMoveSource('toolbox');
//       } else {
//         this.mutationSetMoveSource('grid');
//       }
//     } else {
//       this.indicateUnmovable();
//     }

//     // second click:
//   } else {
//     if (this.cell === this.activeCell) {
//       // same cell click - rotate
//       this.$emit('rotate', this.cell);
//       return;
//     }
//     // emit event for moving
//     if (this.cell.validTarget) {
//       this.$emit('add-cell-here', this.cell.coord);
//       this.mutationStopMoving();
//     } else {
//       /*  the tile is taken;
//           indicate kind - frozen or not
//       */
//       if (this.cell.validSource) {
//         this.indicateMovable();
//       } else {
//         this.indicateUnmovable();
//       }
//       this.mutationSetActiveCell(this.cell);
//     }
//   }
// }
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
