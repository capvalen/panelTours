<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import { reactive, onMounted, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useHospedajesStore } from '@/stores/hospedajeStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { rutaArchivo, listaDepartamentos } = useFormat()
const hospedajeStore = useHospedajesStore()
const { hospedajeActual } = storeToRefs(hospedajeStore)
const departamentos = ref([])

const nombreDepartamento = computed(() => {
	const depto = departamentos.value.find(d => d.id === hospedajeActual.value?.departamento_id)
	return depto ? depto.departamento : hospedajeActual.value?.departamento_id || '-'
})

const cargarDatos = async () => {
	await hospedajeStore.obtenerPorId(route.params.id)
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
	<h1>Perfil del hospedaje</h1>

	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/hospedajes">Hospedajes</a></li>
			<li class="breadcrumb-item active" aria-current="page">Perfil</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<router-link :to="`/hospedaje/editar/${route.params.id}`" class="btn btn-outline-secondary"><i class="bi bi-pencil-square"></i> Editar datos</router-link>
			<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalSubirArchivo"><i class="bi bi-file-earmark-plus"></i> Agregar documentación</button>
		</div>
	</div>

	<div class="row">
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🏨 Detalle del hospedaje</strong></p>
					<p><strong>RUC:</strong> {{ hospedajeActual?.ruc ?? 'Sin documento' }}</p>
					<p><strong>Nombre:</strong> {{ hospedajeActual?.hospedaje }}</p>
					<p><strong>Dirección:</strong> {{ hospedajeActual?.direccion }}</p>
					<p><strong>Departamento:</strong> {{ nombreDepartamento }}</p>
				</div>
			</div>
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>📞 Contacto</strong></p>
					<p><strong>Contacto:</strong> {{ hospedajeActual?.contacto }}</p>
					<p><strong>Celular:</strong> {{ hospedajeActual?.celular }}</p>
					<p><strong>Correo:</strong> {{ hospedajeActual?.correo }}</p>
				</div>
			</div>
			
		</div>
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🛎️ Servicios incluidos</strong></p>
					<p><strong>Desayuno:</strong> {{ hospedajeActual?.incluye_desayuno ? 'Sí' : 'No' }}</p>
					<p><strong>Estacionamiento:</strong> {{ hospedajeActual?.incluye_estacionamiento ? 'Sí' : 'No' }}</p>
					<p><strong>WiFi:</strong> {{ hospedajeActual?.incluye_wifi ? 'Sí' : 'No' }}</p>
					<p v-if="hospedajeActual?.servicios_extra"><strong>Servicios extra:</strong></p>
					<p v-if="hospedajeActual?.servicios_extra">{{ hospedajeActual?.servicios_extra }}</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-header bg-dark text-white">
					<strong>📎 Archivos adjuntos ({{ hospedajeActual?.archivos?.length }})</strong>
				</div>
				<div class="card-body p-0">
					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="(archivo, index) in hospedajeActual?.archivos" :key="index">
							<div class="d-flex justify-content-between align-items-center">
								<span>
									📁 {{ index + 1 }}.
									<a :href="rutaArchivo(archivo?.link)" target="_blank">
										{{ archivo?.nombre || 'Archivo sin nombre' }}
									</a>
								</span>
								<small class="text-muted">{{ archivo?.fecha }}</small>
							</div>
						</li>
						<li class="list-group-item text-muted" v-if="!hospedajeActual?.archivos || hospedajeActual?.archivos.length === 0">
							No hay archivos adjuntos
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<ModalSubirArchivo :modelo="'hospedaje'"></ModalSubirArchivo>
</template>
