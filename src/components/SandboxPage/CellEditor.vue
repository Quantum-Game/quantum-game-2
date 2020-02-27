<template>
  <div>
    <div>
      Selected cell: {{ selectedCell.element.name }} @ [x: {{ selectedCell.coord.x }}, y:
      {{ selectedCell.coord.y }}]
      <span class="small">(Double click on a cell to select it.)</span>
    </div>
    <hr />
    <div id="form">
      <!-- COORDS ARE MANAGED BY DOUBLE CLICKED CELL -->
      <p>
        <!-- ELEMENT -->
        <select v-model="selectedCell.element" @change="onElementChange($event)">
          <option
            v-for="element in Object.values(Elem)"
            :key="element"
            :value="element"
            :selected="element === selectedCell.element.name ? true : false"
          >
            {{ element }}
          </option>
        </select>
        &nbsp;
        <span>Element: {{ selectedCell.element.name }}</span>
      </p>

      <!-- ROTATION -->
      <p v-if="isRotable">
        <select v-model="selectedCell.rotation">
          <option
            v-for="angle in selectedCell.element.angles"
            :key="'rotation' + angle"
            :value="angle"
          >
            {{ angle }}°
          </option>
        </select>
        &nbsp;
        <span>Rotation: {{ selectedCell.rotation }}</span>
      </p>

      <!-- POLARIZATION -->
      <p v-if="isPolarizable">
        <select v-model="selectedCell.polarization">
          <option
            v-for="angle in [0, 45, 90, 135, 180, 225, 270, 315]"
            :key="'polarization' + angle"
            :value="angle"
          >
            {{ angle }}°
          </option>
        </select>
        &nbsp;
        <span>Polarization: {{ selectedCell.polarization }}</span>
      </p>

      <!-- PERCENTAGE -->
      <p v-if="isPercentageVariable">
        <input v-model="selectedCell.percentage" placeholder="Percentage" />
        Percentage is: {{ selectedCell.percentage }}%
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
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import Cell from '@/engine/Cell'
import { Elem } from '@/engine/interfaces'

@Component({
  components: {}
})
export default class CellEditor extends Vue {
  @State('selectedCell') selectedCell!: Cell
  Elem = Elem

  onElementChange(event: { target: { value: string } }): void {
    const name = event.target.value
    this.selectedCell.element = Cell.fromName(name)
  }

  get isPolarizable(): boolean {
    const polarizables = [Elem.QuarterWavePlate, Elem.Polarizer, Elem.Laser]
    return polarizables.includes(this.selectedCell.element.name)
  }

  get isRotable(): boolean {
    return this.selectedCell.element.angles.length > 1
  }

  get isActivable(): boolean {
    return this.selectedCell.isLaser
  }

  get isPercentageVariable(): boolean {
    const variables = [Elem.SugarSolution, Elem.Absorber]
    return variables.includes(this.selectedCell.element.name)
  }

  // Add a watcher for selected cell change
}
</script>

<style lang="scss" scoped>
.small {
  font-size: 10px;
}
</style>
