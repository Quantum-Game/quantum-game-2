<template>
  <div slot="left" class="element-list" :class="{ entriesExpanded: entriesExpanded }">
    <h3 class="upper-border" @click="toggleEntries">ALL ELEMENTS</h3>
    <router-link v-for="entry in entryList" :key="entry.name" :to="`/info/${entry.name}`">
      <div :class="{ 'not-ready': !entry.ready }">{{ spacedEntry(entry.name) }}</div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class EncyclopediaLinkList extends Vue {
  data() {
    return {
      entriesExpanded: false
    };
  }
  @Prop() readonly entryList!: Array<any>;

  toggleEntries(): void {
    this.$data.entriesExpanded = !this.$data.entriesExpanded;
  }

  spacedEntry(name: string) {
    const nameCopy = name;
    return nameCopy.replace(/-/g, ' ');
  }
}
</script>

<style lang="scss" scoped>
.element-list {
  border-top: 1px solid white;
  overflow: hidden;
  transition: 0.5s;
  user-select: none;
  & .not-ready {
    opacity: 0.5;
  }
  @media screen and (max-width: 1000px) {
    height: 60px;
    border-bottom: 1px solid white;
    margin-left: -20px;
    padding-left: 20px;
    cursor: pointer;
    &.entriesExpanded {
      height: 600px;
      h3::after {
        transform: rotate(90deg);
      }
    }
  }
  a {
    color: white;
    text-decoration: none;
    line-height: 200%;
  }
  h3 {
    @media screen and (max-width: 1000px) {
      &::after {
        display: inline-block;
        position: relative;
        content: '';
        left: 12px;
        height: 0;
        border-left: 6px solid rgb(232, 232, 232);
        border-bottom: 6px solid rgba(0, 0, 0, 0);
        border-top: 6px solid rgba(0, 0, 0, 0);
        clear: both;
        -webkit-transition: 0.2s;
        transition: 0.2s;
      }
    }
  }
}
</style>
