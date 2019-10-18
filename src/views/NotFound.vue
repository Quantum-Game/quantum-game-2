<template>
	<div class="not-found">
		<h1>404</h1>
		<p>OH NO :(</p>
		<router-link to="/"> <q-button type="basic">Take me back!</q-button></router-link>
	</div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import QButton from '../components/QButton.vue';

@Component({
	components: {
		QButton
	}
})
export default class NotFound extends Vue {}
</script>

<style lang="scss" scoped>
.not-found {
	color: white;
	align-items: center;
	display: flex;
	flex-direction: column;
	& h1 {
		font-size: 12rem;
		margin-bottom: 2rem;
	}
}
</style>
