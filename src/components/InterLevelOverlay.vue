<template>
  <div class="inter-level-overlay">
    <slot name="title"></slot>
    <img ref="wrapper" class="inter-level-overlay__graphic-wrapper" :src="url" @load="onLoad" />
    <speech-bubble
      v-show="showFirst"
      :hint="hints[0]"
      :wrapper-rect="wrapperRect"
      :overlay="type"
    />
    <speech-bubble
      v-if="showSecond"
      :hint="hints[1]"
      :wrapper-rect="wrapperRect"
      :overlay="'second'"
    />
    <div class="slot"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SpeechBubble from '@/components/SpeechBubble.vue'
import Hint from '@/engine/Hint'

@Component({
  components: {
    SpeechBubble,
  },
})
export default class InterLevelOverlay extends Vue {
  @Prop({ default: 'rock' }) readonly type!: string | undefined
  @Prop() readonly hints!: Hint[]

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
   */
  get url(): string {
    return require(`@/assets/graphics/overlays/${this.type}.svg`)
  }

  get showFirst(): boolean {
    return this.imageLoaded && !!this.hints[0].content.length
  }

  /**
   * The second tooltip on the overlay should be shown
   * only in case the type supports it and the hint is there
   */
  get showSecond(): boolean {
    return this.imageLoaded && this.type === 'pile2' && !!this.hints[1].content.length
  }
}
</script>

<style lang="scss">
.inter-level-overlay {
  height: 100vh;
  width: 100vw;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  & .inter-level-overlay__graphic-wrapper {
    min-height: 100px;
    width: 30vw;
    max-width: 500px;
  }
  & .slot {
    padding-bottom: 20vh;
  }
}
</style>
