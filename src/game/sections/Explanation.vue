+<template>
	<div class="explanation">
		<h3 class="explanation__title">{{name}}</h3>
		<p class="explanation__description">
			{{activeCell.element.description}}
		</p>
		<router-link :to="entryURL" class="explanation__link">LEARN MORE</router-link>
		<slot> </slot>
	</div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Explanation extends Vue {
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
	get entryURL() {
		const addressName = this.name
    .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
		.replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`)

		return `/info/${addressName}`
	}
}
</script>

<style lang="scss" scoped>
.explanation {
	width: 100%;
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
