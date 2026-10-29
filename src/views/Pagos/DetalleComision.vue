<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import api from '@/services/axios';
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue';
import { useComisionesStore } from '@/stores/comisionStore';
import { useCajaStore } from '@/stores/cajaStore';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2';

const props = defineProps({ id: String });
const route = useRoute();
const router = useRouter();
const comisionStore = useComisionesStore();
const cajaStore = useCajaStore();
const { fechaLatamSimple, formatMoneda, rutaArchivo, capitalize } = useFormat();

const item = ref(null);
const cajaAbierta = ref(null);
const cajaVerificada = ref(false);
const actualizandoEstado = ref(false);
const montoEdit = ref(0);
let debounceTimer = null;

const estadosPago = ['pendiente', 'adelantado', 'pagado', 'anulado'];

const totalPagado = computed(() => {
	return (item.value?.pagos || []).reduce((sum, p) => sum + Number(p.monto || 0), 0);
});

const saldoPendiente = computed(() => {
	return Math.max(0, Number(item.value?.monto || 0) - totalPagado.value);
});

const pagoForm = ref({
	monto: 0,
});

const montoPago = computed(() => Number(pagoForm.value.monto || 0));

const esPagoTotal = computed(() => {
	return montoPago.value > 0 &&
		Math.round(montoPago.value * 100) / 100 >= Math.round(saldoPendiente.value * 100) / 100;
});

const pagoValido = computed(() => {
	return montoPago.value > 0 && montoPago.value <= saldoPendiente.value;
});

const ajustarMonto = () => {
	if (montoPago.value > saldoPendiente.value) {
		pagoForm.value.monto = saldoPendiente.value;
	} else if (montoPago.value < 0) {
		pagoForm.value.monto = 0;
	}
};

let modalPagoInstance = null;

const cargarCajaAbierta = async () => {
	try {
		cajaAbierta.value = await cajaStore.obtenerCajaAbierta();
	} catch (error) {
		console.error('Error al verificar la caja abierta:', error);
		cajaAbierta.value = null;
	} finally {
		cajaVerificada.value = true;
	}
};

const verificarCajaAbierta = async () => {
	await cargarCajaAbierta();

	if (!cajaAbierta.value) {
		Swal.fire({
			title: 'No hay una caja abierta',
			text: 'Debe aperturar una caja para registrar el pago.',
			icon: 'warning',
		});
		return false;
	}

	return true;
};

const abrirModalPago = async () => {
	if (!(await verificarCajaAbierta())) return;

	pagoForm.value = { monto: saldoPendiente.value };
	if (!modalPagoInstance) {
		modalPagoInstance = new Modal(document.getElementById('modalPago'));
	}
	modalPagoInstance.show();
};

const confirmarPago = async () => {
	const monto = montoPago.value;
	// El estado depende del total pagado acumulado:
	// si el monto cubre todo el saldo pendiente, la comisión queda pagada.
	const totalConPago = Math.round((totalPagado.value + Number(monto || 0)) * 100) / 100;
	const nuevoEstado = totalConPago >= Number(item.value?.monto || 0) ? 'pagado' : 'adelantado';
	const hoy = new Date().toISOString().split('T')[0];

	try {
		// Verificar nuevamente al confirmar, por si la caja se cerró con el modal abierto.
		if (!(await verificarCajaAbierta())) return;

		await api.post('/comision-pagos', {
			comision_id: item.value.id,
			fecha: hoy,
			monto,
		});

		await comisionStore.actualizar(item.value.id, { estado_pago: nuevoEstado });

		await api.post('/caja_detalles', {
			caja_id: cajaAbierta.value.id,
			tipo: 'egreso',
			categoria: 'pago de comisión',
			monto,
			concepto: `Pago ${String(item.value.id).padStart(3, '0')} - ${nombreComisionable(item.value)}`,
			fecha: hoy,
			comprobante_pago: 'interno',
			proveedor_id: 1,
			observaciones: item.value.observaciones || '',
		});

		item.value = await comisionStore.obtenerPorId(item.value.id);

		modalPagoInstance?.hide();
		Swal.fire({ title: 'Pago registrado', icon: 'success', timer: 2000, showConfirmButton: false });
	} catch (err) {
		console.error(err);
		Swal.fire('Error', 'No se pudo registrar el pago', 'error');
	}
};

onMounted(async () => {
	const id = props.id || route.params.id;
	item.value = await comisionStore.obtenerPorId(id);
	montoEdit.value = item.value.monto;
	await cargarCajaAbierta();
});

const actualizarMonto = (val) => {
	const monto = parseFloat(val) || 0;
	montoEdit.value = monto;
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(async () => {
		await comisionStore.actualizar(item.value.id, { monto });
		item.value.monto = monto;
	}, 600);
};

const editandoEstadoPago = ref(false);
const estadoPagoEdit = ref('pendiente');

