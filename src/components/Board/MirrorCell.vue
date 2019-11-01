<template>
	<svg>
		<g>
			<rect x="2" y="25" class="st0" width="60" height="14" />
			<polygon class="st1" points="29.1,39 16,25 3.1,25 16.2,39 	" />
			<polygon class="st1" points="34.9,39 21.8,25 19.2,25 32.3,39 	" />
		</g>
		<g v-if="border" id="Qoutline">
			<path
				class="st2"
				:style="{ fill: border }"
				d="M62,25v14H2V25H62 M63,24h-1H2H1v1v14v1h1h60h1v-1V25V24L63,24z"
			/>
		</g>
	</svg>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Piece from './Piece';

@Component
export default class Mirror extends Piece {}
</script>

<style lang="scss" scoped>
.st0 {
	fill: #5a4278;
}
.st1 {
	fill: #aa93cc;
}
</style>
