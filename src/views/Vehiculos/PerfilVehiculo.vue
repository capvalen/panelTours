<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import { reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useVehiculosStore } from '@/stores/vehiculoStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { rutaArchivo } = useFormat()
const vehiculoStore = useVehiculosStore()
const { vehiculoActual } = storeToRefs(vehiculoStore)

const cargarDatos = async () => {
	await vehiculoStore.obtenerPorId(route.params.id)
}

onMounted(() => {
	cargarDatos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	},
	{ immediate: true }
)
</script>
<template>
	<h1>Perfil del vehículo</h1>

	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/vehiculos">Vehículos</a></li>
			<li class="breadcrumb-item active" aria-current="page">Perfil</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<router-link :to="`/vehiculo/editar/${route.params.id}`" class="btn btn-outline-secondary"><i class="bi bi-pencil-square"></i> Editar datos</router-link>
			<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalSubirArchivo"><i class="bi bi-file-earmark-plus"></i> Agregar documentación</button>
		</div>
	</div>

	<div class="row rows-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Detalle del vehículo</strong></p>
					<p><strong>Tipo:</strong> <span class="text-capitalize">{{ vehiculoActual?.tipo_vehiculo }}</span></p>
					<p><strong>Placa:</strong> {{ vehiculoActual?.placa }}</p>
					<p><strong>Combustible:</strong> <span class="text-capitalize">{{ vehiculoActual?.tipo_combustible }}</span></p>
					<p><strong>Incluye seguro:</strong> {{ vehiculoActual?.incluye_seguro ? 'Sí' : 'No' }}</p>
					<p v-if="vehiculoActual?.seguro"><strong>Seguro:</strong> {{ vehiculoActual?.seguro }}</p>
					<p><strong>Incluye GPS:</strong> {{ vehiculoActual?.incluye_gps ? 'Sí' : 'No' }}</p>
					<p><strong>Incluye silla de bebé:</strong> {{ vehiculoActual?.incluye_silla_bebe ? 'Sí' : 'No' }}</p>
					<p><strong>Acepta mascotas:</strong> {{ vehiculoActual?.acepta_mascotas ? 'Sí' : 'No' }}</p>
				</div>
			</div>
		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Datos del conductor</strong></p>
					<p><strong>DNI:</strong> {{ vehiculoActual?.dni_conductor }}</p>
					<p><strong>Nombre:</strong> {{ vehiculoActual?.nombre_conductor }}</p>
					<p><strong>Licencia:</strong> {{ vehiculoActual?.licencia_conductor }}</p>
					<p><strong>Edad:</strong> {{ vehiculoActual?.edad_conductor }}</p>
				</div>
			</div>

			<div class="card mt-3">
				<div class="card-body">
					<p><strong>Documentación</strong></p>

					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="(archivo, index) in vehiculoActual?.archivos" :key="archivo.link">
							<div class="d-flex w-100 justify-content-between">
								<span class="text-capitalize">{{ index + 1 }}. <a :href="rutaArchivo(archivo?.link)" target='_blank'> {{ archivo?.nombre || 'Archivo sin nombre' }}</a></span>
							</div>
						</li>
						<li class="list-group-item" v-if="!vehiculoActual?.archivos || vehiculoActual?.archivos.length === 0">No hay archivos adjuntos</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<ModalSubirArchivo :modelo="'vehiculo'"></ModalSubirArchivo>
</template>
