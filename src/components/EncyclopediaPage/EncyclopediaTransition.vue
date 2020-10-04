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
          class="matrix-viewer"
          :operator="operator"
          :size="30"
          @column-mouseover="updateIndicators($event)"
        />
      </div>
      <div v-if="vector" class="eboard">
        <encyclopedia-board
          class="board"
          :grid="grid"
          :vector="vector"
          :max-steps="2"
          :default-step="2"
          @rotated="rotation = $event"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { IGrid } from '@/engine/interfaces'
import { MatrixViewer } from 'bra-ket-vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import { Operator, Vector, Elements, Dimension } from 'quantum-tensors'
import { elementsData } from '@/engine/elements'
import { importElem, Rotation, rotationFromDegrees, rotationToDegrees } from '@/engine/model'

@Options({
  components: {
    EncyclopediaBoard,
    MatrixViewer,
  },
})
export default class EncyclopediaMatrixBoard extends Vue {
  @Prop({ default: 'Mirror' }) readonly elementName!: string
  @Prop({ default: 0 }) defaultRotation!: number

  rotation: Rotation = rotationFromDegrees(this.defaultRotation) ?? Rotation.Right
  isOpen = true
  vector = Vector.indicator(
    [...this.xyDimensions, Dimension.direction(), Dimension.polarization()],
    ['0', '1', '>', 'H']
  )

  handleTitleClick(): void {
    this.isOpen = !this.isOpen
  }

  get grid(): IGrid {
    return {
      rows: 3,
      cols: 3,
      cells: [
        {
          coord: { x: 1, y: 1 },
          element: this.elementName,
          rotation: rotationToDegrees(this.rotation),
          frozen: false,
        },
      ],
    }
  }

  get rotationText(): string {
    const elem = importElem(this.elementName)
    if (elem == null) return ''
    return elementsData[elem].ascii.length > 1 ? ` at ${this.rotation}°` : ''
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

  get xyDimensions(): [Dimension, Dimension] {
    return [Dimension.position(this.grid.cols, 'x'), Dimension.position(this.grid.rows, 'y')]
  }

  /**
   */
  updateIndicators(vector: Vector): void {
    const coord = vector.entries[0]?.coord
    const dirIdx = vector.dimensions.findIndex((d) => d.name === 'direction')
    const dirDim = vector.dimensions[dirIdx]

    if (coord == null || dirDim == null) {
      return
    }

    const maxX = this.grid.cols - 1
    const maxY = this.grid.rows - 1
    let x = Math.floor(maxX / 2)
    let y = Math.floor(maxY / 2)

    switch (dirDim.coordNames[coord[dirIdx]]) {
      case '>':
        x = 0
        break
      case '<':
        x = maxX
        break
      case '^':
        y = maxY
        break
      case 'v':
        y = 0
        break
    }

    this.vector = Vector.indicator(this.xyDimensions, [x.toString(), y.toString()]).outer(vector)
  }

  /**
   * Return the generated cell operator and select the entries
   * @todo: figure a way to recover the operator
   */
  get operator(): Operator {
    const cell = this.grid.cells[0]
    return Elements.generateOperator({
      x: cell.coord.x,
      y: cell.coord.y,
      element: cell.element,
      rotation: cell.rotation ?? 0,
      polarization: cell.polarization ?? 0,
    }).op
  }
}
</script>

<style lang="scss" scoped>
.grids {
  display: flex;
  justify-content: space-around;
  width: 100%;
  @include media('<large') {
    flex-direction: column;
  }
}

.matrix-viewer {
  padding-bottom: 100px;
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
    @include media('<large') {
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
  @include media('<large') {
    padding-left: 20px;
  }
}
</style>
