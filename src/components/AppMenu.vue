<template>
  <transition name="fade">
    <div v-if="appMenuOpened" class="menu-overlay" flex layout="column">
      <menu layout="column around u1">
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
</template>

<script lang="ts">
import { useWindowEvent } from '@/mixins/event'
import { storeNamespace } from '@/store'
import { defineComponent, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent(() => {
  const user = storeNamespace('user')
  const game = storeNamespace('game')
  const isLoggedIn = user.useGetter('isLoggedIn')
  const currentLevel = game.useState('currentLevelID')
  const appMenuOpened = game.useState('appMenuOpened')
  const SET_MENU_OPENED = game.useMutation('SET_MENU_OPENED')

  useWindowEvent('keydown', (e) => {
    if (e.key === 'Escape') {
      SET_MENU_OPENED(!appMenuOpened.value)
    }
  })

  useRouter().afterEach(() => {
    SET_MENU_OPENED(false)
  })

  let preservedOffset = 0
  watchEffect(() => {
    if (appMenuOpened.value) {
      preservedOffset = window.scrollY
      const scrollbarVisible = document.body.scrollHeight > window.innerHeight
      const overflowY = scrollbarVisible ? 'scroll' : 'auto'
      document.body.setAttribute('style', `top: ${-preservedOffset}px; overflow-y: ${overflowY};`)
      document.body.classList.add('menu-opened')
    } else {
      document.body.classList.remove('menu-opened')
      document.body.setAttribute('style', '')
      window.scrollTo(0, preservedOffset)
    }
  })

  return {
    isLoggedIn,
    currentLevel,
    appMenuOpened,
  }
})
</script>

<style scoped lang="scss">
.menu-overlay {
  z-index: 3;
  position: fixed;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(33, 2, 53, 0.9);
  cursor: unset;
}
menu {
  padding: 25px 0;
  display: flex;
  flex-direction: column;
  min-height: 60%;
  margin: auto;
  font-size: 2rem;
  padding-inline-start: 0;
}

@include media('<large', 'landscape') {
  menu {
    font-size: 1.5rem;
  }
}

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
