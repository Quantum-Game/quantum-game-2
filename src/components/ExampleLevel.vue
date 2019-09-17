<template>
  <div>
    <h1>Level {{ $route.params.id }}</h1>
    <pre>// example level in the game</pre>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'Level',
});
</script>

<style>

</style>
