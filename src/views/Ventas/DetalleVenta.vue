<template>
	<div class="container-fluid">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item"><router-link to="/ventas">Ventas</router-link></li>
				<li class="breadcrumb-item active">Venta {{ ventaIdFormateado }}</li>
			</ol>
		</nav>

		<div v-if="cargando" class="text-center py-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
			<p class="mt-2 text-muted">Cargando venta...</p>
		</div>

		<div v-else-if="error" class="alert alert-danger">
			<i class="bi bi-exclamation-triangle"></i> {{ error }}
		</div>

		<template v-else-if="venta">
			<div class="d-flex justify-content-between align-items-start mb-3">
				<div>
					<h2 class="mb-1">Venta {{ ventaIdFormateado }}</h2>
					<p class="text-muted mb-0">
						<i class="bi bi-calendar"></i> {{ formatFecha(venta.fecha) }} &middot;
						<span :class="'badge bg-' + estadoBadgeColor">
							{{ capitalize(venta.estado) }}
						</span>
					</p>
				</div>
				<div class="d-flex gap-2">
					<router-link :to="{ name: 'editarVenta', params: { id: venta.id } }" class="btn btn-outline-secondary">
						<i class="bi bi-pencil-square"></i> Editar venta
					</router-link>
				</div>
			</div>

			<div class="row g-3">
				<!-- Datos del cliente -->
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-body">
							<h6 class="card-title"><i class="bi bi-person"></i> Datos del cliente</h6>
							<table class="table table-sm table-borderless mb-0">
								<tr>
									<td class="text-muted small" style="width: 100px;">Nombre</td>
									<td class="fw-semibold">{{ clienteNombre }}</td>
								</tr>
								<tr>
									<td class="text-muted small">DNI / RUC</td>
									<td>{{ venta.cliente?.dni || venta.cliente?.ruc || '-' }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Celular</td>
									<td>{{ venta.cliente?.celular || '-' }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Nacionalidad</td>
									<td>{{ capitalize(venta.nacionalidad || 'peruana') }}</td>
								</tr>
							</table>
						</div>
					</div>
				</div>

				<!-- Datos del viaje -->
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-body">
							<h6 class="card-title"><i class="bi bi-geo-alt"></i> Datos del viaje</h6>
							<table class="table table-sm table-borderless mb-0">
								<tr>
									<td class="text-muted small" style="width: 100px;">Destino</td>
									<td class="fw-semibold">{{ venta.departamento?.departamento || '-' }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Adultos</td>
									<td>{{ venta.adults || 0 }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Niños</td>
									<td>{{ venta.kids || 0 }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Total personas</td>
									<td>{{ venta.cuantas_personas || (venta.adults + venta.kids) || 0 }}</td>
								</tr>
							<tr v-if="venta.ciudad">
									<td class="text-muted small">Ciudad</td>
									<td>{{ venta.ciudad }}</td>
								</tr>
								<tr class="border-top">
									<td class="text-muted small">Descuento</td>
									<td class="fw-semibold">S/ {{ formatPrecio(venta.descuento) }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Adelanto</td>
									<td class="fw-semibold">S/ {{ formatPrecio(venta.adelanto) }}</td>
								</tr>
								<tr>
									<td class="fw-bold fs-6">Total a cobrar</td>
									<td class="fw-bold fs-6 text-primary">S/ {{ formatPrecio(totalFinal) }}</td>
								</tr>
						</table>
					</div>
				</div>
			</div>

	<!-- Servicios -->
	<div class="col-12">
		<div class="card">
			<div class="card-body">
				<h6 class="card-title"><i class="bi bi-list-check"></i> Servicios contratados</h6>
				<div v-if="venta.items && venta.items.length > 0" class="table-responsive">
					<table class="table table-bordered table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th class="text-center" style="width: 40px;">N°</th>
								<th>Tipo</th>
								<th>Servicio</th>
								<th class="text-end">P. Adulto</th>
								<th class="text-end">P. Niño</th>
								<th class="text-end">Descuento</th>
								<th>Motivo descuento</th>
								<th class="text-end">Subtotal</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in venta.items" :key="item.id">
								<td class="text-center text-muted">{{ index + 1 }}</td>
								<td>{{ getIcono(item.tipo) }} {{ capitalize(item.tipo) }}</td>
								<td>{{ item.descripcion || '-' }}</td>
								<td class="text-end">S/ {{ formatPrecio(item.precio_adulto) }}</td>
								<td class="text-end">S/ {{ formatPrecio(item.precio_kids) }}</td>
								<td class="text-end">{{ item.descuento ? 'S/ ' + formatPrecio(item.descuento) : '-' }}</td>
								<td>{{ item.motivo_descuento || '-' }}</td>
								<td class="text-end fw-semibold">S/ {{ formatPrecio(item.precio) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div v-else class="text-muted text-center py-3">
					<i class="bi bi-inbox"></i> Sin servicios registrados
				</div>
			</div>
		</div>
	</div>

	<!-- Pagos -->
				<div class="col-12">
					<div class="card">
						<div class="card-header d-flex justify-content-between align-items-center">
							<h6 class="mb-0 fw-bold"><i class="bi bi-wallet2"></i> Pagos</h6>
							<button class="btn btn-sm btn-primary" @click="abrirModalNuevoPago">
								<i class="bi bi-plus-lg"></i> Agregar pago
							</button>
						</div>
						<div class="card-body">
							<div class="row mb-3">
								<div class="col-md-4">
									<small class="text-muted">Total pagado</small>
									<p class="fw-bold fs-5 mb-0 text-success">S/ {{ formatPrecio(totalPagado) }}</p>
								</div>
								<div class="col-md-4">
									<small class="text-muted">Saldo pendiente</small>
									<p class="fw-bold fs-5 mb-0" :class="saldoPendiente > 0 ? 'text-danger' : 'text-muted'">S/ {{ formatPrecio(saldoPendiente) }}</p>
								</div>
								<div class="col-md-4">
									<small class="text-muted">Total a pagar</small>
									<p class="fw-bold fs-5 mb-0 text-primary">S/ {{ formatPrecio(totalFinal) }}</p>
								</div>
							</div>
							<div v-if="pagos.length" class="table-responsive">
								<table class="table table-bordered table-hover align-middle mb-0">
									<thead class="table-light">
										<tr>
											<th class="text-center" style="width: 40px;">N°</th>
											<th>N° Comprobante</th>
											<th>Fecha</th>
											<th class="text-end">Monto</th>
											<th>Estado</th>
											<th>Método</th>
											<th>Observaciones</th>
											<th class="text-center" style="width: 100px;">Acciones</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(pago, index) in pagos" :key="pago.id">
											<td class="text-center text-muted">{{ index + 1 }}</td>
											<td>{{ pago.codigo_referencia || '-' }}</td>
											<td>{{ pago.fecha ? fechaLatamSimple(pago.fecha) : '-' }}</td>
											<td class="text-end fw-semibold">S/ {{ formatPrecio(pago.monto_abonado) }}</td>
											<td>
												<span class="badge border text-capitalize" :class="badgeEstadoPago(pago.estado_pago)">
													{{ pago.estado_pago || '-' }}
												</span>
											</td>
											<td>{{ capitalize(pago.metodo_pago || '-') }}</td>
											<td>{{ pago.observaciones || '-' }}</td>
											<td class="text-center" style="white-space: nowrap;">
												<button class="btn btn-sm btn-outline-success me-1" title="Ticket" @click="abrirTicketPago(pago.id)">
													<i class="bi bi-receipt"></i>
												</button>
												<button v-if="pago.estado_pago !== 'anulado'" class="btn btn-sm btn-outline-primary me-1" title="Editar" @click="abrirModalEditarPago(pago)">
													<i class="bi bi-pencil-square"></i>
												</button>
												<button v-if="pago.estado_pago !== 'anulado'" class="btn btn-sm btn-outline-danger" title="Anular" @click="anularPago(pago)">
													<i class="bi bi-x-lg"></i>
												</button>
												<span v-else class="text-danger small">Anulado</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div v-else class="text-muted text-center py-3">
								<i class="bi bi-inbox"></i> No hay pagos registrados
							</div>
						</div>
					</div>
				</div>

				<!-- Personas -->
				<div class="col-12">
					<div class="card">
						<div class="card-header d-flex justify-content-between align-items-center">
							<h6 class="mb-0 fw-bold"><i class="bi bi-people"></i> Manifiesto de personas ({{ personas.length }} / {{ totalPersonas }}) <span class="text-danger fw-normal small">(Faltan checkin: {{ faltanCheckin }})</span></h6>
							<div class="d-flex gap-2">
								<button class="btn btn-sm btn-outline-secondary" @click="copiarLinkCheckin">
									<i class="bi bi-send"></i> Enviar link check-in automático
								</button>
								<button v-if="personas.length < totalPersonas" class="btn btn-sm btn-primary" @click="abrirModalNuevaPersona">
									<i class="bi bi-plus-lg"></i> Agregar persona
								</button>
							</div>
						</div>
						<div class="card-body">
							<div v-if="personas.length" class="table-responsive">
								<table class="table table-bordered table-hover align-middle mb-0">
									<thead class="table-light">
										<tr>
											<th class="text-center" style="width: 40px;">N°</th>
											<th>Nombre</th>
											<th>DNI</th>
											<th>Parentesco</th>
											<th>Fecha nac.</th>
											<th>Enfermedades</th>
											<th v-if="tieneVuelo">Pasaporte</th>
											<th>Vacunas</th>
											<th class="text-center" style="width: 100px;">Acciones</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(persona, index) in personas" :key="persona.id">
											<td class="text-center text-muted">{{ index + 1 }}</td>
											<td>
												{{ persona.nombre }}
												<span v-if="persona.es_titular" class="badge bg-primary ms-1">Titular</span>
											</td>
											<td>{{ persona.dni || '-' }}</td>
											<td>{{ capitalize(persona.parentesco || '-') }}</td>
											<td>{{ persona.fecha_nacimiento ? formatFechaSimple(persona.fecha_nacimiento) : '-' }}</td>
											<td>
												<span v-if="persona.enfermedades === 'si'" class="text-danger">Sí</span>
												<span v-else class="text-muted">No</span>
												<span v-if="persona.enfermedades === 'si' && persona.detalle_enfermedades" class="small text-muted ms-1">({{ persona.detalle_enfermedades }})</span>
											</td>
											<td v-if="tieneVuelo">{{ persona.pasaporte || '-' }}</td>
											<td>
												<span v-if="persona.vacunas === 'si'" class="text-success">Sí</span>
												<span v-else class="text-muted">No</span>
											</td>
											<td class="text-center">
												<button class="btn btn-sm btn-outline-primary me-1" title="Editar" @click="abrirModalEditarPersona(persona)">
													<i class="bi bi-pencil-square"></i>
												</button>
												<button class="btn btn-sm btn-outline-danger" title="Eliminar" @click="eliminarPersona(persona)">
													<i class="bi bi-trash"></i>
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div v-else class="text-muted text-center py-3">
								<i class="bi bi-inbox"></i> No hay personas registradas
							</div>
						</div>
					</div>
				</div>

				<!-- Acciones -->
				<div class="col-12 mb-4">
					<div class="d-flex justify-content-between">
						<div>
							<router-link to="/ventas" class="btn btn-outline-secondary">
								<i class="bi bi-arrow-left"></i> Volver
							</router-link>
						</div>
						<div class="d-flex gap-2">
							<button class="btn btn-success" @click="generarPDF">
								<i class="bi bi-file-pdf"></i>
								Generar PDF
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>

	<!-- Modal Pago -->
	<div class="modal fade" id="modalPago" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog modal-sm modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{ pagoEditando ? 'Editar pago' : 'Nuevo pago' }}</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row g-3">
						<div class="col-12">
							<label class="form-label">N° Comprobante</label>
							<input type="text" class="form-control" v-model="pagoForm.numeroComprobante" placeholder="Ej: B001-000001">
						</div>
						<div class="col-12">
							<label class="form-label">Fecha de pago <span class="text-danger">*</span></label>
							<input type="date" class="form-control" v-model="pagoForm.fechaPago" required>
						</div>
						<div class="col-12">
							<label class="form-label">Monto (S/) <span class="text-danger">*</span></label>
							<input type="number" class="form-control" v-model="pagoForm.monto" step="0.01" min="0" placeholder="0.00">
						</div>
						<div class="col-12">
							<label class="form-label">Método de pago</label>
							<select class="form-select" v-model="pagoForm.metodoPago">
								<option value="efectivo">Efectivo</option>
								<option value="yape">Yape</option>
								<option value="plin">Plin</option>
								<option value="tarjeta">Tarjeta</option>
								<option value="depósito">Depósito</option>
								<option value="POS">POS</option>
								<option value="transferencia">Transferencia</option>
							</select>
						</div>
						<div class="col-12 d-none">
							<label class="form-label">Estado del pago</label>
							<select class="form-select" v-model="pagoForm.estadoPago">
								<option value="pendiente">Pendiente</option>
								<option value="adelantado">Adelantado</option>
								<option value="pagado">Pagado</option>
								<option value="anulado">Anulado</option>
							</select>
						</div>
						<div class="col-12">
							<label class="form-label">Observaciones</label>
							<textarea class="form-control" rows="2" v-model="pagoForm.observaciones"></textarea>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary" @click="guardarPago" :disabled="guardandoPago">
						<span v-if="guardandoPago" class="spinner-border spinner-border-sm me-1"></span>
						{{ pagoEditando ? 'Actualizar' : 'Guardar' }}
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Persona -->
	<div class="modal fade" id="modalPersona" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog modal-sm modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{ personaEditando ? 'Editar persona' : 'Nueva persona' }}</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row g-3">
						<div class="col-12">
							<label class="form-label">DNI</label>
							<input type="text" class="form-control" v-model="personaForm.dni" placeholder="12345678">
						</div>
						<div class="col-12">
							<label class="form-label">Nombre <span class="text-danger">*</span></label>
							<input type="text" class="form-control" v-model="personaForm.nombre" placeholder="Nombre completo">
						</div>
						<div class="col-12">
							<label class="form-label">Fecha de nacimiento</label>
							<input type="date" class="form-control" v-model="personaForm.fecha_nacimiento">
						</div>
						<div class="col-12">
							<label class="form-label">Parentesco</label>
							<select class="form-select" v-model="personaForm.parentesco">
								<option v-for="p in parentescos" :key="p" :value="p">{{ capitalize(p) }}</option>
							</select>
						</div>
						<div class="col-12">
							<div class="d-flex justify-content-between align-items-center">
								<label class="form-label mb-0">Es titular</label>
								<div class="form-check form-switch mb-0">
									<input class="form-check-input" type="checkbox" role="switch" v-model="personaForm.es_titular" :true-value="true" :false-value="false">
								</div>
							</div>
						</div>
						<div class="col-12">
							<div class="d-flex justify-content-between align-items-center">
								<label class="form-label mb-0">¿Enfermedades?</label>
								<div class="form-check form-switch mb-0">
									<input class="form-check-input" type="checkbox" role="switch" v-model="personaForm.enfermedades" true-value="si" false-value="no">
								</div>
							</div>
						</div>
						<div class="col-12" v-if="personaForm.enfermedades === 'si'">
							<label class="form-label">Detalle enfermedades</label>
							<input type="text" class="form-control" v-model="personaForm.detalle_enfermedades" placeholder="Describa las enfermedades">
						</div>
						<template v-if="tieneVuelo">
							<div class="col-12">
								<label class="form-label">N° Pasaporte</label>
								<input type="text" class="form-control" v-model="personaForm.pasaporte">
							</div>
							<div class="col-12">
								<label class="form-label">Vencimiento pasaporte</label>
								<input type="date" class="form-control" v-model="personaForm.fecha_caducidad_pasaporte">
							</div>
							<div class="col-12">
								<label class="form-label">País de emisión</label>
								<input type="text" class="form-control" v-model="personaForm.pais_emision">
							</div>
						</template>
						<div class="col-12">
							<div class="d-flex justify-content-between align-items-center">
								<label class="form-label mb-0">¿Vacunas?</label>
								<div class="form-check form-switch mb-0">
									<input class="form-check-input" type="checkbox" role="switch" v-model="personaForm.vacunas" true-value="si" false-value="no">
								</div>
							</div>
						</div>
						<div class="col-12" v-if="personaForm.vacunas === 'si'">
							<label class="form-label">Detalle vacunas</label>
							<input type="text" class="form-control" v-model="personaForm.detalle_vacunas" placeholder="Describa las vacunas">
						</div>
						<div class="col-12">
							<label class="form-label">Observaciones</label>
							<textarea class="form-control" rows="2" v-model="personaForm.observaciones"></textarea>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary" @click="guardarPersona" :disabled="guardando">
						<span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
						{{ personaEditando ? 'Actualizar' : 'Guardar' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/axios';
import { useRoute } from 'vue-router';
import { useVentasStore } from '@/stores/ventaStore';
import { usePagosStore } from '@/stores/pagoStore';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

const route = useRoute();
const ventaStore = useVentasStore();
const pagosStore = usePagosStore();
const { encodeForUrl, formatMoneda, fechaLatamSimple } = useFormat();

const venta = ref(null);
const cargando = ref(true);
const error = ref('');

const personas = ref([]);
const modalInstance = ref(null);
const personaEditando = ref(null);
const guardando = ref(false);

const personaForm = ref({
	dni: '',
	nombre: '',
	fecha_nacimiento: '',
	parentesco: 'acompañante',
	es_titular: false,
	enfermedades: 'no',
	detalle_enfermedades: '',
	pasaporte: '',
	fecha_caducidad_pasaporte: '',
	pais_emision: '',
	vacunas: 'no',
	detalle_vacunas: '',
	observaciones: '',
});

const parentescos = [
	'acompañante', 'alumno', 'amistad', 'empleado', 'esposo/a',
	'hermano/a', 'hijo', 'jefe', 'madre', 'padre', 'pareja', 'tio/a', 'tutor/a'
];

const getIcono = (tipo) => {
	const iconos = {
		web: '🌐',
		tour: '🧳',
		hospedaje: '🏨',
		vuelo: '✈️',
		restaurante: '🍽️',
		transporte: '🚌',
	};
	return iconos[tipo] || '📦';
};

const capitalize = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatPrecio = (val) => {
	if (val === null || val === undefined || val === '') return '0.00';
	const num = Number(val);
	return isNaN(num) ? '0.00' : num.toFixed(2);
};

const formatFecha = (fecha) => {
	if (!fecha) return '-';
	const d = new Date(fecha);
	return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatFechaSimple = (fecha) => {
	if (!fecha) return '-';
	const d = new Date(fecha);
	return d.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const clienteNombre = computed(() => {
	if (!venta.value?.cliente) return '-';
	const c = venta.value.cliente;
	return c.razon_social || (c.apellidos + ' ' + c.nombres) || '-';
});

const ventaIdFormateado = computed(() => {
	const num = Number(route.params.id);
	return 'GEA-' + String(num).padStart(3, '0');
});

const estadoBadgeColor = computed(() => {
	const e = (venta.value?.estado || '').toLowerCase();
	if (e === 'anulado') return 'danger';
	if (e === 'activo' || e === 'confirmado') return 'success';
	return 'secondary';
});

const tieneVuelo = computed(() => {
	return venta.value?.items?.some(item => (item.tipo || '').toLowerCase() === 'vuelo') ?? false;
});

const totalFinal = computed(() => {
	if (!venta.value) return 0;
	return Number(venta.value.precio || 0);
});

const totalPersonas = computed(() => {
	if (!venta.value) return 0;
	return Number(venta.value.cuantas_personas || (venta.value.adults + venta.value.kids) || 0);
});

const faltanCheckin = computed(() => {
	return Math.max(0, totalPersonas.value - personas.value.length);
});

const pagos = ref([]);
const modalPagoInstance = ref(null);
const pagoEditando = ref(null);
const guardandoPago = ref(false);

const pagoForm = ref({
	numeroComprobante: '',
	fechaPago: new Date().toISOString().slice(0, 10),
	monto: '',
	metodoPago: 'efectivo',
	observaciones: '',
	estadoPago: 'pendiente',
});

const totalPagado = computed(() => {
	return pagos.value
		.filter(p => p.estado_pago !== 'anulado')
		.reduce((sum, p) => sum + Number(p.monto_abonado || 0), 0);
});

const saldoPendiente = computed(() => {
	return Math.max(0, totalFinal.value - totalPagado.value);
});

const apiBaseUrl = import.meta.env.MODE === 'production'
	? 'https://apipanel.grupoeuroandino.com/api'
	: 'http://127.0.0.1:8000/api';

const abrirTicketPago = (pagoId) => {
	window.open(`${apiBaseUrl}/ventas/${route.params.id}/pagos/${pagoId}/ticket`, '_blank');
};

const badgeEstadoPago = (estado) => {
	const map = {
		pagado: 'border-success text-success',
		adelantado: 'border-info text-info',
		pendiente: 'border-warning text-warning',
		anulado: 'border-danger text-danger',
	};
	return map[estado?.toLowerCase()] || 'border-secondary text-secondary';
};

const cargarPagos = async () => {
	try {
		const res = await api.get(`/ventas/${route.params.id}/pagos`);
		pagos.value = res.data;
	} catch (err) {
		console.error('Error al cargar pagos:', err);
	}
};

const resetPagoForm = () => {
	pagoForm.value = {
		numeroComprobante: '',
		fechaPago: new Date().toISOString().slice(0, 10),
		monto: '',
		metodoPago: 'efectivo',
		observaciones: '',
		estadoPago: 'pendiente',
	};
};

const abrirModalNuevoPago = () => {
	pagoEditando.value = null;
	resetPagoForm();
	if (!modalPagoInstance.value) {
		const el = document.getElementById('modalPago');
		modalPagoInstance.value = new Modal(el);
	}
	modalPagoInstance.value.show();
};

const abrirModalEditarPago = (pago) => {
	pagoEditando.value = pago;
	pagoForm.value = {
		numeroComprobante: pago.codigo_referencia || '',
		fechaPago: pago.fecha ? new Date(pago.fecha).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
		monto: pago.monto_abonado ?? '',
		metodoPago: pago.metodo_pago || 'efectivo',
		observaciones: pago.observaciones || '',
		estadoPago: pago.estado_pago || 'pendiente',
	};
	if (!modalPagoInstance.value) {
		const el = document.getElementById('modalPago');
		modalPagoInstance.value = new Modal(el);
	}
	modalPagoInstance.value.show();
};

const guardarPago = async () => {
	if (!pagoForm.value.monto || Number(pagoForm.value.monto) <= 0) {
		Swal.fire('Validación', 'El monto debe ser mayor a 0', 'warning');
		return;
	}
	guardandoPago.value = true;
	try {
		const nuevoTotalPagado = totalPagado.value + Number(pagoForm.value.monto);
		const estadoPagoCalculado = nuevoTotalPagado >= totalFinal.value ? 'pagado' : 'adelantado';
		const payload = {
			fecha: pagoForm.value.fechaPago,
			monto_abonado: Number(pagoForm.value.monto),
			metodo_pago: pagoForm.value.metodoPago,
			estado_pago: estadoPagoCalculado,
			codigo_referencia: pagoForm.value.numeroComprobante || null,
			observaciones: pagoForm.value.observaciones || null,
			concepto: venta.value?.items?.[0]?.descripcion || 'Pago de venta',
			saldo_pendiente: saldoPendiente.value,
		};
		let pagoCreado;
		if (pagoEditando.value) {
			pagoCreado = await pagosStore.actualizar(route.params.id, pagoEditando.value.id, payload);
		} else {
			pagoCreado = await pagosStore.guardar(route.params.id, payload);
		}
		venta.value = ventaStore.ventaActual;
		modalPagoInstance.value?.hide();
		await cargarPagos();
		Swal.fire({
			title: 'Éxito',
			text: pagoEditando.value ? 'Pago actualizado' : 'Pago registrado',
			icon: 'success',
			showCancelButton: true,
			confirmButtonText: 'Ver ticket interno',
			cancelButtonText: 'Cerrar',
		}).then(result => {
			if (result.isConfirmed) {
				abrirTicketPago(pagoCreado.id);
			}
		});
	} catch (err) {
		console.error('Error al guardar pago:', err);
		Swal.fire('Error', 'No se pudo guardar el pago', 'error');
	} finally {
		guardandoPago.value = false;
	}
};

const anularPago = async (pago) => {
	const result = await Swal.fire({
		title: '¿Anular pago?',
		text: `Se anulará el pago de S/ ${formatPrecio(pago.monto_abonado)}`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, anular',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#d33',
	});
	if (!result.isConfirmed) return;
	try {
		await pagosStore.eliminar(route.params.id, pago.id);
		venta.value = ventaStore.ventaActual;
		await cargarPagos();
		Swal.fire('Anulado', 'Pago anulado', 'success');
	} catch (err) {
		console.error('Error al anular pago:', err);
		Swal.fire('Error', 'No se pudo anular el pago', 'error');
	}
};

const cargarPersonas = async () => {
	try {
		const res = await api.get('/personas', { params: { venta_id: route.params.id } });
		personas.value = res.data;
	} catch (err) {
		console.error('Error al cargar personas:', err);
	}
};

const resetForm = () => {
	personaForm.value = {
		dni: '',
		nombre: '',
		fecha_nacimiento: '',
		parentesco: 'acompañante',
		es_titular: false,
		enfermedades: 'no',
		detalle_enfermedades: '',
		pasaporte: '',
		fecha_caducidad_pasaporte: '',
		pais_emision: '',
		vacunas: 'no',
		detalle_vacunas: '',
		observaciones: '',
	};
};

const abrirModalNuevaPersona = () => {
	personaEditando.value = null;
	resetForm();
	personaForm.value.es_titular = personas.value.length === 0;
	if (!modalInstance.value) {
		const el = document.getElementById('modalPersona');
		modalInstance.value = new Modal(el);
	}
	modalInstance.value.show();
};

const abrirModalEditarPersona = (persona) => {
	personaEditando.value = persona;
	personaForm.value = {
		dni: persona.dni || '',
		nombre: persona.nombre || '',
		fecha_nacimiento: persona.fecha_nacimiento || '',
		parentesco: persona.parentesco || 'acompañante',
		es_titular: Boolean(persona.es_titular),
		enfermedades: persona.enfermedades || 'no',
		detalle_enfermedades: persona.detalle_enfermedades || '',
		pasaporte: persona.pasaporte || '',
		fecha_caducidad_pasaporte: persona.fecha_caducidad_pasaporte || '',
		pais_emision: persona.pais_emision || '',
		vacunas: persona.vacunas || 'no',
		detalle_vacunas: persona.detalle_vacunas || '',
		observaciones: persona.observaciones || '',
	};
	if (!modalInstance.value) {
		const el = document.getElementById('modalPersona');
		modalInstance.value = new Modal(el);
	}
	modalInstance.value.show();
};

const guardarPersona = async () => {
	if (!personaForm.value.nombre.trim()) {
		Swal.fire('Validación', 'El nombre es obligatorio', 'warning');
		return;
	}
	guardando.value = true;
	try {
		const payload = { ...personaForm.value, venta_id: Number(route.params.id) };
		if (personaEditando.value) {
			await api.put(`/personas/${personaEditando.value.id}`, payload);
		} else {
			await api.post('/personas', payload);
		}
		modalInstance.value?.hide();
		await cargarPersonas();
		Swal.fire({ title: 'Éxito', text: personaEditando.value ? 'Persona actualizada' : 'Persona agregada', icon: 'success', timer: 5000, timerProgressBar: true, showConfirmButton: false });
	} catch (err) {
		console.error('Error al guardar persona:', err);
		Swal.fire('Error', 'No se pudo guardar la persona', 'error');
	} finally {
		guardando.value = false;
	}
};

const eliminarPersona = async (persona) => {
	const result = await Swal.fire({
		title: '¿Eliminar persona?',
		text: `Se eliminará a "${persona.nombre}"`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#d33',
	});
	if (!result.isConfirmed) return;
	try {
		await api.delete(`/personas/${persona.id}`);
		await cargarPersonas();
		Swal.fire('Eliminado', 'Persona eliminada', 'success');
	} catch (err) {
		console.error('Error al eliminar persona:', err);
		Swal.fire('Error', 'No se pudo eliminar la persona', 'error');
	}
};

onMounted(async () => {
	try {
		const data = await ventaStore.obtenerPorId(route.params.id);
		venta.value = data;
		await Promise.all([cargarPersonas(), cargarPagos()]);
	} catch (err) {
		console.error('Error al cargar venta:', err);
		error.value = 'No se pudo cargar la venta. Verifica que exista o intente nuevamente.';
	} finally {
		cargando.value = false;
	}
});

const generarPDF = () => {
	const url = `${apiBaseUrl}/ventas/${route.params.id}/pdf`;
	window.open(url, '_blank');
};

const copiarLinkCheckin = () => {
	const parametro = encodeForUrl({ id: route.params.id });
	const baseUrl = import.meta.env.MODE === 'production' ? 'https://panel.grupoeuroandino.com/' : 'http://localhost:5173/';
	const url = baseUrl + 'recopilacion-datos.html?p=' + parametro;
	navigator.clipboard.writeText(url);
	Swal.fire({
		title: 'Link copiado',
		text: 'Link copiado al portapapeles',
		icon: 'success',
		timer: 5000,
		timerProgressBar: true,
		showCancelButton: true,
		confirmButtonText: 'Abrir link',
		cancelButtonText: 'Cerrar',
	}).then(result => {
		if (result.isConfirmed) {
			window.open(url, '_blank');
		}
	});
};
</script>
