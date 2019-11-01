<template>
	<div class="not-found">
		<h1>404</h1>
		<p>OH NO :(</p>
		<img src="@/assets/rock_weasel.svg" alt="weasel" />
		<router-link to="/"> <q-button type="basic">Take me back!</q-button></router-link>
	</div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import AppButton from '@/components/AppButton.vue';

@Component({
	components: {
		AppButton
	}
})
export default class NotFoundPage extends Vue {}
</script>

<style lang="scss" scoped>
.not-found {
	color: white;
	align-items: center;
	display: flex;
	flex-direction: column;
	& h1 {
		font-size: 10rem;
		margin-bottom: 2rem;
	}
}
</style>
