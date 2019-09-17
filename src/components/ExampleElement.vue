<template>
  <div>
    <h1>{{ $route.params.id }}</h1>
    <pre>// example item in Encyclopedia</pre>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'ExampleElement',
  computed: {
    elementName() {
      const routename = this.$route.params.id;
      return routename.charAt(0).toUpperCase() + routename.slice(1);
    },
  },
});
</script>

<style>

</style>
