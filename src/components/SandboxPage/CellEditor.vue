<template>
  <div>
    <h1>
      Cell editor @ [x: {{ selectedCell.coord.x }}, y: {{ selectedCell.coord.y }}]
      <br />
      <span class="small">(Double click on a cell to select it.)</span>
    </h1>

    <div id="form">
      <!-- COORDS ARE MANAGED BY DOUBLE CLICKED CELL -->
      <table class="table">
        <!-- ELEMENT -->
        <tr>
          <td class="right">
            Element
          </td>
          <td class="left">
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
          </td>
        </tr>

        <!-- ACTIVE -->
        <tr v-if="isActivable">
          <td class="right">Active</td>
          <td class="left">
            <input id="checkbox" v-model="selectedCell.active" type="checkbox" />
            <label for="checkbox">{{ selectedCell.active }}</label>
          </td>
        </tr>

        <!-- FROZEN / TOOL -->
        <tr>
          <td class="right">Frozen</td>
          <td class="left">
            <input
              id="checkbox"
              v-model="selectedCell.frozen"
              type="checkbox"
              @change="onFrozenChange($event)"
            />
            <label for="checkbox">{{ selectedCell.frozen }}</label>
          </td>
        </tr>

        <!-- ROTATION -->
        <tr v-if="isRotable">
          <td class="right">
            Rotation
          </td>
          <td class="left">
            <div class="slider">
              <vue-slider
                v-model="selectedCell.rotation"
                :data="selectedCell.element.allowedRotations"
                :marks="true"
                :adsorb="true"
                :dot-size="20"
              />
            </div>
          </td>
        </tr>

        <!-- POLARIZATION -->
        <tr v-if="isPolarizable">
          <td class="right">
            Polarization
          </td>
          <td class="left">
            <div class="slider">
              <vue-slider
                v-model="selectedCell.polarization"
                :data="selectedCell.element.allowedPolarizations"
                :marks="true"
                :adsorb="true"
                :dot-size="20"
              />
            </div>
          </td>
        </tr>

        <!-- PERCENTAGE -->
        <tr v-if="isPercentageVariable">
          <td class="right">
            Percentage
          </td>
          <td class="left">
            <div class="slider">
              <vue-slider
                v-model="selectedCell.percentage"
                :data="selectedCell.element.allowedPercentages"
                :marks="true"
                :adsorb="true"
                :dot-size="20"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { Elem } from '@/engine/interfaces'
import Level from '@/engine/Level'
import Cell from '@/engine/Cell'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/material.css'

@Component({
  components: {
    VueSlider
  }
})
export default class CellEditor extends Vue {
  @Prop() readonly level!: Level
  @State('selectedCell') selectedCell!: Cell
  Elem = Elem

  onElementChange(event: { target: { value: string } }): void {
    const name = event.target.value
    this.selectedCell.reset()
    this.selectedCell.tool = true
    this.selectedCell.element = Cell.fromName(name)
  }

  onFrozenChange(event: { target: { checked: boolean } }): void {
    const frozen = event.target.checked
    if (frozen) {
      this.selectedCell.frozen = true
      this.selectedCell.tool = false
    } else {
      this.selectedCell.frozen = false
      this.selectedCell.tool = true
    }
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
.slider {
  margin: 10px 20px;
}
.table {
  width: 100%;
  td {
    padding: 10px;
  }
  .left {
    text-align: left;
    width: 70%;
  }
  .right {
    text-align: right;
    width: 30%;
  }
}
</style>
