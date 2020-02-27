<template>
  <div>
    <div>
      Selected cell: [x: {{ selectedCell.coord.x }}, y: {{ selectedCell.coord.y }}]
      {{ selectedCell.toString() }}
    </div>
    <hr />
    <div id="form">
      <!-- COORDS ARE MANAGED BY HOVERED CELL -->
      <p>
        <!-- ELEMENT -->
        <select v-model="selectedCell.element" @change="onElementChange($event)">
          <option v-for="element in Object.values(Elem)" :key="element" :value="element">
            {{ element }}
          </option>
        </select>
        &nbsp;
        <span>Element: {{ selectedCell.element.name }}</span>
      </p>

      <!-- ROTATION -->
      <p>
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
      <p>
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

      <!-- GOAL -->
      <input v-model="selectedCell.percentage" placeholder="Percentage" />
      Percentage is: {{ selectedCell.percentage }}%

      <!-- FROZEN -->
      <p>
        <input id="checkbox" v-model="selectedCell.frozen" type="checkbox" />
        <label for="checkbox">Frozen: {{ selectedCell.frozen }}</label>
      </p>

      <!-- ACTIVE -->
      <p>
        <input id="checkbox" v-model="selectedCell.active" type="checkbox" />
        <label for="checkbox">Active: {{ selectedCell.active }}</label>
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
export default class GameToolbox extends Vue {
  @State('selectedCell') selectedCell!: Cell
  Elem = Elem

  onElementChange(event: { target: { value: string } }): void {
    const name = event.target.value
    this.selectedCell.element = Cell.fromName(name)
  }

  // Add a watcher for selected cell change
}
</script>

<style lang="scss" scoped></style>
