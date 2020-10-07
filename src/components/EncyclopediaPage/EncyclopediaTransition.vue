<template>
  <encyclopedia-section>
    <template #title>
      Transition matrix
    </template>
    <template #content>
      <p>This matrix ({{ elementName }}{{ rotationText }}) is {{ operatorPropertiesText }}.</p>
      <div layout="row wrap around u10" class="grids">
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
    </template>
  </encyclopedia-section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { IGrid } from '@/engine/interfaces'
import { MatrixViewer } from 'bra-ket-vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import EncyclopediaSection from '@/components/EncyclopediaPage/EncyclopediaSection.vue'
import { Operator, Vector, Elements, Dimension } from 'quantum-tensors'
import { elementsData } from '@/engine/elements'
import { importElem, Rotation, rotationFromDegrees, rotationToDegrees } from '@/engine/model'

@Options({
  components: {
    EncyclopediaBoard,
    MatrixViewer,
    EncyclopediaSection,
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
    return elementsData[elem].ascii.length > 1 ? ` at ${rotationToDegrees(this.rotation)}°` : ''
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
  padding-bottom: 100px;
}

.matrix-viewer::v-deep svg {
  overflow: visible;
}
</style>
