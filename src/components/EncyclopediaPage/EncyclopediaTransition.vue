<template>
  <div class="container">
    <h2 :class="{ 'entry-title': true, active: isOpen }" @click="handleTitleClick">
      Transition matrix
    </h2>
    <p v-show="isOpen">
      This matrix ({{ elementName }}{{ rotationText }}) is {{ operatorPropertiesText }}.
    </p>
    <div v-show="isOpen" class="grids">
      <div class="matrix">
        <matrix-viewer
          :key="`matrix-${matrixIter}`"
          class="matrix-viewer"
          :operator-raw="operator"
          :size="30"
          @columnMouseover="updateIndicators($event)"
        />
      </div>
      <div class="eboard">
        <encyclopedia-board
          :key="`board-${boardIter}`"
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
import { Coord, Grid, Cell } from '@/engine/classes'
import { MatrixViewer } from 'bra-ket-vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import { Operator, Vector, Dimension, Elements } from 'quantum-tensors'

interface IXYVec {
  posX: number
  posY: number
  vecDirPol: Vector
}

@Component({
  components: {
    EncyclopediaBoard,
    MatrixViewer,
  },
})
export default class EncyclopediaMatrixBoard extends Vue {
  @Prop({ default: 'Mirror' }) readonly elementName!: string
  @Prop({ default: () => 10 }) readonly maxSteps!: number
  @Prop({ default: () => 2 }) readonly defaultStep!: number
  @Prop({ default: '0' }) defaultRotation!: number

  rotation: number = this.defaultRotation
  grid: Grid = Grid.emptyGrid(3, 3)
  matrixIter = 0
  boardIter = 0
  isOpen = true
  initialState: IXYVec = {
    posX: 0,
    posY: 1,
    vecDirPol: Vector.indicator([Dimension.direction(), Dimension.polarization()], ['>', 'H']),
  }

  $refs!: {
    grid: HTMLElement
  }

  created(): void {
    this.grid.set(this.cell)
  }

  handleTitleClick(): void {
    this.isOpen = !this.isOpen
  }

  get rotationText(): string {
    return this.cell.element.angles.length > 1 ? ` at ${this.rotation}°` : ''
  }

  get operatorProperties(): { name: string; is: boolean }[] {
    return [
      { name: 'zero', is: this.operator.isCloseToZero() },
      { name: 'an identity', is: this.operator.isCloseToIdentity() },
      { name: 'unitary', is: this.operator.isCloseToUnitary() },
      {
        name: 'unitary on a non-trivial subspace',
        is:
          this.operator.isCloseToUnitaryOnSubspace() &&
          !this.operator.isCloseToUnitary() &&
          !this.operator.isCloseToZero(),
      },
      { name: 'a projection', is: this.operator.isCloseToProjection() },
      { name: 'Hermitian', is: this.operator.isCloseToHermitian() },
      { name: 'normal', is: this.operator.isCloseToNormal() },
    ]
  }

  get operatorPropertiesText(): string {
    return this.operatorProperties
      .filter((property) => property.is)
      .map((property) => property.name)
      .join(', ')
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
    this.matrixIter += 1
  }

  /**
   */
  updateIndicators(vector: Vector): void {
    this.grid.set(this.cell)

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
      vecDirPol: vector,
    }
    this.boardIter += 1
  }

  /**
   * Return the generated cell operator and select the entries
   * @todo: figure a way to recover the operator
   */
  get operator(): Operator {
    return Elements.generateOperator(this.cell.exportSimCell()).op
  }
}
</script>

<style lang="scss" scoped>
.grids {
  display: flex;
  justify-content: space-around;
  width: 100%;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
}

.container {
  & .entry-title {
    padding: 1em 0;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: 0.4s;
    margin: 0;
    font-weight: bold;
    text-align: justify;
    text-transform: uppercase;
    @media screen and (max-width: 1000px) {
      text-align: center;
      width: 90%;
    }
    &:after {
      display: inline-block;
      position: relative;
      content: '';
      left: 12px;
      // height: 0;
      border-left: 6px solid #e8e8e8;
      border-bottom: 6px solid transparent;
      border-top: 6px solid transparent;
      clear: both;
      transition: 0.2s;
    }
    &.active:after {
      transform: rotate(90deg);
      transition: 0.2s;
    }
  }
  @media screen and (max-width: 1000px) {
    padding-left: 20px;
  }
}
</style>
