<template>
  <svg>
    <rect width="62" height="62" rx="12" />
  </svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Piece from './Piece'

@Component
export default class WallCell extends Piece {}
</script>

<style lang="scss" scoped>
rect {
  fill: grey;
}
</style>
