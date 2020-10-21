<template>
  <div class="rock-talk">
    <slot name="title"></slot>
    <div class="wrapper">
      <img :src="url" />
      <SpeechBubble
        v-if="showFirst"
        :hint="dialogue[0]"
        :overridePosition="firstPosition"
        :closeable="false"
      />
      <SpeechBubble
        v-if="showSecond"
        :hint="dialogue[1]"
        :overridePosition="secondPosition"
        :closeable="false"
        class="second"
      />
    </div>
    <div class="slot"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import SpeechBubble from '@/components/SpeechBubble.vue'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  components: {
    SpeechBubble,
  },
  props: {
    type: { type: String, default: 'rock' },
    dialogue: { type: Array as PropType<{ content: string }[]> },
  },
  setup(props) {
    const url = computed((): string | undefined =>
      require(`@/assets/graphics/overlays/${props.type}.svg`)
    )

    const showFirst = computed(() => {
      return !!props.dialogue?.[0]?.content.length
    })

    const showSecond = computed(() => {
      return props.type === 'pile2' && !!props.dialogue?.[1]?.content.length
    })

    const firstPosition = computed(() => {
      switch (props.type) {
        // single rock
        case 'rock':
          return {
            left: `50%`,
            top: `30%`,
          }
        // the pile's first talking rock
        case 'pile':
        case 'pile2':
          return {
            left: `30%`,
            top: `0%`,
          }
        // second of the two talking rocks
        case 'second':
          return
        default:
          return {
            left: `44%`,
            top: `1%`,
          }
      }
    })

    const secondPosition = {
      left: `80%`,
      top: `30%`,
    }

    return {
      url,
      showFirst,
      showSecond,
      firstPosition,
      secondPosition,
    }
  },
})
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

.second {
  max-width: 10vw;
}
</style>
