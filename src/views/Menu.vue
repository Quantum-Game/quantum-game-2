<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <pre>// These do not lead anywhere yet</pre>
    <resource
      goto="level/0"
      label="Play"
    />
    <resource-container />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ResourceContainer from '../components/ResourceContainer.vue';
import Resource from '../components/Resource.vue';

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    ResourceContainer,
    Resource,
  },
  props: {
    msg: {
      type: String,
      default: 'Welcome to the Quantum Game with Photons 2 skeleton',
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
