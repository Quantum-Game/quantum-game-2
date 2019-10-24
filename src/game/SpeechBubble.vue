<template>
	<svg>
		<g></g>
	</svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

interface IHint {
	coord: {
		x: number;
		y: number;
	};
	content: string;
	color?: string;
}

@Component
export default class SpeechBubble extends Vue {
	@Prop() readonly hint!: IHint;
}
</script>

<style></style>
