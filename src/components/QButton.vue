<template>
	<button class="button" :class="type"><slot></slot></button>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class QButton extends Vue {
	@Prop() readonly hoverColor!: string;
	@Prop() readonly type!: string;

	get colorClass() {
		return this.hoverColor;
	}
}
</script>

<style lang="scss" scoped>
button {
	text-decoration: none;
	text-decoration-style: none;
	text-decoration-color: none;
	padding: 0;
	border: none;
	font: inherit;
	color: inherit;
	background-color: transparent;
	cursor: pointer;
	/* background-color: #5c00d3;  */
	// border-bottom: 4px solid #120223;
	color: white;
	padding: 8px 20px;
	text-align: center;
	font-weight: bold;
	text-decoration: none;
	display: flex;
	font-size: 0.8rem;
	transition: 0.5s;
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
		background-color: #db0356;
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
