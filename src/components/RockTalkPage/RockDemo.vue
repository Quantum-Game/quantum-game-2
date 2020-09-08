<template>
  <div class="test-page">
    <rock-talk :type="type" :dialogue="dialogue">
      <template #title>
        <h1>OVERLAYS DEMO</h1>
      </template>
      <app-button type="big">PLAY</app-button>
    </rock-talk>
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
import { Vue, Options } from 'vue-class-component'
import RockTalk from '@/components/RockTalkPage/RockTalk.vue'
import AppButton from '@/components/AppButton.vue'

@Options({
  components: {
    RockTalk,
    AppButton,
  },
})
export default class TestPage extends Vue {
  type = 'rock'
  dialogue = [
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
  ]

  get isSecondDisabled(): boolean {
    return this.type !== 'pile2'
  }
}
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
