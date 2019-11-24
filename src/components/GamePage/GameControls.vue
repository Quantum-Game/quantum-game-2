<template>
  <div class="controls">
    <!-- SIMULATION CONTROLS -->
    <span class="playback">
      <button type="button" :style="computeRewindStyle" @click="$emit('rewind')" />
      <button type="button" :style="computeBackStyle" @click="$emit('step-back')" />
      <button type="button" :style="computePlayStyle" @click="$emit('play')" />
      <button type="button" :style="computeForwardStyle" @click="$emit('step-forward')" />
      <button type="button" :style="computeFastForwardStyle" @click="$emit('fast-forward')" />
    </span>
    <!-- FRAME INFO -->
    <span class="frameInfo">
      <b>STEP {{ frameIndex + 1 }} / {{ totalFrames }}</b>
      <span class="gameState">({{ gameState }})</span>
    </span>
    <!-- LEVEL CONTROLS -->
    <span class="view-mode">
      <button type="button" :style="computeReloadStyle" @click="$emit('reload')" />
      <button type="button" :style="computeSoundStyle" @click="toggleSound" />
      <button type="button" :style="computeDownloadStyle" @click="$emit('downloadLevel')" />
      <button type="button" :style="computeSaveStyle" @click="handleSave()" />
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import { GameStateEnum } from '@/engine/interfaces';
import $userStore from '@/store/userStore';

@Component
export default class GameControls extends Vue {
  // FIXME: Can somehow accelerate photon speed by spamming play
  @Prop() readonly frameIndex!: number;
  @Prop() readonly totalFrames!: number;
  @State('gameState') gameState!: GameStateEnum;
  @State('simulationState') simulationState!: boolean;
  scaleControls = 0.8;
  soundFlag = true;

  toggleSound(): void {
    this.soundFlag = !this.soundFlag;
  }

  get playFlag(): boolean {
    return !this.simulationState;
  }

  get stepForwardFlag(): boolean {
    return this.frameIndex + 1 !== this.totalFrames;
  }

  get stepBackFlag(): boolean {
    return this.frameIndex > 0;
  }

  get computeRewindStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/rewind.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepBackFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get computeBackStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/skip_back.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepBackFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get computePlayStyle(): {} {
    if (this.simulationState) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/b-buttons/pause.svg`)})`, //eslint-disable-line
        opacity: 1
      };
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/play.svg`)})`, //eslint-disable-line
      opacity: 1
    };
  }

  get computeForwardStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/skip_forward.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepForwardFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get computeFastForwardStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/fast_forward.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepForwardFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get computeReloadStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/reload.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get computeDownloadStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/download.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get computeSaveStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/save.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get computeSoundStyle(): {} {
    if (this.soundFlag) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/b-buttons/sound_off.svg`)})`, //eslint-disable-line
        opacity: this.playFlag ? 1 : 0.3,
        transform: `scale(${this.scaleControls})`
      };
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/b-buttons/sound_on.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3,
      transform: `scale(${this.scaleControls})`
    };
  }

  get isLoggedIn() {
    return $userStore.getters.isLoggedIn;
  }

  saveLevel() {
    $userStore.dispatch('SAVE_LEVEL', this.$store.state);
  }
  updateLevel() {
    $userStore.dispatch('UPDATE_LEVEL', this.$store.state);
  }

  handleSave() {
    if (!this.$route.meta.levelSaved) {
      this.saveLevel();
    } else {
      this.updateLevel();
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  height: 30px;
  width: 30px;
  margin: 0.2rem 0.4rem;
  background-color: transparent;
  border: none;
}
.gameState {
  font-size: 12px;
  padding-left: 10px;
}
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
