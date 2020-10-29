<template>
  <div class="element-list" :class="{ entriesExpanded }" layout="column">
    <h3 v-if="title" @click="toggleEntries">{{ title }}</h3>
    <div class="entries">
      <router-link
        v-for="entry in sortedList"
        :key="entry.name"
        class="link"
        :to="`/info/${entry}`"
      >
        {{ entryTitle(entry) }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { getEntry } from './loadData'

export default defineComponent({
  props: {
    title: { type: String, required: false },
    entryList: { type: Array as PropType<string[]>, required: true },
  },
  setup(props) {
    const entriesExpanded = ref(false)
    const sortedList = computed(() => {
      return [...props.entryList].sort((a, b) => {
        const ta = getEntry(a).title
        const tb = getEntry(b).title
        return ta === tb ? 0 : ta > tb ? 1 : -1
      })
    })
    return {
      sortedList,
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
    margin-bottom: 10px;
    text-transform: uppercase;
  }
}

.entries {
  columns: 330px;
  column-rule: 1px solid rgba(255, 255, 255, 0.0);
  > .link {
    display: block;
  }
}
</style>
