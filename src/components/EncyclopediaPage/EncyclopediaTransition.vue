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
          class="board"
          max-steps="10"
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
        <!-- <div class="operatorText">{{ operator }}</div> -->
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
  element = Element.fromName(this.elementName);
  coord = new Coord(1, 2);
  cell = new Cell(this.coord, this.element, this.rotation);
  grid = Grid.dummyGrid(3, 4);
  dimOrder = 'dir pol';

  $refs!: {
    grid: HTMLElement;
  };

  created() {
    this.grid.set(this.cell);
    console.log(this.grid.ascii);
  }

  /**
   * Update the rotation of the mini board element
   */
  updateRotation(cell: Cell) {
    console.log(cell.toString());

    this.rotation = cell.rotation;
  }

  get operator() {
    return this.cell.element.transition(this.cell.rotation);
  }

  get basis() {
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
