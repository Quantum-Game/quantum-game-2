import { useRoute } from 'vue-router'
import { Synth } from './soundtrack/synth'
import { computed, ref, watchEffect } from 'vue'
import { storeNamespace } from '@/store'
import * as Tone from 'tone'

const options = storeNamespace('options')

// global to avoid multiple tracks running at the same time,
// as there is no way to clean one up now
const synth = ref<Synth>()

function bootstrapSynth() {
  Tone.start().then(() => {
    if (synth.value != null) return
    synth.value = new Synth()
  })
}

window.addEventListener('keydown', handler)
window.addEventListener('pointerdown', handler)

function handler() {
  bootstrapSynth()
  window.removeEventListener('keydown', handler)
  window.removeEventListener('pointerdown', handler)
}

setTimeout(() => {
  Tone.getContext((c: AudioContext) => {
    if (c.state === 'running') handler()
  })
}, 100)

export function useSoundtrack(): void {
  const soundActive = options.useGetter('soundActive')
  const volume = options.useGetter('volume')

  const route = useRoute()

  const effectiveVolume = computed(() => {
    const routeAllowsSound = route.name != null && route.meta.preventSound !== true
    return soundActive.value && routeAllowsSound ? volume.value : 0
  })

  watchEffect(() => {
    const s = synth.value
    if (s == null) return
    const volume = effectiveVolume.value
    s.setAllGenerative(volume !== 0)
    s.setOverallVolume(volume)
  })

  // TODO: uninitialize on unmounted
  // this requires cleanup methods to exist in the synth implementation
}
