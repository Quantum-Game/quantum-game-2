<template>
  <footer>
    <a href="https://www.quantumlah.org/" target="_blank">
      <img src="@/assets/CQT_NUS_Logo_mono.svg" alt="CQT" width="128" />
    </a>
  </footer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AppFooter extends Vue {}
</script>

<style lang="scss" scoped>
footer {
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  opacity: 0.4;
}
</style>
