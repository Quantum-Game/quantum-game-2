<template>
	<transition name="bang">
		<div v-if="gameState === 'Victory'" class="victory">
			<h2>THIS IS A WIN</h2>
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
.bang-enter-active,
.bang-leave-active {
	transition: opacity 0.5s;
}
.bang-enter, .bang-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.victory {
	height: 100vh;
	width: 100vw;
	background-color: rgba(179, 7, 136, 0.856);
	position: fixed;
	z-index: 3;
	display: flex;
	align-items: center;
	h2 {
		margin: 0;
		display: block;
		color: white;
		font-size: 14rem;
		transform: rotate(-5deg);
	}
}
</style>
