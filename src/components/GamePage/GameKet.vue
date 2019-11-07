<template>
  <div ref="wrapper" class="simulation-frame-kets">
    <span>
      {{ frame.photons.ketString() }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { CellInterface, CoordInterface } from '@/engine/interfaces';
import Particle from '@/engine/Particle';
import AppPhoton from '@/components/AppPhoton.vue';
import AppButton from '@/components/AppButton.vue';
import QuantumFrame from '@/engine/QuantumFrame';

@Component({
  components: {
    AppPhoton,
    AppButton
  }
})
export default class GameKet extends Vue {
  @Prop() readonly frame!: QuantumFrame;
}
</script>

<style lang="scss" scoped>
.simulation-frame-kets {
  padding-top: 10px;
  border-top: 1px solid white;
  width: 100%;
  display: block;
  text-align: center;
}

.step {
  font-size: 0.8rem;
  line-height: 150%;
}

h3 {
  font-size: 1rem;
}
</style>
