<template>
  <div class="inter-level-overlay">
    <rock-talk-line
      :graphics="rockTalk.graphics"
      :dialogue="rockTalk.dialogue"
      :link="rockTalk.link"
    />
    <router-link v-if="currentLevelID != '31'" class="button-next" :to="nextLevel">
      <app-button :overlay="true" :inline="false">NEXT LEVEL</app-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { IDialogue } from '@/mixins/dataInterfaces'
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
const customOverlaysList: Record<string, IDialogue> = {
  superposition: {
    graphics: 'rock_happy',
    dialogue: [
      "We didn't split a photon. It is still one photon in many places at the same time.",
      'How is it possible?!',
    ],
    link: 'superposition',
  },
  interference: {
    graphics: 'weasel',
    dialogue: ["It is unexpected, isn't it?"],
    link: 'interference',
  },
  end: {
    graphics: 'pile',
    dialogue: ["That's it for now!", 'Dd you want something more? Check us on Twitter!'],
    link: 'https://twitter.com/quantumgameio',
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
  get rockTalk(): IDialogue {
    if (Object.keys(customOverlaysList).includes(this.overlayId)) {
      return customOverlaysList[this.overlayId]
    }
    return {
      graphics: 'weasel',
      dialogue: ['Rock dialogue not found.'],
      link: '',
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
