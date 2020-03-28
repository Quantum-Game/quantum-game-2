<template>
  <div class="inter-level-overlay">
    <h1 class="title">{{ title }}</h1>
    <component :is="customContent" v-if="customContent" />
    <rock-talk v-if="rt" :dialogue="rt.dialogue" :type="rt.type" />
    <router-link :to="nextLevel">
      <app-button :overlay="true" :inline="false">NEXT LEVEL</app-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { VueConstructor } from 'vue/types/vue'
import { State } from 'vuex-class'
import RockTalk from '@/components/RockTalkPage/RockTalk.vue'
import { getRockTalkById, IRockTalk } from '@/assets/data/rock_talk/index.ts'
import customOverlayExample from '@/components/RockTalkPage/CustomOverlayExample.vue'
import AppButton from '@/components/AppButton.vue'

type overlayListType = {
  [key: string]: VueConstructor<Vue>
}

/**
 * This is the mapping of overlay route id params
 * to actual vue components to be conditionally rendered.
 * NOTE! Adding a component here will make it accessible
 * through URL, but to incorporate it into the game flow
 * the assets/data/rock_talk's postLevelOverlayMapping
 * must be altered as well.
 */
const customOverlaysList: overlayListType = {
  custom: customOverlayExample
}

@Component({
  components: {
    RockTalk,
    AppButton
  }
})
export default class InterLevelOverlay extends Vue {
  @State('currentLevelID') currentLevelID!: number
  rt: IRockTalk | null = null
  customContent: VueConstructor<Vue> | null = null
  title = ''

  /**
   * Once created, find out what kind of content is required:
   */
  created(): void {
    this.assessContentType()
  }

  /**
   * We want to find out what should be the main element of the overlay:
   * A) a custom template (here exemplified by customOverlayExample)? or
   * B) the rocks talking or perhaps
   * C) user got here by accident?
   */
  assessContentType(): void {
    // A) if it's a custom overlay, display the corresponding component:
    if (Object.keys(customOverlaysList).includes(this.overlayId)) {
      this.customContent = customOverlaysList[this.overlayId]
      // B) else, default to talking rocks and get the dialogue data
    } else {
      this.rt = getRockTalkById(this.overlayId)
      // C) if the overlay ID was not listed as custom, nor was
      // there a corresponding rocktalk entry, navigate to 404
      if (!this.rt) {
        console.error(`No data found for rocks/${this.overlayId}`)
        this.$router.push({ name: '404' })
      }
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

<style lang="scss">
.inter-level-overlay {
  height: 40vh;
  width: 40vw;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
