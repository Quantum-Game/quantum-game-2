<template>
  <svg
    x="0px"
    y="0px"
    viewBox="0 0 64 64"
  >
    <g>
      <g>
        <rect
          x="26"
          y="2"
          class="st0"
          width="14"
          height="60"
        />
        <g>
          <path
            class="st1"
            d="M40,36.4v16c-7.8-9.46-11.91-18.35-14-24.24v-16C28.09,18.05,32.2,26.94,40,36.4z"
          />
          <path
            class="st2"
            d="M40,52.4V62H26V28.16C28.09,34.05,32.2,42.94,40,52.4z"
          />
        </g>
      </g>
      <rect
        x="24"
        y="2"
        class="st3"
        width="2"
        height="60"
      />
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
export default class CoatedBeamSplitter extends Vue {

}
</script>

<style lang="scss" scoped>
	.st0{fill:#61DBEF;}
	.st1{fill:#4AD1D8;}
	.st2{fill:#4AC4D1;}
	.st3{fill:#5A4278;}
</style>
