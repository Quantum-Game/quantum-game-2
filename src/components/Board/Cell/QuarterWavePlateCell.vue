<template>
  <svg id="Layer_1" style="enable-background:new 0 0 64 64;" xml:space="preserve">
    <g>
      <!-- BARS -->
      <g :style="computePolarization">
        <rect x="8.5" y="-7" class="st2" width="3" height="69" />
        <rect x="14.5" y="-7" class="st2" width="3" height="69" />
        <rect x="20.5" y="-7" class="st2" width="3" height="69" />
        <rect x="26.5" y="-7" class="st2" width="3" height="69" />
        <rect x="32.5" y="-7" class="st2" width="3" height="69" />
        <rect x="38.5" y="-7" class="st2" width="3" height="69" />
        <rect x="44.5" y="-7" class="st2" width="3" height="69" />
        <rect x="50.5" y="-7" class="st2" width="3" height="69" />
      </g>
      <!-- OVAL TRIMMING PATH -->
      <clipPath id="clip">
        <circle cx="32" cy="32" r="28" />
      </clipPath>
    </g>

    <g class="circular">
      <path
        class="st0"
        d="M60.5,37.8V28H55c-1.2,9-11.1,16-23,16S10.1,37,9,28H3.5v9.9C3.5,50.6,16.3,61,32,61S60.5,50.6,60.5,37.8z"
      />
      <path
        class="st1"
        d="M60.5,26.2C60.5,13.4,47.7,3,32,3S3.5,13.4,3.5,26.2S16.3,49.4,32,49.4C47.7,49.3,60.5,39,60.5,26.2z M9,28
    c1.2-9,11.1-16,23-16s21.9,7,23,16c-1.2,9-11.1,16-23,16S10.1,37,9,28z"
      />
      <path
        class="st0"
        d="M32,11.9c12,0,21.9,7,23,16c0.1-0.6,0.1-1.2,0.1-1.8c0-9.8-10.4-17.8-23.2-17.8s-23.2,8-23.2,17.8
    c0,0.6,0,1.2,0.1,1.8C10.1,19,20,11.9,32,11.9z"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Piece from './Piece';

@Component
export default class QuarterWavePlateCell extends Piece {
  /**
   * Compute inner grid rotation from cell polarization
   */
  get computePolarization() {
    return {
      'transform-origin': `32px 32px`,
      transform: `rotate(${(this.cell.polarization + 90) % 180}deg)`
    };
  }
}
</script>

<style lang="scss" scoped>
.circular {
  transform-origin: 32px 32px;
  transform: rotate(270deg);
}
.st0 {
  fill: #41a0a5;
}
.st1 {
  fill: #4ac4d1;
}
.st2 {
  clip-path: url(#clip);
  fill: #61dbef;
}
</style>
