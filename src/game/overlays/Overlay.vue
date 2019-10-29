<template>
	<transition :name="gameState">
		<div v-if="gameState === 'baba'" :class="gameState" class="wrapper">
			<h2>
				:(
			</h2>
		</div>

		<div v-else-if="gameState === 'Victory'" :class="gameState" class="wrapper">
			<h2>You won!<br /><slot></slot></h2>
		</div>
	</transition>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import VueConfetti from 'vue-confetti';
import QButton from '@/components/QButton.vue';

Vue.use(VueConfetti);

@Component({
	components: {
		QButton
	}
})
export default class Overlay extends Vue {
	@Prop() readonly gameState!: string;

	@Watch('gameState')
	startConfetti(val: string) {
		if (val === "Victory") {
			this.$confetti.start({
				particlesPerFrame: 3,
				defaultSize: 8,
				particles: [
					{
					dropRate: 15,
					//type:'rect',
					}
				],
				defaultColors: [
					'#ffbb3b', //Q yellow
					'#5c00d3', //Q purple
					'#ff0055', //Q red
					'#ff8b00', // orange 01
					'#ff5d15', // orange 02
					'#ba00ff', // purple 02
					'#ffbb3b', //Q yellow
					'#5c00d3', //Q purple
					'#ff0055', //Q red
					'#ff8b00', // orange 01
					'#ff5d15', // orange 02
					'#ba00ff', // purple 02

				],
			});
		} else {
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
	h2 {
		//THIS IS A DRAFT VERSION OF POP-UP
		width: 12rem;
		height: 10rem;
		padding: 1rem;
		background: linear-gradient(#5c00d3, #ff0055, #fbb03b);
		//margin: 50;
		color: white;
		font-size: 2rem;
		//transform: rotate(-5deg);
	}
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
