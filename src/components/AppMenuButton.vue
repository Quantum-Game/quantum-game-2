<template>
  <nav class="menu-nav" layout="row u5">
    <div
      ref="button"
      :class="{ open: appMenuOpened, 'menu-icon': true }"
      :style="style"
      @click="toggleMenu"
    >
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </div>
    <div layout="row u5" :class="{ alt: $flags.altMenu }">
      <router-link to="/" class="nav-icon" exact>
        <div><IconHome /></div>
        <span>HOME</span>
      </router-link>
      <router-link v-if="currentLevel != null" :to="`/level/${currentLevel}`" class="nav-icon">
        <div><IconGame /></div>
        <span>GAME</span>
      </router-link>
      <router-link to="/levels" class="nav-icon">
        <div><IconLevels /></div>
        <span>LEVELS</span>
      </router-link>
      <router-link to="/lab" class="nav-icon">
        <div><IconLab /></div>
        <span>LAB</span>
      </router-link>
      <router-link to="/info" class="nav-icon">
        <div><IconEncyclopedia /></div>
        <span>LEARN</span>
      </router-link>
    </div>
  </nav>
  <!-- <router-link to="/options">OPTIONS???</router-link> -->
</template>

<script lang="ts">
import { storeNamespace } from '@/store'
import { computed, defineComponent, ref, watch } from 'vue'

import IconHome from '@/assets/graphics/icons/menu_home.svg?inline'
import IconGame from '@/assets/graphics/icons/menu_game.svg?inline'
import IconLevels from '@/assets/graphics/icons/menu_levels.svg?inline'
import IconLab from '@/assets/graphics/icons/menu_lab.svg?inline'
import IconEncyclopedia from '@/assets/graphics/icons/menu_encyclopedia.svg?inline'

export default defineComponent({
  components: {
    IconHome,
    IconGame,
    IconLevels,
    IconLab,
    IconEncyclopedia,
  },
  setup() {
    const game = storeNamespace('game')
    const appMenuOpened = game.useState('appMenuOpened')
    const SET_MENU_OPENED = game.useMutation('SET_MENU_OPENED')
    const button = ref<HTMLElement>()
    const currentLevel = game.useState('currentLevelID')

    function toggleMenu(): void {
      SET_MENU_OPENED(!appMenuOpened.value)
    }

    const offsetTop = ref(0)
    watch(
      () => appMenuOpened.value,
      (opened) => {
        if (opened && button.value != null) {
          const rect = button.value.getBoundingClientRect()
          offsetTop.value = rect.top - 30
        } else {
          offsetTop.value = 0
        }
      }
    )

    const style = computed(() => {
      return {
        transform: `translateY(${-offsetTop.value}px)`,
      }
    })

    return {
      button,
      style,
      toggleMenu,
      appMenuOpened,
      currentLevel,
    }
  },
})
</script>

<style scoped lang="scss">
.menu-nav {
  padding: 20px 0;
}

.nav-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
  }

  span {
    display: inline-block;
    font-weight: 400;
    margin-top: 5px;
    font-size: 0.7em;
    padding: 2px 4px;
  }
}

// eslint-disable-next-line vue-scoped-css/no-unused-selector
.nav-icon.router-link-active {
  color: $fuchsia;
}

.alt > .nav-icon {
  text-decoration: none;
  > span {
    color: $purple-dark;
    background: $grey;
    position: absolute;
    top: 50px;
    opacity: 0;
    transition: opacity 0.1s ease-out;
  }

  &:hover > span,
  &:active > span {
    opacity: 1;
  }
}

// eslint-disable-next-line vue-scoped-css/no-unused-selector
.alt > .nav-icon.router-link-active > span {
  color: $purple-dark;
  background: $fuchsia;
}

.menu-icon {
  position: relative;
  display: block;
  cursor: pointer;
  z-index: 4;
  transition: transform 0.15s ease-out;
  transform: translateY(0px);

  .bar1,
  .bar2,
  .bar3 {
    width: 35px;
    height: 1px;
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
