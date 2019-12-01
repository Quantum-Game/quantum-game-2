import Vue from 'vue'
import Component from 'vue-class-component'
import { Cell } from '@/engine/classes'
import { HintInterface } from '@/engine/interfaces'

@Component
export default class GetPosition extends Vue {
  public cell!: Cell
  public hint!: HintInterface
  public tileSize!: number
  public coord = {
    x: 0,
    y: 0
  }

  private created(): void {
    this.setCoordOrigin()
  }

  private updated(): void {
    this.setCoordOrigin()
  }

  private setCoordOrigin(): void {
    if (this.hint) {
      this.coord = this.hint.coord
    } else {
      this.coord = this.cell.coord
    }
  }

  private centerCoord(val: number): number {
    return (val + 0.5) * this.tileSize
  }

  public get positionX(): number {
    return this.coord.x * this.tileSize
  }

  public get positionY(): number {
    return this.coord.y * this.tileSize
  }

  public get transformOriginX(): number {
    return this.centerCoord(this.coord.x)
  }

  public get transformOriginY(): number {
    return this.centerCoord(this.coord.y)
  }
}
