<template>
  <svg
    x="0px"
    y="0px"
    viewBox="0 0 64 64"
  >
    <g>
      <circle
        class="st0"
        cx="31.93"
        cy="32.02"
        r="30"
      />
      <polygon
        class="st1"
        points="55.69,32.02 18.66,11.02 18.66,53.02 	"
      />
      <g>
        <g>
          <rect
            x="21.36"
            y="31.52"
            class="st0"
            width="20.46"
            height="1"
          />
          <rect
            x="31.09"
            y="21.79"
            class="st0"
            width="1"
            height="20.46"
          />
          <rect
            x="31.09"
            y="20.6"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -13.3869 31.7116)"
            class="st0"
            width="1"
            height="22.84"
          />

          <rect
            x="20.17"
            y="31.51"
            transform="matrix(0.7071 -0.7071 0.7071 0.7071 -13.3869 31.7109)"
            class="st0"
            width="22.84"
            height="1"
          />
        </g>
        <g>
          <rect
            x="24.01"
            y="31.52"
            transform="matrix(0.9238 -0.3828 0.3828 0.9238 -9.8513 14.532)"
            class="st0"
            width="15.15"
            height="1"
          />

          <rect
            x="31.09"
            y="24.44"
            transform="matrix(0.9238 -0.3828 0.3828 0.9238 -9.8504 14.5302)"
            class="st0"
            width="1"
            height="15.15"
          />

          <rect
            x="31.09"
            y="24.44"
            transform="matrix(0.3827 -0.9239 0.9239 0.3827 -10.0825 48.9496)"
            class="st0"
            width="1"
            height="15.15"
          />

          <rect
            x="24.01"
            y="31.52"
            transform="matrix(0.3828 -0.9238 0.9238 0.3828 -10.0837 48.946)"
            class="st0"
            width="15.15"
            height="1"
          />
        </g>
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
} from 'vue-property-decorator';

@Component
export default class Emitter extends Vue {

}
</script>

<style lang="scss" scoped>
	.st0{fill:#FF0055;}
	.st1{fill:#FFFFFF;}
</style>
