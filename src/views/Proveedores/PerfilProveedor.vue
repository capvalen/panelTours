<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import ModalAddPago from './ModalAddPago.vue';
import { reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useProveedoresStore } from '@/stores/proveedorStore'
import { useDeudasStore } from '@/stores/deudasStore';
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'

const route = useRoute() //instancia hacia la ruta
const { fechaLatamSimple, rutaArchivo } = useFormat()
const proveedorStore = useProveedoresStore()
const deudasStore = useDeudasStore()
//const proveedorActual = computed(() => proveedorStore.proveedorActual)
const {proveedorActual} = storeToRefs(proveedorStore)

const cargarDatos = async ()=>{
	await proveedorStore.obtenerPorId(route.params.id)
}

const eliminarDeuda = async (id, index)=>{
	Swal.fire({
		title: '¿Eliminar deuda?',
		text: '¿Está seguro de eliminar esta deuda pendiente?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar'
	}).then((result) => {
		if (result.isConfirmed) {
			deudasStore.eliminar(id)
				.then(() => {
					proveedorStore.proveedorActual.deudas.splice(index, 1);
					Swal.fire('Deuda eliminada', 'La deuda pendiente ha sido eliminada', 'success');
				})
				.catch(error => {
					console.error(error);
					Swal.fire('Error', 'Error al eliminar la deuda', 'error');
				});
		}
	});
}

onMounted(()=>{ //al cargar la pagina
	cargarDatos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	}
, { immediate: true })


/* const eliminarAdjunto = async (index)=>{
	if (proveedorActual?.archivos){
		proveedorActual.archivos.splice(index, 1)
		//crear eliminar archivo
		proveedorStore.actualizar(proveedorActual.id, proveedorActual)
	}
} */

</script>
<template>
	<h1>Perfil del proveedor</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/proveedores">Proveedores</a></li>
			<li class="breadcrumb-item active" aria-current="page">Perfil</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<router-link :to="`/proveedor/editar/${route.params.id}`" class="btn btn-outline-secondary"><i class="bi bi-pencil-square"></i> Editar datos</router-link>
			<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalSubirArchivo"><i class="bi bi-file-earmark-plus"></i> Agregar documentación</button>
		</div>
	</div>

	<div class="row">
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>📋 Datos del proveedor</strong></p>
					<p><strong>RUC:</strong> {{ proveedorActual?.ruc }}</p>
					<p><strong>Razón Social:</strong> {{ proveedorActual?.razon_social }}</p>
					<p><strong>Categoría:</strong> <span class="text-capitalize">{{ proveedorActual?.categoria }}</span></p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-body">
					<p><strong>📞 Contacto</strong></p>
					<p><strong>Contacto:</strong> {{ proveedorActual?.contacto }}</p>
					<p><strong>Correo:</strong> {{ proveedorActual?.correo }}</p>
					<p><strong>Celular:</strong> {{ proveedorActual?.celular }}</p>
					<p><strong>Dirección:</strong> {{ proveedorActual?.direccion }}</p>
					<p><strong>Ciudad:</strong> {{ proveedorActual?.ciudad }}</p>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🏦 Datos bancarios</strong></p>
					<p><strong>Cuenta bancaria:</strong> {{ proveedorActual?.banco || 'Ninguno' }}</p>
					<p><strong># de Cuenta:</strong> {{ proveedorActual?.numero_cuenta }}</p>
					<p><strong>Observaciones:</strong> {{ proveedorActual?.observaciones || '-' }}</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-header bg-dark text-white">
					<strong>📎 Archivos adjuntos ({{ proveedorActual?.archivos?.length }})</strong>
				</div>
				<div class="card-body p-0">
					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="(archivo, index) in proveedorActual?.archivos" :key="index">
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
						<li class="list-group-item text-muted" v-if="!proveedorActual?.archivos || proveedorActual?.archivos.length === 0">
							No hay archivos adjuntos
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col">
			<div class="d-flex justify-content-between align-items-center mb-2">
				<p class=""><strong>Pagos al proveedor</strong></p>
				<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalNuevoPago"><i class="bi bi-wallet2"></i> Agregar pago pendiente</button>

			</div>
			<div class="table-responsive">
				<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>N° Comprobante</th>
						<th>Registrado</th>
						<th>Límite de Pago</th>
						<th>Monto (S/)</th>
						<th>Estado</th>
						<th>Método de Pago</th>
						<th>Contacto</th>
						<th>Información</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(deuda, index) in proveedorActual?.deudas" :key="index">
						<td>{{ index+1 }}</td>
						<td>{{ deuda.codigo_referencia }}</td>
						<td>{{ fechaLatamSimple(deuda.created_at)}}</td>
						<td>{{ fechaLatamSimple(deuda.fecha_pago)}}</td>
						<td>{{ deuda.monto }}</td>
						<td>
							<div class="badge rounded-pill text-capitalize"
							:class="{
								'text-bg-warning': deuda.estado_pago=='pendiente',
								'text-bg-success': deuda.estado_pago=='completado',
								'text-bg-danger': deuda.estado_pago=='fallido',
								'text-bg-secondary': deuda.estado_pago=='condonado',
							}"
							>{{ deuda.estado_pago }}</div>
						</td>
						<td class="text-capitalize">{{ deuda.medio_pago }}</td>
						<td>{{ deuda.contacto_pagar }}</td>
						<td>
							<p class="mb-0">{{deuda.informacion}}</p>
						</td>
						<td>
							<button class="btn btn-sm btn-outline-danger" @click="eliminarDeuda(deuda.id, index)"><i class="bi bi-x"></i></button>
						</td>
					</tr>
					<tr v-if="proveedorActual?.deudas.length == 0">
						<td>No hay deudas registrados</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
	<ModalSubirArchivo :modelo="'proveedor'"></ModalSubirArchivo>
	<ModalAddPago></ModalAddPago>
</template>