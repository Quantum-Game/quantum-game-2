<template>
  <svg :class="state">
    <path
      fill-rule="evenodd"
      d="M54.0155 8L56 9.99334V56H9.99725L8 54.0162V8H54.0155ZM9 53.6V9H53.6L55 10.4062V55H10.4095L9 53.6Z"
      fill="#F0F"
    />
    <g opacity="0.9">
      <path d="M33 32.4L45.6 55H55V10.4L33 32.4Z" fill="#61DBEF" />
      <path d="M26.4 39L35.3 55H45.9L33.3 32.1L26.4 39Z" fill="#4AD1D8" />
      <path d="M10.4 55H35.6L26.6 38.8L10.4 55Z" fill="#4AC4D1" />
    </g>
    <g opacity="0.6">
      <path d="M20.1 9L32 30.5L25.4 37.2L53.6 9H20.1Z" fill="#61DBEF" />
      <path d="M20.4 9H9.8L25.4 37.2L32.2 30.3L20.4 9Z" fill="#4AD1D8" />
      <path d="M9 9V53.5L25.6 37L10.1 9H9Z" fill="#4AC4D1" />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { props } from './Piece'
export default defineComponent({ props })
</script>
