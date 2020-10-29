<template>
  <div class="explanation">
    <h3 class="title">
      {{ name }}
    </h3>
    <p v-if="description" class="description">
      {{ description }}
    </p>
    <p v-if="infoPayload.text" class="description">
      {{ infoPayload.text }}
    </p>
    <p
      v-for="(particle, index) in infoPayload.particles"
      :key="`info-particle-${index}`"
      class="description"
    >
      Intensity {{ (100 * particleProbability(particle)).toFixed(1) }}% at
      {{ directionToDegrees(particle.direction) }}°
    </p>
    <router-link v-if="infoPayload.piece" :to="hyphenedElementEntryURL" class="link">
      LEARN MORE
    </router-link>
  </div>
</template>

<script lang="ts">
import type { IInfoPayload } from '@/mixins/gameInterfaces'
import { camelCaseToDash } from '@/engine/Helpers'
import { elementsData } from '@/engine/elements'
import { assertUnreachable } from '@/types'
import { particleProbability, directionToDegrees, elemName } from '@/engine/model'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    infoPayload: {
      type: Object as PropType<IInfoPayload>,
      default: () => ({
        kind: 'ui',
        particles: [],
        text: '',
      }),
    },
  },
  setup(props) {
    const name = computed((): string => {
      switch (props.infoPayload.kind) {
        case 'piece':
          return elemName(props.infoPayload.piece.type)
        case 'particles':
          return 'photon state'
        case 'ui':
          return 'HINT'
        default:
          assertUnreachable(props.infoPayload)
      }
    })

    const description = computed((): string => {
      switch (props.infoPayload.kind) {
        case 'piece':
          return elementsData[props.infoPayload.piece.type].description
        case 'particles':
          return ''
        case 'ui':
          return ''
        default:
          assertUnreachable(props.infoPayload)
      }
    })

    const hyphenedElementEntryURL = computed((): string => {
      const addressName = camelCaseToDash(name.value)
      return `/info/${addressName}`
    })

    return {
      particleProbability,
      directionToDegrees,
      name,
      description,
      hyphenedElementEntryURL,
    }
  },
})
</script>

<style lang="scss" scoped>
.explanation {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
  font-size: 0.8rem;

  @include media('<large') {
    display: none;
  }
}

.title {
  text-transform: uppercase;
  margin-top: 8px;
  font-weight: 500;
}

.description {
  text-align: left;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.6);
}

.link {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 500;
  text-decoration: underline;
}
</style>
