<template>
	<div class="default-content">
		<router-link to="/">main menu</router-link>
		<h1>Welcome to the encyclopedia!</h1>
		Why don't you check...
		<div class="entries">
			<router-link to="/info/beamsplitter">50-50 Beam Splitter</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend();
</script>

<style lang="scss">
a {
	color: red;
}
</style>
