<template>
	<div class="default-content">
		<router-link to="/">
			<app-button type="basic">HOMEPAGE</app-button>
		</router-link>
		<!-- <router-link to="/info" class="button"> BACK TO GAME </router-link> -->
		<h1>Welcome to the encyclopedia!</h1>
		<img src="@/assets/placeholder_encyclopedia.svg" alt="placeholder" />
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import AppButton from '@/components/AppButton.vue';

@Component({
	components: {
		AppButton
	}
})
export default class EncyclopediaDefaultArticle extends Vue {}
</script>

<style lang="scss" scoped>
a {
	color: white;
	text-align: left;
	text-decoration: none;
}

img {
	border-top: 1px solid white;
	padding-top: 30px;
	padding-bottom: 30px;
}

.default-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.entries {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
