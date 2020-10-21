<template>
  <SvgGlobalDefs />
  <router-view />
  <LoginStatus />
</template>

<script lang="ts">
import SvgGlobalDefs from '@/components/SvgGlobalDefs.vue'
import LoginStatus from '@/components/LoginPage/LoginStatus.vue'
import { useSoundtrack } from '@/mixins/soundtrack'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    LoginStatus,
    SvgGlobalDefs,
  },
  setup() {
    useSoundtrack()
  },
})
</script>
<!-- eslint-disable-next-line vue-scoped-css/require-scoped -->
<style lang="scss">
@import '~@/assets/styles/app.scss';

* {
  box-sizing: border-box;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;

  &.menu-opened {
    position: fixed;
    width: 100%;
    height: 100%;
  }
}
#app {
  display: flex;
  justify-content: stretch;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(to right, #210235 16%, #2e006a 30%, #2e006a 70%, #210235 84%);
  position: relative;
}

#app:before {
  content: '';
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.5s ease-in-out;
}

body.flag-dimBackground.mode-experiment #app:before {
  opacity: 0.5;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #796bbc;
    }
  }
}
a {
  color: #837e9b;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.entry {
  & img {
    width: 100%;
  }
}
</style>
