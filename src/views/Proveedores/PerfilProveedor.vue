<script setup>
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue'
import { onMounted, watch, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormat } from '@/composables/formatos';
import { useProveedoresStore } from '@/stores/proveedorStore'
import { usePagosStore } from '@/stores/pagoStore'
import { useDepartamentosStore } from '@/stores/departamentoStore';
import { storeToRefs } from 'pinia'
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const { fechaLatamSimple, rutaArchivo, formatMoneda, capitalizeFirst } = useFormat()
const proveedorStore = useProveedoresStore()
const pagoStore = usePagosStore()
const departamentosStore = useDepartamentosStore();
const {proveedorActual} = storeToRefs(proveedorStore)
const comisiones = ref([])
const cobros = ref([])
const pagosPorPagar = ref([])
const nombreDepartamento = computed(() => {
	const depto = departamentosStore.departamentos.find(d => Number(d.id) === Number(proveedorActual.value?.departamento_id));
	return depto ? depto.departamento : '-';
});

const cargarDatos = async ()=>{
	await proveedorStore.obtenerPorId(route.params.id)
}

// Carga todo: cobros (por cobrar), pagos de ventas del vendedor (por pagar) y comisiones
const cargarTodo = async () => {
	try {
		const res = await pagoStore.listarTodos({ proveedor_id: route.params.id });
		const lista = Array.isArray(res) ? res : [];
		cobros.value = lista.filter(p => p.es_cobro === true);
		pagosPorPagar.value = lista.filter(p => p.es_cobro === false && p.origen === 'pago');
		comisiones.value = lista.filter(p => p.origen === 'comision');
	} catch (error) {
		console.error('Error al cargar pagos:', error);
	}
}

// ── Sumatorias de adelantos ──
const totalAdelantadoComision = (item) => {
	return (item.pagos || []).reduce((sum, p) => sum + Number(p.monto || 0), 0);
};

const saldoComision = (item) => {
	return Math.max(0, Number(item.monto || 0) - totalAdelantadoComision(item));
};

const totalCobro = (cobro) => {
	return Number(cobro.monto || 0) + Number(cobro.saldo_pendiente || 0);
};

// ── Pago por pagar (egreso) del proveedor ──
const pagoPagarForm = ref({
	concepto: '',
	fecha: new Date().toISOString().slice(0, 10),
	monto: '',
	monto_pagado: '',
	metodo_pago: 'efectivo',
	codigo_referencia: '',
	observaciones: '',
});
let modalPagoPagarInstance = null;

const abrirModalPagoPagar = () => {
	pagoPagarForm.value = {
		concepto: '',
		fecha: new Date().toISOString().slice(0, 10),
		monto: '',
		monto_pagado: '',
		metodo_pago: 'efectivo',
		codigo_referencia: '',
		observaciones: '',
	};
	if (!modalPagoPagarInstance) {
		modalPagoPagarInstance = new Modal(document.getElementById('modalPagoPagar'));
	}
	modalPagoPagarInstance.show();
};

const guardarPagoPagar = async () => {
	if (!pagoPagarForm.value.monto || Number(pagoPagarForm.value.monto) <= 0) {
		Swal.fire('Validación', 'El monto total debe ser mayor a 0', 'warning');
		return;
	}
	try {
		await pagoStore.guardarProveedor({
			proveedor_id: Number(route.params.id),
			fecha: pagoPagarForm.value.fecha,
			monto: Number(pagoPagarForm.value.monto),
			monto_recibido: Number(pagoPagarForm.value.monto_pagado || 0),
			es_cobro: false,
			concepto: pagoPagarForm.value.concepto,
			metodo_pago: pagoPagarForm.value.metodo_pago,
			codigo_referencia: pagoPagarForm.value.codigo_referencia,
			observaciones: pagoPagarForm.value.observaciones,
		});
		modalPagoPagarInstance?.hide();
		await cargarTodo();
		Swal.fire('Pago por pagar registrado', '', 'success');
	} catch (error) {
		console.error('Error al registrar pago por pagar:', error);
		Swal.fire('Error', 'No se pudo registrar el pago por pagar', 'error');
	}
}

