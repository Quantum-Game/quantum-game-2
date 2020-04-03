<template>
  <div class="controls">
    <!-- SIMULATION CONTROLS -->
    <span class="playback">
      <!-- <button type="button" :style="computeRewindStyle" @click="$emit('rewind')" /> -->
      <button
        type="button"
        :style="computeBackStyle"
        @click="$emit('step-back')"
        @mouseenter="
          $emit('hover', { kind: 'ui', particles: [], text: 'Simulation: one step back.' })
        "
      />
      <button
        id="play"
        type="button"
        :style="computePlayStyle"
        @click="$emit('play')"
        @mouseenter="$emit('hover', { kind: 'ui', particles: [], text: 'Run the simulation.' })"
      />
      <button
        type="button"
        :style="computeForwardStyle"
        @click="$emit('step-forward')"
        @mouseenter="
          $emit('hover', { kind: 'ui', particles: [], text: 'Simulation: the next step.' })
        "
      />
      <!-- <button type="button" :style="computeFastForwardStyle" @click="$emit('fast-forward')" /> -->
    </span>
    <!-- FRAME INFO -->
    <span class="frameInfo">
      <span class="gameState">{{ displayStatus }}</span>
    </span>
    <!-- LEVEL CONTROLS -->
    <span class="view-mode">
      <button
        type="button"
        :style="computeReloadStyle"
        @click="$emit('reload')"
        @mouseenter="$emit('hover', { kind: 'ui', particles: [], text: 'Reset the level.' })"
      />
      <button
        type="button"
        :style="computeSoundStyle"
        @click="toggleSound"
        @mouseenter="
          $emit('hover', {
            kind: 'ui',
            particles: [],
            text: `Sound is ${soundFlag ? 'ON' : 'OFF'}`
          })
        "
      />
      <button
        type="button"
        :style="computeDownloadStyle"
        @click="$emit('downloadLevel')"
        @mouseenter="
          $emit('hover', { kind: 'ui', particles: [], text: 'Download level as a JSON file.' })
        "
      />

      <label
        for="fileUpload"
        :style="computeUploadStyle"
        class="upload"
        @mouseenter="
          $emit('hover', { kind: 'ui', particles: [], text: 'Load level from a JSON file.' })
        "
      >
      </label>
      <input id="fileUpload" type="file" @change="loadJsonLevelFromFile" />

      <button
        type="button"
        :style="computeSaveStyle"
        @click="handleSave()"
        @mouseenter="
          $emit('hover', {
            kind: 'ui',
            particles: [],
            text: 'Save level to the cloud (you need to be logged in).'
          })
        "
      />
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { GameStateEnum } from '@/engine/interfaces'
import $userStore from '@/store/userStore'
import Soundtract from '@/mixins/soundtrack'

@Component
export default class GameControls extends Vue {
  // FIXME: Can somehow accelerate photon speed by spamming play
  @Prop() readonly frameIndex!: number
  @Prop() readonly totalFrames!: number
  @Prop({ default: '' }) readonly displayStatus!: string
  @State('gameState') gameState!: GameStateEnum
  @State('simulationState') simulationState!: boolean
  soundFlag = false
  soundtract?: Soundtract
  volume = -10

  loadJsonLevelFromFile(event: Event): void {
    const reader = new FileReader()
    const target = event.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]

    reader.onload = (): void => {
      if (reader.result !== undefined && reader.result !== null) {
        const result: string = reader.result.toString()
        const iLevel = JSON.parse(result)
        this.$emit('loadedLevel', iLevel)
      }
    }
    reader.readAsText(file)
  }

  toggleSound(): void {
    this.soundFlag = !this.soundFlag
    if (this.soundtract === undefined) {
      this.soundtract = new Soundtract()
      this.soundtract.setAndPlay(this.volume)
    }
    this.soundtract.setAllGenerative(this.soundFlag)
  }

  created(): void {
    window.setTimeout(() => this.toggleSound(), 1000)
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

  get computeFateStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/reload.svg`)})`,
      opacity: 1
    }
  }

  get computeRewindStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/rewind.svg`)})`,
      opacity: this.playFlag && this.stepBackFlag ? 1 : 0.3
    }
  }

  get computeBackStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/orig_step_back.svg`)})`,
      opacity: this.playFlag && this.stepBackFlag ? 1 : 0.3
    }
  }

  get computePlayStyle(): {} {
    if (this.simulationState) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/pause.svg`)})`,
        opacity: 1
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/play.svg`)})`,
      opacity: 1
    }
  }

  get computeForwardStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/orig_step_forward.svg`)})`,
      opacity: this.playFlag && this.stepForwardFlag ? 1 : 0.3
    }
  }

  get computeFastForwardStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/fast_forward.svg`)})`,
      opacity: this.playFlag && this.stepForwardFlag ? 1 : 0.3
    }
  }

  get computeReloadStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/reload.svg`)})`,
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeSoundStyle(): {} {
    if (this.soundFlag) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/sound_off.svg`)})`,
        opacity: this.playFlag ? 1 : 0.3
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/sound_on.svg`)})`,
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeDownloadStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/download.svg`)})`,
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeUploadStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/upload.svg`)})`,
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeSaveStyle(): {} {
    if (this.isLoggedIn) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/save.svg`)})`,
        opacity: this.playFlag ? 1 : 0.3
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/save.svg`)})`,
      opacity: 0.3
    }
  }

  get computeAccountStyle(): {} {
    if (this.isLoggedIn) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/account.svg`)})`,
        opacity: this.playFlag ? 1 : 0.3
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/account_register.svg`)})`,
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeOptionsStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/options.svg`)})`,
      opacity: this.playFlag ? 1 : 0.3
    }
  }

  get computeMapStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/map.svg`)})`,
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
  cursor: pointer;
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
  font-size: 1rem;
  padding-left: 10px;
  text-transform: uppercase;
}

input[type='file'] {
  display: none;
}
.upload {
  height: 20px;
  width: 20px;
  margin: 0.2rem 0.4rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
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
