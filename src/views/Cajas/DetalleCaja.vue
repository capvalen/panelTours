<script setup>
import ModalIngresoCaja from '@/components/ModalIngresoCaja.vue';
import ModalSalidaCaja from '@/components/ModalSalidaCaja.vue';
import ModalCerrarCaja from '@/components/ModalCerrarCaja.vue';

import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useCajaStore } from '@/stores/cajaStore';
import { useFormat } from '@/composables/formatos';
import { formatoMoneda } from '@/globales';

const route = useRoute() //instancia hacia la ruta

const cajaStore = useCajaStore()
const cajaActual = ref(null)
const cajaDetalles = ref(null)
const {fechaLatamCorta, horaCorta, capitalize} = useFormat()

const cierreSistema = computed(() => {
	return parseFloat(cajaActual.value?.monto_final || 0) 
})

const efectivoFinal = computed(() => {
	if (!cajaDetalles.value || !cajaActual.value) return 0
	const ingresos = (cajaDetalles.value?.internos || [])
		.filter(d => d.tipo === 'ingreso' && d.metodo_pago === 'efectivo')
		.reduce((sum, d) => sum + parseFloat(d.monto), 0)
	const egresos = (cajaDetalles.value?.internos || [])
		.filter(d => d.tipo === 'egreso' && d.metodo_pago === 'efectivo')
		.reduce((sum, d) => sum + parseFloat(d.monto), 0)
	return parseFloat(cajaActual.value.monto_inicial) + ingresos - egresos
})

const resumenIngresos = computed(() => {
	const items = (cajaDetalles.value?.internos || []).filter(d => d.tipo === 'ingreso')
	const porMetodo = {}
	items.forEach(d => {
		const m = d.metodo_pago || 'efectivo'
		porMetodo[m] = (porMetodo[m] || 0) + parseFloat(d.monto)
	})
	return { total: items.reduce((s, d) => s + parseFloat(d.monto), 0), porMetodo }
})

const resumenEgresos = computed(() => {
	const items = (cajaDetalles.value?.internos || []).filter(d => d.tipo === 'egreso')
	const porMetodo = {}
	items.forEach(d => {
		const m = d.metodo_pago || 'efectivo'
		porMetodo[m] = (porMetodo[m] || 0) + parseFloat(d.monto)
	})
	return { total: items.reduce((s, d) => s + parseFloat(d.monto), 0), porMetodo }
})

const resumenVentas = computed(() => {
	const items = cajaDetalles.value?.especiales || []
	const porMetodo = {}
	let adelantos = 0
	let completos = 0
	items.forEach(d => {
		const m = d.metodo_pago || 'otros'
		porMetodo[m] = (porMetodo[m] || 0) + parseFloat(d.monto)
		if (d.estado_pago === 'adelantado') adelantos += parseFloat(d.monto)
		else completos += parseFloat(d.monto)
	})
	return { total: items.reduce((s, d) => s + parseFloat(d.monto), 0), porMetodo, adelantos, completos }
})

const cargarDatos = async ()=>{
	
	await cajaStore.obtenerCajaId(route.params.id)
	cajaActual.value = cajaStore.cajaActual
	await cajaStore.obtenerDetalleCajaId(route.params.id)
	cajaDetalles.value = cajaStore.cajaDetalles
}

onMounted(()=>{ //al cargar la pagina
	cargarDatos()
})

/* //autogenerado:
watch(() => route.params.id, (newId, oldId) => {
	cargarDatos()
}, { immediate: true }) */

</script>

