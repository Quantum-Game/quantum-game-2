<template>
  <svg :class="state" width="64" height="64">
    <path
      fill="#F0F"
      fill-rule="evenodd"
      d="M2 32C2 15.448 15.448 2 32 2s30 13.448 30 30-13.448 30-30 30S2 48.552 2 32zM32 3C16 3 3 16 3 32s13 29 29 29 29-13 29-29S48 3 32 3z"
    />
    <path
      fill="#61DBEF"
      fill-opacity=".5"
      d="M12 12.4c-1.1 1.1-2.1 2.3-3 3.6v32c.9 1.3 1.9 2.5 3 3.6V12.4zM15 54.2c1 .7 2 1.4 3 2V7.8c-1 .6-2 1.3-3 2v44.4zM24 5.2c-1 .3-2 .7-3 1.1v51.5c1 .4 2 .8 3 1.1V5.2zM30 4.1c-1 .1-2 .2-3 .4v55.1c1 .2 2 .3 3 .4V4.1zM33 60c1 0 2-.1 3-.3V4.3L33 4v56zM42 5.8c-1-.4-2-.7-3-1V59c1-.3 2-.6 3-1V5.8zM48 9c-1-.7-2-1.3-3-1.8v49.6c1-.5 2-1.2 3-1.8V9zM54 49.3V14.7c-.9-1.2-1.9-2.2-3-3.3v41.1c1.1-.9 2.1-2 3-3.2z"
    />
    <path
      fill="#41A0A5"
      d="M32 7c13.8 0 25 11.2 25 25S45.8 57 32 57 7 45.8 7 32 18.2 7 32 7zm0-4C16 3 3 16 3 32s13 29 29 29 29-13 29-29S48 3 32 3z"
    />
    <path
      fill="#227F7F"
      d="M32 8c13.2 0 24 10.8 24 24S45.2 56 32 56 8 45.2 8 32 18.8 8 32 8zm0-2C17.6 6 6 17.6 6 32s11.6 26 26 26 26-11.6 26-26S46.4 6 32 6z"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { props } from './Piece'
export default defineComponent({ props })
</script>
