<template>
  <encyclopedia-section>
    <template #title>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="section.title"></span>
    </template>
    <template #content>
      <div class="content-wrapper">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="content" v-html="parsedContent" />
      </div>
    </template>
  </encyclopedia-section>
</template>

<script lang="ts">
import type { IEntrySection } from '@/engine/interfaces'
import EncyclopediaSection from '@/components/EncyclopediaPage/EncyclopediaSection.vue'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  components: { EncyclopediaSection },
  props: {
    section: { type: Object as PropType<IEntrySection>, required: true },
  },
  setup(props) {
    const parsedContent = computed(
      () =>
        props.section.content
          ?.replace(/(href="[^"]+wikipedia[^"]+">[^<]+)/g, '$1 <i class="fab fa-wikipedia-w"></i>')
          .replace(/(href="[^"]+youtube[^"]+">[^<]+)/g, '$1 <i class="fab fa-youtube"></i>')
          .replace(/(href="[^"]+arxiv[^"]+">[^<]+)/g, '$1 <i class="fas fa-book-open"></i>')
          .replace(/(href="[^"]+arxiv[^"]+">[^<]+)/g, '$1 <i class="fas fa-book-open"></i>')
          .replace(
            /(href="[^"]+(edmundoptics|rp-photonics|thorlabs)[^"]+">[^<]+)/g,
            '$1 <i class="fas fa-microscope"></i>'
          ) ?? ''
    )

    return { parsedContent }
  },
})
</script>

<style scoped lang="scss">
.content-wrapper {
  font-weight: lighter;
  font-size: 1rem;
  // max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  line-height: 1.3rem;
  letter-spacing: 0.5px;
  text-align: left;
  line-height: 1.5em;
}
</style>
