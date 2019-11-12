<template>
  <div class="game-layout">
    <!-- games header: menu and level name -->
    <header>
      <div class="left">
        <app-menu />
      </div>
      <div class="middle">
        <slot name="header-middle"></slot>
      </div>
      <div class="right">
        <slot name="header-right"></slot>
      </div>
    </header>

    <!-- games main: goals, board, toolbox and explanations -->
    <main>
      <aside class="left">
        <slot name="main-left"></slot>
      </aside>
      <article class="middle">
        <slot name="main-middle"></slot>
      </article>
      <aside class="right">
        <slot name="main-right"></slot>
      </aside>
    </main>

    <!-- a generic footer for now -->
    <footer>
      <slot name="footer">
        <img src="@/assets/CQT_NUS_Logo_mono.svg" alt="CQT" width="128" />
      </slot>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import AppMenu from '@/components/AppMenu.vue';

@Component({
  components: {
    AppMenu
  }
})
export default class GameLayout extends Vue {}
</script>

<style lang="scss" scoped>
.game-layout {
  width: 1400px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  align-items: center;
}
.middle {
  padding: 20px;
  align-content: center;
  justify-content: center;
  width: 65%;
  box-sizing: border-box;
  @media screen and (max-width: 1000px) {
    width: 100%;
    padding: 0 20px;
  }
}
.left,
.right {
  box-sizing: border-box;
  height: auto;
  width: 16%;
  padding: 20px;
  @media screen and (max-width: 1000px) {
    width: 100%;
    padding: 0 20px;
  }
}

header {
  width: 1400px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: none;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 50px;
      min-height: 41px;
    }
  }
}

main {
  max-width: 1400px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

footer {
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
  opacity: 0.2;
}

main {
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    padding: 0 20px;
  }
}

.placeholder {
  width: 100%;
  height: 200px;
  & h3 {
    margin: 0;
  }
  &.explanation {
    border-top: 1px solid white;
    //background-color: rgba(0, 225, 255, 0.349);
  }
  &.toolbox {
    border-top: 1px solid white;
    //background-color: rgba(255, 187, 0, 0.349);
  }
  &.goals {
    border-top: 1px solid white;
    //background-color: rgba(255, 0, 85, 0.349);
    height: 400px;
  }
  &.controls {
    //background-color: rgba(179, 255, 0, 0.349);
    border-top: 1px solid white;
    height: 100px;
  }
}
</style>
