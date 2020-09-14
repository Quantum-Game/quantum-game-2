import { useRoute } from 'vue-router'
import Soundtrack from '@/mixins/soundtrack'
import { computed, watch, onMounted } from 'vue'
import { storeNamespace } from '@/store'

const options = storeNamespace('options')

// global to avoid multiple tracks running at the same time,
// as there is no way to clean one up now
const soundtrack = new Soundtrack()

export function useSoundtrack(): void {
  const soundActive = options.useGetter('soundActive')
  const volume = options.useGetter('volume')

  const route = useRoute()
  soundtrack.init()

  function onVolumeChange(volume: number) {
    const doPlay = volume !== 0
    soundtrack.setAllGenerative(doPlay)
    soundtrack.setOverallVolume(volume)
  }

  const effectiveVolume = computed(() => {
    const routeAllowsSound = route.name != null && route.meta.preventSound !== true
    return soundActive.value && routeAllowsSound ? volume.value : 0
  })

  watch(effectiveVolume, onVolumeChange)

  onMounted(() => {
    soundtrack.setAndPlay(-10)
    onVolumeChange(effectiveVolume.value)
  })

  // TODO: uninitialize on unmounted
  // this requires cleanup methods to exist in the Soundtrack implementation
}
