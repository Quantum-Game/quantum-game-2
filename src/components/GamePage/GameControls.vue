<template>
  <div class="controls">
    <span class="playback">
      <game-controls-button
        v-for="btn in playBackControls"
        :key="btn"
        :which-is="btn"
        :class="computedClass"
        @click.native="$emit(btn)"
      />
    </span>

    <span>
      <b>STEP {{ frameIndex + 1 }} / {{ totalFrames }} </b>
      <b>({{ gameState }})</b>
    </span>
    <span class="view-mode">
      <game-controls-button
        v-for="btn in viewControls"
        :key="btn"
        :which-is="btn"
        @click.native="$emit(btn)"
      />
    </span>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import GameControlsButton from '@/components/GamePage/GameControlsButton.vue';

@Component({
  components: {
    GameControlsButton
  }
})
export default class GameControls extends Vue {
  @Prop() readonly frameIndex!: number;
  @Prop() readonly totalFrames!: number;
  @State('gameState') gameState!: string;
  // PLAY BUTTON SHOULD CHANGE TO PAUSE WHEN THE PHOTON IS MOVING
  playBackControls = ['step-back', 'play', 'step-forward'];
  // ADD VIEW CONTROLS WHEN MULTIVERSE MODE IS ADDED
  viewControls = [];
}
</script>

<style lang="scss" scoped>
.controls {
  width: 100%;
  //border-top: 1px solid white;
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
  & .view-mode {
    display: flex;
    align-items: center;
    line-height: 20px;
  }
}
</style>
