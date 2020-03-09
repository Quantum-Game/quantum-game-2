<template>
  <div class="simulationControls">
    <!-- SIMULATION CONTROLS -->
    <span class="buttons">
      <button type="button" :style="computeRewindStyle" @click="$emit('rewind')" />
      <button type="button" :style="computeBackStyle" @click="$emit('step-back')" />
      <button id="play" type="button" :style="computePlayStyle" @click="$emit('play')" />
      <button type="button" :style="computeForwardStyle" @click="$emit('step-forward')" />
      <button type="button" :style="computeFastForwardStyle" @click="$emit('fast-forward')" />
      <!-- <button type="button" :style="computeFateStyle" @click="$emit('new-fate')" /> -->
    </span>

    <!-- FRAME INFO -->
    <span class="frameInfo">
      <b>STEP {{ frameIndex + 1 }} / {{ totalFrames }}</b>
    </span>

    <!-- GAME STATE -->
    <span class="gameState">({{ gameState }})</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { GameStateEnum } from '@/engine/interfaces'

@Component
export default class GameControls extends Vue {
  @Prop() readonly frameIndex!: number
  @Prop() readonly totalFrames!: number
  @State('gameState') gameState!: GameStateEnum
  @State('simulationState') simulationState!: boolean

  get stepForwardFlag(): boolean {
    return this.frameIndex + 1 !== this.totalFrames
  }

  get playFlag(): boolean {
    return !this.simulationState
  }

  get stepBackFlag(): boolean {
    return this.frameIndex > 0
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

  get computeFateStyle(): {} {
    return {
      backgroundImage: `url(${require(`@/assets/graphics/icons/reload.svg`)})`,
      opacity: 1
    }
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
  &:hover {
    -webkit-transform-origin: center center;
    -ms-transform-origin: center center;
    transform-origin: center center;
    -webkit-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
    opacity: 0.5;
  }
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

.simulationControls {
  width: 100%;
  display: flex;
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
}
</style>