const iniciarEdicionEstadoPago = () => {
	estadoPagoEdit.value = item.value.estado_pago || 'pendiente';
	editandoEstadoPago.value = true;
};

const cancelarEdicionEstadoPago = () => {
	editandoEstadoPago.value = false;
};

const guardarEstadoPago = async () => {
	if (estadoPagoEdit.value === item.value.estado_pago) {
		editandoEstadoPago.value = false;
		return;
	}

	actualizandoEstado.value = true;
	try {
		await comisionStore.actualizar(item.value.id, { estado_pago: estadoPagoEdit.value });
		item.value.estado_pago = estadoPagoEdit.value;
		editandoEstadoPago.value = false;
		Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
	} catch (error) {
		console.error('Error al actualizar el estado de pago:', error);
		Swal.fire('Error', 'No se pudo actualizar el estado de pago', 'error');
	} finally {
		actualizandoEstado.value = false;
	}
};

// ── Comisionable: Guia | Vehiculo | Proveedor ──
const tipoComisionable = (i) => {
	if (!i?.comisionable_type) return '-';
	if (i.comisionable_type.includes('Guia')) return 'Guía';
	if (i.comisionable_type.includes('Proveedor')) return 'Proveedor';
	return 'Vehículo';
};

const nombreComisionable = (i) => {
	if (!i?.comisionable) return '-';
	if (i.comisionable_type?.includes('Guia')) {
		return capitalize(i.comisionable.nombre) || '-';
	}
	if (i.comisionable_type?.includes('Proveedor')) {
		return capitalize(i.comisionable.razon_social || i.comisionable.contacto) || '-';
	}
	return capitalize(i.comisionable.nombre_conductor || i.comisionable.placa) || '-';
};

const tipoPago = (pago) => {
	let acumulado = 0;
	for (const p of item.value?.pagos || []) {
		if (p.id === pago.id) break;
		acumulado += Number(p.monto || 0);
	}
	const saldoAntes = Number(item.value?.monto || 0) - acumulado;
	return Number(pago.monto) >= saldoAntes ? 'Pago total' : 'Adelanto';
};

const rutaComisionable = (i) => {
	if (!i?.comisionable) return null;
	if (i.comisionable_type?.includes('Guia')) {
		return { name: 'perfilGuia', params: { id: i.comisionable.id } };
	}
	if (i.comisionable_type?.includes('Proveedor')) {
		return { name: 'perfilProveedor', params: { id: i.comisionable.id } };
	}
	return { name: 'perfilVehiculo', params: { id: i.comisionable.id } };
};
</script>

