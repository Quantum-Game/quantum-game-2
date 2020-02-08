<template>
  <div v-if="hoveredParticles.length === 0" class="explanation">
    <h3 class="title">
      {{ spacedName }}
    </h3>
    <p class="description">
      {{ hoveredCell.element.description }}
    </p>
    <router-link :to="hyphenedEntryURL" class="link">
      LEARN MORE
    </router-link>
    <p v-if="canUpdatePolarization">
      <select v-model="activeCell.polarization">
        <option
          v-for="option in polarizationOptions"
          :key="'option' + option.id"
          :value="option.value"
        >
          {{ option.value }}
        </option>
      </select>
      <span>Selected: {{ activeCell.polarization }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import Cell from '@/engine/Cell'
import Particle from '@/engine/Particle'
import { camelCaseToDash } from '@/engine/Helpers'
import { Elem } from '@/engine/interfaces'

@Component
export default class GameActiveCell extends Vue {
  @State activeCell!: Cell
  @State hoveredCell!: Cell
  @State hoveredParticles!: Particle[]

  /**
   * Check if advanced options should be displayed
   */
  get canUpdatePolarization(): boolean {
    if (this.activeCell.tool) {
      switch (this.activeCell.element.name) {
        case Elem.Polarizer:
          return true
        case Elem.QuarterWavePlate:
          return true
        default:
          return false
      }
    }
    return false
  }

  /**
   * Polarization options for different elements
   */
  get polarizationOptions(): {} {
    switch (this.activeCell.element.name) {
      case Elem.Polarizer:
        return [
          { id: 0, value: '0°' },
          { id: 45, value: '45°' },
          { id: 90, value: '90°' },
          { id: 135, value: '135°' }
        ]
      case Elem.QuarterWavePlate:
        return [
          { id: 0, value: '0°' },
          { id: 45, value: '45°' },
          { id: 90, value: '90°' },
          { id: 135, value: '135°' }
        ]
      default:
        throw new Error(`Element ${this.activeCell.element.name} not implemented yet.`)
    }
  }

  /*
    used at least twice, getter for convenience
  */
  get name(): string {
    return this.hoveredCell.element.name
  }

  /*
    Get entry url and use helper to convert it to dash
  */
  get hyphenedEntryURL(): string {
    const addressName = camelCaseToDash(this.name)
    return `/info/${addressName}`
  }

  /** Get entry with space as delimiter */
  get spacedName(): string {
    const regexp = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g
    const nameCopy = this.name
    return nameCopy.replace(regexp, '$1$4 $2$3$5')
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
  & .title {
    margin-top: 8px;
    font-size: 1rem;
    text-transform: uppercase;
  }
  & .description {
    text-align: left;
    font-size: 0.8rem;
    line-height: 150%;
  }
  & .link {
    color: #837e9b;
    font-size: 0.8rem;
    text-decoration: none;
  }
}
</style>
