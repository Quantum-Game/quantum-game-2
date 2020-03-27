<template>
  <div class="rock-talk">
    <slot name="title"></slot>
    <img ref="wrapper" class="rock-talk__graphic-wrapper" :src="url" @load="onLoad" />
    <speech-bubble
      v-if="showFirst"
      :hint="dialogue[0]"
      :wrapper-rect="wrapperRect"
      :overlay="type"
    />
    <speech-bubble
      v-if="showSecond"
      :hint="dialogue[1]"
      :wrapper-rect="wrapperRect"
      :overlay="'second'"
    />
    <div class="slot"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SpeechBubble from '@/components/SpeechBubble.vue'

@Component({
  components: {
    SpeechBubble
  }
})
export default class RockTalk extends Vue {
  @Prop({ default: 'rock' }) readonly type!: string | undefined
  @Prop() readonly dialogue!: { content: string }[]

  wrapperRect: {
    top: number
  } = { top: 0 }

  imageLoaded = false

  $refs!: {
    wrapper: HTMLElement
  }

  /**
   * Life-cycle hooks to manage the resize event listener.
   */
  mounted(): void {
    window.addEventListener('resize', this.assessWrapperSize)
  }

  beforeDestroy(): void {
    window.removeEventListener('resize', this.assessWrapperSize)
  }

  /**
   * Fired on resize event, used to update the reactive
   * property sent as props, which is used by the Tooltip
   * to position against the wrapper.
   */
  assessWrapperSize(): void {
    this.wrapperRect = this.$refs.wrapper.getBoundingClientRect()
  }

  /**
   * Assess the size only if the wrapper
   * has assumed its full dimensions, namely:
   * the picture has been loaded.
   */
  onLoad(): void {
    this.imageLoaded = true
    this.assessWrapperSize()
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

<style lang="scss">
.rock-talk {
  height: 100vh;
  width: 100vw;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  & .rock-talk__graphic-wrapper {
    min-height: 100px;
    width: 30vw;
    max-width: 500px;
  }
  & .slot {
    padding-bottom: 20vh;
  }
}
</style>
