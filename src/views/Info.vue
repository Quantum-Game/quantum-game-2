<template>
  <section>
    <h2>Welcome to the encyclopedia</h2>
    <pre>// Example elements</pre>

    <resource-container
      type="info"
      :items="elementList"
    />
  </section>
</template>

<script>
import Vue from 'vue';
import ResourceContainer from '../components/ResourceContainer.vue';

export default Vue.extend({
  name: 'Info',
  components: {
    ResourceContainer,
  },
  data() {
    return {
      elementList: [],
    };
  },
  created() {
    [...Array(20)].map((_, i) => this.elementList.push(`Element ${i + 1}`));
  },
});
</script>

<style>

</style>
