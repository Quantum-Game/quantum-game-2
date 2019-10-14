<template>
	<section>
		<h2 class="title" @click="handleTitleClick">{{ section.title }}</h2>
		<div ref="content" class="content-wrapper" :style="style">
			<div class="content" v-html="section.content" />
			<img v-for="image in section.pics" :key="image" :src="imageUrl(image)" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface ISection {
	title: string;
	content: string;
	pics?: Array<string>;
}

@Component
export default class EntrySection extends Vue {
	@Prop() readonly section!: ISection;
	@Prop() readonly shouldBeOpenOnInit!: boolean;

	$refs!: {
		content: HTMLElement;
	};

	isOpen: boolean = false;

	mounted() {
		this.isOpen = this.shouldBeOpenOnInit;
		console.log(this.section.pics);
	}

	handleTitleClick(e: { target: Element }) {
		if (e && e.target && e.target.classList) {
			e.target.classList.toggle('active');
			this.isOpen = !this.isOpen;
		}
	}

	get style() {
		return {
			maxHeight: this.isOpen ? `${this.$refs.content.scrollHeight}px` : null
		};
	}

	/* eslint-disable */
	imageUrl(imageString: string) {
		const images = require.context('../assets');
		return images(`./${imageString}`);
	}
}
</script>

<style lang="scss" scroped>
section {
	border-bottom: 1px solid white;
	& .title {
		padding: 1em 0;
		cursor: pointer;
		transition: 0.4s;
		margin: 0;
		cursor: pointer;
	}

	& .content-wrapper {
		font-weight: 100;
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.2s ease-out;
		line-height: 1.3rem;
		letter-spacing: 1px;
	}
}

.active,
.accordion:hover {
	// background-color: #ccc;
}

.accordion:after {
	content: '\002B';
	color: #777;
	font-weight: bold;
	float: right;
	margin-left: 5px;
}

.active:after {
	content: '\2212';
}

// TEXT STYLING:
// key words and phrases
em {
	font-style: underline;
}

// strong importance
strong,
b {
	font-style: bold;
}

// emphasis
em,
i {
	font-style: italics;
}
</style>
