<template>
  <div class="inter-level-overlay" flex layout="column center">
    <RockTalkLine
      :graphics="rockTalk.graphics"
      :dialogue="rockTalk.dialogue"
      :link="rockTalk.link"
    />
    <router-link
      v-if="currentLevelID != '31'"
      class="button-next"
      :to="`/level/${currentLevelID + 1}`"
    >
      <AppButton :overlay="true" :inline="false">NEXT LEVEL</AppButton>
    </router-link>
  </div>
</template>

<script lang="ts">
import { getRockTalkById } from './loadRockTalks'
import RockTalkLine from '@/components/RockTalkPage/RockTalkLine.vue'
import AppButton from '@/components/AppButton.vue'
import { useRoute } from 'vue-router'
import { storeNamespace } from '@/store'
import { computed, defineComponent } from 'vue'

const game = storeNamespace('game')

export default defineComponent({
  components: {
    RockTalkLine,
    AppButton,
  },
  setup() {
    const currentLevelID = game.useState('currentLevelID')
    const route = useRoute()
    const rockTalk = computed(() => getRockTalkById(route.params.id as string))
    return { currentLevelID, rockTalk }
  },
})
</script>

<style lang="scss" scoped>
.inter-level-overlay {
  width: 40vw;
  color: white;
}

.button-next {
  margin: 10px;
}
</style>
