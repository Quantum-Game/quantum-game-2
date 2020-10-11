<template>
  <div>
    <div class="rock-text">
      <p v-for="(line, i) in dialogue" :key="`line-${i}`">
        {{ line }}
      </p>
      <p v-if="isLinkEncyclopedia">
        Check the
        <router-link :to="`/info/${link}`"
          ><b>{{ link }}</b></router-link
        >
        encyclopedia entry.
      </p>
      <p v-if="isLinkExternal">Visit <a :href="link">link</a>.</p>
    </div>
    <img class="rock-line" src="@/assets/graphics/overlays/rock_talk_line.svg" alt="rock-line" />
    <div class="rock-img">
      <img :src="require(`@/assets/graphics/overlays/${graphics}.svg`)" :alt="graphics" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    graphics: { type: String, default: 'pile' },
    dialogue: { type: Array, default: () => [''] },
    link: { type: String, default: '' },
  },
  setup(props) {
    return {
      isLinkEncyclopedia: computed(() => {
        return props.link && props.link.indexOf('://') === -1
      }),

      isLinkExternal: computed(() => {
        return props.link && props.link.indexOf('://') !== -1
      }),
    }
  },
})
</script>

<style lang="scss" scoped>
.rock-text {
  margin-top: 4rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  & a {
    text-transform: uppercase;
  }
}
.rock-line {
  width: 95%;
}
.rock-img {
  margin: auto;
  height: 100%;
  min-height: 100px;
  width: 30vw;
  max-width: 400px;
}
</style>
