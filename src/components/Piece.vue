<template>
  <div
    class="piece-wrapper"
    :draggable="isDraggable"
    @dragstart="onPieceDragStart"
    @dragend="onDragEnd"
    @dragover.prevent="onDragOver"
  >
    <component
      :is="element"
      :opacity="opacity"
      :style="{
        transform: `rotate(${cell.rotation}deg)`
      }"
      @drop.cancel="onDrop"
      @dragstart="onPieceDragStart"
    />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Vue,
  Prop,
} from 'vue-property-decorator';
import {
  Absorber,
  BeamSplitter,
  Bomb,
  CoatedBeamSplitter,
  Detector,
  Emitter,
  GlassSlab,
  Mirror,
  OmniDetector,
  Polarizer0,
  Polarizer45,
  Polarizer90,
  Polarizer135,
  PolarizingBeamSplitter,
  Rock,
  SugarSolution,
  VacuumJar,
  WavePlate0,
  WavePlate45,
  WavePlate90,
  WavePlate135,
} from './pieces';

@Component({
  components: {
    Absorber,
    BeamSplitter,
    Bomb,
    CoatedBeamSplitter,
    Detector,
    Emitter,
    GlassSlab,
    Mirror,
    OmniDetector,
    Polarizer0,
    Polarizer45,
    Polarizer90,
    Polarizer135,
    PolarizingBeamSplitter,
    Rock,
    SugarSolution,
    VacuumJar,
    WavePlate0,
    WavePlate45,
    WavePlate90,
    WavePlate135,
  }
})
export default class Piece extends Vue {
  @Prop() readonly cell!: {
    element: string
    frozen: boolean,
    x: number,
    y: number,
    rotation: number,
  }

  isBeingDragged: boolean = false

  get opacity() {
    return this.isBeingDragged ? 0.3 : 1;
  }

  // for toolbox only:
  @Prop() readonly disabled!: boolean

  onDragEnd(e) {
    this.isBeingDragged = false;
    this.$emit('onDragEnd', this.cell);
    console.log(e)
  }

  @Emit('ondrop')
  onDrop(e) {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  }

  @Emit()
  onDragOver(e: MpuseEvent) {
    // const dt = e.dataTransfer;
    // if (dt && this.cell.x < 0 && this.cell.y < 0) {
    //   dt.dropEffect = 'move';
    // }
  }

  get isDraggable(): boolean {
    return !this.cell.frozen && !this.disabled;
  }

  get element() {
    return this.cell.element;
  }

  @Emit('pieceDragStart')
  onPieceDragStart(e: DragEvent) {
    const {
      element,
      frozen,
      x,
      y,
      rotation,
    } = this.cell;
    const dt = e.dataTransfer;

    if (!this.isDraggable || frozen) {
      if (dt) {
        dt.clearData();
      }
      return false;
    }

    if (dt) {
      dt.setData('text/plain', element);
      dt.setData('originY', String(y));
      dt.setData('originX', String(x));
      dt.setData('rotation', String(rotation));
      dt.dropEffect = 'move';
    }
    this.isBeingDragged = true;
    return this.cell;
  }

  // @Emit('emit')
  // onDrop(e: MouseEvent){
  //   return e;
  // }
}
</script>

<style lang="scss">
.piece-wrapper {
  height: 100%;
  width: 100%;

  // Animation class?
   svg {
    transition: 0.5s;
  }
}
</style>
