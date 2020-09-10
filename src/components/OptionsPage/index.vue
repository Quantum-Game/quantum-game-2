<template>
  <app-layout>
    <template #main>
      <div class="options-wrapper" layout="column u4">
        <h2>{{ i18n.t('options.header') }}</h2>
        <form layout="column u4">
          <label layout="row u1">
            <span flex>
              {{ i18n.t('language') }}
            </span>
            <select v-model="i18n.locale">
              <option v-for="locale in i18n.availableLocales" :key="locale" :value="locale">
                {{ i18n.t('lang_name', {}, { locale }) }}
              </option>
            </select>
          </label>
          <label layout="row u1">
            <span flex>
              {{ i18n.t('options.game_speed') }}:
              {{
                i18n.t('options.tiles_per_second', tilesPerSecond, { n: i18n.n(tilesPerSecond) })
              }}
            </span>
            <input v-model.number="gameSpeed" type="range" min="100" max="2000" class="reverse" />
          </label>
          <label layout="row u1">
            <span flex>{{ i18n.t('options.volume') }}: {{ i18n.n(volume * 100) }}%</span>
            <input v-model.number="volume" type="range" step="0.01" min="0" max="1" />
          </label>
          <label layout="row u1">
            <span flex>{{ i18n.t('options.mute_all_sound') }}</span>
            <input v-model="mute" type="checkbox" />
          </label>
        </form>
      </div>
    </template>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import { AppLayout } from '@/components'
import { useI18n } from 'vue-i18n'
import { storeNamespace } from '@/store'

const options = storeNamespace('options')

@Options({
  components: {
    AppLayout,
  },
})
export default class OptionsPage extends Vue {
  setOptions = setup(() => options.useMutation('SET_OPTIONS'))
  allOptions = setup(() => options.useGetter('allOptions'))
  i18n = setup(useI18n)

  get gameSpeed(): number {
    return this.allOptions.gameSpeedInterval
  }

  set gameSpeed(gameSpeedInterval: number) {
    this.setOptions({ gameSpeedInterval })
  }

  get tilesPerSecond(): number {
    return +(1000 / this.gameSpeed).toFixed(1)
  }

  get volume(): number {
    return this.allOptions.volume
  }

  set volume(volume: number) {
    this.setOptions({ volume })
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

input,
option {
  width: 200px;
}

input.reverse {
  direction: rtl;
}
</style>
