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
import { AppLayout } from '@/components'
import { useI18n } from 'vue-i18n'
import { storeNamespace } from '@/store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppLayout,
  },
  setup() {
    const options = storeNamespace('options')
    const setOptions = options.useMutation('SET_OPTIONS')
    const allOptions = options.useGetter('allOptions')

    const gameSpeed = computed({
      get() {
        return allOptions.value.gameSpeedInterval
      },
      set(gameSpeedInterval: number) {
        setOptions({ gameSpeedInterval })
      },
    })

    const volume = computed({
      get() {
        return allOptions.value.volume
      },
      set(volume: number) {
        setOptions({ volume })
      },
    })

    const mute = computed({
      get() {
        return allOptions.value.mute
      },
      set(mute: boolean) {
        setOptions({ mute })
      },
    })

    const tilesPerSecond = computed((): number => {
      return +(1000 / gameSpeed.value).toFixed(1)
    })

    return {
      i18n: useI18n(),
      gameSpeed,
      volume,
      mute,
      tilesPerSecond,
    }
  },
})
</script>

<style lang="scss" scoped>
.options-wrapper {
  margin-top: 30px;
  @include media('<large') {
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
