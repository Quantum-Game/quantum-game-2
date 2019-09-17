<template>
  <div
    class="resource-container"
    :class="type"
  >
    <resource
      v-for="(item, index) in items"
      :key="index"
      :label="item || index"
      :category="type"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Resource from './Resource.vue';

export default Vue.extend({
  name: 'ResourceContainer',
  components: {
    Resource,
  },
  props: {
    type: {
      type: String,
      default: 'menu',
    },
    items: {
      type: [Array, Number],
      default: () => ['A', 'B', 'C'],
    },
  },
});
</script>

<style scoped lang="scss">
  .resource-container {
    display: flex;
    flex-wrap: wrap;
  }
  .menu {
    flex-direction: column
  }
  .info {
    flex-direction: row;
    & .resource {
      min-width: 45%;
    }
  }
</style>
