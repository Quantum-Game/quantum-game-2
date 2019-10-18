<template>
	<div class="default-content">
		<router-link to="/"> <q-button type="basic"> HOMEPAGE </q-button> </router-link>
		<!-- <router-link to="/info" class="button"> BACK TO GAME </router-link> -->
		<h1>Welcome to the encyclopedia!</h1>
		<img src="@/assets/placeholder_encyclopedia.svg" alt="placeholder" />		
		<div class="entries">
			<router-link to="/info/beam-splitter"> <q-button type="basic"> 50-50 BEAM SPLITTER</q-button></router-link>
			<br />
			<router-link to="/info/mirror"><q-button type="basic"> MIRROR</q-button></router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import QButton from '../components/QButton.vue';

@Component({
	components: {
		QButton
	}
})
export default class InfoHome extends Vue {}
</script>

<style lang="scss">
a {
	color: white;
	text-align: left;
	text-decoration: none;
}

img{
	border-top:1px solid white;
	padding-top:30px;
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
