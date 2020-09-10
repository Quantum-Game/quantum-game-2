<template>
  <svg>
    <g v-if="border" id="active">
      <path
        class="st1"
        d="M7.5,58.5h-3c0-15.1,15.5-18,15.6-18l0.5,3L20.4,42l0.3,1.5C20.1,43.6,7.5,46,7.5,58.5z"
      />
      <g class="st2">
        <polygon class="st3" points="56.9,21.5 56.6,16.4 52.2,19.2     " />
        <polygon class="st3" points="52.7,24.3 52.4,19.1 48.1,22     " />
        <polygon class="st3" points="48.6,27.1 48.2,21.9 43.9,24.8     " />
        <polygon class="st3" points="44.4,29.8 44.1,24.6 39.7,27.5     " />
      </g>
      <g class="st2">
        <polygon class="st3" points="43.5,33.7 38.8,36 43.1,38.9     " />
        <polygon class="st3" points="47.6,36.5 42.9,38.8 47.2,41.7     " />
        <polygon class="st3" points="51.7,39.4 47,41.6 51.3,44.5     " />
        <polygon class="st3" points="55.9,42.2 51.2,44.4 55.5,47.4     " />
      </g>
      <g class="st2">
        <g>
          <linearGradient
            id="detectorSVGID_2_"
            gradientUnits="userSpaceOnUse"
            x1="169.5468"
            y1="-119.9468"
            x2="225.5468"
            y2="-119.9468"
            gradientTransform="matrix(6.123234e-17 1 1 -6.123234e-17 151.5468 -165.5468)"
          >
            <stop offset="0" style="stop-color:#FBB03B" />
            <stop offset="6.042393e-02" style="stop-color:#FBAA3C" />
            <stop offset="0.1405" style="stop-color:#FC993E" />
            <stop offset="0.2315" style="stop-color:#FC7E42" />
            <stop offset="0.3307" style="stop-color:#FD5748" />
            <stop offset="0.4352" style="stop-color:#FE274F" />
            <stop offset="0.5088" style="stop-color:#FF0055" />
            <stop offset="0.5823" style="stop-color:#E90873" />
            <stop offset="0.7213" style="stop-color:#C416A7" />
            <stop offset="0.8423" style="stop-color:#A920CD" />
            <stop offset="0.9392" style="stop-color:#9827E4" />
            <stop offset="1" style="stop-color:#9229ED" />
          </linearGradient>
          <path
            id="detectorSVGID_1_"
            class="st4"
            d="M33.9,32l23.3-15.7C52.1,8.9,43.6,4,34,4C18.5,4,6,16.5,6,32s12.5,28,28,28
            c9.6,0,18.1-4.9,23.2-12.3L33.9,32z"
          />
        </g>
        <g>
          <defs>
            <path
              id="detectorSVGID_3_"
              d="M33.9,32l23.3-15.7C52.1,8.9,43.6,4,34,4C18.5,4,6,16.5,6,32s12.5,28,28,28c9.6,0,18.1-4.9,23.2-12.3
              L33.9,32z"
            />
          </defs>
          <clipPath id="detectorSVGID_5_">
            <use xlink:href="#detectorSVGID_3_" style="overflow:visible;" />
          </clipPath>
          <path class="st5" d="M12,7c0,0-11,48,53,45S47,72,47,72l-32-7L2,29V13L12,7z" />
        </g>
        <g>
          <defs>
            <path
              id="detectorSVGID_6_"
              d="M33.9,32l23.3-15.7C52.1,8.9,43.6,4,34,4C18.5,4,6,16.5,6,32s12.5,28,28,28c9.6,0,18.1-4.9,23.2-12.3
              L33.9,32z"
            />
          </defs>
          <clipPath id="detectorSVGID_7_">
            <use xlink:href="#detectorSVGID_6_" style="overflow:visible;" />
          </clipPath>
          <polygon class="st6" points="55,10 32,32 56,54 61,47 62,22 60,14       " />
        </g>
      </g>
      <g class="st7">
        <g>
          <circle class="st8" cx="40" cy="14" r="5" />
        </g>
        <g>
          <circle class="st9" cx="15" cy="22" r="4" />
        </g>
        <g>
          <circle class="st10" cx="27" cy="35" r="3" />
        </g>
        <g>
          <circle class="st11" cx="38" cy="50" r="5" />
        </g>
        <g>
          <circle class="st11" cx="13" cy="44" r="2" />
        </g>
        <g>
          <circle class="st8" cx="23" cy="10" r="2" />
        </g>
      </g>
    </g>
    <!-- BASIC STATE -->
    <g v-else id="regular">
      <g>
        <path
          class="st12"
          d="M7.5,58.5h-3c0-15.1,15.5-18,15.6-18l0.5,3L20.4,42l0.3,1.5C20.1,43.6,7.5,46,7.5,58.5z"
        />
        <g>
          <polygon class="st3" points="56.9,21.5 56.6,16.4 52.2,19.2       " />
          <polygon class="st3" points="52.7,24.3 52.4,19.1 48.1,22       " />
          <polygon class="st3" points="48.6,27.1 48.2,21.9 43.9,24.8       " />
          <polygon class="st3" points="44.4,29.8 44.1,24.6 39.7,27.5       " />
        </g>
        <g>
          <polygon class="st3" points="43.5,33.7 38.8,36 43.1,38.9       " />
          <polygon class="st3" points="47.6,36.5 42.9,38.8 47.2,41.7       " />
          <polygon class="st3" points="51.7,39.4 47,41.6 51.3,44.5       " />
          <polygon class="st3" points="55.9,42.2 51.2,44.4 55.5,47.4       " />
        </g>
        <g>
          <g>
            <path
              id="detectorSVGID_4_detector"
              class="st13"
              d="M33.9,32l23.3-15.7C52.1,8.9,43.6,4,34,4C18.5,4,6,16.5,6,32s12.5,28,28,28
              c9.6,0,18.1-4.9,23.2-12.3L33.9,32z"
            />
          </g>
          <g>
            <defs>
              <path
                id="detectorSVGID_8_detector"
                d="M33.9,32l23.3-15.7C52.1,8.9,43.6,4,34,4C18.5,4,6,16.5,6,32s12.5,28,28,28c9.6,0,18.1-4.9,23.2-12.3
                L33.9,32z"
              />
            </defs>
            <clipPath id="detectorSVGID_9_detector">
              <use xlink:href="#detectorSVGID_8_detector" style="overflow:visible;" />
            </clipPath>
            <path class="st14" d="M12,7c0,0-11,48,53,45S47,72,47,72l-32-7L2,29V13L12,7z" />
          </g>
          <g>
            <defs>
              <path
                id="detectorSVGID_10_"
                d="M33.9,32l23.3-15.7C52.1,8.9,43.6,4,34,4C18.5,4,6,16.5,6,32s12.5,28,28,28c9.6,0,18.1-4.9,23.2-12.3
                L33.9,32z"
              />
            </defs>
            <clipPath id="detectorSVGID_11_">
              <use xlink:href="#detectorSVGID_10_" style="overflow:visible;" />
            </clipPath>
            <polygon class="st15" points="55,10 32,32 56,54 61,47 62,22 60,14" />
          </g>
        </g>
        <g>
          <g>
            <circle class="st16" cx="40" cy="14" r="5" />
          </g>
          <g>
            <circle class="st16" cx="27" cy="35" r="3" />
          </g>
          <g>
            <circle class="st17" cx="13" cy="44" r="2" />
          </g>
          <g>
            <circle class="st16" cx="23" cy="10" r="2" />
          </g>
          <path
            class="st16"
            d="M19,22c0-2.2-1.8-4-4-4c-1.4,0-2.7,0.8-3.4,1.9c0.2,1.7,0.5,3.5,1,5.3c0.7,0.5,1.5,0.8,2.4,0.8
            C17.2,26,19,24.2,19,22z"
          />
          <path
            class="st17"
            d="M11,22c0,1.3,0.6,2.5,1.6,3.2c-0.5-1.8-0.8-3.6-1-5.3C11.2,20.5,11,21.2,11,22z"
          />
          <path
            class="st16"
            d="M38,45c-2,0-3.8,1.2-4.5,2.9c2.8,1.1,6,2,9.5,2.8c0-0.2,0-0.4,0-0.7C43,47.2,40.8,45,38,45z"
          />
          <path
            class="st17"
            d="M33,50c0,2.8,2.2,5,5,5c2.5,0,4.6-1.9,5-4.3c-3.5-0.7-6.7-1.6-9.5-2.8C33.2,48.5,33,49.3,33,50z"
          />
        </g>
      </g>
    </g>
    <!-- OUTLINE -->
    <g v-if="border">
      <path
        class="st8"
        :style="{ fill: border }"
        d="M34,4c7.4,0,14.2,2.9,19.2,7.7c1.5,1.4,2.8,2.9,4,4.6l-0.6,0.4l0.3,4.8l-4.3-2.1l-0.2,0.1l0.3,4.8l-4.2-2.1
        l-0.2,0.2l0.4,4.8L44.3,25l-0.2,0.1l0.3,4.7l-4.2-2.1L33.9,32l5.5,3.7l4.1-2l-0.3,4.5l0.4,0.3l4.1-2L47.3,41l0.4,0.3l4-1.9
        l-0.3,4.4l0.5,0.3l4-1.9l-0.3,4.4l1.6,1.1c-1,1.5-2.2,2.9-3.5,4.2c0,0-0.1,0.1-0.1,0.1c-5.1,5-12,8-19.6,8
        c-9.3,0-17.6-4.5-22.7-11.5c-2.2,2.3-3.8,5.5-3.8,10h-3c0-5.9,2.3-9.9,5.2-12.6C7.3,41.8,6,37.1,6,32c0-6.1,2-11.8,5.3-16.4
        C16.4,8.6,24.6,4,34,4 M34,3c-9.3,0-18.1,4.5-23.5,12C6.9,20,5,25.9,5,32c0,4.8,1.2,9.5,3.4,13.7c-3.3,3.4-4.9,7.7-4.9,12.8v1h1h3
        h1v-1c0-3.3,0.9-6.1,2.8-8.4C16.8,56.9,25.2,61,34,61c7.6,0,14.8-3,20.3-8.3l0.1-0.1c1.4-1.3,2.6-2.8,3.6-4.3l0.6-0.8l-0.8-0.6
        l-1.2-0.8l0.3-3.8l0.1-1.7l-1.6,0.7l-3,1.4l0.3-3.2l0.1-1.7l-1.6,0.7l-2.9,1.4l0.3-3.3l0.1-1.7l-1.6,0.8L44.2,37l0.3-3.3l0.1-1.7
        l-1.6,0.8l-3.6,1.8L35.7,32l4.6-3.1l3.7,1.8l1.5,0.8l-0.1-1.7l-0.2-3.2l2.9,1.4l1.6,0.8L49.6,27l-0.3-3.3l2.9,1.5l1.5,0.8l-0.1-1.7
        L53.5,21l3,1.4l1.5,0.8l-0.1-1.7l-0.2-4.2l0.1-0.1l0.8-0.6L58,15.7c-1.2-1.7-2.6-3.3-4.1-4.8C48.5,5.8,41.4,3,34,3L34,3z"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import Piece from './Piece'

export default class DetectorCell extends Piece {}
</script>

<style lang="scss" scoped>
.st1 {
  display: inline;
  fill: #891879;
}
.st2 {
  display: inline;
}
.st3 {
  fill: #ffffff;
}
.st4 {
  fill: url(#detectorSVGID_2_);
}
.st5 {
  opacity: 0.5;
  clip-path: url(#detectorSVGID_5_);
  fill: #9e005d;
  enable-background: new;
}
.st6 {
  clip-path: url(#detectorSVGID_7_);
  fill: #ff0055;
}
.st7 {
  display: inline;
  opacity: 0.37;
}
.st8 {
  fill: #ff0055;
}
.st9 {
  fill: #c90651;
}
.st10 {
  fill: #931948;
}
.st11 {
  fill: #3a0f38;
}
.st12 {
  fill: #57c703;
}
.st13 {
  fill: #77d807;
}
.st14 {
  clip-path: url(#detectorSVGID_9_detector);
  fill: #57c703;
}
.st15 {
  clip-path: url(#detectorSVGID_11_);
  fill: #007f12;
}
.st16 {
  fill: #5caa19;
}
.st17 {
  fill: #489f16;
}
</style>
