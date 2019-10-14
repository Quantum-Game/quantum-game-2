<template>
	<section>
		<h2>This is a levels' map</h2>
		<pre>// Example routing</pre>
		<resource-container type="level" :items="levelList" />
	</section>
</template>

<script>
import Vue from 'vue';
import ResourceContainer from '@/components/ResourceContainer.vue';

export default Vue.extend({
	name: 'Levels',
	components: {
		ResourceContainer,
	},
	data() {
		return {
			levelList: [],
		};
	},
	created() {
		[...Array(20)].map((_, x) => this.levelList.push(x + 1));
	}
});
</script>
