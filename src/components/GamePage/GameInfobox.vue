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
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import type { IInfoPayload } from '@/mixins/gameInterfaces'
import { camelCaseToDash } from '@/engine/Helpers'
import { elementsData } from '@/engine/elements'
import { assertUnreachable } from '@/types'
import { particleProbability, directionToDegrees, elemName } from '@/engine/model'

export default class GameActiveCell extends Vue {
  @Prop({
    default: () => ({
      kind: 'ui',
      particles: [],
      text: '',
    }),
  })
  readonly infoPayload!: IInfoPayload

  particleProbability = particleProbability
  directionToDegrees = directionToDegrees
  /*
    used at least twice, getter for convenience
  */
  get name(): string {
    switch (this.infoPayload.kind) {
      case 'piece':
        return elemName(this.infoPayload.piece.type)
      case 'particles':
        return 'photon state'
      case 'ui':
        return 'HINT'
      default:
        assertUnreachable(this.infoPayload)
    }
  }

  get description(): string {
    switch (this.infoPayload.kind) {
      case 'piece':
        return elementsData[this.infoPayload.piece.type].description
      case 'particles':
        return ''
      case 'ui':
        return ''
      default:
        assertUnreachable(this.infoPayload)
    }
  }


  /*
    Get entry url and use helper to convert it to dash
  */
  get hyphenedElementEntryURL(): string {
    const addressName = camelCaseToDash(this.name)
    return `/info/${addressName}`
  }
}
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
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  text-decoration: none;
}
</style>
