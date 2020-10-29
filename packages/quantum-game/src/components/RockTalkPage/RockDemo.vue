<template>
  <div class="test-page">
    <RockTalk :type="type" :dialogue="dialogue">
      <template #title>
        <h1>OVERLAYS DEMO</h1>
      </template>
      <AppButton type="big">PLAY</AppButton>
    </RockTalk>
    <menu class="test-page__controls">
      <h2>Overlay Controls:</h2>
      <section>
        type:
        <select v-model="type">
          <option>rock</option>
          <option>pile</option>
          <option>pile2</option>
          <option>weasel</option>
        </select>
        {{ type }}
      </section>

      <section>
        hint 1:
        <textarea v-model="dialogue[0].content" placeholder="First rock says..."></textarea> <br />
        <select v-model="dialogue[0].color">
          <option disabled value="">color</option>
          <option>purple</option>
          <option>fuchsia</option>
          <option>orange</option>
        </select>
      </section>

      <section>
        hint 2:
        <textarea
          v-model="dialogue[1].content"
          placeholder="The second rock says..."
          :disabled="isSecondDisabled"
        ></textarea
        ><br />
        <small>(active only for pile2 overlay type)</small><br />
        <select v-model="dialogue[1].color">
          <option disabled value="">color</option>
          <option>purple</option>
          <option>fuchsia</option>
          <option>orange</option>
        </select>
      </section>
    </menu>
  </div>
</template>

<script lang="ts">
import RockTalk from '@/components/RockTalkPage/RockTalk.vue'
import AppButton from '@/components/AppButton.vue'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  components: {
    RockTalk,
    AppButton,
  },
  setup() {
    const type = ref('rock')
    return {
      type,
      dialogue: ref([
        {
          coord: {
            x: 4,
            y: 4,
          },
          content: 'Well, hello there',
          color: 'purple',
        },
        {
          coord: {
            x: 4,
            y: 4,
          },
          content: '',
          color: 'fuchsia',
        },
      ]),
      isSecondDisabled: computed(() => type.value !== 'pile2'),
    }
  },
})
</script>

<style lang="scss" scoped>
.test-page {
  & .test-page__controls {
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: column;
    & section {
      padding-bottom: 10px;
    }
  }
}
</style>
