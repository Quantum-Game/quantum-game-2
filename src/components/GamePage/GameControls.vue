<template>
  <div class="controls" layout="row">
    <!-- SIMULATION CONTROLS -->
    <span class="playback" layout="row">
      <!-- <button type="button" :class="classes.rewind" @click="$emit('rewind')" /> -->
      <button
        type="button"
        :class="classes.back"
        @click="playhead.stepBack()"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Simulation: one step back.' })"
      />
      <button
        class="play"
        type="button"
        :class="classes.play"
        @click="playhead.toggle()"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Run the simulation.' })"
      />
      <button
        type="button"
        :class="classes.forward"
        @click="playhead.stepForward()"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Simulation: the next step.' })"
      />
      <!-- <button type="button" :class="classes.fastForward" @click="$emit('fast-forward')" /> -->
    </span>
    <!-- FRAME INFO -->
    <span class="frameInfo" layout="column u2 center" flex>
      <div layout="row u2">
        <button :class="classes.laser" @click="playhead.rewind()" />
        <button :class="classes.wave" @click="playhead.play()" />
        <button
          :class="{ ...classes.experiment, blink: !classes.experiment.active && promptExperiment }"
          @click="$emit('run-experiment')"
        />
      </div>
      <span class="gameState">{{ displayStatus }}</span>
    </span>
    <!-- LEVEL CONTROLS -->
    <span class="view-mode">
      <button
        type="button"
        :class="classes.reload"
        @click="$emit('reload')"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Reset the level.' })"
      />
      <button
        type="button"
        :class="classes.sound"
        @click="toggleSound(), showSoundHint()"
        @mouseenter="showSoundHint"
      />
      <button
        type="button"
        :class="classes.download"
        @click="$emit('download')"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Download level as a JSON file.' })"
      />

      <label
        for="fileUpload"
        :class="classes.upload"
        class="upload"
        @mouseenter="$emit('hover', { kind: 'ui', text: 'Load level from a JSON file.' })"
      >
      </label>
      <input id="fileUpload" type="file" @change="$emit('upload', $event)" />

      <button
        type="button"
        :class="classes.save"
        @click="$emit('save')"
        @mouseenter="showSaveHint()"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { validateInfoPayload } from '@/mixins/gameInterfaces'
import { storeNamespace } from '@/store'
import { computed, defineComponent, PropType, proxyRefs } from 'vue'
import { PlayheadController, SimulationVisType } from '@/engine/controller'

const user = storeNamespace('user')
const options = storeNamespace('options')

export default defineComponent({
  props: {
    playhead: { type: Object as PropType<PlayheadController>, required: true },
    promptExperiment: { type: Boolean, default: false },
    visType: { type: Number as PropType<SimulationVisType>, required: true },
  },
  emits: {
    hover: validateInfoPayload,
    download: null,
    upload: (_: Event) => true,
    save: null,
    reload: null,
    'run-experiment': null,
  },
  setup(props, { emit }) {
    const toggleSound = options.useAction('TOGGLE_SOUND')
    const soundActive = options.useGetter('soundActive')
    const isLoggedIn = user.useGetter('isLoggedIn')

    const displayStatus = computed(() => {
      switch (props.visType) {
        case SimulationVisType.Laser:
          return 'Classical laser beam'
        case SimulationVisType.QuantumWave:
          return 'Quantum simulation'
        case SimulationVisType.Experiment:
          return 'Running experiment'
      }
    })

    function iconClass(icon: string, active: boolean): Record<string, boolean> {
      return {
        [`i-${icon}`]: true,
        active,
      }
    }

    const classes = proxyRefs({
      rewind: computed(() =>
        iconClass('rewind', !props.playhead.isPlaying && !props.playhead.isFirstFrame)
      ),
      back: computed(() =>
        iconClass('origStepBack', !props.playhead.isPlaying && !props.playhead.isFirstFrame)
      ),
      play: computed(() => iconClass(props.playhead.isPlaying ? 'pause' : 'play', true)),
      forward: computed(() =>
        iconClass('origStepForward', !props.playhead.isPlaying && !props.playhead.isLastFrame)
      ),
      fastForward: computed(() =>
        iconClass('fastForward', !props.playhead.isPlaying && !props.playhead.isLastFrame)
      ),
      reload: computed(() => iconClass('reload', !props.playhead.isPlaying)),
      sound: computed(() =>
        iconClass(soundActive.value ? 'soundOff' : 'soundOn', !props.playhead.isPlaying)
      ),
      download: computed(() => iconClass('download', !props.playhead.isPlaying)),
      upload: computed(() => iconClass('upload', !props.playhead.isPlaying)),
      save: computed(() => iconClass('save', isLoggedIn.value && !props.playhead.isPlaying)),
      wave: computed(() => iconClass('wave', props.visType === SimulationVisType.QuantumWave)),
      laser: computed(() => iconClass('laser', props.visType === SimulationVisType.Laser)),
      experiment: computed(() =>
        iconClass('experiment', props.visType === SimulationVisType.Experiment)
      ),
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
      classes,
      displayStatus,
      toggleSound,
      showSoundHint,
      showSaveHint,
    }
  },
})
</script>

<style lang="scss" scoped>
@mixin define-icon($class, $filename) {
  .i-#{$class} {
    background-image: url(~@/assets/graphics/icons/#{$filename}.svg);
  }
}

@include define-icon(pause, pause);
@include define-icon(play, play);
@include define-icon(reload, reload);
@include define-icon(rewind, rewind);
@include define-icon(origStepBack, orig_step_back);
@include define-icon(origStepForward, orig_step_forward);
@include define-icon(fastForward, fast_forward);
@include define-icon(soundOff, sound_off);
@include define-icon(soundOn, sound_on);
@include define-icon(download, download);
@include define-icon(upload, upload);
@include define-icon(save, save);
@include define-icon(account, account);
@include define-icon(accountRegister, account_register);
@include define-icon(options, options);
@include define-icon(map, map);
@include define-icon(wave, icon_wave);
@include define-icon(laser, icon_laser);
@include define-icon(experiment, icon_experiment);

button,
label {
  cursor: pointer;
  height: 20px;
  width: 20px;
  margin: 0.2rem 0.4rem;
  background-size: cover;
  background-color: transparent;
  border: none;
  transition: all 0.2s ease-out;
  opacity: 0.16;

  &.active {
    opacity: 1;
  }
}

.frameInfo button {
  width: 49px;
  height: 29px;
  background-color: mix($fuchsia, black);
  border-radius: 2px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
  transition: all 0.1s ease-out;
  opacity: 0.5;

  &:hover {
    background-color: mix($orange, black);
  }

  &.blink {
    opacity: 0.75;
    animation: button-blink 0.5s ease-in-out alternate infinite;
  }

  &.active {
    opacity: 1;
    background-color: $fuchsia;
  }
}

@keyframes button-blink {
  30% {
    background-color: mix($fuchsia, black);
  }
  100% {
    background-color: mix($orange, black, 80%);
  }
}

.play {
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
