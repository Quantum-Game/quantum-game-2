<template>
  <transition :name="gameState">
    <!-- FIXME -->
    <div v-if="explosion" :class="gameState" class="wrapper">
    </div>

    <div v-else-if="gameState === 'Victory'" :class="gameState" class="wrapper">
      <div class="victory-circle">
        <h2>
          You won!
        </h2>
        <slot></slot>
      </div> 
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import VueConfetti from 'vue-confetti';
import AppButton from '@/components/AppButton.vue';

Vue.use(VueConfetti);

@Component({
  components: {
    AppButton
  }
})
export default class AppOverlay extends Vue {
  @Prop() readonly gameState!: string;
  $confetti!: {
    start: (params: any) => void;
    stop: () => void;
  };
  explosion: boolean = false;
  explosionTimeout: number = 0;

  mineExploding() {
    this.explosion = true;
    this.explosionTimeout = setTimeout(() => {
      this.explosion = false;
    }, 300)
  } 

  @Watch('gameState')
  handleGameStateChange(newGameState: string, oldGameState: string) {
    if (newGameState === 'Victory') {
      this.$confetti.start({
        particlesPerFrame: 3,
        defaultSize: 8,
        particles: [
          {
            dropRate: 15
            // type:'rect',
          }
        ],
        defaultColors: [
          '#ffbb3b', // Q yellow
          '#5c00d3', // Q purple
          '#ff0055', // Q red
          '#ff8b00', // orange 01
          '#ff5d15', // orange 02
          '#ba00ff', // purple 02
          '#ffbb3b', // Q yellow
          '#5c00d3', // Q purple
          '#ff0055', // Q red
          '#ff8b00', // orange 01
          '#ff5d15', // orange 02
          '#ba00ff' // purple 02
        ]
      });
    } else if (newGameState === 'MineExploded') {
      this.mineExploding();
    } else if (oldGameState === 'Victory') {
      this.$confetti.stop();
    }
  }
}
</script>

<style lang="scss">
.Victory-enter-active,
.Victory-leave-active {
  transition: opacity 0.5s;
}
.Victory-enter,
.Victory-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.Victory.wrapper {
  //background-color: rgba(179, 7, 136, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  & .victory-circle {
    width: 300px;
    height: 300px;
    border-radius: 150px;
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    margin: 10px;
    background: linear-gradient(#5c00d3, #ff0055, #fbb03b);
  }
  h2 {
    color: white;
    font-size: 2rem;
    margin: 20px;
  }
}
// .MineExploded-enter-active,
// .MineExploded-leave-active {
//   //transition: opacity 5s;
// }
.MineExploded-enter,
.MineExploded-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.MineExploded.wrapper {
  opacity: 0.8;
  background: #ff0055;
}

.wrapper {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 3;
  display: flex;
  align-items: center;
}
</style>
