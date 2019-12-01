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
        <encyclopedia-board
          :key="JSON.stringify(indicators)"
          class="board"
          :grid-obj="grid.exportGrid()"
          :indicators="indicators"
          :max-steps="2"
          :default-step="2"
          :exact-steps="true"
          @updateRotation="updateRotation"
        />
      </div>
      <div>
        <span>Select dimension order:</span>
        <select v-model="dirPolOrder">
          <option :value="true">dir pol</option>
          <option :value="false">pol dir</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { IndicatorInterface, DirEnum, PolEnum } from '@/engine/interfaces'
import { Coord, Grid, Cell } from '@/engine/classes'
import EncyclopediaMatrix from '@/components/EncyclopediaPage/EncyclopediaMatrix.vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import { OperatorEntry } from 'quantum-tensors'

@Component({
  components: {
    EncyclopediaBoard,
    EncyclopediaMatrix
  }
})
export default class EncyclopediaMatrixBoard extends Vue {
  @Prop({ default: 'Mirror' }) readonly elementName!: string
  @Prop({ default: () => 10 }) readonly maxSteps!: number
  @Prop({ default: () => 2 }) readonly defaultStep!: number
  @Prop({ default: '0' }) defaultRotation!: number

  rotation: number = this.defaultRotation
  dirPolOrder: boolean = true
  grid: Grid = Grid.emptyGrid(3, 3)
  indicators: IndicatorInterface[] = [
    {
      x: 0,
      y: 1,
      direction: DirEnum['>'],
      polarization: PolEnum.H
    }
  ]

  $refs!: {
    grid: HTMLElement
  }

  created(): void {
    this.grid.set(this.cell)
  }

  get cell(): Cell {
    return new Cell(new Coord(1, 1), Cell.fromName(this.elementName), this.rotation)
  }

  /**
   * Updates rotation from the cell event
   */
  updateRotation(cell: Cell): void {
    this.rotation = cell.rotation
  }

  /**
   * Update indicators with colId
   * FIXME: Needs a serious refactor
   * suuuper dirty
   */
  updateIndicators(colId: number): void {
    this.grid.set(this.cell)
    if (this.dirPolOrder) {
      const direction = [
        DirEnum['>'],
        DirEnum['>'],
        DirEnum['^'],
        DirEnum['^'],
        DirEnum['<'],
        DirEnum['<'],
        DirEnum.v,
        DirEnum.v
      ][colId]
      const polarization = [
        PolEnum.H,
        PolEnum.V,
        PolEnum.H,
        PolEnum.V,
        PolEnum.H,
        PolEnum.V,
        PolEnum.H,
        PolEnum.V
      ][colId]
      const x = [0, 0, 1, 1, 2, 2, 1, 1][colId]
      const y = [1, 1, 2, 2, 1, 1, 0, 0][colId]
      this.indicators = [{ x, y, direction, polarization }]
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
      ][colId]
      const polarization = [
        PolEnum.H,
        PolEnum.H,
        PolEnum.H,
        PolEnum.H,
        PolEnum.V,
        PolEnum.V,
        PolEnum.V,
        PolEnum.V
      ][colId]
      const x = [0, 1, 2, 1, 0, 1, 2, 1][colId]
      const y = [1, 2, 1, 0, 1, 2, 1, 0][colId]
      this.indicators = [{ x, y, direction, polarization }]
    }
  }

  /**
   * Get the basis direction and polarization strings
   */
  get basis(): string[] {
    if (this.dirPolOrder) {
      return ['⇢↔', '⇢↕', '⇡↔', '⇡↕', '⇠↔', '⇠↕', '⇣↔', '⇣↕']
    }
    return ['↔⇢', '↔⇡', '↔⇠', '↔⇣', '↕⇢', '↕⇡', '↕⇠', '↕⇣']
  }

  /**
   * Return the generated cell operator and select the entries
   */
  get operator() {
    return this.cell.operator[2]
  }

  get matrixElements() {
    if (this.dirPolOrder) {
      return this.operator.entries.map((entry: OperatorEntry) => {
        return {
          i: 2 * entry.coordIn[0] + entry.coordIn[1],
          j: 2 * entry.coordOut[0] + entry.coordOut[1],
          re: entry.value.re,
          im: entry.value.im
        }
      })
    }
    return this.operator.entries.map((entry: OperatorEntry) => {
      return {
        i: entry.coordIn[0] + 4 * entry.coordIn[1],
        j: entry.coordOut[0] + 4 * entry.coordOut[1],
        re: entry.value.re,
        im: entry.value.im
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 500px;
  .eboard {
    display: inline-block;
  }
  .operatorText {
    padding: 10px;
    font-size: 10px;
  }
}
</style>
