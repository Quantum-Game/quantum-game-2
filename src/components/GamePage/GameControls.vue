<template>
  <div class="controls">
    <!-- SIMULATION CONTROLS -->
    <span class="playback">
      <!-- <button type="button" :style="styles.rewind" @click="$emit('rewind')" /> -->
      <button
        type="button"
        :style="styles.back"
        @click="scrubber.stepBack()"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Simulation: one step back.' })"
      />
      <button
        id="play"
        type="button"
        :style="styles.play"
        @click="scrubber.toggle()"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Run the simulation.' })"
      />
      <button
        type="button"
        :style="styles.forward"
        @click="scrubber.stepForward()"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Simulation: the next step.' })"
      />
      <!-- <button type="button" :style="styles.fastForward" @click="$emit('fast-forward')" /> -->
    </span>
    <!-- FRAME INFO -->
    <span class="frameInfo">
      <span class="gameState">{{ displayStatus }}</span>
    </span>
    <!-- LEVEL CONTROLS -->
    <span class="view-mode">
      <button
        type="button"
        :style="styles.reload"
        @click="$emit('reload')"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Reset the level.' })"
      />
      <button
        type="button"
        :style="styles.sound"
        @click="toggleSound(), showSoundHint()"
        @mouseenter="showSoundHint"
      />
      <button
        type="button"
        :style="styles.download"
        @click="$emit('download')"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Download level as a JSON file.' })"
      />

      <label
        for="fileUpload"
        :style="styles.upload"
        class="upload"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Load level from a JSON file.' })"
      >
      </label>
      <input id="fileUpload" type="file" @change="$emit('upload', $event)" />

      <button
        type="button"
        :style="styles.save"
        @click="$emit('save')"
        @mouseenter="showSaveHint()"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { IStyle } from '@/types'
import { validateInfoPayload } from '@/mixins/gameInterfaces'
import { storeNamespace } from '@/store'
import { computed, defineComponent, PropType, proxyRefs } from 'vue'
import { ScrubberController } from '@/engine/controller'

const user = storeNamespace('user')
const options = storeNamespace('options')

const icons = {
  pause: require(`@/assets/graphics/icons/pause.svg`),
  play: require(`@/assets/graphics/icons/play.svg`),
  reload: require(`@/assets/graphics/icons/reload.svg`),
  rewind: require(`@/assets/graphics/icons/rewind.svg`),
  origStepBack: require(`@/assets/graphics/icons/orig_step_back.svg`),
  origStepForward: require(`@/assets/graphics/icons/orig_step_forward.svg`),
  fastForward: require(`@/assets/graphics/icons/fast_forward.svg`),
  soundOff: require(`@/assets/graphics/icons/sound_off.svg`),
  soundOn: require(`@/assets/graphics/icons/sound_on.svg`),
  download: require(`@/assets/graphics/icons/download.svg`),
  upload: require(`@/assets/graphics/icons/upload.svg`),
  save: require(`@/assets/graphics/icons/save.svg`),
  account: require(`@/assets/graphics/icons/account.svg`),
  accountRegister: require(`@/assets/graphics/icons/account_register.svg`),
  options: require(`@/assets/graphics/icons/options.svg`),
  map: require(`@/assets/graphics/icons/map.svg`),
}

export default defineComponent({
  props: {
    scrubber: { type: Object as PropType<ScrubberController>, required: true },
  },
  emits: {
    hover: validateInfoPayload,
    download: null,
    upload: (_: Event) => true,
    save: null,
    reload: null,
  },
  setup(props, { emit }) {
    const toggleSound = options.useAction('TOGGLE_SOUND')
    const soundActive = options.useGetter('soundActive')
    const isLoggedIn = user.useGetter('isLoggedIn')

    const displayStatus = computed(() => {
      if (props.scrubber.isPlaying) {
        // (each time a random outcome)
        return 'Quantum simulation (live)'
      } else if (props.scrubber.frameIndex > 0) {
        return 'Quantum simulation (step-by-step)'
      } else {
        // (still with polarization & interference)
        return 'Classical laser beam'
      }
    })

    function iconStyle(icon: keyof typeof icons, active: boolean): IStyle {
      return {
        backgroundImage: `url(${icons[icon]})`,
        opacity: `${active ? 1 : 0.16}`,
      }
    }

    const styles = proxyRefs({
      rewind: computed(() =>
        iconStyle('rewind', !props.scrubber.isPlaying && !props.scrubber.isFirstFrame)
      ),
      back: computed(() =>
        iconStyle('origStepBack', !props.scrubber.isPlaying && !props.scrubber.isFirstFrame)
      ),
      play: computed(() => iconStyle(props.scrubber.isPlaying ? 'pause' : 'play', true)),
      forward: computed(() =>
        iconStyle('origStepForward', !props.scrubber.isPlaying && !props.scrubber.isLastFrame)
      ),
      fastForward: computed(() =>
        iconStyle('fastForward', !props.scrubber.isPlaying && !props.scrubber.isLastFrame)
      ),
      reload: computed(() => iconStyle('reload', !props.scrubber.isPlaying)),
      sound: computed(() =>
        iconStyle(soundActive.value ? 'soundOff' : 'soundOn', !props.scrubber.isPlaying)
      ),
      download: computed(() => iconStyle('download', !props.scrubber.isPlaying)),
      upload: computed(() => iconStyle('upload', !props.scrubber.isPlaying)),
      save: computed(() => iconStyle('save', isLoggedIn.value && !props.scrubber.isPlaying)),
    })

    function showSoundHint() {
      emit('hover', {
        kind: 'ui',
        text: `Sound is ${soundActive.value ? 'ON' : 'OFF'}`,
      })
    }

    function showSaveHint() {
      emit('hover', {
        kind: 'ui',
        text: 'Save level to the cloud (you need to be logged in).',
      })
    }

    return {
      styles,
      displayStatus,
      toggleSound,
      showSoundHint,
      showSaveHint,
    }
  },
})
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
  @include media('<large') {
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
  @include media('<large') {
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
  @include media('<large') {
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
    @include media('<large') {
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
