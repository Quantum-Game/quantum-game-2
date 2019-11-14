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
      />
      <div class="eboard">
        <encyclopedia-board
          :grid-obj="grid.exportGrid()"
          :initialize-from="intializeFrom"
          class="board"
          max-steps="2"
          default-step="1"
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
import cloneDeep from 'lodash.clonedeep';
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

  // this code begs a rewrite
  cell = new Cell(new Coord(1, 1), Element.fromName(this.elementName), this.rotation);
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

  created() {
    this.grid.set(this.cell);
    console.debug(this.grid.ascii);
  }

  /**
   * Update the rotation of the mini board element
   */
  updateRotation(cell: Cell): void {
    this.rotation = cell.rotation;
  }

  get operator() {
    return this.cell.element.transition(this.rotation);
  }

  get basis(): string[] {
    if (this.dimOrder === 'dir pol') {
      return ['⇢↔', '⇢↕', '⇡↔', '⇡↕', '⇠↔', '⇠↕', '⇣↔', '⇣↕'];
    }
    return ['↔⇢', '↔⇡', '↔⇠', '↔⇣', '↕⇢', '↕⇡', '↕⇠', '↕⇣'];
  }

  get matrixElements() {
    if (this.dimOrder === 'dir pol') {
      return this.operator.entries.map((entry) => {
        return {
          i: 2 * entry.coordIn[0] + entry.coordIn[1],
          j: 2 * entry.coordOut[0] + entry.coordOut[1],
          re: entry.value.re,
          im: entry.value.im
        };
      });
    }
    return this.operator.entries.map((entry) => {
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
