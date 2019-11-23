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
        @columnMouseover="updateInitialState($event)"
      />
      <div class="eboard">
        <encyclopedia-board
          :key="`${JSON.stringify(intializeFrom)}`"
          :grid-obj="grid.exportGrid()"
          :initialize-from="intializeFrom"
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
  GridInterface
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

  // TODO: this code begs a rewrite
  grid = Grid.emptyGrid(3, 3);
  dimOrder = 'dir pol';
  intializeFrom = [
    {
      x: 0,
      y: 1,
      dirStr: '>',
      polStr: 'H'
    }
  ];

  $refs!: {
    grid: HTMLElement;
  };

  get cell(): Cell {
    return new Cell(new Coord(1, 1), Cell.fromName(this.elementName), this.rotation);
  }

  created() {
    this.grid.set(this.cell);
    console.debug(this.grid.ascii);
  }

  updateInitialState(colId: number): void {
    // suuuper dirty
    this.grid.set(this.cell);
    if (this.dimOrder === 'dir pol') {
      const dirStr = ['>', '>', '^', '^', '<', '<', 'v', 'v'][colId];
      const polStr = ['H', 'V', 'H', 'V', 'H', 'V', 'H', 'V'][colId];
      const x = [0, 0, 1, 1, 2, 2, 1, 1][colId];
      const y = [1, 1, 2, 2, 1, 1, 0, 0][colId];
      this.intializeFrom = [{ x, y, dirStr, polStr }];
    } else {
      const dirStr = ['>', '^', '<', 'v', '>', '^', '<', 'v'][colId];
      const polStr = ['H', 'H', 'H', 'H', 'V', 'V', 'V', 'V'][colId];
      const x = [0, 1, 2, 1, 0, 1, 2, 1][colId];
      const y = [1, 2, 1, 0, 1, 2, 1, 0][colId];
      this.intializeFrom = [{ x, y, dirStr, polStr }];
    }
    console.log(this.intializeFrom);
  }

  /**
   * Update the rotation of the mini board element
   */
  updateRotation(cell: Cell): void {
    this.rotation = cell.rotation;
  }

  /**
   * FIXME: Use the cell operator generator
   */
  get operator() {
    return this.cell.element.transition({
      rotation: this.rotation,
      polarization: 0,
      percentage: 0
    });
  }

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
