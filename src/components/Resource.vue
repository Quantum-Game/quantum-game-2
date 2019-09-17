<template>
  <router-link
    :to="`${category}/${label}`"
    class="resource"
  >
    {{ label }}
  </router-link>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'Resource',
  props: {
    category: {
      type: String,
      default: 'level',
    },
    label: {
      type: [String, Number],
      default: 'a label',
    },
  },
});
</script>

<style lang="scss">
  .resource {
    height: 100px;
    min-width: 100px;
    margin: 10px;
    background-color: #796bbc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    font-size: 5rem;
    text-decoration: none;
    transition: .6s;
    border-radius: 10px;
    box-shadow: 4px 3px 2px rgba(0,0,0,.5);
    &:hover {
      transform: scale(1.05);
      transition: .6s;
    }
  }

</style>
