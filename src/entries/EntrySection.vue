<template>
	<section class="entry-section">
		<h2 :class="{ 'entry-title': true, active: isOpen }" @click="handleTitleClick">{{ section.title.toUpperCase() }}</h2>
		<div ref="contentWrapper" class="content-wrapper" :style="style">
			<div class="content" v-html="section.content" />
			<img v-for="image in section.pics" :key="image" :src="imageUrl(image)" />
		</div>
	</section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface ISection {
	title: string;
	content?: string;
	pics?: Array<string>;
}

@Component
export default class EntrySection extends Vue {
	@Prop() readonly section!: ISection;
	@Prop() readonly shouldBeOpenOnInit!: boolean;

	$refs!: {
		contentWrapper: HTMLElement;
	};

	isOpen: boolean = false;

	// hack, as having a computed property that's using refs
	// as an initial data property causes errors - refs are
	// not existant then.
	mounted() {
		this.isOpen = this.shouldBeOpenOnInit;
	}

	handleTitleClick(e: { target: Element }) {
		this.isOpen = !this.isOpen;
	}

	get style() {
		return {
			maxHeight: this.isOpen ? `${this.$refs.contentWrapper.scrollHeight}px` : null
		};
	}

	/* eslint-disable */
 imageUrl(imageString: string) {
  const images = require.context('../assets');
  return images(`./${imageString}`);
 }
}
</script>

<style lang="scss" scoped>
section.entry-section {
 border-bottom: 1px solid #8e819d;
 & .entry-title {
  padding: 1em 0;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: 0.4s;
  margin: 0;
  font-weight: bold;
  text-align: justify;
  &:after {
   display: inline-block;
   position: relative;
   content: '';
   left: 12px;
   height: 0;
   border-left: 6px solid #e8e8e8;
   border-bottom: 6px solid transparent;
   border-top: 6px solid transparent;
   clear: both;
   transition: 0.4s;
  }
  &.active:after {
   transform: rotate(90deg);
   transition: 0.4s;
  }
 }
 & p {
  line-height: 2em;
  text-align: left;
  & a {
   color: #ff0055;
  }
 }

 & .content-wrapper {
  font-weight: lighter;
  font-size: 1rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  line-height: 1.3rem;
  letter-spacing: 1px;
 }
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
