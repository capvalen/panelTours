<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import { onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router'
import { useClienteStore } from '@/stores/clienteStore';
import { useVentasStore } from '@/stores/ventaStore';
import { useFormat } from '@/composables/formatos';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2'
const route = useRoute() //instancia hacia la ruta
const { fechaLatamSimple, rutaArchivo, formatMoneda, capitalize } = useFormat()

const clienteStore = useClienteStore()
const ventaStore = useVentasStore()
const {clienteActual} = storeToRefs(clienteStore)
const vacunas = computed( ()=> clienteActual.value?.vacunas)
const seguros = computed( ()=> clienteActual.value?.seguros)
const archivos = computed( ()=> clienteActual.value?.archivos)
const compras = computed(() => clienteActual.value?.ventas || [])
const MAX_CONCEPTO_LEN = 43

const truncarTexto = (texto, max = MAX_CONCEPTO_LEN) => {
	if (!texto) return '-'
	const limpio = String(texto).trim()
	return limpio.length > max ? `${limpio.slice(0, max)}...` : limpio
}

const badgeEstadoClass = (estadoPago) => {
	const estado = (estadoPago || '').toLowerCase();
	if (estado === 'pagado') return 'bg-success';
	if (estado === 'adelanto') return 'bg-warning text-dark';
	return 'bg-secondary';
};

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

const anularVenta = async (id, concepto) => {
	const result = await Swal.fire({
		title: '¿Anular venta?',
		text: `Se anulará el servicio "${concepto}"`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, anular',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#d33',
	});
	if (result.isConfirmed) {
		await ventaStore.anular(id);
		await Swal.fire('Eliminado', 'Venta anulada', 'success');
		await cargarDatos();
	}
};

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
			<router-link :to="`/cotizacion/nueva?clienteId=${route.params.id}`" class="btn btn-outline-primary"><i class="bi bi-file-text"></i> Crear cotización</router-link>
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
				<div class="card-body">
					<p><strong>💉 Vacunas ({{ vacunas?.length }})</strong></p>
					<ul v-if="vacunas?.length">
						<li v-for="vacuna in vacunas" class="text-capitalize">
							🩺 {{ vacuna?.certificado }} - {{ fechaLatamSimple(vacuna?.fecha) }}
						</li>
					</ul>
					<p v-else class="text-muted">Sin vacunas registradas</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-body">
					<p><strong>🛡️ Seguros ({{ seguros?.length }})</strong></p>
					<ul v-if="seguros?.length">
						<li v-for="seguro in seguros" class="text-capitalize">
							📄 {{ seguro?.seguro }} - {{ fechaLatamSimple(seguro?.fecha) }}
						</li>
					</ul>
					<p v-else class="text-muted">Sin seguros registrados</p>
				</div>
			</div>

			<div class="card">
				<div class="card-body">
					<p><strong>📎 Archivos adjuntos ({{ archivos?.length }})</strong></p>
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
			<div class="table-responsive">
				<table class="table table-hover align-middle">
				<thead>
					<tr>
						<th>#</th>
						<th>Tipo</th>
						<th>Etapa</th>
						<th>Concepto</th>
						<th>Fecha de registro</th>
						<th>Fecha de salida</th>
						<th>Monto (S/)</th>
						<th>Estado</th>
						<th>Método de Pago</th>
						<th>Categorías</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(compra, index) in compras" :key="compra.id">
						<td>{{ index + 1 }}</td>
						<td><span class="badge bg-info text-white">Venta</span></td>
						<td>{{ capitalize(compra.progreso || 'cotización') }}</td>
						<td class="tdLargo">
							{{ truncarTexto(compra.items?.map(i => i.descripcion).filter(Boolean).join(' | ')) }}
						</td>
						<td>{{ compra.created_at ? fechaLatamSimple(compra.created_at) : '-' }}</td>
						<td class="tdLargo">{{ compra.fecha ? fechaLatamSimple(compra.fecha) : '-' }}</td>
						<td>{{ formatMoneda(Number(compra.precio || 0)) }}</td>
						<td>
							<span class="badge" :class="badgeEstadoClass(compra.estado_pago)">
								{{ capitalize(compra.estado_pago || 'pendiente') }}
							</span>
						</td>
						<td class="text-capitalize">{{ capitalize(compra.metodo_pago || '-') }}</td>
						<td class="text-capitalize">{{ compra.items?.map(i => i.tipo).filter(Boolean).join(', ') || '-' }}</td>
						<td>
							<div class="d-flex gap-2" v-if="compra.estado != 'anulado'">
								<router-link :to="`/venta/detalle/${compra.id}`" class="btn btn-sm btn-outline-primary me-1">
									<i class="bi bi-eye"></i>
								</router-link>
								<button class="btn btn-sm btn-outline-warning" @click="anularVenta(compra.id, `${capitalize(compra.items?.[0]?.descripcion || 'servicio')} ${clienteActual ? ' de ' + (clienteActual.razon_social || clienteActual.nombres) : ''}`)" title="Anular servicio">
									<i class="bi bi-ban"></i>
								</button>
							</div>
							<p v-else class="text-danger"><small>Anulado</small></p>
						</td>
					</tr>
					<tr v-if="!compras.length">
						<td colspan="11" class="text-center text-muted">Sin compras registradas</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
	<ModalSubirArchivo :modelo="'cliente'" ></ModalSubirArchivo>
</template>
