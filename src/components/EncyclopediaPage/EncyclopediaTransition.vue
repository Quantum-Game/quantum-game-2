<template>
  <div class="container">
    <div>
      <h2>{{ elementName }} at {{ rotation }}°</h2>
      <encyclopedia-matrix
        :labels-in="basis"
        :labels-out="basis"
        :matrix-elements="matrixElements"
        :height="300"
        :width="300"
        :size="30"
        :margin="20"
        @columnMouseover="updateIndicators($event)"
      />
      <div class="eboard">
        <!-- FUGLY -->
        <encyclopedia-board
          :key="`${JSON.stringify(indicators)}`"
          :grid-obj="grid.exportGrid()"
          :indicators="indicators"
          class="board"
          :max-steps="2"
          :default-step="2"
          :exact-steps="true"
          @updateRotation="updateRotation"
        />
      </div>
      <div>
        <span>Select dimension order:</span>
        <select v-model="dimOrder">
          <option value="dir pol">dir pol</option>
          <option value="pol dir">pol dir</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import * as qt from 'quantum-tensors';
import {
  ParticleInterface,
  CellInterface,
  LevelInterface,
  GridInterface,
  IndicatorInterface,
  DirEnum,
  PolEnum
} from '@/engine/interfaces';
import { Coord, Level, Element, Particle, Grid, Cell } from '@/engine/classes';
import EncyclopediaMatrix from '@/components/EncyclopediaPage/EncyclopediaMatrix.vue';
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue';

@Component({
  components: {
    EncyclopediaBoard,
    EncyclopediaMatrix
  }
})
export default class EncyclopediaMatrixBoard extends Vue {
  @Prop({ default: 'Mirror' }) readonly elementName!: string;
  @Prop({ default: () => 10 }) readonly maxSteps!: number;
  @Prop({ default: () => 2 }) readonly defaultStep!: number;
  @Prop({ default: '0' }) defaultRotation!: number;
  rotation = this.defaultRotation;

  grid = Grid.emptyGrid(3, 3);
  dimOrder = 'dir pol';
  indicators: IndicatorInterface[] = [
    {
      x: 0,
      y: 1,
      direction: DirEnum['>'],
      polarization: PolEnum.H
    }
  ];

  $refs!: {
    grid: HTMLElement;
  };

  created() {
    this.grid.set(this.cell);
    console.debug(this.grid.ascii);
  }

  /**
   * Create a default cell with correct element in the center of the grid
   */
  get cell(): Cell {
    return new Cell(new Coord(1, 1), Cell.fromName(this.elementName), this.rotation);
  }

  /**
   * Update indicators with colId
   * FIXME: Needs a serious refactor
   * suuuper dirty
   */
  updateIndicators(colId: number): void {
    this.grid.set(this.cell);
    if (this.dimOrder === 'dir pol') {
      const direction = [
        DirEnum['>'],
        DirEnum['>'],
        DirEnum['^'],
        DirEnum['^'],
        DirEnum['<'],
        DirEnum['<'],
        DirEnum.v,
        DirEnum.v
      ][colId];
      const polarization = [
        PolEnum.H,
        PolEnum.V,
        PolEnum.H,
        PolEnum.V,
        PolEnum.H,
        PolEnum.V,
        PolEnum.H,
        PolEnum.V
      ][colId];
      const x = [0, 0, 1, 1, 2, 2, 1, 1][colId];
      const y = [1, 1, 2, 2, 1, 1, 0, 0][colId];
      this.indicators = [{ x, y, direction, polarization }];
    } else {
      const direction = [
        DirEnum['>'],
        DirEnum['^'],
        DirEnum['<'],
        DirEnum.v,
        DirEnum['>'],
        DirEnum['^'],
        DirEnum['<'],
        DirEnum.v
      ][colId];
      const polarization = [
        PolEnum.H,
        PolEnum.H,
        PolEnum.H,
        PolEnum.H,
        PolEnum.V,
        PolEnum.V,
        PolEnum.V,
        PolEnum.V
      ][colId];
      const x = [0, 1, 2, 1, 0, 1, 2, 1][colId];
      const y = [1, 2, 1, 0, 1, 2, 1, 0][colId];
      this.indicators = [{ x, y, direction, polarization }];
    }
    console.log(this.indicators);
  }

  /**
   * Update the rotation of the mini board element
   */
  updateRotation(cell: Cell): void {
    this.rotation = cell.rotation;
  }

  /**
   * Return the generated cell operator and select the entries
   */
  get operator() {
    return this.cell.operator[2];
  }

  /**
   * Get the basis direction and polarization strings
   */
  get basis(): string[] {
    if (this.dimOrder === 'dir pol') {
      return ['⇢↔', '⇢↕', '⇡↔', '⇡↕', '⇠↔', '⇠↕', '⇣↔', '⇣↕'];
    }
    return ['↔⇢', '↔⇡', '↔⇠', '↔⇣', '↕⇢', '↕⇡', '↕⇠', '↕⇣'];
  }

  get matrixElements() {
    if (this.dimOrder === 'dir pol') {
      return this.operator.entries.map((entry: any) => {
        return {
          i: 2 * entry.coordIn[0] + entry.coordIn[1],
          j: 2 * entry.coordOut[0] + entry.coordOut[1],
          re: entry.value.re,
          im: entry.value.im
        };
      });
    }
    return this.operator.entries.map((entry: any) => {
      return {
        i: entry.coordIn[0] + 4 * entry.coordIn[1],
        j: entry.coordOut[0] + 4 * entry.coordOut[1],
        re: entry.value.re,
        im: entry.value.im
      };
    });
  }
}
</script>

<style lang="scss" scoped>
.eboard {
  display: inline-block;
}
.operatorText {
  padding: 10px;
  font-size: 10px;
}
</style>
