<template>
  <AppLayout class="encyclopedia" leftClass="hide show-lg" :menuAbsolute="false">
    <template #main>
      <h3 v-if="crumbs.length > 0" class="breadcrumbs underlined">
        <template v-for="crumb in crumbs" :key="crumb.url">
          <span class="crumb">
            <router-link :to="crumb.to">{{ crumb.text }}</router-link>
          </span>
        </template>
      </h3>
      <router-view />
    </template>
    <template v-if="showAside" #left>
      <div layout="column u4">
        <EncyclopediaLinkList :entryList="elementNameList" title="Elements" />
        <EncyclopediaLinkList :entryList="conceptNameList" title="Concepts" />
      </div>
    </template>
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { elementNameList, conceptNameList, getEntry } from './loadData'

const rootCrumb = {
  text: 'Encyclopedia',
  to: '/info',
}

export default defineComponent({
  components: {
    AppLayout,
    EncyclopediaLinkList,
  },
  setup() {
    const route = useRoute()

    const entryId = computed(() => {
      const id = route.params.entry
      if (typeof id === 'string' && id !== '') return id
      return null
    })

    const entry = computed(() => {
      if (entryId.value != null) {
        return getEntry(entryId.value)
      } else {
        return null
      }
    })

    const showAside = computed(() => {
      return entry.value != null
    })

    const crumbs = computed(() => {
      if (entry.value != null) {
        return [
          rootCrumb,
          {
            text: entry.value.title,
            to: `/info/${entryId.value}`,
          },
        ]
      }
      return [rootCrumb]
    })

    return {
      showAside,
      crumbs,
      entry,
      elementNameList,
      conceptNameList,
    }
  },
})
</script>
<style lang="scss" scoped>
.encyclopedia {
  background: #2e006a;

  &::v-deep(img) {
    max-width: 100%;
  }
}

.breadcrumbs {
  margin-top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: normal;
}

// eslint-disable-next-line vue-scoped-css/no-unused-selector
.crumb:last-child > a {
  color: white;
}

// eslint-disable-next-line vue-scoped-css/no-unused-selector
.crumb + .crumb:before {
  content: ' / ';
  font-weight: normal;
}
</style>
