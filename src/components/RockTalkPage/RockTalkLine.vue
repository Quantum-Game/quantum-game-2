<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="rock-text" v-html="dialogue"></div>
    <img class="rock-line" src="@/assets/graphics/overlays/rock_talk_line.svg" alt="rock-line" />
    <div class="rock-img">
      <img :src="require(`@/assets/graphics/overlays/${graphics}.svg`)" :alt="graphics" />
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'

@Component
export default class RockTalkLine extends Vue {
  @Prop({ default: '' }) dialogue!: string
  @Prop({ default: 'pile' }) graphics!: string
}
</script>

<style lang="scss" scoped>
.rock-text {
  margin-bottom: 1rem;
  font-size: 1rem;
}
.rock-img {
  margin: 0px 5rem 2rem 5rem;
  height: 100%;
  min-height: 100px;
  width: 30vw;
  max-width: 500px;
}
</style>
