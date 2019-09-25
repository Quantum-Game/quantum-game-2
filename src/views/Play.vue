<template>
  <div class="play-container">
    <h1>should we play now?</h1>
    <button
      class="button"
      @click="goOn"
    >
      CLICK ME
    </button>
    <board />
    <toolbox
      :toolsets="availableTools"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Board from '@/components/Board.vue';
import Toolbox from '@/components/Toolbox.vue';

@Component({
  components: { Board, Toolbox },
})
export default class Play extends Vue {
  sets = [['A', 1], ['B', 2], ['C', 3]]

  goOn() {
    this.$store.commit('goToLevel', 'next');
  }

  get availableTools() {
    return this.$store.state.currentLevel.availableTools;
  }
}
</script>

<style>
.button {
  display: block;
}
</style>
