<template>
  <g
    ref="cellRef"
    :style="computeCellStyle"
    :class="computeCellClass"
    @mousedown="deviceTargetDown"
    @mouseup="deviceTargetUp"
  >
    <!-- BOUNDING RECTANGLE -->
    <rect
      :width="tileSize"
      :height="tileSize"
      :class="computeRectClass"
      :style="computeRectStyle"
    />

    <!-- ELEMENT SVG -->
    <component :is="cellComponent" v-if="cellComponent != null" :state="pieceState" />
  </g>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { GameStateEnum } from '@/engine/interfaces'
import Cell from '@/engine/Cell'
import { usePosition } from '@/mixins/Position'
import { elementComponents } from '@/components/Board/Cell/index'
import { IStyle } from '@/types'
import { ref } from 'vue'
import { storeNamespace } from '@/store'
import { PieceState } from './Cell/Piece'

const game = storeNamespace('game')

@Options({
  emits: ['update-cell', 'play'],
})
export default class AppCell extends Vue {
  @Prop() readonly cell!: Cell
  @Prop() readonly tileSize!: number
  @Prop({ default: true }) readonly available!: boolean // looks like this is NOT needed
  mutationSetActiveCell = setup(() => game.useMutation('SET_ACTIVE_CELL'))
  mutationResetActiveCell = setup(() => game.useMutation('RESET_ACTIVE_CELL'))
  simulationState = setup(() => game.useState('simulationState'))
  gameState = setup(() => game.useState('gameState'))
  activeCell = setup(() => game.useState('activeCell'))
  cellSelected = setup(() => game.useState('cellSelected'))
  isRotate = false

  get pieceState(): PieceState {
    return {
      hover: false,
      interacting: this.activeCell === this.cell,
      energized: this.cell.energized,
    }
  }

  position = setup(() =>
    usePosition(
      () => this.tileSize,
      () => this.cell.coord
    )
  )

  cellRef = setup(() => ref<HTMLElement>())

  /**
   * Compute the cell class name
   * @returns Compute cell name string
   */
  get cellComponent(): unknown {
    return elementComponents[this.cell.element]
  }

  /**
   *  handles clicking, namely
   *  1. distinguishes a selecting vs a placing click
   *  2. determines if the update-cell event should be emitted
   *  @returns void
   */
  deviceTargetDown(): void {
    if (window.innerWidth <= 1024) {
      this.handleCellTouch()
    } else {
      this.handleCellClick()
    }
  }

  deviceTargetUp(): boolean | void {
    return window.innerWidth >= 1024 && this.handleCellUp()
  }

  handleCellTouch(): void {
    if (
      this.cell.frozen ||
      (!this.cellSelected && this.cell.isFromToolbox && !this.available) ||
      (this.cellSelected && this.isActiveCell && this.cell.isFromToolbox)
    ) {
      this.mutationResetActiveCell()
    } else {
      if (!this.cellSelected) {
        if (this.cell.tool && (this.cell.isFromGrid || this.cell.isFromToolbox)) {
          this.mutationSetActiveCell(this.cell)
          return
        }
        this.mutationResetActiveCell()
        return
      }
      if (this.isActiveCell && this.cell.isFromGrid) {
        this.cell.rotate()
      }
      this.$emit('update-cell', this.cell)
      this.mutationResetActiveCell()
    }
  }

  mouseMove(e: { pageX: number; pageY: number }): void {
    const cell = this.cellRef
    const hoverCell = document.querySelector<HTMLElement>('.portal-dragdrop')
    if (cell == null || hoverCell == null) return

    this.isRotate = true
    hoverCell.innerHTML = cell.innerHTML
    cell.style.opacity = '0'
    hoverCell.style.visibility = 'visible'
    document.body.style.cursor = 'grabbing'
    hoverCell.style.height = '64px' // change to tileSize, IDK why not work
    hoverCell.style.width = '64px' // change to tileSize, IDK why not work
    hoverCell.style.transformOrigin = '32px 32px' // change to tileSize/2
    hoverCell.style.transform = `
        translate(${e.pageX - 64 / 2}px, ${e.pageY - 64 / 2}px)
        rotate(-${this.cell.rotation}deg)` // change to tileSize/2
  }

  dragStart(): void {
    this.mutationSetActiveCell(this.cell)
    window.addEventListener('mousemove', this.mouseMove)
    window.addEventListener('mouseup', this.dragEnd)
  }

