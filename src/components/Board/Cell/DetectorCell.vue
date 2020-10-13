<template>
  <svg :class="state" width="64" height="64">
    <g class="DetectorCell">
      <path
        fill="#F0F"
        d="M10 15C15.4 7.5 24.2 3 33.5 3c7.4 0 14.5 2.8 19.9 7.9 1.5 1.5 2.9 3.1 4.1 4.8l.6.9-.8.6-.1.1.2 4.2.1 1.7-1.5-.8-3-1.4.1 3.3.1 1.7-1.5-.8-2.9-1.5.3 3.3.1 1.8-1.6-.8-2.9-1.4.2 3.2.1 1.7-1.5-.8-3.7-1.8-4.6 3.1 3.7 2.6 5.2-2.6-.1 1.7-.3 3.3 2.9-1.3 1.6-.8-.1 1.7-.3 3.3 2.9-1.4 1.6-.7-.1 1.7-.3 3.2 3-1.4 1.6-.7-.1 1.7-.3 3.8 1.2.8.8.6-.6.8c-1 1.5-2.2 3-3.6 4.3l-.1.1C48.3 58 41.1 61 33.5 61c-8.8 0-17.2-4.1-22.7-10.9C8.9 52.4 8 55.2 8 58.5v1H3v-1c0-5.1 1.6-9.4 4.9-12.8-2.2-4.2-3.4-8.9-3.4-13.7 0-6.1 1.9-12 5.5-17z"
        class="outline"
      />
      <g class="teeth">
        <path
          fill="#fff"
          d="M38.3 36l4.7-2.3-.384 4.994L47.1 36.5l-.385 5 4.485-2.1-.388 4.948L55.4 42.2l-.4 5.2-4.198-2.929-.002.029-4.3-2.9.03-.014L42.4 38.8l.03-.015L38.3 36z"
          class="bottom"
          clip-rule="evenodd"
        />
        <path
          fill="#fff"
          d="M56.1 16.4l.3 5.1-4.488-2.196.288 4.996-4.488-2.244.388 5.044-4.482-2.194.282 4.894-4.7-2.3 4.4-2.9.004.063L47.7 21.9l.002.031 4.028-2.716-.03-.015 4.4-2.8z"
          class="top"
          clip-rule="evenodd"
        />
      </g>
      <g class="default">
        <path
          fill="#77D807"
          d="M33.4 32l23.3-15.7C51.6 8.9 43.1 4 33.5 4 18 4 5.5 16.5 5.5 32s12.5 28 28 28c9.6 0 18.1-4.9 23.2-12.3L33.4 32z"
          class="background"
        />
        <path
          fill="#57C703"
          d="M10.788 15.591c.231 12.462 5.898 34.3 42.306 36.383C48.014 56.928 41.102 60 33.5 60a27.934 27.934 0 01-22.665-11.526C8.676 50.724 7 53.941 7 58.5H4c0-5.846 2.323-9.863 5.176-12.592A27.934 27.934 0 015.5 32c0-6.136 1.96-11.802 5.288-16.409z"
          class="background-dark"
          clip-rule="evenodd"
        />
        <path
          fill="#007F12"
          d="M56.7 16.3L33.4 32l23.3 15.7a28.788 28.788 0 01-3.511 4.181L31.5 32l21.239-20.315A28.78 28.78 0 0156.7 16.3z"
          class="mouth"
          clip-rule="evenodd"
        />
        <g class="dimples" opacity=".19">
          <path
            fill="#000"
            d="M39.5 19a5 5 0 100-10 5 5 0 000 10zM14.5 26a4 4 0 100-8 4 4 0 000 8zM26.5 38a3 3 0 100-6 3 3 0 000 6zM37.5 55a5 5 0 100-10 5 5 0 000 10zM12.5 46a2 2 0 100-4 2 2 0 000 4zM22.5 12a2 2 0 100-4 2 2 0 000 4z"
          />
        </g>
      </g>
      <g class="show-energized" :style="`opacity: ${state.goalProgress};`">
        <path
          fill="#891879"
          d="M7 58.5H4c0-15.1 15.5-18 15.6-18l.5 3-.2-1.5.3 1.5C19.6 43.6 7 46 7 58.5z"
          class="Vector"
        />
        <path
          fill="url(#detector_paint0_linear)"
          d="M33.4 32l23.3-15.7C51.6 8.9 43.1 4 33.5 4 18 4 5.5 16.5 5.5 32s12.5 28 28 28c9.6 0 18.1-4.9 23.2-12.3L33.4 32z"
          class="background_2"
        />
        <path
          fill="#9E005D"
          d="M53.094 51.974C16.686 49.891 11.02 28.053 10.788 15.591A27.909 27.909 0 005.5 32c0 15.5 12.5 28 28 28 7.602 0 14.514-3.072 19.594-8.026z"
          class="background-dark_2"
          opacity=".5"
        />
        <path
          fill="#F05"
          d="M56.7 16.3L33.4 32l23.3 15.7a28.788 28.788 0 01-3.511 4.181L31.5 32l21.239-20.315A28.78 28.78 0 0156.7 16.3z"
          class="Intersect"
        />
        <g class="dimples_2" opacity=".37">
          <path fill="#F05" d="M39.5 19a5 5 0 100-10 5 5 0 000 10z" class="Vector_2" />
          <path fill="#C90651" d="M14.5 26a4 4 0 100-8 4 4 0 000 8z" class="Vector_3" />
          <path fill="#931948" d="M26.5 38a3 3 0 100-6 3 3 0 000 6z" class="Vector_4" />
          <path fill="#3A0F38" d="M37.5 55a5 5 0 100-10 5 5 0 000 10z" class="Vector_5" />
          <path fill="#3A0F38" d="M12.5 46a2 2 0 100-4 2 2 0 000 4z" class="Vector_6" />
          <path fill="#F05" d="M22.5 12a2 2 0 100-4 2 2 0 000 4z" class="Vector_7" />
        </g>
      </g>
    </g>
    <defs>
      <linearGradient
        id="detector_paint0_linear"
        x1="31.1"
        x2="31.1"
        y1="4"
        y2="60"
        class="detector_paint0_linear"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#FBB03B" />
        <stop offset=".06" stop-color="#FBAA3C" />
        <stop offset=".141" stop-color="#FC993E" />
        <stop offset=".232" stop-color="#FC7E42" />
        <stop offset=".331" stop-color="#FD5748" />
        <stop offset=".435" stop-color="#FE274F" />
        <stop offset=".509" stop-color="#F05" />
        <stop offset=".582" stop-color="#E90873" />
        <stop offset=".721" stop-color="#C416A7" />
        <stop offset=".842" stop-color="#A920CD" />
        <stop offset=".939" stop-color="#9827E4" />
        <stop offset="1" stop-color="#9229ED" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { props } from './Piece'
export default defineComponent({ props })
</script>

<style lang="scss" scoped>
.show-energized {
  transition: opacity 0.3s;
}
</style>
