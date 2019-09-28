<template>
  <div class="play-containter">
    <div class="placeholder">
      <h1>placeholder</h1>
    </div>
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
  get availableTools() {
    return this.$store.state.currentLevel.availableTools;
  }
}
</script>

<style>
.button {
  display: block;
}

.play-containter {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.placeholder {
  height: 860px;
  width: 20%;
  background-color: rgba(162, 0, 255, 0.301)
}
</style>
