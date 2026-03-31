<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import { onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router'
import { useClienteStore } from '@/stores/clienteStore';
import { useFormat } from '@/composables/formatos';
import { storeToRefs } from 'pinia';
const route = useRoute() //instancia hacia la ruta
const { fechaLatamSimple, rutaArchivo } = useFormat()

const clienteStore = useClienteStore()
const {clienteActual} = storeToRefs(clienteStore)
const vacunas = computed( ()=> clienteActual.value?.vacunas)
const seguros = computed( ()=> clienteActual.value?.seguros)
const archivos = computed( ()=> clienteActual.value?.archivos)

const cargarDatos = async ()=>{	
	await clienteStore.obtenerClienteId(route.params.id)
}

const eliminarAdjunto = async (index)=>{
	if (clienteActual.value?.archivos){
		clienteActual.value.archivos.splice(index, 1)
		//crear eliminar archivo
		clienteActual.actualizarCliente(clienteActual.value)
	}
}

onMounted(()=>{ //al cargar la pagina
	cargarDatos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	}
, { immediate: true })


</script>
<template>
	<h1>Perfil del cliente</h1>

	<nav aria-label="breadcrumb" style="content: '\F285';">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/clientes">Clientes</a></li>
			<li class="breadcrumb-item active" aria-current="page">Perfil</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>

	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<router-link :to="`/cliente/editar/${route.params.id}`" class="btn btn-outline-secondary"><i class="bi bi-pencil-square"></i> Editar datos</router-link>
			<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalSubirArchivo"><i class="bi bi-file-earmark-plus"></i> Agregar documentación</button>
		</div>
	</div>

	<div class="row rows-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Detalle del cliente</strong></p>
					<div if="clienteActual.apellidos">
						<p><strong>Nombres:</strong> {{clienteActual.nombres}}</p>
						<p><strong>Apellidos:</strong> {{clienteActual.apellidos}}</p>
						<p><strong>DNI:</strong> {{clienteActual.dni}}</p>
					</div>
					<div v-if="clienteActual.razon_social">
						<p><strong>Razón Social:</strong> {{clienteActual.razon_social}}</p>
						<p><strong>RUC:</strong> {{clienteActual.ruc}}</p>
					</div>
					<p><strong>Fecha de Nacimiento:</strong> {{fechaLatamSimple(clienteActual.fecha_nacimiento)}}</p>
					<p><strong>Correo:</strong> {{clienteActual.correo}}</p>
					<p><strong>Celular:</strong> {{clienteActual.celular}}</p>
					<p><strong>Teléfono:</strong> {{clienteActual.telefono}}</p>
					<p><strong>Dirección:</strong> {{clienteActual.direccion}}</p>
					<p><strong>Nacionalidad:</strong> {{clienteActual.nacionalidad}}</p>
					<p><strong>País/Ciudad:</strong> {{clienteActual.pais_origen}}</p>
				</div>
			</div>

		</div>
		<div class="col">
			<div class="card">
				<div class="card-body">
					<p><strong>Documentación </strong></p>
					<p><strong>Pasaporte:</strong> {{clienteActual.pasaporte}} (vigencia: {{fechaLatamSimple(clienteActual.pasaporte_vigencia) || 'sin dato'}})</p>
					<p><strong>Visado:</strong> <span class="text-capitalize">{{clienteActual.tipo_visado}}</span> (válido hasta: {{fechaLatamSimple(clienteActual.calido_vigencia) || 'sin dato'}})</p>
					<p><strong>Vacunación: </strong> ({{ vacunas?.length }})</p>
					<ul>
						<li class="text-capitalize" v-for="vacuna in vacunas">
							{{vacuna?.certificado}} - {{fechaLatamSimple(vacuna?.fecha)}}
						</li>
					</ul>
					<p><strong>Seguros: </strong> ({{ seguros?.length }})</p>
					<ul>
						<li class="text-capitalize" v-for="seguro in seguros">
							{{seguro?.seguro}} - {{fechaLatamSimple(seguro?.fecha)}}
						</li>
					</ul>
					
					<p><strong>Autorización de viaje:</strong> <span class="text-capitalize">{{clienteActual.autorizacion_viaje}}</span></p>
					<p><strong>Archivos adjuntos:</strong> ({{ archivos?.length }})</p>


					<ul class="list-group list-group-flush ">
						<li class="list-group-item" v-for="(archivo,index) in archivos">
							<div class="d-flex w-100 justify-content-between">
								<span class="text-capitalize">{{ index+1 }}. <a :href="rutaArchivo(archivo?.link)" target='_blank'> {{ archivo?.nombre || 'Archivo sin nombre' }}</a></span>
								<small>{{ archivo?.fecha }}</small>
								<button class="btn btn-outline-danger border-0 rounded-circle" @click="eliminarAdjunto(index)"><i class="bi bi-x"></i></button>
							</div>
						</li>
						<li class="list-group-item" v-if="!clienteActual?.archivos || clienteActual?.archivos.length === 0">No hay archivos adjuntos</li>
					</ul>

				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col table-responsive">
			<p><strong>Compras realizadas</strong></p>
			<table class="table table-hover align-middle">
				<thead>
					<tr>
						<th>#</th>
						<th>Tipo</th>
						<th>Servicio</th>
						<th>Concepto</th>
						<th>Fecha de registro</th>
						<th>Fecha de salida</th>
						<th>Monto (S/)</th>
						<th>Estado</th>
						<th>Método de Pago</th>
						<th>Observaciones</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td>Paquete</td>
						<td class="tdLargo">Turismo vivencial en Cusco</td>
						<td>10/10/2025</td>
						<td class="tdLargo">25/11/2025 05:00 a.m.</td>
						<td>1,450.00</td>
						<td><span class="badge bg-secondary">Pendiente</span></td>
						<td>Transferencia</td>
						<td>Incluye Machu Picchu</td>
						<td>
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
							<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
						</td>
					</tr>
					<tr>
						<td>2</td>
						<td><span class="badge bg-warning text-dark">Reserva</span></td>
						<td>Movibilidad</td>
						<td class="tdLargo">Servicio ida y vuelta</td>
						<td>12/10/2025</td>
						<td class="tdLargo">12/10/2025 3:45 p.m.</td>
						<td>120.00</td>
						<td><span class="badge bg-success">Pagado</span></td>
						<td>Efectivo</td>
						<td>Vehículo SUV</td>
						<td>
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
							<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
						</td>
					</tr>
					<tr>
						<td>3</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td>Tour y vehículo</td>
						<td class="tdLargo">Tour Paracas</td>
						<td>14/10/2025</td>
						<td class="tdLargo">15/10/2025 05:00 a.m.</td>
						<td>280.50</td>
						<td><span class="badge bg-warning text-dark">Con adelanto</span></td>
						<td>Tarjeta</td>
						<td>Con almuerzo incluido</td>
						<td>
							<button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></button>
							<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>		
	</div>
	<ModalSubirArchivo :modelo="'cliente'" ></ModalSubirArchivo>
</template>