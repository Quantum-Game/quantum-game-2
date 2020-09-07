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
      Intensity {{ (100 * particle.probability).toFixed(1) }}% at {{ particle.direction }}°
    </p>
    <router-link v-if="infoPayload.kind === 'element'" :to="hyphenedElementEntryURL" class="link">
      LEARN MORE
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Component, Prop } from 'vue-property-decorator'
import { IInfoPayload } from '@/mixins/gameInterfaces'
import { camelCaseToDash } from '@/engine/Helpers'

const spacedName = (name: string): string => {
  const regexp = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g
  return name.replace(regexp, '$1$4 $2$3$5')
}

export default class GameActiveCell extends Vue {
  @Prop({
    default: () => ({
      kind: 'ui',
      particles: [],
      text: '',
    }),
  })
  readonly infoPayload!: IInfoPayload

  /*
    used at least twice, getter for convenience
  */
  get name(): string {
    switch (this.infoPayload.kind) {
      case 'element':
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return spacedName(this.infoPayload.cell!.element.name)
      case 'particles':
        return 'photon state'
      case 'ui':
        return 'HINT'
      default:
        return ''
    }
  }

  get description(): string {
    switch (this.infoPayload.kind) {
      case 'element':
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.infoPayload.cell!.element.description
      case 'particles':
        return ''
      case 'ui':
        return ''
      default:
        return ''
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
  width: 100%;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
  @media screen and (max-width: 1000px) {
    display: none;
  }
  & .title {
    padding: 0px 10px;
    text-transform: uppercase;
    margin-top: 8px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  & .description {
    padding: 0px 10px;
    text-align: left;
    font-size: 0.8rem;
    line-height: 150%;
    color: rgba(255, 255, 255, 0.6);
  }
  & .link {
    padding: 0px 10px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
    font-size: 0.8rem;
    text-decoration: none;
  }
}
</style>
