<template>
  <div class="toolbox-container">
    <pre>THIS IS TOOLBOX, HELLO</pre>
    <ToolSlot
      v-for="(set) in toolsets"
      :key="set[0]"
      :set="set"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ToolSlot from './ToolSlot.vue';

@Component({
  components: {
    ToolSlot,
  },
})
export default class ToolBox extends Vue {
  @Prop() readonly toolsets!: Array<Object>
}
</script>

<style lang="scss">
  .toolbox-container {
    display: inline-block;
    height: 100%;
    width: 20%;
    margin-left: 10px;
  }
</style>
