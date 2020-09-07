import { Cell } from '@/engine/classes'
import { IHint } from '@/engine/interfaces'
import { Vue } from 'vue-class-component'

// FIXME: Should extend coord and not cell or hint
export default class Position extends Vue {
  public cell!: Cell
  public hint!: IHint
  public tileSize!: number
  public coord = {
    x: 0,
    y: 0,
  }

  /**
   * Will extend elements created function
   */
  created(): void {
    this.setCoordOrigin()
  }

  /**
   * Will extend elements updated function
   */
  updated(): void {
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
