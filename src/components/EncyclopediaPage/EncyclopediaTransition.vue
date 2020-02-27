<template>
  <div class="container">
    <h2>{{ elementName }} at {{ rotation }}°</h2>
    <div class="grids">
      <div class="matrix">
        <matrix-viewer
          :key="`${operator.toString()}`"
          class="matrix-viewer"
          :operator-raw="operator"
          :size="30"
          @columnMouseover="updateIndicators($event)"
        />
      </div>
      <div class="eboard">
        <encyclopedia-board
          :key="`${initialState.vecDirPol.toKetString()}`"
          class="board"
          :i-grid="grid.exportGrid()"
          :initial-state="[initialState]"
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
import { Elem } from '@/engine/interfaces'
import Coord from '@/engine/Coord'
import Cell from '@/engine/Cell'
import Grid from '@/engine/Grid'

import { MatrixViewer } from 'bra-ket-vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import { Basis, Operator, Vector, Dimension } from 'quantum-tensors'

interface IXYVec {
  posX: number
  posY: number
  vecDirPol: Vector
}

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
  initialState: IXYVec = {
    posX: 0,
    posY: 1,
    vecDirPol: Vector.indicator([Dimension.direction(), Dimension.polarization()], ['>', 'H'])
  }

  $refs!: {
    grid: HTMLElement
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
   */
  updateIndicators(vector: Vector): void {
    this.grid.set(this.cell)
    const hv = Basis.polarization('HV')

    // how to get direction?
    const str = vector.toKetString()
    let move: { x: number; y: number }
    if (str.indexOf('>') > -1) {
      move = { x: 1, y: 0 }
    } else if (str.indexOf('^') > -1) {
      move = { x: 0, y: -1 }
    } else if (str.indexOf('<') > -1) {
      move = { x: -1, y: 0 }
    } else if (str.indexOf('v') > -1) {
      move = { x: 0, y: 1 }
    } else {
      throw new Error('No direction detected')
    }

    this.initialState = {
      posX: 1 - move.x,
      posY: 1 - move.y,
      vecDirPol: hv.changeAllDimsOfVector(vector)
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
