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
        <div class="eboard">
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
import { IGrid } from '@/engine/interfaces'
import { MatrixViewer } from 'bra-ket-vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import EncyclopediaSection from '@/components/EncyclopediaPage/EncyclopediaSection.vue'
import { Operator, Vector, Elements, Dimension } from 'quantum-tensors'
import { elementsData } from '@/engine/elements'
import { importElem, rotationFromDegrees, rotationToDegrees } from '@/engine/model'
import { computed, defineComponent, ref, toRaw } from 'vue'

export default defineComponent({
  components: {
    EncyclopediaBoard,
    MatrixViewer,
    EncyclopediaSection,
  },
  props: {
    elementName: { type: String, default: 'Mirror' },
    defaultRotation: { type: Number, default: 0 },
  },
  setup(props) {
    const rotation = ref(rotationFromDegrees(props.defaultRotation))

    const grid = computed(
      (): IGrid => {
        return {
          rows: 3,
          cols: 3,
          cells: [
            {
              coord: { x: 1, y: 1 },
              element: props.elementName,
              rotation: rotationToDegrees(rotation.value),
              frozen: false,
            },
          ],
        }
      }
    )

    const xyDimensions = computed(() => {
      return [Dimension.position(grid.value.cols, 'x'), Dimension.position(grid.value.rows, 'y')]
    })

    const vector = ref(
      Vector.indicator(
        [...toRaw(xyDimensions.value), Dimension.direction(), Dimension.polarization()],
        ['0', '1', '>', 'H']
      )
    )

    const rotationText = computed((): string => {
      const elem = importElem(props.elementName)
      if (elem == null) return ''
      return elementsData[elem].ascii.length > 1 ? ` at ${rotationToDegrees(rotation.value)}°` : ''
    })

    function updateIndicators(newVector: Vector): void {
      const coord = newVector.entries[0]?.coord
      const dirIdx = newVector.dimensions.findIndex((d) => d.name === 'direction')
      const dirDim = newVector.dimensions[dirIdx]

      if (coord == null || dirDim == null) return
      const maxX = grid.value.cols - 1
      const maxY = grid.value.rows - 1
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

      vector.value = Vector.indicator(toRaw(xyDimensions.value), [
        x.toString(),
        y.toString(),
      ]).outer(newVector)
    }

    const operator = computed(
      (): Operator => {
        const cell = grid.value.cells[0]
        return Elements.generateOperator({
          x: cell.coord.x,
          y: cell.coord.y,
          element: cell.element,
          rotation: cell.rotation ?? 0,
          polarization: cell.polarization ?? 0,
        }).op
      }
    )

    const operatorProperties = computed((): { name: string; is: boolean }[] => {
      const op = operator.value
      return [
        { name: 'zero', is: op.isCloseToZero() },
        { name: 'an identity', is: op.isCloseToIdentity() },
        { name: 'unitary', is: op.isCloseToUnitary() },
        {
          name: 'unitary on a non-trivial subspace',
          is: op.isCloseToUnitaryOnSubspace() && !op.isCloseToUnitary() && !op.isCloseToZero(),
        },
        { name: 'a projection', is: op.isCloseToProjection() },
        { name: 'Hermitian', is: op.isCloseToHermitian() },
        { name: 'normal', is: op.isCloseToNormal() },
      ]
    })

    const operatorPropertiesText = computed((): string => {
      return operatorProperties.value
        .filter((property) => property.is)
        .map((property) => property.name)
        .join(', ')
    })

    return {
      grid,
      vector,
      operator,
      rotationText,
      operatorPropertiesText,
      updateIndicators,
    }
  },
})
</script>

<style lang="scss" scoped>
.grids {
  padding-bottom: 100px;
}

.matrix-viewer::v-deep(svg) {
  overflow: visible;
}
</style>
