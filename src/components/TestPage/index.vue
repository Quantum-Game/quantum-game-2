<template>
  <div class="test-page">
    <InterLevelOverlay :type="type" :hints="hints">
      <h1 slot="title">OVERLAYS DEMO</h1>
      <app-button type="big">PLAY</app-button>
    </InterLevelOverlay>
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
        <textarea v-model="hints[0].content" placeholder="First rock says..."></textarea> <br />
        <select v-model="hints[0].color">
          <option disabled value="">color</option>
          <option>purple</option>
          <option>fuscia</option>
          <option>orange</option>
        </select>
      </section>

      <section>
        hint 2:
        <textarea
          v-model="hints[1].content"
          placeholder="The second rock says..."
          :disabled="isSecondDisabled"
        ></textarea
        ><br />
        <small>(active only for pile2 overlay type)</small><br />
        <select v-model="hints[1].color">
          <option disabled value="">color</option>
          <option>purple</option>
          <option>fuscia</option>
          <option>orange</option>
        </select>
      </section>
    </menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import InterLevelOverlay from '@/components/InterLevelOverlay.vue'
import AppButton from '@/components/AppButton.vue'

@Component({
  components: {
    InterLevelOverlay,
    AppButton
  }
})
export default class TestPage extends Vue {
  type = 'rock'
  hints = [
    {
      coord: {
        x: 4,
        y: 4
      },
      content: 'Well, hello there',
      color: 'purple'
    },
    {
      coord: {
        x: 4,
        y: 4
      },
      content: '',
      color: 'fuscia'
    }
  ]

  get isSecondDisabled(): boolean {
    return this.type !== 'pile2'
  }
}
</script>

<style lang="scss">
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
