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
    <toolbox />
  </div>
</template>

<script>
import Vue from 'vue';
import Board from '@/components/Board.vue';
import Toolbox from '@/components/Toolbox.vue';

export default Vue.extend({
  name: 'Play',
  components: { Board, Toolbox },

  methods: {
    goOn() {
      this.$store.commit('goToLevel', 'next');
    },
  },
});
</script>

<style>
.button {
  display: block;
}
</style>
