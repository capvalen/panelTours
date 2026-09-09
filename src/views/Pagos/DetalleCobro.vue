<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import ModalSubirArchivo from '@/components/ModalSubirArchivo.vue';
import { usePagosStore } from '@/stores/pagoStore';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2';

const props = defineProps({ id: String, tipo: { type: String, default: 'cobro' } });
const route = useRoute();
const router = useRouter();
const pagoStore = usePagosStore();
const { fechaLatamSimple, formatMoneda, capitalize, rutaArchivo } = useFormat();

const esCobro = computed(() => props.tipo === 'cobro');
const item = ref(null);

const totalCobro = computed(() => Number(item.value?.monto_abonado || 0) + Number(item.value?.saldo_pendiente || 0));
const totalCobrado = computed(() => Number(item.value?.monto_abonado || 0));
const saldoPendiente = computed(() => Number(item.value?.saldo_pendiente || 0));

const tipoAbono = (abono) => {
	let acumulado = 0;
	for (const a of item.value?.abonos || []) {
		if (a.id === abono.id) break;
		acumulado += Number(a.monto || 0);
	}
	const saldoAntes = totalCobro.value - acumulado;
	return Number(abono.monto) >= saldoAntes ? 'Pago total' : 'Adelanto';
};

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
		modalPagoInstance = new Modal(document.getElementById('modalAbonoCobro'));
	}
	modalPagoInstance.show();
};

const confirmarAbono = async () => {
	const monto = pagoForm.value.tipo === 'total' ? saldoPendiente.value : pagoForm.value.monto;

	try {
		item.value = esCobro.value
			? await pagoStore.abonarCobro(item.value.id, { monto })
			: await pagoStore.abonarPagoPagar(item.value.id, { monto });
		modalPagoInstance?.hide();
		Swal.fire({ title: 'Abono registrado', icon: 'success', timer: 2000, showConfirmButton: false });
	} catch (err) {
		console.error(err);
		Swal.fire('Error', 'No se pudo registrar el abono', 'error');
	}
};

const estadoBadgeClass = (estado) => {
	const map = {
		'pagado': 'border-success text-success',
		'adelantado': 'border-info text-info',
		'pendiente': 'border-warning text-warning',
		'anulado': 'border-danger text-danger',
	};
	return map[estado?.toLowerCase()] || 'border-secondary text-secondary';
};

onMounted(async () => {
	const id = props.id || route.params.id;
	item.value = esCobro.value
		? await pagoStore.obtenerCobro(id)
		: await pagoStore.obtenerPagoPagar(id);
});
</script>

<template>
	<div v-if="item">
		<h1>{{ esCobro ? 'Cobro COB-' : 'Pago PAG-' }}{{ String(item.id).padStart(3, '0') }}</h1>
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item"><router-link to="/pagos">Pagos</router-link></li>
				<li class="breadcrumb-item active">{{ esCobro ? 'COB-' : 'PAG-' }}{{ String(item.id).padStart(3, '0') }}</li>
			</ol>
		</nav>

		<div class="card">
			<div class="card-body">
				<dl class="row mb-0">
					<dt class="col-sm-3">Fecha</dt>
					<dd class="col-sm-9">{{ fechaLatamSimple(item.fecha) }}</dd>

					<dt class="col-sm-3">Concepto</dt>
					<dd class="col-sm-9">{{ capitalize(item.concepto) || '-' }}</dd>

					<dt class="col-sm-3">Proveedor</dt>
					<dd class="col-sm-9">
						<router-link :to="{ name: 'perfilProveedor', params: { id: item.proveedor_id } }">
							{{ capitalize(item.proveedor?.razon_social || item.proveedor?.contacto) || '-' }}
						</router-link>
					</dd>

					<dt class="col-sm-3">Método de pago</dt>
					<dd class="col-sm-9 text-capitalize">{{ item.metodo_pago || '-' }}</dd>

					<dt class="col-sm-3">Código de referencia</dt>
					<dd class="col-sm-9">{{ item.codigo_referencia || '-' }}</dd>

					<dt class="col-sm-3">Estado</dt>
					<dd class="col-sm-9">
						<span class="badge border text-capitalize" :class="estadoBadgeClass(item.estado_pago)">
							{{ item.estado_pago === 'adelantado' ? 'Con adelanto' : item.estado_pago || '-' }}
						</span>
					</dd>
				</dl>
			</div>
		</div>

		<div class="row mt-3">
			<div class="col-md-6">
				<div class="card h-100">
					<div class="card-body">
						<h6 class="fw-bold mb-2">{{ esCobro ? 'Cobro' : 'Pago por pagar' }}</h6>
						<table class="table table-bordered align-middle mb-0 text-center">
							<thead class="table-light">
								<tr>
									<th class="text-center">{{ esCobro ? 'Total a cobrar' : 'Total a pagar' }}</th>
									<th class="text-center">{{ esCobro ? 'Total cobrado' : 'Total pagado' }}</th>
									<th class="text-center">Saldo pendiente</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="text-center">{{ formatMoneda(totalCobro) }}</td>
									<td class="text-center text-success fw-semibold">{{ formatMoneda(totalCobrado) }}</td>
									<td class="text-center text-danger fw-semibold">{{ formatMoneda(saldoPendiente) }}</td>
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
							<h6 class="fw-bold">Abonos</h6>
							<p class="mb-1"><strong>{{ esCobro ? 'Total cobrado' : 'Total pagado' }}:</strong> {{ formatMoneda(totalCobrado) }}</p>
							<p class="mb-1"><strong>Saldo pendiente:</strong> {{ formatMoneda(saldoPendiente) }}</p>
						</div>
						<button v-if="saldoPendiente > 0" class="btn btn-success mt-3" @click="abrirModalPago">
							<i class="bi bi-cash"></i> Realizar pago
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="card mt-3" v-if="item.abonos?.length">
			<div class="card-body">
				<h6 class="fw-bold mb-2">Historial de abonos</h6>
				<table class="table table-bordered align-middle mb-0">
					<thead class="table-light">
						<tr>
							<th style="width:50px">N°</th>
							<th>Fecha</th>
							<th>Monto</th>
							<th>Tipo</th>
							<th>Método</th>
							<th>Referencia</th>
							<th>Observaciones</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(abono, idx) in item.abonos" :key="abono.id">
							<td>{{ idx + 1 }}</td>
							<td>{{ fechaLatamSimple(abono.fecha) }}</td>
							<td class="text-success fw-semibold">{{ formatMoneda(abono.monto) }}</td>
							<td>
								<span :class="tipoAbono(abono) === 'Pago total' ? 'badge text-bg-success' : 'badge text-bg-warning'">
									{{ tipoAbono(abono) }}
								</span>
							</td>
							<td class="text-capitalize">{{ abono.metodo_pago || '-' }}</td>
							<td>{{ abono.codigo_referencia || '-' }}</td>
							<td>{{ abono.observaciones || '-' }}</td>
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

	<div class="modal fade" id="modalAbonoCobro" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Registrar abono</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label small">Tipo de abono</label>
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
						Se cobrará <strong>{{ formatMoneda(saldoPendiente) }}</strong>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button class="btn btn-sm btn-success" @click="confirmarAbono" :disabled="!pagoValido">
						<i class="bi bi-check-lg"></i> Confirmar pago
					</button>
				</div>
			</div>
		</div>
	</div>

	<ModalSubirArchivo :modelo="esCobro ? 'cobro' : 'pago-pagar'" />
</template>