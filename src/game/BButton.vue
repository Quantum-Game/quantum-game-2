<template>
	<button type="button" :style="calculatedStyle">
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class BButton extends Vue {
	@Prop() readonly whichIs!: string;
	@Prop({ default: true }) readonly usable!: boolean;

	handleClick() {
		console.log(this.whichIs);
		this.$emit(this.whichIs);
	}

	get calculatedStyle() {
		let styleObj = {};
		if (this.whichIs) {
			if (this.whichIs === 'classical' || this.whichIs === 'quantum') {
				return { opacity: 0.3 };
			}

			styleObj = {
        backgroundImage: `url(${require(`../assets/b-buttons/${this.whichIs}.svg`)})`, // eslint-disable-line
				backgroundColor: this.usable ? 'transparent' : 'transparent',
				border: 'none'
				// transform: `rotate(-${this.cell.rotation}deg)`
			};
		}
		return styleObj;
	}
}
</script>

<style lang="scss" scoped>
button {
	height: 30px;
	width: 30px;
	margin: 0.2rem 0.4rem;
}
</style>
