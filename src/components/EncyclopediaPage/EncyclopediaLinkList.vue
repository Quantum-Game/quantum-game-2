<template>
  <div slot="left" class="element-list">
    <h3 class="upper-border">ALL ELEMENTS</h3>
    <router-link v-for="entry in entryList" :key="entry" :to="`/info/${entry}`">
      <div>{{ spacedEntry(entry) }}</div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class EncyclopediaLinkList extends Vue {
  @Prop() readonly entryList!: Array<string>;

  spacedEntry(name: string) {
    const nameCopy = name;
    return nameCopy.replace(/-/g, ' ');
  }
}
</script>

<style lang="scss" scoped>
.element-list {
  border-top: 1px solid white;
  a {
    color: white;
    text-decoration: none;
    line-height: 200%;
  }
}
</style>
