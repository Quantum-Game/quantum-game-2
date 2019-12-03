<template>
  <div class="controls">
    <!-- SIMULATION CONTROLS -->
    <span class="playback">
      <!-- <button type="button" :style="computeRewindStyle" @click="$emit('rewind')" /> -->
      <button type="button" :style="computeBackStyle" @click="$emit('step-back')" />
      <button id="play" type="button" :style="computePlayStyle" @click="$emit('play')" />
      <button type="button" :style="computeForwardStyle" @click="$emit('step-forward')" />
      <!-- <button type="button" :style="computeFastForwardStyle" @click="$emit('fast-forward')" /> -->
    </span>
    <!-- FRAME INFO -->
    <!-- <span class="frameInfo">
      <b>STEP {{ frameIndex + 1 }} / {{ totalFrames }}</b>
      <span class="gameState">({{ gameState }})</span>
    </span> -->
    <!-- LEVEL CONTROLS -->
    <span class="view-mode">
      <!-- <button type="button" :style="computeReloadStyle" @click="$emit('reload')" /> -->
      <!-- <button type="button" :style="computeOptionsStyle" @click="handleOptions()" /> -->
      <button type="button" :style="computeSoundStyle" @click="toggleSound" />
      <button type="button" :style="computeDownloadStyle" @click="$emit('downloadLevel')" />
      <button type="button" :style="computeSaveStyle" @click="handleSave()" />
      <!-- <button type="button" :style="computeMapStyle" @click="handleMap()" /> -->
      <!-- <button type="button" :style="computeAccountStyle" @click="handleAccount()" /> -->
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { GameStateEnum } from '@/engine/interfaces'
import $userStore from '@/store/userStore'

@Component
export default class GameControls extends Vue {
  // FIXME: Can somehow accelerate photon speed by spamming play
  @Prop() readonly frameIndex!: number
  @Prop() readonly totalFrames!: number
  @State('gameState') gameState!: GameStateEnum
  @State('simulationState') simulationState!: boolean
  soundFlag = true

  toggleSound(): void {
    this.soundFlag = !this.soundFlag
  }

  get playFlag(): boolean {
    return !this.simulationState
  }

  get stepForwardFlag(): boolean {
    return this.frameIndex + 1 !== this.totalFrames
  }

  get stepBackFlag(): boolean {
    return this.frameIndex > 0
  }

  get computeRewindStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/rewind.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepBackFlag ? 1 : 0.3
    }
  }

  get computeBackStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/orig_step_back.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepBackFlag ? 1 : 0.3
    }
  }

  get computePlayStyle(): {} {
    if (this.simulationState) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/pause.svg`)})`, //eslint-disable-line
        opacity: 1
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/play.svg`)})`, //eslint-disable-line
      opacity: 1
    }
  }

  get computeForwardStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/orig_step_forward.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepForwardFlag ? 1 : 0.3
    }
  }

  get computeFastForwardStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/fast_forward.svg`)})`, //eslint-disable-line
      opacity: this.playFlag && this.stepForwardFlag ? 1 : 0.3
    }
  }

  get computeReloadStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/reload.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeSoundStyle(): {} {
    if (this.soundFlag) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/sound_off.svg`)})`, //eslint-disable-line
        opacity: this.playFlag ? 1 : 0.3
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/sound_on.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeDownloadStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/download.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeSaveStyle(): {} {
    if (this.isLoggedIn) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/save.svg`)})`, //eslint-disable-line
        opacity: this.playFlag ? 1 : 0.3
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/save.svg`)})`, //eslint-disable-line
      opacity: 0.3
    }
  }

  get computeAccountStyle(): {} {
    if (this.isLoggedIn) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/account.svg`)})`, //eslint-disable-line
        opacity: this.playFlag ? 1 : 0.3
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/account_register.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeOptionsStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/options.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeMapStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/map.svg`)})`, //eslint-disable-line
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get isLoggedIn(): boolean {
    return $userStore.getters.isLoggedIn
  }

  saveLevel(): void {
    $userStore.dispatch('SAVE_LEVEL', this.$store.state)
  }

  updateLevel(): void {
    $userStore.dispatch('UPDATE_LEVEL', this.$store.state)
  }

  handleSave(): void {
    if (!this.$route.meta.levelSaved) {
      this.saveLevel()
    } else {
      this.updateLevel()
    }
  }

  handleAccount(): void {
    if (!this.isLoggedIn) {
      this.$router.push('/login')
    } else {
      this.$router.push('/myaccount')
    }
  }

  handleOptions(): void {
    this.$router.push('/options')
  }

  handleMap(): void {
    this.$router.push('/levels')
  }
}
</script>

<style lang="scss" scoped>
button {
  height: 20px;
  width: 20px;
  margin: 0.2rem 0.4rem;
  background-color: transparent;
  border: none;
  transition: all 0.2s ease-in-out;
}
#play {
  height: 30px;
  width: 30px;
  margin: 0 0.2rem;
  @media screen and (max-width: 1000px) {
    width: 4.5vw;
    height: 4.5vw;
    margin: 0.2rem 0.4rem;
  }
}
.gameState {
  font-size: 0.75rem;
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
    button {
      display: none;
    }
    .frameInfo {
      display: none;
      display: flex;
      flex-direction: column;
    }
  }
  .playback {
    display: flex !important;
    @media screen and (max-width: 1000px) {
      button {
        background-repeat: no-repeat;
        background-size: contain;
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
