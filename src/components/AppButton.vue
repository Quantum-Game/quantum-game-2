<template>
	<button :class="computedClass"><slot></slot></button>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class QButton extends Vue {
	@Prop() readonly hoverColor!: string;
	@Prop({ default: 'basic' }) readonly type!: string;
	@Prop({ default: true }) readonly inline!: boolean;

	get colorClass() {
		return this.hoverColor;
	}

	get computedClass() {
		return [this.type, this.inline && 'inline'];
	}
}
</script>

<style lang="scss" scoped>
button {
	display: inline-block;
	padding: 0;
	border: none;
	font: inherit;
	color: inherit;
	background-color: transparent;
	cursor: pointer;
	color: white;
	padding: 8px 20px;
	text-align: center;
	font-weight: bold;
	text-decoration: none;
	display: flex;
	font-size: 1rem;
	transition: 0.5s;
	align-items: center;
	&.inline {
		display: inline;
	}
}

.basic {
	background-color: #5c00d3;
	border-bottom: 4px solid #120223;
	&:hover {
		background-color: #4302bf;
		transition: 0.5s;
	}
}

.special {
	background-color: #ff0055;
	border-bottom: 4px solid #890236;
	&:hover {
		background-color: #e80054;
		transition: 0.5s;
	}
}

.big {
	background-color: #5c00d3;
	font-size: 1.5rem;
	border-bottom: 4px solid #120223;
	&:hover {
		background-color: #4302bf;
		transition: 0.5s;
	}
}
// button:hover {
// 	background-color: #4e99c9;
// 	transition: 0.5s;
// }

// .color1:hover {
// 	background-color: #be1616;
// 	transition: 0.5s;
// }
// .color2:hover {
// 	background-color: #4e99c9;
// 	transition: 0.5s;
// }
</style>
