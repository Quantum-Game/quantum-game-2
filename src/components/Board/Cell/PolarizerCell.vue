<template>
  <svg id="Layer_1" style="enable-background:new 0 0 64 64;" xml:space="preserve">
    <g>
      <!-- BARS -->
      <g :style="computePolarization" class="st2">
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
      <!-- TODO: Error with the placement of the polarizer -->
      <!-- <clipPath id="polarizerClip">
        <circle cx="32" cy="32" r="28" />
      </clipPath> -->
      <g v-if="border" id="Qoutline">
        <path
          class="st2"
          :style="{ fill: border }"
          d="M57.6,5L59,6.4V59H6.4L5,57.6V5H57.6 M58,4h-0.4H5H4v1v52.6V58l0.3,0.3l1.4,1.4L6,60h0.4H59h1v-1V6.4V6
        l-0.3-0.3l-1.4-1.4L58,4L58,4z"
        />
      </g>
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
import { Component } from 'vue-property-decorator'
import Piece from './Piece'

@Component
export default class PolarizerCell extends Piece {
  /**
   * Compute inner grid rotation from cell polarization
   */
  get computePolarization(): {} {
    const polarization = this.cell ? this.cell.rotation + this.cell.polarization : 0
    return {
      'transform-origin': `32px 32px`,
      transform: `rotate(${(polarization + 90) % 180}deg)`
    }
  }

  get computeClipping(): {} {
    const polarization = this.cell ? this.cell.rotation + this.cell.polarization : 0
    return {
      'transform-origin': `32px 32px`,
      transform: `rotate(${(polarization + 90) % 180}deg)`
    }
  }
}
</script>

<style lang="scss" scoped>
.circular {
  transform-origin: 32px 32px;
  transform: rotate(270deg);
}
.st0 {
  fill: #3c2c50;
}
.st1 {
  fill: #4e3b6b;
}
.st2 {
  clip-path: url(#polarizerClip);
  fill: #5a4278;
}
</style>
