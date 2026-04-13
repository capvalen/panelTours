<script setup>
import { ref } from 'vue';

const title = ref('Configuraciones');
</script>

<template>
	<h1>{{ title }}</h1>
	<div class="card">
		<div class="card-body">
			<p class="text-muted">Aquí podrás gestionar las configuraciones del sistema.</p>
		</div>
	</div>
</template>
