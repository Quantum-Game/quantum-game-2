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
  background: #2e006a; /* Old browsers */
  //TO DO - change first two gradients
  background: -moz-linear-gradient(
    right,
    #210235 16%,
    #2e006a 30%,
    #2e006a 70%,
    #210235 84%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    to right,
    #210235 16%,
    #2e006a 30%,
    #2e006a 70%,
    #210235 84%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to right,
    #210235 16%,
    #2e006a 30%,
    #2e006a 70%,
    #210235 84%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#5000a0', endColorstr='#3c1156',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
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
