import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Cell from '@/engine/Cell'

export default class Piece extends Vue {
  @Prop() public readonly cell!: Cell
  @Prop({ default: '' }) public readonly border!: string
  @Prop({ default: 64 }) public readonly tileSize!: number

  /**
   * Getters for cell instance properties
   */
  public get energized(): boolean {
    return this.cell.energized
  }

  public get active(): boolean {
    return this.cell.active
  }

  public get polarization(): number {
    return this.cell.polarization
  }

  public get percentage(): number {
    return this.cell.percentage
  }
}
