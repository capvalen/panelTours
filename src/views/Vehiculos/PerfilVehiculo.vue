<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import { reactive, onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useVehiculosStore } from '@/stores/vehiculoStore'
import { useComisionesStore } from '@/stores/comisionStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const { rutaArchivo, formatMoneda, fechaLatamSimple } = useFormat()
const vehiculoStore = useVehiculosStore()
const comisionStore = useComisionesStore()
const { vehiculoActual } = storeToRefs(vehiculoStore)
const comisiones = ref([])

const cargarComisiones = async () => {
	try {
		await comisionStore.listar({ tipo: 'vehiculo', comisionable_id: route.params.id });
		comisiones.value = comisionStore.comisiones || [];
	} catch (error) {
		console.error('Error al cargar comisiones:', error);
	}
}

const cargarDatos = async () => {
	await vehiculoStore.obtenerPorId(route.params.id)
}

onMounted(() => {
	cargarDatos()
	cargarComisiones()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
		cargarComisiones()
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

	<div class="row">
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🚗 Detalle del vehículo</strong></p>
					<p><strong>Tipo:</strong> <span class="text-capitalize">{{ vehiculoActual?.tipo_vehiculo }}</span></p>
					<p><strong>Placa:</strong> {{ vehiculoActual?.placa }}</p>
					<p><strong>Combustible:</strong> <span class="text-capitalize">{{ vehiculoActual?.tipo_combustible }}</span></p>
					<p><strong>Departamento:</strong> {{ vehiculoActual?.departamento?.departamento || '-' }}</p>
					<p><strong>Incluye seguro:</strong> {{ vehiculoActual?.incluye_seguro ? 'Sí' : 'No' }}</p>
					<p v-if="vehiculoActual?.seguro"><strong>Seguro:</strong> {{ vehiculoActual?.seguro }}</p>
					<p><strong>Incluye GPS:</strong> {{ vehiculoActual?.incluye_gps ? 'Sí' : 'No' }}</p>
					<p><strong>Incluye silla de bebé:</strong> {{ vehiculoActual?.incluye_silla_bebe ? 'Sí' : 'No' }}</p>
					<p><strong>Acepta mascotas:</strong> {{ vehiculoActual?.acepta_mascotas ? 'Sí' : 'No' }}</p>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>👤 Datos del conductor</strong></p>
					<p><strong>DNI:</strong> {{ vehiculoActual?.dni_conductor }}</p>
					<p><strong>Nombre:</strong> {{ vehiculoActual?.nombre_conductor }}</p>
					<p><strong>Licencia:</strong> {{ vehiculoActual?.licencia_conductor }}</p>
					<p><strong>Edad:</strong> {{ vehiculoActual?.edad_conductor }}</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🏦 Datos bancarios y aplicativo</strong></p>
					<p><strong>Banco:</strong> {{ vehiculoActual?.banco || '-' }}</p>
					<p><strong>Número de cuenta:</strong> {{ vehiculoActual?.numero_cuenta || '-' }}</p>
					<p><strong>Aplicativo:</strong> {{ vehiculoActual?.aplicativo || '-' }}</p>
					<p><strong>Propietario del aplicativo:</strong> {{ vehiculoActual?.propietario_aplicativo || '-' }}</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-header bg-dark text-white">
					<strong>📎 Archivos adjuntos ({{ vehiculoActual?.archivos?.length }})</strong>
				</div>
				<div class="card-body p-0">
					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="(archivo, index) in vehiculoActual?.archivos" :key="index">
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
						<li class="list-group-item text-muted" v-if="!vehiculoActual?.archivos || vehiculoActual?.archivos.length === 0">
							No hay archivos adjuntos
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="row mt-3 mb-5">
		<div class="col-12">
			<div class="card">
				<div class="card-header">
					<h6 class="mb-0 fw-bold"><i class="bi bi-cash-stack"></i> Comisiones</h6>
				</div>
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-bordered align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th>#</th>
									<th>Fecha</th>
									<th>Paquete</th>
									<th>Personas</th>
									<th>Monto</th>
									<th>Estado</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in comisiones" :key="item.id" style="cursor:pointer;" @click="router.push('/comision/' + item.id)">
									<td class="text-muted">{{ index + 1 }}</td>
									<td>{{ fechaLatamSimple(item.fecha) }}</td>
									<td>{{ item.observaciones || '-' }}</td>
									<td>{{ item.cant_personas }}</td>
									<td>{{ formatMoneda(item.monto) }}</td>
									<td>
										<span class="badge border text-capitalize" :class="{
											'border-success text-success': item.estado_pago === 'pagado',
											'border-warning text-warning': item.estado_pago === 'adelantado',
											'border-secondary text-secondary': item.estado_pago === 'pendiente',
											'border-danger text-danger': item.estado_pago === 'anulado',
										}">
											{{ item.estado_pago === 'adelantado' ? 'Con adelanto' : item.estado_pago === 'pendiente' ? 'Pendiente de pagar' : item.estado_pago === 'pagado' ? 'Pagado' : item.estado_pago === 'anulado' ? 'Anulado' : item.estado_pago || '-' }}
										</span>
									</td>
									<td @click.stop><button class="btn btn-sm btn-outline-primary" title="Ver comisión" @click="router.push('/comision/' + item.id)"><i class="bi bi-eye"></i></button></td>
								</tr>
								<tr v-if="comisiones.length === 0">
									<td colspan="7" class="text-muted text-center">No hay comisiones registradas</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<ModalSubirArchivo :modelo="'vehiculo'"></ModalSubirArchivo>
</template>