<template>
	<div v-if="item">
		<h1>Comisión COM-{{ String(item.id).padStart(3, '0') }}</h1>
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item"><router-link to="/pagos">Pagos</router-link></li>
				<li class="breadcrumb-item active">COM-{{ String(item.id).padStart(3, '0') }}</li>
			</ol>
		</nav>

		<div class="card">
			<div class="card-body">
				<dl class="row mb-0">
					<dt class="col-sm-3">Fecha</dt>
					<dd class="col-sm-9">{{ fechaLatamSimple(item.fecha) }}</dd>

					<dt class="col-sm-3">Paquete logístico</dt>
					<dd class="col-sm-9">
						<router-link v-if="item.logistica_id" :to="{ name: 'LogisticaDetalle', params: { id: item.logistica_id } }">
							LOG-{{ String(item.logistica_id).padStart(3, '0') }} ⋅ {{ item.observaciones }}
						</router-link>
						<span v-else>-</span>
					</dd>

					<dt class="col-sm-3">Tipo</dt>
					<dd class="col-sm-9">{{ tipoComisionable(item) }}</dd>

					<dt class="col-sm-3">Beneficiario</dt>
					<dd class="col-sm-9">
						<router-link v-if="rutaComisionable(item)" :to="rutaComisionable(item)">
							{{ nombreComisionable(item) }}
						</router-link>
						<span v-else>{{ nombreComisionable(item) }}</span>
					</dd>

					<dt class="col-sm-3">Estado pago</dt>
					<dd class="col-sm-9">
						<span v-if="!editandoEstadoPago" class="text-capitalize">
							{{ item.estado_pago }}
							<button class="btn btn-sm btn-link p-0 ms-1" @click="iniciarEdicionEstadoPago" title="Editar estado de pago">
								<i class="bi bi-pencil"></i>
							</button>
						</span>
						<div v-else class="d-flex align-items-center gap-1">
							<select class="form-select form-select-sm w-auto" v-model="estadoPagoEdit" :disabled="actualizandoEstado">
								<option v-for="estado in estadosPago" :key="estado" :value="estado">
									{{ capitalize(estado) }}
								</option>
							</select>
							<button class="btn btn-sm btn-success" @click="guardarEstadoPago" :disabled="actualizandoEstado" title="Guardar">
								<i class="bi bi-check-lg"></i>
							</button>
							<button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionEstadoPago" :disabled="actualizandoEstado" title="Cancelar">
								<i class="bi bi-x-lg"></i>
							</button>
						</div>
					</dd>
				</dl>
			</div>
		</div>

		<div class="row mt-3">
			<div class="col-md-6">
				<div class="card h-100">
					<div class="card-body">
						<h6 class="fw-bold mb-2">Pago</h6>
						<table class="table table-bordered align-middle mb-0 text-center">
							<thead class="table-light">
								<tr>
									<th class="text-center">N° de personas</th>
									<th class="text-center">Pago Total</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="text-center">{{ item.cant_personas }}</td>
									<td class="text-center">
										<input type="number" step="0.01" class="form-control form-control-sm text-center mx-auto" style="width:160px" :value="montoEdit" @input="actualizarMonto($event.target.value)">
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="card h-100">
					<div class="card-body d-flex flex-column justify-content-between">
						<div>
							<h6 class="fw-bold">Adelanto</h6>
							<p class="mb-1"><strong>Total pagado:</strong> {{ formatMoneda(totalPagado) }}</p>
							<p class="mb-1"><strong>Saldo pendiente:</strong> {{ formatMoneda(saldoPendiente) }}</p>
						</div>
						<button v-if="saldoPendiente > 0 && cajaVerificada && cajaAbierta" class="btn btn-primary mt-3" @click="abrirModalPago">
							<i class="bi bi-cash"></i> Realizar pago
						</button>
						<div v-else-if="saldoPendiente > 0 && cajaVerificada && !cajaAbierta" class="alert alert-warning mt-3 mb-0 py-2 small">
							<i class="bi bi-exclamation-triangle"></i> No hay una caja abierta
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="card mt-3" v-if="item.pagos?.length">
			<div class="card-body">
				<h6 class="fw-bold mb-2">Historial de pagos</h6>
				<table class="table table-bordered align-middle mb-0">
					<thead class="table-light">
						<tr>
							<th style="width:50px">N°</th>
							<th>Fecha</th>
							<th>Monto</th>
							<th>Tipo</th>
							<th>Observaciones</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(pago, idx) in item.pagos" :key="pago.id">
							<td>{{ idx + 1 }}</td>
							<td>{{ fechaLatamSimple(pago.fecha) }}</td>
							<td>{{ formatMoneda(pago.monto) }}</td>
							<td>
								<span :class="tipoPago(pago) === 'Pago total' ? 'badge text-bg-success' : 'badge text-bg-warning'">
									{{ tipoPago(pago) }}
								</span>
							</td>
							<td>{{ pago.observaciones || '-' }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="card mt-3">
			<div class="card-header d-flex justify-content-between align-items-center">
				<h6 class="mb-0 fw-bold"><i class="bi bi-paperclip"></i> Archivos adjuntos ({{ item.archivos?.length || 0 }})</h6>
				<button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalSubirArchivo">
					<i class="bi bi-file-earmark-plus"></i> Adjuntar
				</button>
			</div>
			<div class="card-body">
				<ul class="list-group list-group-flush" v-if="item.archivos?.length">
					<li class="list-group-item d-flex justify-content-between align-items-center" v-for="(archivo, index) in item.archivos" :key="index">
						<span>
							📁 {{ index + 1 }}.
							<a :href="rutaArchivo(archivo?.link)" target="_blank">{{ archivo?.nombre || 'Archivo sin nombre' }}</a>
						</span>
						<small class="text-muted">{{ archivo?.fecha || '' }}</small>
					</li>
				</ul>
				<p v-else class="text-muted mb-0">No hay archivos adjuntos</p>
			</div>
		</div>
	</div>

	<div v-else class="text-center py-5">
		<div class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Cargando...</span>
		</div>
	</div>

	<div class="modal fade" id="modalPago" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Realizar pago</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label small">Monto</label>
						<input type="number" step="0.01" min="0.01" :max="saldoPendiente" class="form-control" v-model.number="pagoForm.monto" @blur="ajustarMonto">
					</div>
					<div v-if="montoPago > 0" class="alert py-2 small mb-0" :class="esPagoTotal ? 'alert-success' : 'alert-warning'">
						<i class="bi" :class="esPagoTotal ? 'bi-check-circle' : 'bi-info-circle'"></i>
						{{ esPagoTotal ? 'Se realizará el pago total' : 'Se realizará un adelanto' }}
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button class="btn btn-sm btn-primary" @click="confirmarPago" :disabled="!pagoValido">
						<i class="bi bi-check-lg"></i> Confirmar pago
					</button>
				</div>
			</div>
		</div>
	</div>

	<ModalSubirArchivo :modelo="'pago'" />
</template>