// ── Cobro (ingreso) del proveedor ──
const metodosPago = [
	'efectivo',
	'yape',
	'plin',
	'transferencia',
	'depósito',
	'tarjeta',
	'POS',
];

const cobroForm = ref({
	fecha: new Date().toISOString().slice(0, 10),
	concepto: '',
	monto: '',
	monto_recibido: '',
	metodo_pago: 'efectivo',
	codigo_referencia: '',
	observaciones: '',
});
let modalCobroInstance = null;

const abrirModalCobro = () => {
	cobroForm.value = {
		fecha: new Date().toISOString().slice(0, 10),
		concepto: '',
		monto: '',
		monto_recibido: '',
		metodo_pago: 'efectivo',
		codigo_referencia: '',
		observaciones: '',
	};
	if (!modalCobroInstance) {
		modalCobroInstance = new Modal(document.getElementById('modalCobroProveedor'));
	}
	modalCobroInstance.show();
};

const guardarCobro = async () => {
	if (!cobroForm.value.monto || Number(cobroForm.value.monto) <= 0) {
		Swal.fire('Validación', 'El monto total debe ser mayor a 0', 'warning');
		return;
	}
	try {
		await pagoStore.guardarProveedor({
			proveedor_id: Number(route.params.id),
			fecha: cobroForm.value.fecha,
			concepto: cobroForm.value.concepto,
			monto: Number(cobroForm.value.monto),
			monto_recibido: Number(cobroForm.value.monto_recibido || 0),
			metodo_pago: cobroForm.value.metodo_pago,
			codigo_referencia: cobroForm.value.codigo_referencia,
			observaciones: cobroForm.value.observaciones,
		});
		modalCobroInstance?.hide();
		await cargarTodo();
		Swal.fire('Cobro registrado', '', 'success');
	} catch (error) {
		console.error('Error al registrar cobro:', error);
		Swal.fire('Error', 'No se pudo registrar el cobro', 'error');
	}
}

