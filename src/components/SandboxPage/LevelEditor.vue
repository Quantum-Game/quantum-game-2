<template>
  <div>
    <h1>Level Editor</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { Elem } from '@/engine/interfaces'
import Cell from '@/engine/Cell'

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
