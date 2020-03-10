<template>
  <g class="fates_wrapper">
    <g
      v-for="(fate, index) in fateCells"
      :key="'fate' + index"
      :v-if="fateCells.length > 0"
      class="fate"
    >
      <circle
        :cx="(fate.coord.x + 0.5) * tileSize"
        :cy="(fate.coord.y + 0.5) * tileSize"
        fill="purple"
        :r="tileSize / 2"
        stroke="purple"
        stroke-width="2"
      >
        <!-- eslint-disable -->
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          :from="tileSize / 2"
          :to="tileSize"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
        />
        <!-- eslint-enable -->
      </circle>
    </g>
  </g>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import Cell from '@/engine/Cell'

@Component
export default class BoardFate extends Vue {
  @Prop({ default: 64 }) readonly tileSize!: number
  @State('fateCells') fateCells!: Cell[]

  get displayFate(): boolean {
    return this.fateCells.length > 0
  }
}
</script>

<style lang="scss" scoped></style>
