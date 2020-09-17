<template>
  <svg :class="state">
    <path fill="#F0F" d="M1 24h62v16H1V24zm61 1v14H2V25h60z" />
    <path fill="#8468A5" d="M62 25H2v14h60V25z" />
    <path fill="#E5D9F7" d="M29.1 39L16 25H3.1l13.1 14h12.9zM34.9 39L21.8 25h-2.6l13.1 14h2.6z" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { props } from './Piece'
export default defineComponent({ props })
</script>
