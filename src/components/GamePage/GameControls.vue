<template>
  <div class="controls">
    <span class="playback">
      <game-controls-button
        v-for="btn in playBackControls"
        :key="btn"
        :which-is="btn"
        @click.native="$emit(btn)"
      />
    </span>
    <save-level />
    <span>
      <b>STEP {{ frameIndex + 1 }} / {{ totalFrames }} </b>
      <span>({{ gameState }})</span>
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
// FIXME: Way too overcomplicated and hides access to individual customization
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import GameControlsButton from '@/components/GamePage/GameControlsButton.vue';
import SaveLevel from '@/components/SaveLevel.vue';

@Component({
  components: {
    GameControlsButton,
    SaveLevel
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
  border-bottom: 1px solid white;
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1000px) {
    padding-bottom: 0;
    div:nth-child(2),
    button {
      display: none;
    }
  }
  .playback {
    display: flex !important;
    @media screen and (max-width: 1000px) {
      button {
        display: flex;
        width: 4.5vw;
        height: 4.5vw;
      }
    }
  }
  & .view-mode {
    display: flex;
    align-items: center;
    line-height: 20px;
  }
}
</style>
