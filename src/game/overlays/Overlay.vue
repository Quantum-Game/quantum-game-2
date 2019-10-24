<template>
	<transition :name="gameState">
		<div v-if="gameState === 'baba'" :class="gameState" class="wrapper">
			<h2>THIS IS A WIN</h2>
		</div>
		<div v-else-if="gameState === 'Victory'" :class="gameState" class="wrapper">
			<h2>DEFEAT</h2>
		</div>
	</transition>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class Overlay extends Vue {
	@Prop() readonly gameState!: string;
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
	background-color: rgba(179, 7, 136, 0.856);
	h2 {
		margin: 0;
		display: block;
		color: white;
		font-size: 14rem;
		transform: rotate(-5deg);
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
