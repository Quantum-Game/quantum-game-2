<template>
  <div class="toolbox-container">
    <pre>THIS IS TOOLBOX, HELLO</pre>
    <div class="tool">
      A
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

// TODO:
// [ ] create a notion of tools in the store;
// [ ] d&d

export default Vue.extend({
  name: 'Toolbox',
});

</script>

<style lang="scss">
  .toolbox-container {
    display: inline-block;
    height: 100%;
    width: 20%;
    margin-left: 10px;
    .tool {
      width: 100%;
      background-color: purple;
      height: 50px;
    }
  }
</style>
