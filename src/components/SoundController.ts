import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Soundtrack from '@/mixins/soundtrack'
import { computed, watch, onMounted } from 'vue'

export function useSoundtrack(): void {
  const store = useStore()
  const route = useRoute()
  const soundtrack = new Soundtrack()
  soundtrack.init()

  function onVolumeChange(volume: number) {
    const doPlay = volume !== 0
    soundtrack.setAllGenerative(doPlay)
    soundtrack.setOverallVolume(volume)
  }

  const effectiveVolume = computed(() => {
    const soundActive = store.getters['optionsModule/soundActive'] as boolean
    const volume = store.getters['optionsModule/volume'] as number

    const routeAllowsSound = route.name != null && route.meta.preventSound !== true
    return soundActive && routeAllowsSound ? volume : 0
  })

  watch(effectiveVolume, onVolumeChange)

  onMounted(() => {
    soundtrack.setAndPlay(-10)
    onVolumeChange(effectiveVolume.value)
  })

  // TODO: uninitialize on unmounted
  // this requires cleanup methods to exist in the Soundtrack implementation
}
