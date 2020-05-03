<template>
  <svg style="enable-background:new 0 0 64 64;" xml:space="preserve">
    <g>
      <rect v-for="i in strips" :key="i" class="st2" x="7" :y="8.5 + 6 * i" width="50" height="3" />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Piece from './Piece'

@Component
export default class QuarterWavePlateCell extends Piece {
  strips = [0, 1, 2, 3, 4, 5, 6, 7]
}
</script>

<style lang="scss" scoped>
.st2 {
  fill: #61dbef;
}
</style>