onMounted(()=>{
	departamentosStore.listar();
	cargarDatos()
	cargarTodo()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
		cargarTodo()
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
			<button class="btn btn-outline-danger" @click="abrirModalPagoPagar"><i class="bi bi-arrow-down-circle"></i> Por pagar</button>
			<button class="btn btn-outline-success" @click="abrirModalCobro"><i class="bi bi-arrow-up-circle"></i> Por cobrar</button>
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
	<!-- ══════════ 1. PAGOS POR COBRAR ══════════ -->
	<div class="row mt-3 mb-5">
		<div class="col-12">
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					<h6 class="mb-0 fw-bold"><i class="bi bi-arrow-up-circle text-success"></i> Pagos por cobrar</h6>
					<span class="badge text-bg-success">{{ cobros.length }}</span>
				</div>
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-bordered align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th>#</th>
									<th>Fecha</th>
									<th>Concepto</th>
									<th>Método</th>
									<th>Total</th>
									<th>Adelantado</th>
									<th>Pendiente</th>
									<th>Referencia</th>
									<th>Estado</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(cobro, index) in cobros" :key="cobro.id" style="cursor:pointer;" @click="router.push('/cobro/' + cobro.id)">
									<td class="text-muted">{{ index + 1 }}</td>
									<td>{{ fechaLatamSimple(cobro.fecha) }}</td>
									<td>{{ cobro.concepto || '-' }}</td>
									<td class="text-capitalize">{{ cobro.metodo_pago || '-' }}</td>
									<td>{{ formatMoneda(totalCobro(cobro)) }}</td>
									<td class="text-success fw-semibold">{{ formatMoneda(cobro.monto) }}</td>
									<td class="text-danger fw-semibold">{{ formatMoneda(cobro.saldo_pendiente) }}</td>
									<td>{{ cobro.codigo_referencia || '-' }}</td>
									<td class="text-end" @click.stop>
										<span class="badge border text-capitalize" :class="{
											'border-success text-success': cobro.estado_pago === 'pagado',
											'border-info text-info': cobro.estado_pago === 'adelantado',
											'border-warning text-warning': cobro.estado_pago === 'pendiente',
										}">
											{{ cobro.estado_pago === 'adelantado' ? 'Con adelanto' : cobro.estado_pago === 'pendiente' ? 'Pendiente' : cobro.estado_pago === 'pagado' ? 'Pagado' : cobro.estado_pago || '-' }}
										</span>
										<button class="btn btn-sm btn-outline-primary ms-1" title="Ver cobro" @click="router.push('/cobro/' + cobro.id)"><i class="bi bi-eye"></i></button>
									</td>
								</tr>
								<tr v-if="cobros.length === 0">
									<td colspan="9" class="text-muted text-center">No hay cobros registrados</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ══════════ 2. PAGOS POR PAGAR ══════════ -->
	<div class="row mt-3 mb-5">
		<div class="col-12">
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					<h6 class="mb-0 fw-bold"><i class="bi bi-arrow-down-circle text-danger"></i> Pagos por pagar</h6>
					<span class="badge text-bg-danger">{{ pagosPorPagar.length }}</span>
				</div>
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-bordered align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th>#</th>
									<th>Fecha</th>
									<th>Concepto</th>
									<th>Método</th>
									<th>Monto</th>
									<th>Pendiente</th>
									<th>Estado</th>
									<th>Referencia</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(pago, index) in pagosPorPagar" :key="pago.id" style="cursor:pointer;" @click="router.push('/pago/' + pago.id)">
									<td class="text-muted">{{ index + 1 }}</td>
									<td>{{ fechaLatamSimple(pago.fecha) }}</td>
									<td>{{ capitalizeFirst(pago.concepto) || '-' }}</td>
									<td class="text-capitalize">{{ pago.metodo_pago || '-' }}</td>
									<td class="text-primary fw-semibold">{{ formatMoneda(pago.monto) }}</td>
									<td class="text-danger fw-semibold">{{ pago.saldo_pendiente != null ? formatMoneda(pago.saldo_pendiente) : '-' }}</td>
									<td>
										<span class="badge border text-capitalize" :class="{
											'border-success text-success': pago.estado_pago === 'pagado',
											'border-info text-info': pago.estado_pago === 'adelantado',
											'border-warning text-warning': pago.estado_pago === 'pendiente',
										}">
											{{ pago.estado_pago || '-' }}
										</span>
									</td>
									<td>{{ pago.codigo_referencia || '-' }}</td>
									<td class="text-end" @click.stop>
										<button class="btn btn-sm btn-outline-primary" title="Ver pago" @click="router.push('/pago/' + pago.id)"><i class="bi bi-eye"></i></button>
									</td>
								</tr>
								<tr v-if="pagosPorPagar.length === 0">
									<td colspan="9" class="text-muted text-center">No hay pagos por pagar</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ══════════ 3. COMISIONES ══════════ -->
	<div class="row mt-3 mb-5">
		<div class="col-12">
			<div class="card">
				<div class="card-header d-flex justify-content-between align-items-center">
					<h6 class="mb-0 fw-bold"><i class="bi bi-percent text-primary"></i> Comisiones</h6>
					<span class="badge text-bg-primary">{{ comisiones.length }}</span>
				</div>
				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-bordered align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th>#</th>
									<th>Fecha</th>
									<th>Descripción</th>
									<th>Personas</th>
									<th>Monto</th>
									<th>Adelantado</th>
									<th>Saldo</th>
									<th>Estado</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in comisiones" :key="item.id" style="cursor:pointer;" @click="router.push('/comision/' + item.id)">
									<td class="text-muted">{{ index + 1 }}</td>
									<td>{{ fechaLatamSimple(item.fecha) }}</td>
									<td>{{ item.descripcion || '-' }}</td>
									<td>{{ item.cant_personas }}</td>
									<td>{{ formatMoneda(item.monto) }}</td>
									<td class="text-success fw-semibold">{{ formatMoneda(totalAdelantadoComision(item)) }}</td>
									<td class="text-danger fw-semibold">{{ formatMoneda(saldoComision(item)) }}</td>
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
									<td colspan="9" class="text-muted text-center">No hay comisiones registradas</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Nuevo pago por pagar -->
	<div class="modal fade" id="modalPagoPagar" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-sm modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Nuevo pago por pagar</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row g-3">
						<div class="col-12">
							<label class="form-label">Concepto</label>
							<input type="text" class="form-control" v-model="pagoPagarForm.concepto" placeholder="Ej: Servicio de transporte">
						</div>
						<div class="col-12">
							<label class="form-label">Fecha</label>
							<input type="date" class="form-control" v-model="pagoPagarForm.fecha">
						</div>
						<div class="col-12">
							<label class="form-label">Monto total (S/) <span class="text-danger">*</span></label>
							<input type="number" class="form-control" v-model="pagoPagarForm.monto" step="0.01" min="0">
						</div>
						<div class="col-12">
							<label class="form-label">Monto pagado (S/)</label>
							<input type="number" class="form-control" v-model="pagoPagarForm.monto_pagado" step="0.01" min="0" placeholder="0.00">
							<small class="text-muted">Abono inicial. Si se deja vacío, queda pendiente.</small>
						</div>
						<div class="col-12">
							<label class="form-label">Método de pago</label>
							<select class="form-select text-capitalize" v-model="pagoPagarForm.metodo_pago">
								<option v-for="metodo in metodosPago" :key="metodo" :value="metodo">{{ metodo }}</option>
							</select>
						</div>
						<div class="col-12">
							<label class="form-label">Código de referencia</label>
							<input type="text" class="form-control" v-model="pagoPagarForm.codigo_referencia" placeholder="Ej: FA01-001">
						</div>
						<div class="col-12">
							<label class="form-label">Observaciones</label>
							<textarea class="form-control" rows="2" v-model="pagoPagarForm.observaciones"></textarea>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-danger" @click="guardarPagoPagar">Registrar pago por pagar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Cobro (ingreso) del proveedor -->
	<div class="modal fade" id="modalCobroProveedor" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-sm modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Registrar cobro</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row g-3">
						<div class="col-12">
							<label class="form-label">Fecha</label>
							<input type="date" class="form-control" v-model="cobroForm.fecha">
						</div>
						<div class="col-12">
							<label class="form-label">Concepto</label>
							<input type="text" class="form-control" v-model="cobroForm.concepto" placeholder="Ej: Comisión por tour">
						</div>
						<div class="col-12">
							<label class="form-label">Monto total (S/) <span class="text-danger">*</span></label>
							<input type="number" class="form-control" v-model="cobroForm.monto" step="0.01" min="0">
						</div>
						<div class="col-12">
							<label class="form-label">Monto recibido (S/)</label>
							<input type="number" class="form-control" v-model="cobroForm.monto_recibido" step="0.01" min="0" placeholder="0.00">
							<small class="text-muted">Abono inicial. Si se deja vacío, el cobro queda pendiente.</small>
						</div>
						<div class="col-12">
							<label class="form-label">Método de pago</label>
							<select class="form-select text-capitalize" v-model="cobroForm.metodo_pago">
								<option v-for="metodo in metodosPago" :key="metodo" :value="metodo">{{ metodo }}</option>
							</select>
						</div>
						<div class="col-12">
							<label class="form-label">Código de referencia</label>
							<input type="text" class="form-control" v-model="cobroForm.codigo_referencia" placeholder="Ej: FA01-001">
						</div>
						<div class="col-12">
							<label class="form-label">Observaciones</label>
							<textarea class="form-control" rows="2" v-model="cobroForm.observaciones"></textarea>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-success" @click="guardarCobro">Registrar cobro</button>
				</div>
			</div>
		</div>
	</div>

	<ModalSubirArchivo :modelo="'proveedor'"></ModalSubirArchivo>
</template>
