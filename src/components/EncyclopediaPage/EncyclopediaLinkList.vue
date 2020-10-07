<template>
  <div class="element-list" :class="{ entriesExpanded }" layout="column">
    <h3 v-if="title" @click="toggleEntries">{{ title }}</h3>
    <router-link v-for="entry in entryList" :key="entry.name" :to="`/info/${entry}`">
      {{ entryTitle(entry) }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { getEntry } from './loadData'

export default defineComponent({
  props: {
    title: { type: String, required: false },
    entryList: { type: Array as PropType<string[]>, required: true },
  },
  setup() {
    const entriesExpanded = ref(false)
    return {
      entriesExpanded,
      toggleEntries(): void {
        entriesExpanded.value = !entriesExpanded.value
      },
      entryTitle(name: string): string {
        return getEntry(name).title
      },
    }
  },
})
</script>

<style lang="scss" scoped>
.element-list {
  overflow: hidden;
  transition: 0.5s;
  line-height: 150%;
  h3 {
    margin-top: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 5px;
  }
}
</style>
