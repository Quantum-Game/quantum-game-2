+<template>
	<div class="explanation">
		<h3 class="explanation__title">{{ spacedName }}</h3>
		<p class="explanation__description">
			{{ activeCell.element.description }}
		</p>
		<router-link :to="hyphenedEntryURL" class="explanation__link">LEARN MORE</router-link>
		<slot> </slot>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Cell from '@/engine/Cell';
import AppButton from '@/components/AppButton.vue';

@Component
export default class GameActiveCell extends Vue {
	get activeCell() {
		return this.$store.state.activeCell;
	}

	/*
		used at least twice, getter for convenience
	*/
	get name() {
		return this.activeCell.element.name;
	}

	/*
		get entry url - replace camelCase names
		with hyphened ones, as this is how the entries
		are stored.
	*/
	get hyphenedEntryURL() {
		const addressName = this.name
			.replace(/(^[A-Z])/, ([first]: [string]) => first.toLowerCase())
			.replace(/([A-Z])/g, ([letter]: [string]) => `-${letter.toLowerCase()}`);

		return `/info/${addressName}`;
	}

	get spacedName() {
		const regexp = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
		const nameCopy = this.name;
		return nameCopy.replace(regexp, '$1$4 $2$3$5');
	}
}
</script>

<style lang="scss" scoped>
.explanation {
	width: 100%;
	max-width: 130px;
	text-align: left;
	padding-top: 10px;
	padding-bottom: 10px;
	& .explanation__tile {
		margin: 0;
		font-size: 1rem;
	}
	& .explanation__description {
		border-top: 1px solid #8e819d;
		text-align: left;
		font-size: 1rem;
		line-height: 150%;
	}

	& .explanation__link {
		color: #837e9b;
		text-decoration: none;
	}
}
</style>
