<template>
  <div>
    <h1>Cell editor</h1>
    <div>
      Selected cell: {{ selectedCell.element.name }} @ [x: {{ selectedCell.coord.x }}, y:
      {{ selectedCell.coord.y }}]
      <span class="small">(Double click on a cell to select it.)</span>
    </div>
    <div id="form">
      <!-- COORDS ARE MANAGED BY DOUBLE CLICKED CELL -->
      <p>
        <!-- ELEMENT -->
        <span>Element: &nbsp;</span>
        <select v-model="selectedCell.element.name" @change="onElementChange($event)">
          <option
            v-for="element in Object.values(Elem)"
            :key="element"
            :value="element"
            :selected="element === selectedCell.element.name ? true : false"
          >
            {{ element }}
          </option>
        </select>
      </p>

      <!-- ROTATION -->
      <p v-if="isRotable">
        <span>Rotation:</span>
        &nbsp;
        <select v-model="selectedCell.rotation">
          <option
            v-for="angle in selectedCell.element.allowedRotations"
            :key="'rotation' + angle"
            :value="angle"
          >
            {{ angle }}°
          </option>
        </select>
      </p>

      <!-- POLARIZATION -->
      <p v-if="isPolarizable">
        <span>Polarization: &nbsp;</span>
        <select v-model="selectedCell.polarization">
          <option
            v-for="angle in selectedCell.element.allowedPolarizations"
            :key="'polarization' + angle"
            :value="angle"
          >
            {{ angle }}°
          </option>
        </select>
      </p>

      <!-- PERCENTAGE -->
      <p v-if="isPercentageVariable">
        <span>Percentage: &nbsp;</span>
        <input v-model="selectedCell.percentage" placeholder="Percentage" />
      </p>

      <!-- ACTIVE -->
      <p v-if="isActivable">
        <input id="checkbox" v-model="selectedCell.active" type="checkbox" />
        <label for="checkbox">Active: {{ selectedCell.active }}</label>
      </p>

      <!-- FROZEN -->
      <p>
        <input id="checkbox" v-model="selectedCell.frozen" type="checkbox" />
        <label for="checkbox">Frozen: {{ selectedCell.frozen }}</label>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { Elem } from '@/engine/interfaces'
import Level from '@/engine/Level'
import Cell from '@/engine/Cell'

@Component({
  components: {}
})
export default class CellEditor extends Vue {
  @Prop() readonly level!: Level
  @State('selectedCell') selectedCell!: Cell
  Elem = Elem

  onElementChange(event: { target: { value: string } }): void {
    const name = event.target.value
    this.selectedCell.reset()
    this.selectedCell.element = Cell.fromName(name)
  }

  get isRotable(): boolean {
    return this.selectedCell.element.allowedRotations.length > 1
  }

  get isPolarizable(): boolean {
    return this.selectedCell.element.allowedPolarizations.length > 0
  }

  get isPercentageVariable(): boolean {
    return this.selectedCell.element.allowedPercentages.length > 0
  }

  get isActivable(): boolean {
    return this.selectedCell.isLaser
  }
}
</script>

<style lang="scss" scoped>
.small {
  font-size: 10px;
}
</style>
