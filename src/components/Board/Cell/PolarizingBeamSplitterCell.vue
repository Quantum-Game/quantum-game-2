<template>
  <svg>
    <g>
      <polygon class="st0" points="5,5 5,57.6 57.6,5   " />
      <polygon class="st1" points="59,6.4 6.4,59 59,59   " />
    </g>
    <g v-if="border" id="Qoutlinr">
      <path
        class="st2"
        :style="{ fill: border }"
        d="M57.6,5L59,6.4V59H6.4L5,57.6V5H57.6 M58,4h-0.4H5H4v1v52.6V58l0.3,0.3l1.4,1.4L6,60h0.4H59h1v-1V6.4V6
        l-0.3-0.3l-1.4-1.4L58,4L58,4z"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Piece from './Piece'

@Component
export default class PolarizingBeamSplitterCell extends Piece {}
</script>

<style lang="scss" scoped>
.st0 {
  fill: #61dbef;
  opacity: 0.7;
}
.st1 {
  fill: #4ac4d1;
}
</style>
