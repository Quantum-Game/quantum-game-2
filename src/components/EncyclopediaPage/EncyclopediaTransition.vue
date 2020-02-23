<template>
  <div class="container">
    <h2>{{ elementName }} at {{ rotation }}°</h2>
    <div class="grids">
      <div class="matrix">
        <matrix-viewer
          ref="matrixViewer"
          class="matrix-viewer"
          :operator-raw="operator"
          :size="30"
          @columnMouseover="updateIndicators($event)"
        />
      </div>
      <div class="eboard">
        <encyclopedia-board
          :key="JSON.stringify(indicators)"
          class="board"
          :i-grid="grid.exportGrid()"
          :indicators="indicators"
          :max-steps="2"
          :default-step="2"
          :exact-steps="true"
          @updateRotation="updateRotation"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { Elem, IIndicator, DirEnum, PolEnum } from '@/engine/interfaces'
import { Coord, Grid, Cell } from '@/engine/classes'
import { MatrixViewer } from 'bra-ket-vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import { Operator } from 'quantum-tensors'

@Component({
  components: {
    EncyclopediaBoard,
    MatrixViewer
  }
})
export default class EncyclopediaMatrixBoard extends Vue {
  @Prop({ default: 'Mirror' }) readonly elementName!: string
  @Prop({ default: () => 10 }) readonly maxSteps!: number
  @Prop({ default: () => 2 }) readonly defaultStep!: number
  @Prop({ default: '0' }) defaultRotation!: number

  rotation: number = this.defaultRotation
  grid: Grid = Grid.emptyGrid(3, 3)
  indicators: IIndicator[] = [
    {
      x: 0,
      y: 1,
      direction: DirEnum['>'],
      polarization: PolEnum.H
    }
  ]

  $refs!: {
    grid: HTMLElement
    matrixViewer: Vue
  }

  created(): void {
    this.grid.set(this.cell)
  }

  get cell(): Cell {
    const coord = new Coord(1, 1)
    if (this.elementName in Elem) {
      return new Cell(coord, Cell.fromName(this.elementName), this.rotation)
    }
    return new Cell(coord, Cell.fromName(Elem.Rock))
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
   * Directly generate a vector from Matrix-Viewer rather than
   * use any DirEnum / PolEnum
   */
  updateIndicators(colId: number): void {
    this.grid.set(this.cell)
    const dims = this.$refs.matrixViewer.$data.operator.dimensionsOut
    if (dims[0].name === 'direction') {
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
   * Return the generated cell operator and select the entries
   */
  get operator(): Operator {
    return this.cell.operator[2]
  }
}
</script>

<style lang="scss" scoped>
.grids {
  display: flex;
  justify-content: space-around;
  width: 100%;
  border-bottom: 1px solid #8e819d;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
}
</style>
