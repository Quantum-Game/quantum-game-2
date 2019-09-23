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

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ResourceContainer from '../components/ResourceContainer.vue';

@Component({
  components: {
    ResourceContainer,
  },
})
export default class Info extends Vue {
  elementList!: string[]

  created(): void {
    [...Array(20)].map((_, i) => this.elementList.push(`Element ${i + 1}`));
  }
}

</script>

<style>

</style>
