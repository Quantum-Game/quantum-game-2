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
import { Vue, Options } from 'vue-class-component'
import { State } from 'vuex-class'
import { IDialogue } from '@/mixins/dataInterfaces'
import { getRockTalkById } from './loadRockTalks'
import RockTalkLine from '@/components/RockTalkPage/RockTalkLine.vue'
import AppButton from '@/components/AppButton.vue'
import { useRoute } from 'vue-router'

@Options({
  components: {
    RockTalkLine,
    AppButton,
  },
})
export default class InterLevelOverlay extends Vue {
  @State('currentLevelID') currentLevelID!: string

  get rockTalkId(): string {
    const route = useRoute()
    return route.params.id as string
  }

  get rockTalk(): IDialogue {
    return getRockTalkById(this.rockTalkId)
  }

  /**
   * Used to traverse to the next level
   * @returns a router link :to string parameter
   */
  get nextLevel(): string {
    return `/level/${parseInt(this.currentLevelID) + 1}`
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
