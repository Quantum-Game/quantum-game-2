<template>
  <div class="game-layout" layout="column u5">
    <!-- games header: menu and level name -->
    <header layout="row between u5">
      <div class="left">
        <app-menu />
      </div>
      <div flex>
        <slot name="header-middle"></slot>
      </div>
      <div class="right">
        <slot name="header-right"></slot>
      </div>
    </header>

    <!-- games main: goals, board, toolbox and explanations -->
    <main layout="column u5" layout-lg="row middle">
      <aside class="left">
        <slot name="main-left"></slot>
      </aside>
      <article flex>
        <slot name="main-middle"></slot>
      </article>
      <aside class="right">
        <slot name="main-right"></slot>
      </aside>
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import AppMenu from '@/components/AppMenu.vue'

@Options({
  components: {
    AppMenu,
  },
})
export default class GameLayout extends Vue {}
</script>

<style lang="scss" scoped>
.game-layout {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  user-select: none;
  color: white;
}

@include media('>=large') {
  .left,
  .right {
    width: 200px;
  }
}

header {
  padding: none;
}

main {
  padding: 0 20px;
}
</style>
