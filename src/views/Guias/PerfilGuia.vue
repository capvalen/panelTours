<script setup>
import { reactive, onMounted, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useGuiasStore } from '@/stores/guiaStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { listaDepartamentos } = useFormat()
const guiaStore = useGuiasStore()
const { guiaActual } = storeToRefs(guiaStore)
const departamentos = ref([])

const nombreDepartamento = computed(() => {
	const depto = departamentos.value.find(d => d.id === guiaActual.value?.departamento_id)
	return depto ? depto.departamento : guiaActual.value?.departamento_id || '-'
})

const cargarDatos = async () => {
	await guiaStore.obtenerPorId(route.params.id)
}

onMounted(async () => {
	cargarDatos()
	departamentos.value = await listaDepartamentos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	},
	{ immediate: true }
)
</script>
<template>
	<h1>Perfil del guía</h1>

	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/guias">Guías</a></li>
			<li class="breadcrumb-item active" aria-current="page">Perfil</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<router-link :to="`/guia/editar/${route.params.id}`" class="btn btn-outline-secondary"><i class="bi bi-pencil-square"></i> Editar datos</router-link>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Datos personales</strong></p>
					<p><strong>DNI:</strong> {{ guiaActual?.dni ?? 'Sin documento' }}</p>
					<p><strong>Nombre:</strong> {{ guiaActual?.nombre }}</p>
					<p><strong>Celular:</strong> {{ guiaActual?.celular }}</p>
					<p><strong>Contacto de emergencia:</strong> {{ guiaActual?.contacto_emergencia || '-' }}</p>
					<p><strong>Departamento:</strong> {{ nombreDepartamento }}</p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Información profesional</strong></p>
					<p><strong>Especialidad:</strong> {{ guiaActual?.especialidad || '-' }}</p>
					<p><strong>Idiomas:</strong> {{ guiaActual?.idiomas || '-' }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
