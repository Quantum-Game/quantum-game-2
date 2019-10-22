<template>
	<div class="tile" @onclick="rotate">
		<svg :class="calculatedClass" :style="calculatedStyle" />

		<div
			v-for="(particle, index) in particles"
			:key="index"
			:v-if="particles.length > 0"
			class="photons"
		>
			<photon
				name
				:are="particle.a.re"
				:aim="particle.a.im"
				:bre="particle.b.re"
				:bim="particle.b.im"
				:direction="particle.direction"
				:width="64"
				:height="64"
				:margin="0"
				:display-magnetic="true"
				:display-electric="false"
				:display-gaussian="false"
				:sigma="0.25"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import { ICell, Qparticle } from '@/types';
import Photon from './Photon.vue';

@Component({
	components: {
		Photon
	}
})
export default class Tile extends Vue {
	@Prop() readonly cell!: ICell;
	@Prop() readonly particles!: Qparticle[];

	get calculatedClass() {
		let classObj = {};
		if (this.cell.element) {
			classObj = {
				element: true,
				[this.cell.element]: true,
				active: this.cell.active
			};
		}
		return classObj;
	}

	get calculatedStyle() {
		let styleObj = {};
		if (this.cell.element) {
			styleObj = {
				backgroundImage: `url(${require(`../assets/pieces/${this.cell.element}.svg`)})`, // eslint-disable-line
				transform: `rotate(-${this.cell.rotation}deg)`
			};
		}
		return styleObj;
	}

	rotate() {
		this.cell.rotation = (this.cell.rotation + 45) % 360;
	}
}
</script>

<style lang="scss">
.tile {
	width: 64px;
	height: 64px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: white;
	font-size: 1.3rem;
	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: black;
	}
	svg {
		width: 64px;
		height: 64px;
	}

	&.rotate0 svg {
		transform: rotate(0deg);
	}
	&.rotate45 svg {
		transform: rotate(-45deg);
	}
	&.rotate90 svg {
		transform: rotate(-90deg);
	}
	&.rotate135 svg {
		transform: rotate(-135deg);
	}
	&.rotate180 svg {
		transform: rotate(-180deg);
	}
	&.rotate225 svg {
		transform: rotate(-225deg);
	}
	&.rotate270 svg {
		transform: rotate(-270deg);
	}
	&.rotate315 svg {
		transform: rotate(-315deg);
	}

	&.element {
		background-repeat: no-repeat;
		background-size: contain;
	}
}
</style>
