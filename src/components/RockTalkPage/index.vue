<template>
  <div class="inter-level-overlay">
    <rock-talk-line :dialogue="rockTalk.dialogue" :graphics="rockTalk.graphics" />
    <router-link v-if="currentLevelID != '31'" class="button-next" :to="nextLevel">
      <app-button :overlay="true" :inline="false">NEXT LEVEL</app-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import RockTalkLine from '@/components/RockTalkPage/RockTalkLine.vue'
import AppButton from '@/components/AppButton.vue'

/**
 * This is the mapping of overlay route id params
 * to actual vue components to be conditionally rendered.
 * NOTE! Adding a component here will make it accessible
 * through URL, but to incorporate it into the game flow
 * the RTClient's postLevelOverlayMapping must
 * be altered as well.
 */
const customOverlaysList: Record<string, { dialogue: string; graphics: string }> = {
  superposition: {
    graphics: 'rock_happy',
    dialogue:
      'We didn\'t split a photon. It is still one photon in many places at the same time. How is it possible?! Read more about <a href="https://quantumgame.io/info/superposition">SUPERPOSITION</a> in the game encyclopedia.',
  },
  interference: {
    graphics: 'weasel',
    dialogue:
      'Crazy, isn\'t it? Learn more about <a href="https://quantumgame.io/info/interference">INTERFERENCE</a> from the game encyclopedia.',
  },
  end: {
    graphics: 'pile',
    dialogue:
      '<p>That\'s it for now!</p><p>Write to us on <a href="https://twitter.com/quantumgameio">Twitter</a>.</p>',
  },
}

@Component({
  components: {
    RockTalkLine,
    AppButton,
  },
})
export default class InterLevelOverlay extends Vue {
  @State('currentLevelID') currentLevelID!: number

  /**
   * Once created, find out what kind of content is required:
   */
  get rockTalk(): { dialogue: string; graphics: string } {
    if (Object.keys(customOverlaysList).includes(this.overlayId)) {
      return customOverlaysList[this.overlayId]
    }
    return {
      graphics: 'weasel',
      dialogue: 'Rock dialogue not found.',
    }
  }

  /**
   * @returns an overlay ID string
   */
  get overlayId(): string {
    return this.$route.params.id
  }

  /**
   * Used to traverse to the next level
   * @returns a router link :to string parameter
   */
  get nextLevel(): string {
    return `/level/${this.currentLevelID + 1}`
  }
}
</script>

<style lang="scss" scoped>
.inter-level-overlay {
  width: 40vw;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-next {
  margin: 10px;
}
</style>
