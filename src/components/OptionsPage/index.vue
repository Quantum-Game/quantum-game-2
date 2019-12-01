<template>
  <app-layout>
    <div slot="main" class="options-wrapper">
      <h2>Options</h2>
      <form>
        <div v-for="option in options" :key="option.name" class="option">
          {{ option.name }}: {{ gameSpeedInterval }}
          <input
            :value="gameSpeedInterval"
            :type="option.type"
            :min="option.min"
            :max="option.max"
            @change="onChange"
          />
        </div>
      </form>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { SET_GAME_SPEED_INTERVAL } from '@/store/mutation-types'
import { AppLayout } from '@/components'

// used to target namespaced vuex module:
const options = namespace('optionsModule')

@Component({
  components: {
    AppLayout
  }
})
export default class OptionsPage extends Vue {
  @options.Mutation(SET_GAME_SPEED_INTERVAL) mutationSetGameSpeedInterval!: (
    newInterval: number
  ) => void

  @options.Getter('gameSpeedInterval') gameSpeedInterval!: number

  options = {
    gameSpeed: {
      type: 'range',
      name: 'Game Speed',
      value: this.gameSpeedInterval,
      min: 100,
      max: 2000
    }
  }

  /**
   * used to update gameSpeedInterval vuex option
   * @returns void
   */
  onChange(e: { target: HTMLInputElement }): void {
    const newInterval: number = parseInt(e.target.value, 10)
    this.mutationSetGameSpeedInterval(newInterval)
  }
}
</script>

<style lang="scss" scoped>
.options-wrapper {
  display: flex;
  flex-direction: column;
  & .option {
    display: flex;
    flex-direction: row;
    align-content: space-between;
    justify-content: space-between;
    width: 100%;
    & input[type='range'] {
      direction: rtl;
    }
  }
  @media screen and (max-width: 1000px) {
    padding: 20px;
  }
}
</style>
