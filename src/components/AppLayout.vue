<template>
  <div class="layout-container">
    <aside class="left">
      <app-menu />
      <slot name="left"></slot>
    </aside>
    <main class="main">
      <slot name="main"></slot>
    </main>
    <aside class="right">
      <slot name="right"></slot>
    </aside>
  </div>
</template>

<script lang="ts">
import AppMenu from '@/components/AppMenu.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppMenu,
  },
})
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;
  min-height: 100vh;
  display: flex;
  color: white;
  width: 1400px;
  justify-content: center;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    justify-content: flex-start;
  }
  & aside,
  & main {
    padding: 20px;
    align-content: center;
    width: 65%;
    margin: 0;
    padding: 0;

    @media screen and (max-width: 1000px) {
      width: 100%;
      padding: 0;
    }
  }

  & aside {
    &.left {
      width: 16%;
      padding: 50px 20px 0 0;
      text-transform: uppercase;
      text-align: left;
      color: white;
      @media screen and (max-width: 1000px) {
        padding: 0 20px;
        min-height: 41px;
        width: 100%;
      }
    }
    &.right {
      width: 16%;
      padding: 50px 0 0 20px;
      margin-top: 42px;
      text-transform: uppercase;
      text-align: left;
      color: white;
      @media screen and (max-width: 1000px) {
        width: 100%;
        padding: 0px !important;
      }
    }
  }
}
</style>
