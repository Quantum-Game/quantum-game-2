<template>
  <div class="main-layout" layout="column" flex>
    <app-menu />
    <header layout="row between u5">
      <div flex>
        <slot name="header"></slot>
      </div>
    </header>

    <main layout="column u1" layout-lg="row u5">
      <aside v-if="$slots.left" :class="`left ${leftClass}`">
        <slot name="left"></slot>
      </aside>
      <article flex>
        <slot name="main"></slot>
      </article>
      <aside v-if="$slots.right" class="right">
        <slot name="right"></slot>
      </aside>
    </main>
  </div>
</template>

<script lang="ts">
import AppMenu from '@/components/AppMenu.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppMenu,
  },
  props: {
    leftClass: { type: String, default: '' },
  },
})
</script>

<style lang="scss" scoped>
.main-layout {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  color: white;
}

@include media('>=large') {
  .left,
  .right {
    width: 200px;
  }
}

main,
header {
  padding: 0 20px;
}
</style>
