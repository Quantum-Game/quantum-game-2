<template>
  <div :class="{ open: appMenuOpened, 'menu-icon': true }" @click="toggleMenu">
    <div class="bar1"></div>
    <div class="bar2"></div>
    <div class="bar3"></div>
  </div>
</template>

<script lang="ts">
import { storeNamespace } from '@/store'
import { defineComponent } from 'vue'

export default defineComponent(() => {
  const game = storeNamespace('game')
  const appMenuOpened = game.useState('appMenuOpened')
  const SET_MENU_OPENED = game.useMutation('SET_MENU_OPENED')

  function toggleMenu(): void {
    SET_MENU_OPENED(!appMenuOpened.value)
  }

  return {
    toggleMenu,
    appMenuOpened,
  }
})
</script>

<style scoped lang="scss">
.menu-icon.absolute {
  position: absolute;
  top: 20px;
  left: 20px;

  &.open {
    position: fixed;
  }
}

.menu-icon {
  position: relative;
  display: block;
  cursor: pointer;
  z-index: 4;

  .bar1,
  .bar2,
  .bar3 {
    width: 35px;
    height: 3px;
    background-color: rgb(255, 255, 255);
    margin: 8px 0;
    transition: transform 0.3s, opacity 0.3s;
    transform-origin: 50% 50%;
  }

  &.open {
    .bar1 {
      transform: translate(0px, 11px) rotate(-45deg);
    }
    .bar2 {
      transform: rotateY(90deg);
      opacity: 0;
    }
    .bar3 {
      transform: translate(0px, -11px) rotate(45deg);
    }
  }
}
</style>
