<script setup>
import { reactive, onMounted, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useGuiasStore } from '@/stores/guiaStore'
import { useComisionesStore } from '@/stores/comisionStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const { listaDepartamentos, formatMoneda, fechaLatamSimple } = useFormat()
const guiaStore = useGuiasStore()
const comisionStore = useComisionesStore()
const { guiaActual } = storeToRefs(guiaStore)
const departamentos = ref([])
const comisiones = ref([])

const cargarComisiones = async () => {
	try {
		await comisionStore.listar({ tipo: 'guia', comisionable_id: route.params.id });
		comisiones.value = comisionStore.comisiones || [];
	} catch (error) {
		console.error('Error al cargar comisiones:', error);
	}
}

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
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🧑 Datos personales</strong></p>
					<p><strong>DNI:</strong> {{ guiaActual?.dni ?? 'Sin documento' }}</p>
					<p><strong>Nombre:</strong> {{ guiaActual?.nombre }}</p>
					<p><strong>Celular:</strong> {{ guiaActual?.celular }}</p>
					<p><strong>Contacto de emergencia:</strong> {{ guiaActual?.contacto_emergencia || '-' }}</p>
					<p><strong>Departamento:</strong> {{ nombreDepartamento }}</p>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>💼 Información profesional</strong></p>
					<p><strong>Especialidad:</strong> {{ guiaActual?.especialidad || '-' }}</p>
					<p><strong>Idiomas:</strong> {{ guiaActual?.idiomas || '-' }}</p>
				</div>
			</div>
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🏦 Datos bancarios y aplicativo</strong></p>
					<p><strong>Banco:</strong> {{ guiaActual?.banco || '-' }}</p>
					<p><strong>Número de cuenta:</strong> {{ guiaActual?.numero_cuenta || '-' }}</p>
					<p><strong>Aplicativo:</strong> {{ guiaActual?.aplicativo || '-' }}</p>
					<p><strong>Propietario del aplicativo:</strong> {{ guiaActual?.propietario_aplicativo || '-' }}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="row mt-3 mb-5">
		<div class="col-12">
			<div class="card">
				<div class="card-header">
					<h6 class="mb-0 fw-bold"><i class="bi bi-cash-stack"></i> Pagos</h6>
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
								<tr v-for="(item, index) in comisiones" :key="item.id" style="cursor:pointer;" @click="router.push('/pago/' + item.id)">
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
									<td @click.stop><button class="btn btn-sm btn-outline-primary" title="Ver pago" @click="router.push('/pago/' + item.id)"><i class="bi bi-eye"></i></button></td>
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
</template>
