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

	<div class="row">
		<!-- Columna izquierda: Datos personales / empresa -->
		<div class="col-md-6">
			<div class="card mb-3">
				
				<div class="card-body">
					<p><strong>🧑 Datos personales</strong></p>

					<!-- Persona natural -->
					<div v-if="clienteActual.apellidos">
						<p><strong>Nombres:</strong> {{ clienteActual.nombres }}</p>
						<p><strong>Apellidos:</strong> {{ clienteActual.apellidos }}</p>
						<p><strong>DNI:</strong> {{ clienteActual.dni }}</p>
					</div>

					<!-- Persona jurídica -->
					<div v-if="clienteActual.razon_social">
						<p><strong>Razón Social:</strong> {{ clienteActual.razon_social }}</p>
						<p><strong>RUC:</strong> {{ clienteActual.ruc }}</p>
					</div>

					<hr />

					<p><strong> Fecha de Nacimiento:</strong> {{ fechaLatamSimple(clienteActual.fecha_nacimiento) }}</p>
					<p><strong> Nacionalidad:</strong> {{ clienteActual.nacionalidad }}</p>
					<p><strong> País/Ciudad:</strong> {{ clienteActual.pais_origen }}</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-body">
					<p><strong>📞 Contacto</strong></p>
					<p><strong>Correo:</strong> {{ clienteActual.correo }}</p>
					<p><strong>Celular:</strong> {{ clienteActual.celular }}</p>
					<p><strong>Teléfono:</strong> {{ clienteActual.telefono }}</p>
					<p><strong>Dirección:</strong> {{ clienteActual.direccion }}</p>
				</div>
			</div>
		</div>

		<!-- Columna derecha: Documentación y archivos -->
		<div class="col-md-6">
			<div class="card mb-3">
				
				<div class="card-body">
					<p><strong>🛂 Documentación de viaje</strong></p>
					<p><strong>Pasaporte:</strong> {{ clienteActual.pasaporte || 'No registrado' }}
						<span v-if="clienteActual.pasaporte_vigencia">(vigencia:
							{{ fechaLatamSimple(clienteActual.pasaporte_vigencia) }})</span>
					</p>
					<p><strong>Visado:</strong>
						<span class="text-capitalize">{{ clienteActual.tipo_visado || 'No registrado' }}</span>
						<span v-if="clienteActual.calido_vigencia">(válido hasta:
							{{ fechaLatamSimple(clienteActual.calido_vigencia) }})</span>
					</p>
					<p><strong>Autorización de viaje:</strong>
						<span class="text-capitalize">{{ clienteActual.autorizacion_viaje || 'No registrada' }}</span>
					</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-header bg-success text-white">
					<strong>💉 Vacunas ({{ vacunas?.length }})</strong>
				</div>
				<div class="card-body">
					<ul v-if="vacunas?.length">
						<li v-for="vacuna in vacunas" class="text-capitalize">
							🩺 {{ vacuna?.certificado }} - {{ fechaLatamSimple(vacuna?.fecha) }}
						</li>
					</ul>
					<p v-else class="text-muted">Sin vacunas registradas</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-header bg-warning text-dark">
					<strong>🛡️ Seguros ({{ seguros?.length }})</strong>
				</div>
				<div class="card-body">
					<ul v-if="seguros?.length">
						<li v-for="seguro in seguros" class="text-capitalize">
							📄 {{ seguro?.seguro }} - {{ fechaLatamSimple(seguro?.fecha) }}
						</li>
					</ul>
					<p v-else class="text-muted">Sin seguros registrados</p>
				</div>
			</div>

			<div class="card">
				<div class="card-header bg-dark text-white">
					<strong>📎 Archivos adjuntos ({{ archivos?.length }})</strong>
				</div>
				<div class="card-body p-0">
					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="(archivo, index) in archivos" :key="index">
							<div class="d-flex justify-content-between align-items-center">
								<span>
									📁 {{ index + 1 }}.
									<a :href="rutaArchivo(archivo?.link)" target="_blank">
										{{ archivo?.nombre || 'Archivo sin nombre' }}
									</a>
								</span>
								<small class="text-muted">{{ archivo?.fecha }}</small>
								<button class="btn btn-sm btn-outline-danger rounded-circle" @click="eliminarAdjunto(index)">
									❌
								</button>
							</div>
						</li>
						<li class="list-group-item text-muted" v-if="!archivos?.length">
							No hay archivos adjuntos
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3 mb-5">
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