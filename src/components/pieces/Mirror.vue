<template>
  <svg x="0px" y="0px" viewBox="0 0 64 64">
    <g>
      <polygon class="st0" points="39,31.65 25,44.81 25,48.04 39,34.89 	"/>
      <polygon class="st0" points="39,2 25,2 25,42.24 39,29.08 	"/>
      <polygon class="st0" points="25,60.92 25,62 39,62 39,47.77 	"/>
      <polygon class="st1" points="39,34.89 25,48.04 25,60.92 39,47.77 	"/>
      <polygon class="st1" points="39,29.08 25,42.24 25,44.81 39,31.65 	"/>
    </g>
  </svg>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
} from 'vue-property-decorator';

@Component()
export default class Mirror extends Vue {

}
</script>

<style lang="scss" scoped>
	.st0{fill:#5A4278;}
	.st1{fill:#7858A0;}
</style>
