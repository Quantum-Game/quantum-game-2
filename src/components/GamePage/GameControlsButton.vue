<template>
  <button type="button" :style="calculatedStyle">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class GameControlsButton extends Vue {
  @Prop() readonly whichIs!: string;
  @Prop({ default: true }) readonly usable!: boolean;
  @Prop({ default: true }) readonly disabled!: boolean;

  handleClick() {
    console.debug(this.whichIs);
    this.$emit(this.whichIs);
  }

  get calculatedStyle() {
    let styleObj = {};
    if (this.whichIs) {
      styleObj = {
        backgroundImage: `url(${require(`@/assets/graphics/b-buttons/${this.whichIs}.svg`)})`, // eslint-disable-line
        backgroundColor: this.usable ? 'transparent' : 'transparent',
        border: 'none',
        opacity: this.disabled ? 1 : 0.3
      };
    }
    return styleObj;
  }
}
</script>

<style lang="scss" scoped>
button {
  height: 30px;
  width: 30px;
  margin: 0.2rem 0.4rem;
}
</style>
