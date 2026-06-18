<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import api from '@/services/axios';
import { useComisionesStore } from '@/stores/comisionStore';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2';

const props = defineProps({ id: String });
const route = useRoute();
const router = useRouter();
const comisionStore = useComisionesStore();
const { fechaLatamSimple, formatMoneda } = useFormat();

const item = ref(null);
const montoEdit = ref(0);
let debounceTimer = null;

const totalPagado = computed(() => {
	return (item.value?.pagos || []).reduce((sum, p) => sum + Number(p.monto || 0), 0);
});

const saldoPendiente = computed(() => {
	return Math.max(0, Number(item.value?.monto || 0) - totalPagado.value);
});

const pagoForm = ref({
	tipo: 'adelanto',
	monto: 0,
});

const pagoValido = computed(() => {
	if (pagoForm.value.tipo === 'total') return true;
	return (pagoForm.value.monto || 0) > 0;
});

let modalPagoInstance = null;

const abrirModalPago = () => {
	pagoForm.value = { tipo: 'adelanto', monto: saldoPendiente.value };
	if (!modalPagoInstance) {
		modalPagoInstance = new Modal(document.getElementById('modalPago'));
	}
	modalPagoInstance.show();
};

const confirmarPago = async () => {
	const monto = pagoForm.value.tipo === 'total' ? saldoPendiente.value : pagoForm.value.monto;
	const nuevoEstado = pagoForm.value.tipo === 'total' ? 'pagado' : 'adelantado';
	const hoy = new Date().toISOString().split('T')[0];

	try {
		await api.post('/comision-pagos', {
			comision_id: item.value.id,
			fecha: hoy,
			monto,
		});

		await comisionStore.actualizar(item.value.id, { estado_pago: nuevoEstado });

		const user = JSON.parse(localStorage.getItem('user') || '{}');
		const cajasRes = await api.get('/cajas', { params: { estado: 'abierta', usuario_id: user.id } });
		const caja = Array.isArray(cajasRes.data) ? cajasRes.data.find(c => c.estado === 'abierta') : null;

		if (caja) {
			await api.post('/caja_detalles', {
				caja_id: caja.id,
				tipo: 'egreso',
				categoria: 'pago',
				monto,
				concepto: `Pago ${String(item.value.id).padStart(3, '0')} - ${nombreComisionable(item.value)}`,
				fecha: hoy,
				proveedor_id: 1,
				observaciones: item.value.observaciones || '',
			});
		}

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

const tipoComisionable = (i) => {
	if (!i?.comisionable_type) return '-';
	return i.comisionable_type.includes('Guia') ? 'Guía' : 'Vehículo';
};

const nombreComisionable = (i) => {
	if (!i?.comisionable) return '-';
	if (i.comisionable_type?.includes('Guia')) {
		return i.comisionable.nombre || '-';
	}
	return i.comisionable.nombre_conductor || i.comisionable.placa || '-';
};

const rutaComisionable = (i) => {
	if (!i?.comisionable) return null;
	if (i.comisionable_type?.includes('Guia')) {
		return { name: 'perfilGuia', params: { id: i.comisionable.id } };
	}
	return { name: 'perfilVehiculo', params: { id: i.comisionable.id } };
};
</script>

<template>
	<div v-if="item">
		<h1>Pago PAG-{{ String(item.id).padStart(3, '0') }}</h1>
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item"><router-link to="/pagos">Pagos</router-link></li>
				<li class="breadcrumb-item active">PAG-{{ String(item.id).padStart(3, '0') }}</li>
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
					<dd class="col-sm-9 text-capitalize">{{ item.estado_pago }}</dd>
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
									<th class="text-center">Monto</th>
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
						<button v-if="saldoPendiente > 0" class="btn btn-primary mt-3" @click="abrirModalPago">
							<i class="bi bi-cash"></i> Realizar pago
						</button>
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
							<th>Observaciones</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(pago, idx) in item.pagos" :key="pago.id">
							<td>{{ idx + 1 }}</td>
							<td>{{ fechaLatamSimple(pago.fecha) }}</td>
							<td>{{ formatMoneda(pago.monto) }}</td>
							<td>{{ pago.observaciones || '-' }}</td>
						</tr>
					</tbody>
				</table>
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
						<label class="form-label small">Tipo de pago</label>
						<select class="form-select" v-model="pagoForm.tipo">
							<option value="adelanto">Adelanto</option>
							<option value="total">Pago total</option>
						</select>
					</div>
					<div class="mb-3" v-if="pagoForm.tipo === 'adelanto'">
						<label class="form-label small">Monto</label>
						<input type="number" step="0.01" class="form-control" v-model.number="pagoForm.monto">
					</div>
					<div v-else class="alert alert-info py-2 small mb-0">
						Se pagará <strong>{{ formatMoneda(saldoPendiente) }}</strong>
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
</template>
