<template>
  <svg>
    <g>
      <g>
        <defs>
          <polygon id="bboSVGID_1_" points="32,14.8 33,1.6 63,15.9 63,16" />
        </defs>
        <use xlink:href="#bboSVGID_1_" style="overflow:visible;fill:#B3EEF7;" />
        <clipPath id="bboSVGID_2_">
          <use xlink:href="#bboSVGID_1_" style="overflow:visible;" />
        </clipPath>
        <g class="st0">
          <polygon class="st1" points="20.3,17.7 14.4,15.7 66.5,-1.6 72.3,0.3" />
          <polygon class="st1" points="21.4,21.4 17.6,20.1 69.7,2.8 73.5,4.1" />
        </g>
      </g>
      <g>
        <defs>
          <polygon
            id="bboSVGID_3_"
            points="1,43.5 1,30.1 31.5,14.7 32,14.8 32,51.9 31.9,51.9 31.8,51.9"
          />
        </defs>
        <use xlink:href="#bboSVGID_3_" style="overflow:visible;fill:#61AAB5;" />
        <clipPath id="bboSVGID_4_">
          <use xlink:href="#bboSVGID_3_" style="overflow:visible;" />
        </clipPath>
        <g class="st2">
          <polygon class="st3" points="-8.7,41.7 -11.3,39.1 58.5,31.3 61.1,33.9" />
          <polygon class="st3" points="-6.1,49.1 -9.5,43.5 60.3,35.7 63.7,41.4" />
        </g>
      </g>
      <g>
        <polygon class="st4" points="1,30.1 1,15.9 32,1 33,1.6 32,14.8 31.5,14.7 1.5,16" />
        <polygon class="st5" points="32,51.9 32,14.8 63,16 63,50.7" />
        <polygon class="st5" points="1.1,50.7 31.9,51.9 32,51.9 33,62.4 32,63" />
        <polygon class="st6" points="33,62.4 32,51.9 63,50.7 63,51.1" />
        <polygon class="st3" points="1,50.7 1,43.5 31.8,51.9 1.1,50.7" />
        <polygon class="st7" points="1,30.1 1,15.9 31.5,14.7" />
      </g>
      <polyline class="st8" points="57.2,50.4 32,51.9 32,32.3" />
      <line class="st8" x1="57.2" y1="15.5" x2="32" y2="14.8" />
      <line class="st8" x1="18.4" y1="21.3" x2="2.9" y2="29.1" />
      <path class="st8" d="M18.2,21.4" />
      <path class="st8" d="M21.6,18.4" />
      <line class="st8" x1="31.5" y1="14.7" x2="23.3" y2="19.1" />
      <line class="st8" x1="2.9" y1="43.6" x2="24.2" y2="49.8" />
      <line class="st8" x1="24.9" y1="52" x2="4.8" y2="50.7" />
    </g>
    <!-- OUTLINE FOR ROTATION (ONLY IN SANDBOX MODE) -->
    <g class="st9">
      <path
        class="st10"
        d="M32,1l1,0.6L63,16v34.7v0.3L33,62.4L32,63L1.1,50.8l-0.1,0v-7.3v-2.7V30.1V15.9L32,1 M32.1-0.1l-0.5,0.2
        L0.6,15L0,15.2v0.6v14.2v10.6v2.7v7.3v0.8l0.8,0.2l0.1,0l30.8,12.2l0.5,0.2l0.4-0.3l0.9-0.6L63.4,52l0.6-0.2v-0.7v-0.3V16v-0.6
        l-0.6-0.3l-30-14.3l-0.9-0.6L32.1-0.1L32.1-0.1z"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Piece from './Piece'

@Component
export default class NonLinearCrystalCell extends Piece {}
</script>

<style lang="scss" scoped>
.st0 {
  clip-path: url(#bboSVGID_2_);
}
.st1 {
  fill: #ffffff;
}
.st2 {
  clip-path: url(#bboSVGID_4_);
}
.st3 {
  fill: #9ae8f5;
}
.st4 {
  fill: #61aab5;
}
.st5 {
  fill: #61dbef;
}
.st6 {
  fill: #b3eef7;
}
.st7 {
  fill: #417179;
}
.st8 {
  fill: none;
  stroke: #ffffff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-miterlimit: 10;
}
.st9 {
  display: none;
}
.st10 {
  display: inline;
  fill: #ff0055;
}
</style>
