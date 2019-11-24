<template>
  <!-- DETECTION EVENT -->
  <div></div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { ParticleInterface } from '@/engine/interfaces';
import Particle from '@/engine/Particle';
import Grid from '@/engine/Grid';
import Level from '@/engine/Level';

@Component
export default class DetectionEvent extends Vue {
  @Prop({ default: '' }) readonly particle!: Particle;
  @State simulationState!: boolean;
  tileSize: number = 64;
}
</script>

<style lang="scss" scoped></style>
