<template>
  <div class="sound-controller" />
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Soundtract from '@/mixins/soundtrack'
const options = namespace('optionsModule')

@Component
export default class SoundController extends Vue {
  @options.Getter('soundActive') soundActive!: boolean
  @options.Getter('volume') volume!: number

  soundtract = new Soundtract()

  created(): void {
    this.soundtract.setAndPlay(-10)
    this.onVolumeChange(this.effectiveVolume)
  }

  get effectiveVolume(): number {
    const routeAllowsSound = this.$route.name != null && this.$route.meta.preventSound !== true
    return this.soundActive && routeAllowsSound ? this.volume : 0
  }

  @Watch('effectiveVolume')
  onVolumeChange(volume: number): void {
    const doPlay = volume !== 0
    this.soundtract.setAllGenerative(doPlay)
    this.soundtract.setOverallVolume(volume)
  }
}
</script>
