<template>
  <svg style="enable-background:new 0 0 64 64;" xml:space="preserve">
    <g>
      <path class="st0" d="M12,12.4c-1.1,1.1-2.1,2.3-3,3.6V48c0.9,1.3,1.9,2.5,3,3.6V12.4z" />
      <path class="st0" d="M15,54.2c1,0.7,2,1.4,3,2V7.8c-1,0.6-2,1.3-3,2V54.2z" />
      <path class="st0" d="M24,5.2c-1,0.3-2,0.7-3,1.1v51.5c1,0.4,2,0.8,3,1.1V5.2z" />
      <path class="st0" d="M30,4.1c-1,0.1-2,0.2-3,0.4v55.1c1,0.2,2,0.3,3,0.4V4.1z" />
      <path class="st0" d="M33,60c1,0,2-0.1,3-0.3V4.3c-1-0.1-2-0.2-3-0.3V60z" />
      <path class="st0" d="M42,5.8c-1-0.4-2-0.7-3-1v54.2c1-0.3,2-0.6,3-1V5.8z" />
      <path class="st0" d="M48,9c-1-0.7-2-1.3-3-1.8v49.6c1-0.5,2-1.2,3-1.8V9z" />
      <path
        class="st0"
        d="M54,49.3V14.7c-0.9-1.2-1.9-2.2-3-3.3v41.1C52.1,51.6,53.1,50.5,54,49.3z"
      />
    </g>
    <path
      class="st1"
      d="M32,7c13.8,0,25,11.2,25,25S45.8,57,32,57S7,45.8,7,32S18.2,7,32,7 M32,3C16,3,3,16,3,32s13,29,29,29
      s29-13,29-29S48,3,32,3L32,3z"
    />
    <path
      class="st2"
      d="M32,8c13.2,0,24,10.8,24,24S45.2,56,32,56S8,45.2,8,32S18.8,8,32,8 M32,6C17.6,6,6,17.6,6,32s11.6,26,26,26
      s26-11.6,26-26S46.4,6,32,6L32,6z"
    />
  </svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Piece from './Piece'

@Component
export default class PolarizerCell extends Piece {}
</script>

<style lang="scss" scoped>
.st0 {
  fill: #8468a5;
  opacity: 1; // The opacity should be linked with polarizer's strenght
}
.st1 {
  fill: #5a4278;
}
.st2 {
  fill: #3c2c50;
}
</style>
