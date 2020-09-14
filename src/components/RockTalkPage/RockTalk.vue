<template>
  <div class="rock-talk">
    <slot name="title"></slot>
    <div class="wrapper">
      <img :src="url" @load="onLoad" />
      <speech-bubble v-if="showFirst" :hint="dialogue[0]" :overlay="type" />
      <speech-bubble v-if="showSecond" :hint="dialogue[1]" :overlay="'second'" />
    </div>
    <div class="slot"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import SpeechBubble from '@/components/SpeechBubble.vue'

@Options({
  components: {
    SpeechBubble,
  },
})
export default class RockTalk extends Vue {
  @Prop({ default: 'rock' }) readonly type!: string | undefined
  @Prop() readonly dialogue!: { content: string }[]

  imageLoaded = false
  onLoad(): void {
    this.imageLoaded = true
  }

  /**
   * Dynamically calculate the image URL path
   * @returns an asset path
   */
  get url(): string {
    return require(`@/assets/graphics/overlays/${this.type}.svg`)
  }

  /**
   * The first rock's tooltip should not be shown
   * if it doesn't say anything
   * @returns should tooltip be displayed?
   */
  get showFirst(): boolean {
    return !!this.dialogue[0].content.length
  }

  /**
   * The second tooltip should be shown only in case
   * the overlay type supports it and it says something
   * @returns should tooltip be displayed?
   */
  get showSecond(): boolean {
    return this.type === 'pile2' && !!this.dialogue[1].content.length
  }
}
</script>

<style lang="scss" scoped>
.rock-talk {
  height: 100vh;
  width: 100vw;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .slot {
    padding-bottom: 20vh;
  }
}

img {
  min-height: 100px;
  width: 30vw;
  max-width: 500px;
}

.wrapper {
  position: relative;
}
</style>
