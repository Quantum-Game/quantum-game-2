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
          <router-link to="/" @click.stop.native="closeMenu">BACK TO THE MAIN PAGE</router-link>
          <router-link :to="continueLink" @click.stop.native="handleContinueClick"
            >CONTINUE</router-link
          >
          <router-link to="/levels" @click.stop.native="closeMenu">LEVELS</router-link>
          <router-link to="/login" @click.stop.native="closeMenu">LOGIN</router-link>
          <span>SANDBOX</span>
          <router-link to="/info" @click.stop.native="closeMenu">ENCYCLOPEDIA</router-link>
          <router-link to="/options" @click.stop.native="closeMenu">OPTIONS</router-link>
          <a href="https://medium.com/quantum-photons" target="_blank">BLOG</a>
        </menu>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class AppMenu extends Vue {
  @State('currentLevelID') currentLevelID!: number;
  isMenuOpen: boolean = false;

  created() {
    window.addEventListener('keyup', this.handleEscPress);
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  handleContinueClick(e: MouseEvent) {
    // if we are in the encyclopedia, the continue
    // should take us to the previous played level
    // otherwuise in case we are playing:
    if (this.$route.name === 'level') {
      e.preventDefault();
      this.closeMenu();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleEscPress(e: { which: number }) {
    if (e.which === 27) {
      this.toggleMenu();
    }
  }

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleEscPress);
  }

  get continueLink() {
    return `/level/${this.currentLevelID}`;
  }
}
</script>

<style lang="scss" scoped>
.q-menu-wrapper {
  min-height: 42px;
}
.menu-icon {
  display: block;
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 2;
  @media screen and (max-width: 1000px) {
    position: static;
  }
  &.open {
    position: fixed;
  }
  .bar1,
  .bar2,
  .bar3 {
    width: 35px;
    height: 3px;
    background-color: rgb(255, 255, 255);
    margin: 8px 0;
    transition: 0.4s;
  }

  /* Rotate first bar */
  &.open .bar1 {
    transform: rotate(-45deg) translate(-7px, 3px);
  }

  /* Fade out the second bar */
  &.open .bar2 {
    opacity: 0;
  }

  /* Rotate last bar */
  &.open .bar3 {
    transform: rotate(45deg) translate(-11px, -9px);
  }
}
.menu-overlay {
  z-index: 1;
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
    span {
      text-decoration: line-through;
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
