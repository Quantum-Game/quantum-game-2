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
        @click="toggleSound(), showSoundHint()"
        @mouseenter="showSoundHint"
      />
      <button
        type="button"
        :style="computeDownloadStyle"
        @click="$emit('download-level')"
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
        @click="handleSave"
        @mouseenter="
          $emit('hover', {
            kind: 'ui',
            particles: [],
            text: 'Save level to the cloud (you need to be logged in).',
          })
        "
      />
    </span>
  </div>
</template>

<script lang="ts">
import { Options, setup, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { IStyle } from '@/types'
import { useRouter } from 'vue-router'
import { validateInfoPayload } from '@/mixins/gameInterfaces'
import { storeNamespace } from '@/store'

const game = storeNamespace('game')
const user = storeNamespace('user')
const options = storeNamespace('options')

@Options({
  emits: {
    hover: validateInfoPayload,
    'loaded-level': null,
    play: null,
    'download-level': null,
  },
})
export default class GameControls extends Vue {
  // FIXME: Can somehow accelerate photon speed by spamming play
  @Prop() readonly frameIndex!: number
  @Prop() readonly totalFrames!: number
  @Prop({ default: '' }) readonly displayStatus!: string
  gameState = setup(() => game.useState('gameState'))
  simulationState = setup(() => game.useState('simulationState'))
  actionSaveLevel = setup(() => user.useAction('SAVE_LEVEL'))
  actionUpdateLevel = setup(() => user.useAction('UPDATE_LEVEL'))
  toggleSound = setup(() => options.useAction('TOGGLE_SOUND'))
  moduleGetterIsLoggedIn = setup(() => user.useGetter('isLoggedIn'))
  soundActive = setup(() => options.useGetter('soundActive'))
  router = setup(useRouter)

  loadJsonLevelFromFile(event: Event): void {
    const reader = new FileReader()
    const target = event.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]

    reader.onload = (): void => {
      if (reader.result !== undefined && reader.result !== null) {
        const result: string = reader.result.toString()
        const iLevel = JSON.parse(result)
        this.$emit('loaded-level', iLevel)
      }
    }
    reader.readAsText(file)
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

  get computeFateStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/reload.svg`)})`,
      opacity: `1`,
    }
  }

  get computeRewindStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/rewind.svg`)})`,
      opacity: `${this.playFlag && this.stepBackFlag ? 1 : 0.16}`,
    }
  }

  get computeBackStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/orig_step_back.svg`)})`,
      opacity: `${this.playFlag && this.stepBackFlag ? 1 : 0.16}`,
    }
  }

  get computePlayStyle(): IStyle {
    if (this.simulationState) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/pause.svg`)})`,
        opacity: `1`,
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/play.svg`)})`,
      opacity: `1`,
    }
  }

  get computeForwardStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/orig_step_forward.svg`)})`,
      opacity: `${this.playFlag && this.stepForwardFlag ? 1 : 0.16}`,
    }
  }

  get computeFastForwardStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/fast_forward.svg`)})`,
      opacity: `${this.playFlag && this.stepForwardFlag ? 1 : 0.16}`,
    }
  }

  get computeReloadStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/reload.svg`)})`,
      opacity: `${this.playFlag ? 1 : 0.16}`,
    }
  }

  get computeSoundStyle(): IStyle {
    if (this.soundActive) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/sound_off.svg`)})`,
        opacity: `${this.playFlag ? 1 : 0.16}`,
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/sound_on.svg`)})`,
      opacity: `${this.playFlag ? 1 : 0.16}`,
    }
  }

  get computeDownloadStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/download.svg`)})`,
      opacity: `${this.playFlag ? 1 : 0.16}`,
    }
  }

  get computeUploadStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/upload.svg`)})`,
      opacity: `${this.playFlag ? 1 : 0.16}`,
    }
  }

  get computeSaveStyle(): IStyle {
    if (this.moduleGetterIsLoggedIn) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/save.svg`)})`,
        opacity: `${this.playFlag ? 1 : 0.16}`,
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/save.svg`)})`,
      opacity: `0.16`,
    }
  }

  get computeAccountStyle(): IStyle {
    if (this.moduleGetterIsLoggedIn) {
      return {
        backgroundImage: `url(${require(`@/assets/graphics/icons/account.svg`)})`,
        opacity: `${this.playFlag ? 1 : 0.16}`,
      }
    }
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/account_register.svg`)})`,
      opacity: `${this.playFlag ? 1 : 0.16}`,
    }
  }

  get computeOptionsStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/options.svg`)})`,
      opacity: `${this.playFlag ? 1 : 0.16}`,
    }
  }

  get computeMapStyle(): IStyle {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/map.svg`)})`,
      opacity: `${this.playFlag ? 1 : 0.16}`,
    }
  }

  handleSave(): void {
    this.$emit('save-level')
  }

  handleAccount(): void {
    if (!this.moduleGetterIsLoggedIn) {
      this.router.push('/login')
    } else {
      this.router.push('/myaccount')
    }
  }

  handleOptions(): void {
    this.router.push('/options')
  }

  handleMap(): void {
    this.router.push('/levels')
  }

  showSoundHint(): void {
    this.$emit('hover', {
      kind: 'ui',
      particles: [],
      text: `Sound is ${this.soundActive ? 'ON' : 'OFF'}`,
    })
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
  font-size: 0.8rem;
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
  @media screen and (max-width: 1000px) {
    display: none;
  }
}
.controls {
  width: 100%;
  display: flex;
  padding-top: 1rem;
  padding-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1000px) {
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
