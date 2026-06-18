<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import { onMounted, watch, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useProveedoresStore } from '@/stores/proveedorStore'
import { useComisionesStore } from '@/stores/comisionStore'
import { useDepartamentosStore } from '@/stores/departamentoStore';
import { storeToRefs } from 'pinia'
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const { fechaLatamSimple, rutaArchivo, formatMoneda } = useFormat()
const proveedorStore = useProveedoresStore()
const comisionStore = useComisionesStore()
const departamentosStore = useDepartamentosStore();
const {proveedorActual} = storeToRefs(proveedorStore)
const comisiones = ref([])
const nombreDepartamento = computed(() => {
	const depto = departamentosStore.departamentos.find(d => Number(d.id) === Number(proveedorActual.value?.departamento_id));
	return depto ? depto.departamento : '-';
});

const cargarDatos = async ()=>{
	await proveedorStore.obtenerPorId(route.params.id)
}

const cargarComisiones = async () => {
	try {
		await comisionStore.listar({ tipo: 'proveedor', comisionable_id: route.params.id });
		comisiones.value = comisionStore.comisiones || [];
	} catch (error) {
		console.error('Error al cargar comisiones:', error);
	}
}

const comisionForm = ref({
	fecha: new Date().toISOString().slice(0, 10),
	monto: '',
	cant_personas: 1,
	observaciones: '',
});
let modalComisionInstance = null;

const abrirModalComision = () => {
	comisionForm.value = {
		fecha: new Date().toISOString().slice(0, 10),
		monto: '',
		cant_personas: 1,
		observaciones: '',
	};
	if (!modalComisionInstance) {
		modalComisionInstance = new Modal(document.getElementById('modalNuevaComision'));
	}
	modalComisionInstance.show();
};

const guardarComision = async () => {
	if (!comisionForm.value.monto || Number(comisionForm.value.monto) <= 0) {
		Swal.fire('Validación', 'El monto debe ser mayor a 0', 'warning');
		return;
	}
	try {
		await comisionStore.guardar({
			fecha: comisionForm.value.fecha,
			monto: Number(comisionForm.value.monto),
			cant_personas: Number(comisionForm.value.cant_personas),
			observaciones: comisionForm.value.observaciones,
			comisionable_id: Number(route.params.id),
			comisionable_type: 'App\\Models\\Proveedor',
			estado_pago: 'pendiente',
			logistica_id: null,
		});
		modalComisionInstance?.hide();
		await cargarComisiones();
		Swal.fire('Pago registrado', '', 'success');
	} catch (error) {
		console.error('Error al guardar comisión:', error);
		Swal.fire('Error', 'No se pudo guardar la comisión', 'error');
	}
}

onMounted(()=>{
	departamentosStore.listar();
	cargarDatos()
	cargarComisiones()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
		cargarComisiones()
	}
, { immediate: true })

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
					<p><strong>Departamento:</strong> {{ nombreDepartamento }}</p>
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
					<p><strong>Banco:</strong> {{ proveedorActual?.banco || 'Ninguno' }}</p>
					<p><strong># de Cuenta:</strong> {{ proveedorActual?.numero_cuenta }}</p>
					<p><strong>Aplicativo:</strong> {{ proveedorActual?.aplicativo || '-' }}</p>
					<p><strong>Propietario del aplicativo:</strong> {{ proveedorActual?.propietario_aplicativo || '-' }}</p>
					<p><strong>Observaciones:</strong> {{ proveedorActual?.observaciones || '-' }}</p>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-body">
					<p><strong>📎 Archivos adjuntos ({{ proveedorActual?.archivos?.length }})</strong></p>

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
	<div class="row mt-3 mb-5">
		<div class="col-12">
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					<h6 class="mb-0 fw-bold"><i class="bi bi-cash-stack"></i> Comisiones</h6>
					<button class="btn btn-sm btn-outline-primary" @click="abrirModalComision"><i class="bi bi-plus-lg"></i> Agregar comisión</button>
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

	<!-- Modal Nueva Comisión -->
	<div class="modal fade" id="modalNuevaComision" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-sm modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Nueva comisión</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row g-3">
						<div class="col-12">
							<label class="form-label">Fecha</label>
							<input type="date" class="form-control" v-model="comisionForm.fecha">
						</div>
						<div class="col-12">
							<label class="form-label">Monto (S/) <span class="text-danger">*</span></label>
							<input type="number" class="form-control" v-model="comisionForm.monto" step="0.01" min="0">
						</div>
						<div class="col-12">
							<label class="form-label">Personas</label>
							<input type="number" class="form-control" v-model="comisionForm.cant_personas" min="1">
						</div>
						<div class="col-12">
							<label class="form-label">Paquete / Observaciones</label>
							<textarea class="form-control" rows="2" v-model="comisionForm.observaciones"></textarea>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary" @click="guardarComision">Guardar</button>
				</div>
			</div>
		</div>
	</div>

	<ModalSubirArchivo :modelo="'proveedor'"></ModalSubirArchivo>
</template>
