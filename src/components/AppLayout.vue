<template>
  <div class="main-layout" layout="column center" flex>
    <app-menu />
    <div class="main-layout-inner" layout="column" flex>
      <header layout="row between u5">
        <app-menu-button :class="{ absolute: menuAbsolute, inlineMenu: !menuAbsolute }" />
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
  </div>
</template>

<script lang="ts">
import AppMenu from '@/components/AppMenu.vue'
import AppMenuButton from '@/components/AppMenuButton.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppMenu,
    AppMenuButton,
  },
  props: {
    leftClass: { type: String, default: '' },
    menuAbsolute: { type: Boolean, default: true },
  },
})
</script>

<style lang="scss" scoped>
.main-layout-inner {
  max-width: 1400px;
  width: 100vw;
  min-height: 100vh;
  color: white;
  padding: 0 20px;
}

.inlineMenu {
  padding: 10px 0;
}

@include media('>=large') {
  .left,
  .right {
    width: 200px;
  }
}
</style>
