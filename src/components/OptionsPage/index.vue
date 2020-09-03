<template>
  <app-layout>
    <div slot="main" class="options-wrapper" layout="column u4">
      <h2>Options</h2>
      <form layout="column u4">
        <label layout="row u1">
          <span flex>Speed of light: {{ gameSpeedLabel }}</span>
          <input v-model.number="gameSpeed" type="range" min="100" max="2000" class="reverse" />
        </label>
        <label layout="row u1">
          <span flex>Sound volume: {{ volumeLabel }}</span>
          <input v-model.number="volume" type="range" step="0.01" min="0" max="1" />
        </label>
        <label layout="row u1">
          <span flex>Mute all sound</span>
          <input v-model="mute" type="checkbox" />
        </label>
      </form>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { SET_OPTIONS } from '@/store/mutation-types'
import { AppLayout } from '@/components'
import { IOptionsModule } from '@/store/optionsModule'

// used to target namespaced vuex module:
const options = namespace('optionsModule')

@Component({
  components: {
    AppLayout,
  },
})
export default class OptionsPage extends Vue {
  @options.Mutation(SET_OPTIONS) setOptions!: (options: Partial<IOptionsModule>) => void
  @options.Getter('allOptions') allOptions!: IOptionsModule

  get gameSpeed(): number {
    return this.allOptions.gameSpeedInterval
  }

  set gameSpeed(gameSpeedInterval: number) {
    this.setOptions({ gameSpeedInterval })
  }

  get gameSpeedLabel(): string {
    const tilesPerSecond = (1000 / this.gameSpeed).toFixed(1)
    return tilesPerSecond === `1.0` ? '1 tile per second' : `${tilesPerSecond} tiles per second`
  }

  get volume(): number {
    return this.allOptions.volume
  }

  set volume(volume: number) {
    this.setOptions({ volume })
  }

  get volumeLabel(): string {
    return `${(this.volume * 100).toFixed(0)}%`
  }

  get mute(): boolean {
    return this.allOptions.mute
  }

  set mute(mute: boolean) {
    this.setOptions({ mute })
  }
}
</script>

<style lang="scss" scoped>
.options-wrapper {
  margin-top: 30px;
  @media screen and (max-width: 1000px) {
    padding: 20px;
  }
}

form {
  text-align: left;
}

h2 {
  font-size: 1.5rem;
  text-transform: uppercase;
}

input {
  width: 200px;
}

input.reverse {
  direction: rtl;
}
</style>
