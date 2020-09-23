<template>
  <svg :class="state">
    <path fill="#F0F" d="M63 24H1v16h62V24z" />
    <path fill="#61DBEF" d="M62 25H2v14h60V25z" />
    <path fill="#4AD1D8" d="M36.4 25h16c-9.5 7.8-18.3 11.9-24.2 14h-16c5.8-2.1 14.7-6.2 24.2-14z" />
    <path fill="#4AC4D1" d="M52.4 25H62v14H28.2c5.8-2.1 14.7-6.2 24.2-14z" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { props } from './Piece'
export default defineComponent({ props })
</script>
