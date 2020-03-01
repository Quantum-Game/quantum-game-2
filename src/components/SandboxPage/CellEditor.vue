<template>
  <div>
    <h1>
      Cell editor @ [x: {{ selectedCell.coord.x }}, y: {{ selectedCell.coord.y }}]
      <br />
      <span class="small"
        >(Double click on a cell to select it. Unfrozen elements will be moved to toolbox on
        save.)</span
      >
      {{ selectedGoal.coord }} - {{ selectedGoal.threshold }}%
    </h1>

    <div id="form">
      <!-- COORDS ARE MANAGED BY DOUBLE CLICKED CELL -->
      <table class="table">
        <!-- ELEMENT -->
        <tr>
          <td class="label">
            Element
          </td>
          <td class="input">
            <div class="select">
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
            </div>
          </td>
        </tr>

        <!-- ROTATION -->
        <tr v-if="isRotable">
          <td class="label">
            Rotation
          </td>
          <td class="input">
            <div class="slider">
              <vue-slider
                v-model="selectedCell.rotation"
                :data="selectedCell.element.allowedRotations"
                :marks="true"
                :adsorb="true"
                :dot-size="20"
                @change="$emit('updateSimulation')"
              />
            </div>
          </td>
        </tr>

        <!-- POLARIZATION -->
        <tr v-if="isPolarizable">
          <td class="label">
            Polarization
          </td>
          <td class="input">
            <div class="slider">
              <vue-slider
                v-model="selectedCell.polarization"
                :data="selectedCell.element.allowedPolarizations"
                :marks="true"
                :adsorb="true"
                :dot-size="20"
                @change="$emit('updateSimulation')"
              />
            </div>
          </td>
        </tr>

        <!-- PERCENTAGE -->
        <tr v-if="isPercentageVariable">
          <td class="label">
            Percentage
          </td>
          <td class="input">
            <div class="slider">
              <vue-slider
                v-model="selectedCell.percentage"
                :data="selectedCell.element.allowedPercentages"
                :marks="true"
                :adsorb="true"
                :dot-size="20"
                @change="$emit('updateSimulation')"
              />
            </div>
          </td>
        </tr>

        <!-- ACTIVE -->
        <tr v-if="isActivable">
          <td class="label">Active</td>
          <td class="input">
            <toggle-button
              v-model="selectedCell.active"
              :labels="{ checked: 'Active', unchecked: 'Stopped' }"
              :color="{ checked: 'green', unchecked: 'grey', disabled: '#CCCCCC' }"
              :width="80"
              @change="$emit('updateSimulation')"
            />
          </td>
        </tr>

        <!-- FROZEN / TOOL -->
        <tr>
          <td class="label">Frozen</td>
          <td class="input">
            <toggle-button
              v-model="selectedCell.frozen"
              :labels="{ checked: 'Frozen', unchecked: 'Tool' }"
              :color="{ checked: 'green', unchecked: 'grey', disabled: '#CCCCCC' }"
              :width="80"
              @change="onFrozenChange($event)"
            />
          </td>
        </tr>
      </table>

      <hr />
      <!-- GOAL -->
      <table class="table">
        <tr>
          <td class="label">
            Goal
          </td>
          <td class="input">
            <div class="slider">
              <vue-slider
                v-model="selectedGoal.threshold"
                :marks="{
                  '0': '0%',
                  '20': '20%',
                  '40': '40%',
                  '60': '60%',
                  '80': '80%',
                  '100': '100%'
                }"
                :dot-size="20"
                @change="onGoalChange($event)"
              />
            </div>
          </td>
        </tr>
      </table>

      <hr />
      <!-- HINT -->
      <table class="table">
        <tr>
          <td class="label">
            Hint
          </td>
          <td class="input">
            <input
              v-model="selectedHint.message"
              placeholder="Message"
              @change="onHintChange($event)"
            />
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
import Hint from '@/engine/Hint'
import Goal from '@/engine/Goal'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/material.css'
import { ToggleButton } from 'vue-js-toggle-button'

@Component({
  components: {
    VueSlider,
    ToggleButton
  }
})
export default class CellEditor extends Vue {
  @Prop() readonly level!: Level
  @State('selectedCell') selectedCell!: Cell
  Elem = Elem

  get selectedHint(): Hint {
    this.level.hints.forEach((hint: Hint) => {
      if (this.selectedCell.coord.equal(hint.coord)) {
        return hint
      }
    })
    return new Hint(this.selectedCell.coord, '')
  }

  get selectedGoal(): Goal {
    this.level.goals.forEach((goal: Goal) => {
      if (this.selectedCell.coord.equal(goal.coord)) {
        return goal
      }
    })
    return new Goal(this.selectedCell.coord, 0)
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

  updateSimulation(): void {
    this.$emit('updateSimulation')
  }

  onElementChange(event: { target: { value: string } }): void {
    const name = event.target.value
    this.selectedCell.reset()
    this.selectedCell.tool = true
    this.selectedCell.element = Cell.fromName(name)
    this.updateSimulation()
  }

  onFrozenChange(event: { value: boolean }): void {
    console.log(event)

    const frozen = event.value
    if (frozen) {
      this.selectedCell.frozen = true
      this.selectedCell.tool = false
    } else {
      this.selectedCell.frozen = false
      this.selectedCell.tool = true
    }
  }

  /**
   * Update or create goal at selectedCell coord
   */
  onGoalChange(value: number): void {
    let found = false
    const normalized = value / 100
    // update
    this.level.goals.forEach((goal: Goal) => {
      if (goal.coord.equal(this.selectedCell.coord)) {
        goal.threshold = normalized
        found = true
      }
    })
    // create
    if (!found) {
      const goal = new Goal(this.selectedCell.coord, normalized)
      this.level.goals.push(goal)
    }
  }

  onHintChange(event: { target: { value: string } }): void {
    if (event.target.value !== 'Change me!') {
      const hint = new Hint(this.selectedCell.coord, event.target.value)
      this.level.hints.push(hint)
    }
  }
}
</script>

<style lang="scss" scoped>
.small {
  font-size: 10px;
}
.table {
  width: 100%;
  td {
    padding: 10px;
    &.label {
      text-align: right;
      width: 30%;
    }
    &.input {
      text-align: left;
      width: 70%;
    }
  }
}
.slider {
  margin: 10px 20px;
}
</style>
