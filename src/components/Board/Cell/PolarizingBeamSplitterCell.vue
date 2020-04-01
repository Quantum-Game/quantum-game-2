<template>
  <svg>
    <g class="st0">
      <polygon class="st1" points="33,32.3 45.6,54.9 55,54.9 55,10.3" />
      <polygon class="st2" points="26.4,38.9 35.3,54.9 45.9,54.9 33.3,32" />
      <polygon class="st3" points="10.4,54.9 35.6,54.9 26.6,38.7" />
    </g>
    <g class="st4">
      <polygon class="st1" points="20.1,8.9 32,30.4 25.4,37.1 53.6,8.9" />
      <polygon class="st2" points="20.4,8.9 9.8,8.9 25.4,37.1 32.2,30.2" />
      <polygon class="st3" points="9,8.9 9,53.4 25.6,36.9 10.1,8.9" />
    </g>
    <g v-if="border" id="Qoutline">
      <path
        class="st5"
        :style="{ fill: border }"
        d="M53.6,8.9l1.4,1v45h-9.1H35.2H11l-2-1.4V8.9h0.8h10.7H37H53.6 M53.9,7.9h-0.3H37H20.4H9.8H9H8v1v44.6V54
	      l0.4,0.3l2,1.4l0.3,0.2H11h24.2h10.7H55h1v-1v-45V9.3L55.6,9l-1.4-1L53.9,7.9L53.9,7.9z"
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
  opacity: 0.9;
}
.st1 {
  fill: #61dbef;
}
.st2 {
  fill: #4ad1d8;
}
.st3 {
  fill: #4ac4d1;
}
.st4 {
  opacity: 0.6;
}
.st5 {
  fill: #ffffff;
}
</style>