  dragEnd(): void {
    const cell = this.cellRef
    const hoverCell = document.querySelector<HTMLElement>('.portal-dragdrop')
    if (cell == null || hoverCell == null) return

    cell.style.opacity = '1'
    hoverCell.style.visibility = 'hidden'
    document.body.style.cursor = 'default'
    window.removeEventListener('mousemove', this.mouseMove)

    this.mutationResetActiveCell()
    window.removeEventListener('mouseup', this.dragEnd)
  }

  /**
   * This below is a monstrosity
   */
  handleCellClick(): void {
    // START SIMULATION: Drilling to Game
    if (this.cell.isLaser && this.cell.frozen) {
      // delay, otherwise it interferes with game state and energized are not updated
      setTimeout(() => this.$emit('play', true), 100)
    } else if (
      // TOOLBOX LOGIC
      this.cell.frozen ||
      // if it s a click on a tool thats unavailable:
      (!this.cellSelected && this.cell.isFromToolbox && !this.available) ||
      // if there is a cell selected in the toolbox and you click it once more:
      (this.cellSelected && this.isActiveCell && this.cell.isFromToolbox)
    ) {
      this.mutationResetActiveCell()
    } else {
      // ROTATE CELL
      if (this.isActiveCell && !this.cell.isFromGrid && this.isRotate) {
        this.cell.rotate()
        this.isRotate = false
      }

      if (!this.cellSelected) {
        // FIRST CLICK
        // If from toolbox needs to have available elements
        if (this.cell.tool && (this.cell.isFromGrid || this.cell.isFromToolbox)) {
          this.dragStart()
        }
      }
    }
  }

  handleCellUp(): void {
    if (this.isActiveCell && this.cell.isFromGrid) {
      this.cell.rotate()
    }
    this.$emit('update-cell', this.cell)
    this.mutationResetActiveCell()
  }

  /**
   * Is current cell the active cell
   */
  get isActiveCell(): boolean {
    return this.activeCell?.equal(this.cell) ?? false
  }

  /**
   * FIXME: it should work only in the first level
   * Display pulsating ring around laser
   */
  get displayPulsation(): boolean {
    if (this.cell.isLaser && this.gameState === GameStateEnum.Victory) {
      return true
    }
    return false
  }

  /**
   * Computed class
   * A fcking monstrosity
   */
  get computeCellClass(): string[] {
    return [
      this.cell.tool && !this.cell.isVoid && this.available ? 'active' : '',
      (this.cell.frozen && !this.cell.isVoid) || (this.cell.tool && !this.available)
        ? 'frozen'
        : '',
      this.cell.isFromToolbox && !this.available ? 'transparent' : '',
      this.cell.isLaser ? 'laser' : '',
    ]
  }

  /**
   * styles used for wrapper positioning
   * using the Position mixin;
   * @returns a style object
   */
  get computeCellStyle(): IStyle {
    const { rotation } = this.cell
    let styleObj = {}
    const origin = this.position.transformOrigin
    const translate = this.position.position
    styleObj = {
      'transform-origin': `${origin.x}px ${origin.y}px`,
      transform: `
        rotate(-${rotation}deg)
        translate(${translate.x}px, ${translate.y}px)`,
    }
    return styleObj
  }

  /**
   * Undoes the parent element rotation
   */
  get computeRectStyle(): IStyle {
    let styleObj = {}
    const halfSize = this.tileSize / 2
    styleObj = {
      'transform-origin': `${halfSize}px ${halfSize}px`,
      transform: `
        rotate(${this.cell.rotation}deg)`,
    }
    return styleObj
  }

  /**
   * highlight tile during a move
   * @returns highlight class
   */
  get computeRectClass(): string[] {
    return [this.shouldTileChangeColor ? 'movable-space' : '', 'inner-rect']
  }

  /**
   * determines whether the tile should
   * indeed be highlighted
   * @returns boolean
   */
  get shouldTileChangeColor(): boolean {
    return this.cellSelected && this.cell.isVoid
  }
}
</script>

<style lang="scss" scoped>
rect {
  fill: transparent;
}
.movable-space:hover {
  fill: white;
  opacity: 0.1;
  transition: 0.3s;
}
.frozen {
  cursor: not-allowed;
  &.laser {
    cursor: pointer;
  }
}
.active {
  cursor: grab;
  .inner-rect {
    fill: white;
    opacity: 0.1;
  }
  .transparent {
    opacity: 0.5;
  }
}
</style>
