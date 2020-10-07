<template>
  <app-layout class="encyclopedia" left-class="hide show-lg">
    <template #header>
      <h1>
        <template v-for="crumb in crumbs" :key="crumb.url">
          <span class="crumb">
            <router-link :to="crumb.to">{{ crumb.text }}</router-link>
          </span>
        </template>
      </h1>
    </template>
    <template #main>
      <router-view />
    </template>
    <template v-if="showAside" #left>
      <div layout="column u4">
        <encyclopedia-link-list :entry-list="elementNameList" title="Elements" />
        <encyclopedia-link-list :entry-list="conceptNameList" title="Concepts" />
      </div>
    </template>
  </app-layout>
</template>

<script lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { elementNameList, conceptNameList, getEntry } from './loadData'

const rootCrumb = {
  text: 'encyclopedia',
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
      const crumbs = [rootCrumb]
      if (entry.value != null) {
        crumbs.push({
          text: entry.value.title,
          to: `/info/${entryId.value}`,
        })
      }
      return crumbs
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
<!-- eslint-disable-next-line vue-scoped-css/require-scoped -->
<style lang="scss">
.encyclopedia {
  img {
    max-width: 100%;
  }
}
</style>
<style lang="scss" scoped>
h1 {
  padding-top: 30px;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  text-align: center;
  display: block;
}

// eslint-disable-next-line vue-scoped-css/no-unused-selector
.crumb > a {
  color: white;
  text-transform: uppercase;
}

// eslint-disable-next-line vue-scoped-css/no-unused-selector
.crumb + .crumb:before {
  content: ' / ';
  font-weight: normal;
}
</style>
