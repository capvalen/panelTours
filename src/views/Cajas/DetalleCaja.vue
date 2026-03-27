<script setup>
import ModalIngresoCaja from '@/components/ModalIngresoCaja.vue';
import ModalSalidaCaja from '@/components/ModalSalidaCaja.vue';
import ModalCerrarCaja from '@/components/ModalCerrarCaja.vue';

import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useCajaStore } from '@/stores/cajaStore';
import { useFormat } from '@/composables/formatos';
import { formatoMoneda } from '@/globales';

const route = useRoute() //instancia hacia la ruta

const cajaStore = useCajaStore()
const cajaActual = ref(null)
const cajaDetalles = ref(null)
const {fechaLatamCorta, horaCorta} = useFormat()

const cargarDatos = async ()=>{
	
	await cajaStore.obtenerCajaId(route.params.id)
	cajaActual.value = cajaStore.cajaActual
	await cajaStore.obtenerDetalleCajaId(route.params.id)
	cajaDetalles.value = cajaStore.cajaDetalles
}

onMounted(()=>{ //al cargar la pagina
	cargarDatos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	}
, { immediate: true })

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
		<div class="col d-flex flex-wrap gap-2">
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

	<div class="row mt-4">
		<div class="col">
			<p><strong>Registro de entradas y salidas</strong></p>
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
					<tr v-for="(detalle, index) in cajaDetalles" :key="detalle.id">
						<td>{{ index + 1 }}</td>
						<td>{{ horaCorta(detalle.fecha) }}</td>
						<td>{{ detalle.concepto }}</td>
						<td v-if="detalle.tipo === 'ingreso'" class="text-primary">{{ formatoMoneda(detalle.monto) }}</td>
						<td v-else class="text-danger">-{{ formatoMoneda(detalle.monto) }}</td>
						<td class="text-capitalize">{{ detalle.categoria }}</td>
						<td>Efectivo</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>
	<div class="row">
		<div class="col">
			<p class="text-danger"><strong>Registro de ventas y adelantos de servicios</strong></p>
			<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>Hora</th>
						<th>Servicio</th>
						<th># Pasajes</th>
						<th>Concepto</th>
						<th>Cliente</th>
						<th>Monto</th>
						<th>Estado de pago</th>
						<th>Moneda</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>09:30</td>
						<td>Tour</td>
						<td>3</td>
						<td>Tour selva 3n/2d</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 1 } }">Juan Pérez</router-link></td>
						<td class="text-primary">1200.00</td>
						<td>Pago completo</td>
						<td>Yape</td>
					</tr>
					<tr>
						<td>2</td>
						<td>11:15</td>
						<td>Paquete</td>
						<td>5</td>
						<td>Jauja inolvidable</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 2 } }">María López</router-link></td>
						<td class="text-primary">800.00</td>
						<td>Adelanto</td>
						<td>Tarjeta</td>
					</tr>
					<tr>
						<td>3</td>
						<td>14:00</td>
						<td>Tour y transporte</td>
						<td>3</td>
						<td>Lima la primera ciudad del virreinato</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 3 } }">Carlos Ruiz</router-link></td>
						<td class="text-primary">450.00</td>
						<td>Pago completo</td>
						<td>Efectivo</td>
					</tr>
					<tr>
						<td>4</td>
						<td>16:45</td>
						<td>Transporte</td>
						<td>2</td>
						<td>Laguna de paca</td>
						<td><router-link :to="{ name: 'perfilCliente', params: { id: 4 } }">Ana Gómez</router-link></td>
						<td class="text-primary">60.00</td>
						<td>Pago completo</td>
						<td>Depósito</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<p><strong>Resumen</strong></p>
	<div class="row px-4">
		<div class="col">
			<p><strong>Todal en entradas:</strong> S/ 30.00</p>
			<hr>
			<p><strong>Efectivo:</strong> S/ 30.00</p>
		</div>
		<div class="col">
			<p><strong>Total en salidas:</strong> S/ 1070.90</p>
			<hr>
			<p><strong>Efectivo:</strong> S/ 30.40</p>
			<p><strong>Depósito:</strong> S/ 800.00</p>
			<p><strong>Tarjeta:</strong> S/ 240.50</p>
			<p><strong>Yape:</strong> S/ 2430.00</p>
		</div>
		<div class="col">
			<p><strong>Total en ventas:</strong> S/ 2510.00</p>
			<hr>
			<p><strong>Efectivo:</strong> S/ 800.00</p>
			<p><strong>Depósito:</strong> S/ 2430.00</p>
			<p><strong>Tarjeta:</strong> S/ 2430.00</p>
			<p><strong>Yape:</strong> S/ 2430.00</p>
			<hr>
			<p><strong>Adelantos:</strong> S/ 800.00</p>
			<p><strong>Pagos completos:</strong> S/ 2430.00</p>
		</div>
		<div class="col">
			<p><strong>Cierre de sistema:</strong> S/ 1469.1</p>
			<hr>
			<p><strong>Efectivo final:</strong> S/ 800.40</p>
			<button v-if="cajaActual.estado != 'cerrada'" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#modalCerrarCaja"><i class="bi bi-door-closed-fill"></i> Cerrar caja</button>
			
		</div>
	</div>

	<ModalIngresoCaja :id="cajaActual?.id"></ModalIngresoCaja>
	<ModalSalidaCaja :id="cajaActual?.id"></ModalSalidaCaja>
	<ModalCerrarCaja :id="cajaActual?.id"></ModalCerrarCaja>
</template>

