<template>
  <svg>
    <g>
      <g>
        <polygon class="st0" points="54.1,18.2 32,5.5 9.9,18.2 32,31     " />
        <polygon class="st1" points="27.3,28.3 32,31 42.5,24.9 50.2,16 41.9,11.2     " />
        <polygon class="st1" points="39.8,10 38.2,9.1 23.6,26.1 25.2,27.1     " />
      </g>
      <g>
        <polygon class="st0" points="8.9,20.2 8.9,45.8 31,58.5 31,33     " />
        <polygon class="st1" points="31,34.9 31,33 18,25.5 8.9,25.5 8.9,34.9     " />
        <polygon class="st1" points="31,39.1 31,37.3 8.9,37.2 8.9,39.1     " />
      </g>
      <g>
        <polygon class="st0" points="33,33 33,58.5 55.1,45.8 55.1,20.2     " />
        <polygon class="st1" points="33.7,32.6 33,33 33,48.7 37.7,55.8 45.8,51.1     " />
        <polygon class="st1" points="37.3,30.5 35.7,31.4 47.9,49.9 49.5,49     " />
      </g>
    </g>
    <g v-if="border">
      <path
        class="st2"
        :style="{ fill: border }"
        d="M32,5.5l22.1,12.8l1,2v25.5L33,58.5h-2L8.9,45.8V20.2l1-2L32,5.5 M32,4.3l-0.5,0.3L9.4,17.4l-0.3,0.2L9,17.8
        l-1,2L7.9,20v0.2v25.5v0.6l0.5,0.3l22.1,12.8l0.2,0.1H31h2h0.3l0.2-0.1l22.1-12.8l0.5-0.3v-0.6V20.2V20L56,19.8l-1-2l-0.1-0.3
        l-0.3-0.2L32.5,4.6L32,4.3L32,4.3z"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import Piece from './Piece'

export default class CornerCubeCell extends Piece {}
</script>

<style lang="scss" scoped>
.st0 {
  fill: #8468a5;
}
.st1 {
  fill: #e5d9f7;
}
</style>
