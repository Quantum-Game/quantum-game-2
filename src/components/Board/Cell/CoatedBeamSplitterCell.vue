<template>
  <svg :class="state" width="64" height="64">
    <path d="M63 23V41H1V23H63Z" fill="#F0F" />
    <path d="M62 24H2V40H62V24Z" fill="#61DBEF" />
    <path
      d="M36.4 24H52.4C42.9 31.8 34.1 35.9 28.2 38H12.2C18 35.9 26.9 31.8 36.4 24Z"
      fill="#4AD1D8"
    />
    <path d="M52.4 24H62V38H28.2C34 35.9 42.9 31.8 52.4 24Z" fill="#4AC4D1" />
    <path d="M62 38H2V40H62V38Z" fill="#5A4278" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { props } from './Piece'
export default defineComponent({ props })
</script>
