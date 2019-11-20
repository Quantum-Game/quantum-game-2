<template>
  <div v-if="hoveredParticles.length === 0" class="explanation">
    <h3 class="explanation__title">{{ spacedName }}</h3>
    <p class="explanation__description">{{ hoveredCell.element.description }}</p>
    <router-link :to="hyphenedEntryURL" class="explanation__link">LEARN MORE</router-link>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import Cell from '@/engine/Cell';
import Particle from '@/engine/Particle';
import { camelCaseToDash } from '@/engine/Helpers';
import AppButton from '@/components/AppButton.vue';

@Component
export default class GameActiveCell extends Vue {
  @State activeCell!: Cell;
  @State hoveredCell!: Cell;
  @State hoveredParticles!: Particle[];

  /*
    used at least twice, getter for convenience
  */
  get name(): string {
    return this.hoveredCell.element.name;
  }

  /*
    Get entry url and use helper to convert it to dash
  */
  get hyphenedEntryURL(): string {
    const addressName = camelCaseToDash(this.name);
    return `/info/${addressName}`;
  }

  /** Get entry with space as delimiter */
  get spacedName(): string {
    const regexp = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
    const nameCopy = this.name;
    return nameCopy.replace(regexp, '$1$4 $2$3$5');
  }
}
</script>

<style lang="scss" scoped>
.explanation {
  border-top: 1px solid #8e819d;
  border-bottom: 1px solid white;
  width: 100%;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
  @media screen and (max-width: 1000px) {
    display: none;
  }
  & .explanation__tile {
    margin: 0;
    font-size: 1rem;
  }
  & .explanation__description {
    text-align: left;
    font-size: 0.8rem;
    // font-size: 13px;
    line-height: 150%;
  }

  & .explanation__link {
    color: #837e9b;
    font-size: 0.8rem;
    text-decoration: none;
  }

  .coord {
    font-size: 12px;
    color: grey;
  }
}

h3 {
  text-transform: uppercase;
}
</style>
