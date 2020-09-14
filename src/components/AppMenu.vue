<template>
  <div class="q-menu-wrapper">
    <div :class="{ open: isMenuOpen, 'menu-icon': true }" @click="toggleMenu">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </div>
    <transition name="fade">
      <div v-if="isMenuOpen" class="menu-overlay">
        <menu>
          <router-link to="/">BACK TO THE MAIN PAGE</router-link>
          <router-link v-if="currentLevel != null" :to="`/level/${currentLevel}`">
            CONTINUE
          </router-link>
          <router-link to="/levels">LEVELS</router-link>
          <router-link v-if="isLoggedIn" to="/myaccount">MY ACCOUNT</router-link>
          <router-link v-else to="/login">LOG IN</router-link>
          <router-link to="/sandbox">SANDBOX</router-link>
          <router-link to="/levels">LEVELS</router-link>
          <router-link to="/info">ENCYCLOPEDIA</router-link>
          <router-link to="/options">OPTIONS</router-link>
          <a href="https://medium.com/quantum-photons" target="_blank">BLOG</a>
        </menu>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { useWindowEvent } from '@/mixins/event'
import { storeNamespace } from '@/store'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

const user = storeNamespace('user')
const game = storeNamespace('game')

export default defineComponent(() => {
  const isLoggedIn = user.useGetter('isLoggedIn')
  const currentLevel = game.useState('currentLevelID')
  const router = useRouter()
  const isMenuOpen = ref(false)

  useWindowEvent('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu()
    }
  })

  router.afterEach(() => {
    isMenuOpen.value = false
  })

  function toggleMenu(): void {
    isMenuOpen.value = !isMenuOpen.value
  }

  return {
    toggleMenu,
    isLoggedIn,
    currentLevel,
    isMenuOpen,
  }
})
</script>

<style scoped lang="scss">
.q-menu-wrapper {
  min-height: 42px;
  @include media('<large') {
    width: 6vw;
    min-height: 0px;
  }
}
.menu-icon {
  display: block;
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 4;
  @include media('<large') {
    position: static;
    top: 2vw;
    left: 5vw;
  }

  .bar1,
  .bar2,
  .bar3 {
    width: 35px;
    height: 3px;
    background-color: rgb(255, 255, 255);
    margin: 8px 0;
    transition: 0.4s;
    @include media('<large') {
      width: 6vw;
      height: 0.5vw;
      margin: 1vw 0;
    }
  }

  &.open {
    position: fixed;
    .bar1 {
      transform: rotate(-45deg) translate(-7px, 3px);
      @include media('<large') {
        transform: rotate(-45deg) translate(-1.2vw, 1.2vw);
      }
    }
    .bar2 {
      opacity: 0;
    }
    .bar3 {
      transform: rotate(45deg) translate(-11px, -11px);
      @include media('<large') {
        transform: rotate(45deg) translate(-1vw, -1vw);
      }
    }
  }
}
.menu-overlay {
  z-index: 3;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(33, 2, 53, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: unset;
  & menu {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 50%;
    margin: 0;
    font-size: 2rem;
    padding-inline-start: 0;
    a {
      color: white;
      text-decoration: none;
      text-align: center;
      &:hover {
        color: white;
        font-weight: bold;
        // text-shadow: 1px 1px 2px white, -1px -1px 2px white;
      }
    }
  }
}
// Animation:
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