<template>
	<h1>Detalle de caja</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/cajas">Cajas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Detalle</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2" v-if="cajaActual?.estado != 'cerrada'">
			<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalIngreso"><i class="bi bi-plus"></i> Registrar ingreso</button>
			<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalSalida"><i class="bi bi-dash"></i> Registrar egreso</button>
		</div>
	</div>

	<div class="row rows-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong><i class="bi bi-diamond"></i> Apertura de la caja</strong></p>
					<p><strong>Fecha :</strong> <span class="text-capitalize">{{fechaLatamCorta(cajaActual?.fecha_apertura)}}</span></p>
					<p><strong>Hora:</strong> {{horaCorta(cajaActual?.fecha_apertura)}}</p>
					<p><strong>Monto:</strong> {{formatoMoneda(cajaActual?.monto_inicial)}}</p>
					<p><strong>Usuario:</strong> Úrsula</p>
				</div>
			</div>

		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong><i class="bi bi-diamond"></i> Cierre de caja </strong></p>
					<p><strong>Fecha:</strong> <span class="text-capitalize">{{fechaLatamCorta(cajaActual?.fecha_cierre) || '-'}}</span></p>
					<p><strong>Hora:</strong> {{horaCorta(cajaActual?.fecha_cierre) || '-'}}</p>
					<p><strong>Monto:</strong> {{formatoMoneda(cajaActual?.monto_final) || '-'}}</p>
					<p><strong>Observaciones:</strong> {{cajaActual?.observaciones || '-'}}</p>

				</div>
			</div>
		</div>
		<div class="col d-none">
			<div class="card">
				<div class="card-body">
					<p><strong><i class="bi bi-diamond"></i> Cierre de sistema</strong></p>
					<p><strong>Monto:</strong> S/ 602.80</p>
					<p><strong>Diferencia:</strong> Falta 2.80</p>
				</div>
			</div>
		</div>
	</div>

	<div class="row my-4">
		<div class="col">
			<p><strong>Registro de entradas y salidas</strong></p>
			<div class="table-responsive">
				<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>Hora</th>
						<th>Concepto</th>
						<th>Monto</th>
						<th>Tipo</th>
						<th>Moneda</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(detalle, index) in cajaDetalles?.internos" :key="detalle.id">
						<td>{{ index + 1 }}</td>
						<td>{{ horaCorta(detalle.fecha) }}</td>
						<td>{{ detalle.concepto }}</td>
						<td v-if="detalle.tipo === 'ingreso'" class="text-primary">S/ {{ formatoMoneda(detalle.monto) }}</td>
						<td v-else class="text-danger">-S/ {{ formatoMoneda(detalle.monto) }}</td>
						<td class="text-capitalize">{{ detalle.categoria }}</td>
						<td>Efectivo</td>
					</tr>
					<tr>
						<td colspan="8" v-if="cajaDetalles?.length==0">No hay datos registrados aún</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>

	</div>
	<div class="row">
		<div class="col">
			<p class=""><strong>Registro de ventas y adelantos de servicios</strong></p>
			<div class="table-responsive">
				<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>Hora</th>
						<th>Concepto</th>
						<th># Personas</th>
						<th>Cliente</th>
						<th>Monto</th>
						<th>Estado de pago</th>
						<th>Método de pago</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(detalle, index) in cajaDetalles?.especiales" :key="detalle.id">
						<td>{{ index + 1 }}</td>
						<td>{{ horaCorta(detalle.fecha) }}</td>
						<td>{{ detalle.concepto }}</td>
						<td>{{ detalle.venta?.cuantas_personas }}</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: detalle.venta?.cliente?.id } }">{{ detalle.venta?.cliente?.nombres }} {{ detalle.venta?.cliente?.apellidos }}</router-link></td>
						<td class="text-primary">S/ {{ formatoMoneda(detalle.monto) }}</td>
						<td class="text-capitalize">{{ detalle.estado_pago }}</td>
						<td class="text-capitalize">{{ detalle.metodo_pago }}</td>
					</tr>
					<tr>
						<td colspan="8" v-if="cajaDetalles?.especiales?.length==0">No hay datos registrados aún</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
	<p><strong>Resumen</strong></p>
	<div class="row px-4">
		<div class="col">
			<p><strong>Total de ingresos:</strong> S/ {{ formatoMoneda(resumenIngresos.total) }}</p>
			<hr>
			<p v-for="(tot, met) in resumenIngresos.porMetodo" :key="met"><strong>{{ capitalize(met) }}:</strong> S/ {{ formatoMoneda(tot) }}</p>
			<p v-if="Object.keys(resumenIngresos.porMetodo).length === 0" class="text-muted small">Sin ingresos</p>
		</div>
		<div class="col">
			<p><strong>Total de salidas:</strong> S/ {{ formatoMoneda(resumenEgresos.total) }}</p>
			<hr>
			<p v-for="(tot, met) in resumenEgresos.porMetodo" :key="met"><strong>{{ capitalize(met) }}:</strong> S/ {{ formatoMoneda(tot) }}</p>
			<p v-if="Object.keys(resumenEgresos.porMetodo).length === 0" class="text-muted small">Sin salidas</p>
		</div>
		<div class="col">
			<p><strong>Total en ventas:</strong> S/ {{ formatoMoneda(resumenVentas.total) }}</p>
			<hr>
			<p v-for="(tot, met) in resumenVentas.porMetodo" :key="met"><strong>{{ capitalize(met) }}:</strong> S/ {{ formatoMoneda(tot) }}</p>
			<hr>
			<p><strong>Adelantos:</strong> S/ {{ formatoMoneda(resumenVentas.adelantos) }}</p>
			<p><strong>Pagos completos:</strong> S/ {{ formatoMoneda(resumenVentas.completos) }}</p>
		</div>
		<div class="col">
			
			<p><strong>Efectivo final:</strong> S/ {{ formatoMoneda(efectivoFinal) }}</p>
			<p><strong>Cierre de sistema:</strong> {{ cajaActual?.estado === 'abierta' ? '-' : 'S/ ' + formatoMoneda(cierreSistema) }}</p>
			<button v-if="cajaActual?.estado != 'cerrada'" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalCerrarCaja"><i class="bi bi-door-closed-fill"></i> Cerrar caja</button>
		</div>
	</div>

	<ModalIngresoCaja :id="cajaActual?.id"></ModalIngresoCaja>
	<ModalSalidaCaja :id="cajaActual?.id"></ModalSalidaCaja>
	<ModalCerrarCaja :id="cajaActual?.id" :efectivoFinal="efectivoFinal"></ModalCerrarCaja>

	<div class="mb-4"></div>
</template>

