<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useVentasStore } from '@/stores/ventaStore';
import { usePagosStore } from '@/stores/pagoStore';
import { useFormat } from '@/composables/formatos';
import ModalNuevoPago from '@/components/ModalNuevoPago.vue';
import Swal from 'sweetalert2';

const activeTab = ref('resumen');
const route = useRoute();
const ventaStore = useVentasStore();
const pagosStore = usePagosStore();
const { fechaLatamSimple, formatMoneda, capitalize, convertirHora } = useFormat();
const pagoEditar = ref(null);

const ventaActual = computed(() => ventaStore.ventaActual || {});
const clienteActual = computed(() => ventaActual.value.cliente || {});
const pagos = computed(() => pagosStore.pagos || []);
const serviciosVenta = computed(() => ventaActual.value.items || []);
const progresoSeleccionado = ref('venta');

const clienteDoc = computed(() => clienteActual.value.ruc || clienteActual.value.dni || '-');
const clienteNombre = computed(() => {
	if (clienteActual.value.razon_social) return clienteActual.value.razon_social;
	const nombreCompleto = `${clienteActual.value.apellidos || ''} ${clienteActual.value.nombres || ''}`.trim();
	return nombreCompleto || '-';
});

const montoFinal = computed(() => Number(ventaActual.value.precio || 0));
const descuento = computed(() => Number(ventaActual.value.descuento || 0));
const montoContratado = computed(() => montoFinal.value + descuento.value);
const adelanto = computed(() => Number(ventaActual.value.adelanto || 0));
const saldoPendiente = computed(() => {
	if ((ventaActual.value.estado_pago || '').toLowerCase() === 'pagado') return 0;
	return Math.max(montoFinal.value - adelanto.value, 0);
});

const normalizarProgreso = (estado) => {
	const e = (estado || '').toString().trim().toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, ' ');
	const aliases = {
		cotizacion: 'cotización',
		pendiente: 'cotización',
		reserva: 'cotización',
		confirmada: 'venta',
		confirmado: 'venta',
		venta: 'venta',
		facturada: 'facturada',
		facturado: 'facturada',
		'en seguimiento': 'en seguimiento',
		seguimiento: 'en seguimiento',
		'en proceso': 'en seguimiento',
		finalizado: 'finalizado'
	};
	return aliases[e] || 'cotización';
};
const progresoEstados = ['cotización', 'venta', 'facturada', 'en seguimiento', 'finalizado'];
const progresoActual = computed(() => normalizarProgreso(ventaActual.value.progreso || 'cotización'));
const progresoIndice = computed(() => {
	const idx = progresoEstados.indexOf(progresoActual.value);
	return idx === -1 ? 0 : idx;
});
const progresoWidth = computed(() => {
	return `${Math.max(0, ((progresoIndice.value+1) / (progresoEstados.length )) * 100)}%`;
});
const pasoActivo = (paso) => progresoIndice.value >= paso;
const abrirModalProgreso = () => {
	progresoSeleccionado.value = progresoActual.value ;
};
const actualizarProgresoVenta = async () => {
	if (!route.params.id) return;
	try {
		await ventaStore.actualizarProgreso(route.params.id, progresoSeleccionado.value);
		await Swal.fire('Éxito', 'Progreso actualizado', 'success');
	} catch (error) {
		await Swal.fire('Error', 'No se pudo actualizar el progreso', 'error');
	}
};
const normalizarTipoServicio = (tipo) => {
	const t = (tipo || '').toLowerCase();
	if (t === 'restaurante') return 'restaurant';
	if (t === 'vehículos' || t === 'vehiculo' || t === 'vehículo') return 'transporte';
	return t;
};
const servicioBadgeClass = (tipo) => {
	switch (normalizarTipoServicio(tipo)) {
		case 'transporte': return 'text-primary border-primary';
		case 'hospedaje': return 'text-success border-success';
		case 'restaurant': return 'text-warning border-warning';
		case 'tour': return 'text-info border-info';
		case 'vuelo': return 'text-danger border-danger';
		default: return 'text-secondary border-secondary';
	}
};
const servicioIcono = (tipo) => {
	switch (normalizarTipoServicio(tipo)) {
		case 'transporte': return 'bi-bus-front';
		case 'hospedaje': return 'bi-buildings';
		case 'restaurant': return 'bi-fork-knife';
		case 'tour': return 'bi-suitcase-lg';
		case 'vuelo': return 'bi-airplane';
		default: return 'bi-box';
	}
};
const servicioNombre = (tipo) => {
	const t = normalizarTipoServicio(tipo);
	return t ? capitalize(t) : '-';
};
const tipoServicioItem = (item) => item?.tipo || ventaActual.value?.tipo || '';
const boolLabel = (value) => {
	if (value === true || value === 1 || value === '1') return 'Sí';
	return 'No';
};
const estadoSolicitudClass = (estado) => {
	const e = (estado || 'pendiente').toLowerCase();
	if (['confirmado', 'completado', 'emitido', 'activo', 'abordado', 'checkin_realizado', 'checkout'].includes(e)) return 'text-success';
	if (['cancelado'].includes(e)) return 'text-danger';
	if (['checkin', 'checkin_disponible', 'en_curso', 'finalizado', 'reservado'].includes(e)) return 'text-primary';
	return 'text-warning';
};
const estadoSolicitudLabel = (estado) => {
	const e = (estado || 'pendiente').toLowerCase();
	return capitalize(e);
};

const badgeEstadoClass = (estado) => {
	const estadoPago = (estado || '').toLowerCase();
	if (estadoPago === 'pagado' || estadoPago === 'confirmado') return 'text-success border-success';
	if (estadoPago === 'pendiente') return 'text-warning border-warning';
	if (estadoPago === 'rechazado' || estadoPago === 'anulado') return 'text-danger border-danger';
	if (estadoPago === 'reembolsado') return 'text-info border-info';
	return 'text-secondary border-secondary';
};
const estadoPagoVenta = computed(() => (ventaActual.value.estado_pago || 'pendiente').toLowerCase());
const estadoPagoColorClass = computed(() => {
	switch (estadoPagoVenta.value) {
		case 'pendiente': return 'text-warning';
		case 'adelantado': return 'text-info';
		case 'completo': return 'text-success';
		case 'anulado': return 'text-danger';
		default: return 'text-secondary';
	}
});
const puedeFacturar = computed(() => estadoPagoVenta.value === 'completo');

const prepararNuevoPago = () => {
	pagoEditar.value = null;
};

const prepararEditarPago = (pago) => {
	pagoEditar.value = pago;
};

const guardarPago = async (form, saldoPendiente=0) => {
	if (!route.params.id) return;

	const payload = {
		fecha: form.fechaPago,
		monto_abonado: Number(form.monto || 0),
		saldo_pendiente: Number(form.saldoPendiente || 0),
		metodo_pago: form.metodoPago,
		estado_pago: form.estadoPago,
		codigo_referencia: form.numeroComprobante || null,
		observaciones: form.observaciones || null,
		es_compromiso: Boolean(form.esCompromiso),
		fecha_compromiso: form.fechaCompromiso || null,
	};
	

	if (pagoEditar.value?.id) {
		await pagosStore.actualizar(route.params.id, pagoEditar.value.id, payload);
		pagoEditar.value = null;
		await pagosStore.listar(route.params.id);
		await ventaStore.obtenerPorId(route.params.id);
		return;
	}

	await pagosStore.guardar(route.params.id, payload);
};

const anularPago = async (pago) => {
	if (!pago?.id) return;
	const confirmar = window.confirm(`¿Anular el pago ${pago.codigo_referencia || `#${pago.id}`}?`);
	if (!confirmar) return;
	await pagosStore.eliminar(route.params.id, pago.id);
	await pagosStore.listar(route.params.id);
	await ventaStore.obtenerPorId(route.params.id);
};

onMounted(async () => {
	if (route.params.id) {
		await ventaStore.obtenerPorId(route.params.id);
		await pagosStore.listar(route.params.id);
	}
});
</script>

<template>
	<h1>Detalle de la venta</h1>

	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item">
				<a href="/"><i class="bi bi-house"></i></a>
			</li>
			<li class="breadcrumb-item"><a href="/ventas">Ventas</a></li>
			<li class="breadcrumb-item active" aria-current="page">Detalle</li>
		</ol>
	</nav>

	<p class="text-muted">Acciones</p>
	<div class="row mb-3">
		<div class="col d-flex flex-wrap gap-2">
			<button class="btn btn-outline-secondary">
				<i class="bi bi-pencil-square"></i> Editar venta
			</button>
			<button class="btn btn-outline-secondary">
				<i class="bi bi-printer"></i> Imprimir A4
			</button>
			<a class="btn btn-outline-secondary" href="https://wa.me/send?phone=51977692100&text=EnvíoDeEncuesta"
				target="_blank"><i class="bi bi-send"></i> Enviar encuesta</a>
		</div>
	</div>

	<!-- Pestañas -->
	<ul class="nav nav-tabs mb-3">
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'resumen' }" @click="activeTab = 'resumen'">
				Resumen
			</button>
		</li>
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'servicios' }" @click="activeTab = 'servicios'">
				Servicios
			</button>
		</li>
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'pagos' }" @click="activeTab = 'pagos'">
				Pagos y deudas
			</button>
		</li>
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'facturacion' }" @click="activeTab = 'facturacion'">
				Facturación
			</button>
		</li>
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'recursos' }" @click="activeTab = 'recursos'">
				Recursos
			</button>
		</li>
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'seguimiento' }" @click="activeTab = 'seguimiento'">
				Seguimiento de Operatividad
			</button>
		</li>
	</ul>

	<!-- Contenido de las pestañas -->
	<div class="tab-content">
		<!-- Pestaña Resumen -->
		<div v-if="activeTab === 'resumen'">
			<div class="row p-2">
				<div class="col-12 my-3 px-3">
					<div class="d-flex justify-content-between my-3">
						<p class="text-muted">Progreso:</p>
						<button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalCambiarProgreso"
							@click="abrirModalProgreso">
							<i class="bi bi-arrow-repeat"></i> Cambiar progreso
						</button>
					</div>
					<div class="timeline-wrapper position-relative w-100">
						<div class="timeline-track position-absolute w-100"
							style="top: 50%; transform: translateY(-50%); height: 4px; background: #e9ecef; border-radius: 2px; z-index: 0;">
						</div>
						<div class="timeline-progress position-absolute overflow-hidden"
							:style="{ top: '50%', transform: 'translateY(-50%)', left: '0', width: progresoWidth, height: '4px', background: '#0d6efd', borderRadius: '2px', zIndex: 1 }">
							<div class="shine-effect position-absolute h-100"
								style="top: 0; left: -100%; width: 50%; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%); animation: shineMove 2s ease-in-out infinite;">
							</div>
						</div>
						<div class="position-relative d-flex justify-content-between align-items-center" style="z-index: 2;">
							<div class="text-center position-relative mb-2" :class="{ 'text-primary': pasoActivo(0), 'text-muted': !pasoActivo(0) }" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px;"></i>
								<div class="mt-2 small fw-medium" :class="{ 'text-primary': pasoActivo(0), 'text-muted': !pasoActivo(0) }"><i class="bi bi-caret-right"></i> Cotización</div>
							</div>
							<div class="text-center position-relative mb-2" :class="{ 'text-primary': pasoActivo(1), 'text-muted': !pasoActivo(1) }" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px;"></i>
								<div class="mt-2 small fw-medium" :class="{ 'text-primary': pasoActivo(1), 'text-muted': !pasoActivo(1) }"><i class="bi bi-caret-right"></i> Venta</div>
							</div>
							<div class="text-center position-relative mb-2" :class="{ 'text-primary': pasoActivo(2), 'text-muted': !pasoActivo(2) }" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px;"></i>
								<div class="mt-2 small fw-medium" :class="{ 'text-primary': pasoActivo(2), 'text-muted': !pasoActivo(2) }"><i class="bi bi-caret-right"></i> Facturada</div>
							</div>
							<div class="text-center position-relative mb-2" :class="{ 'text-primary': pasoActivo(3), 'text-muted': !pasoActivo(3) }" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px;"></i>
								<div class="mt-2 small fw-medium" :class="{ 'text-primary': pasoActivo(3), 'text-muted': !pasoActivo(3) }"><i class="bi bi-caret-right"></i> En seguimiento</div>
							</div>
							<div class="text-center position-relative mb-2" :class="{ 'text-primary': pasoActivo(4), 'text-muted': !pasoActivo(4) }" style="flex: 1;">
								<i class="bi bi-check-circle-fill" style="font-size: 24px;"></i>
								<div class="mt-2 small fw-medium" :class="{ 'text-primary': pasoActivo(4), 'text-muted': !pasoActivo(4) }"><i class="bi bi-caret-right"></i> Finalizado</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 mt-3">
					<div class="">
						<div class="">
							
							<p><strong>Empresa:</strong> {{ ventaActual.cliente?.razon_social || '-' }} · {{ ventaActual.cliente?.ruc || '-' }}</p>
							<p><strong>Cliente:</strong> {{ `${ventaActual.cliente?.apellidos || ''} ${ventaActual.cliente?.nombres || ''}`.trim() || '-' }} · {{ ventaActual.cliente?.dni || '-' }}</p>
							<p><strong>Contacto:</strong> {{ ventaActual.cliente?.celular || '-' }}</p>
							<p><strong>Nacionalidad:</strong> {{ capitalize(ventaActual.nacionalidad) }}</p>
							<p><strong>N° de pasajeros:</strong> {{ ventaActual.personas ?? 0 }}</p>
							<p><strong>Fecha de creación:</strong> {{ ventaActual.created_at ? fechaLatamSimple(ventaActual.created_at) : '-' }}</p>
							
						</div>
					</div>
				</div>
				<div class="col-12 col-md-6 mt-3">
					<div class="">
						<div class="">
							<div class="row">
								<div class="col-12 col-md-6">
									<p>
										<strong>Pago:</strong> 
										<span class="ms-2" :class="estadoPagoColorClass">
											<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
											{{ capitalize(estadoPagoVenta) }}
										</span>
									</p>
									<p><strong>Monto Contratado con:</strong> {{ formatMoneda(montoContratado) }}</p>									
									<p><strong>Descuento:</strong> {{ formatMoneda(descuento) }}</p>
								</div>
								<div class="col-12 col-md-6">
									<p><strong>Adelanto:</strong> {{ formatMoneda(adelanto) }}</p>
									<p><strong>Saldo pendiente:</strong> {{ formatMoneda(saldoPendiente) }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- Pestaña Servicios -->
		<div v-if="activeTab === 'servicios'">
			<div class="row my-3 p-2">
				<div class="col col-md-6 my-2">
					<h5 class="card-title fw-bold mb-3">Servicios adquiridos por el cliente </h5>
					<ol v-if="serviciosVenta.length" class="list-group list-group-numbered puntero">
						<li
							v-for="item in serviciosVenta"
							:key="item.id"
							class="list-group-item d-flex justify-content-between align-items-start"
							style="transition: box-shadow 0.3s ease;"
						>
							<div class="ms-2 me-auto">
								<div class="fw-bold servicio">{{ item.descripcion || '-' }}</div>
								<span class="badge border" :class="servicioBadgeClass(item.tipo)">
									<i class="bi me-1" :class="servicioIcono(item.tipo)"></i>{{ servicioNombre(item.tipo) }}
								</span>
								<div class="text-muted mt-2">Clientes: {{ item.nro_clientes ?? 0 }} persona{{ Number(item.nro_clientes || 0) === 1 ? '' : 's' }}</div>
							</div>
							<div class="text-end">
								<div>
									<span class="text-muted"><i class="bi bi-calendar-event"></i></span>
									<span class="badge text-bg-light text-dark border rounded-pill mb-2">
										{{ item.created_at ? fechaLatamSimple(item.created_at) : '-' }}
									</span>
								</div>
								<div class="fw-bold text-primary">{{ formatMoneda(Number(item.precio || 0)) }}</div>
							</div>
						</li>
					</ol>
					<div v-else class="text-muted">No hay servicios registrados para esta venta.</div>
				</div>
			</div>
		</div>

		<!-- Pestaña Pagos y deudas -->
		<div v-if="activeTab === 'pagos'">
			<div class="row mt-3 p-2">
				<div class="col">
					<div class="card mb-3">
						<div class="card-body">
							<div class="d-flex justify-content-between">
								<p><strong>Cobros</strong></p>
								<button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalAddPago"
									@click="prepararNuevoPago">
									<i class="bi bi-wallet2"></i> Agregar pago
								</button>
							</div>
							<div class="row mb-2">
								<div class="col-12 col-md-6">
									<p>
										<strong>Pago:</strong>
										<span class="ms-2" :class="estadoPagoColorClass">
											<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
											{{ capitalize(estadoPagoVenta) }}
										</span>
									</p>
									<p><strong>Monto Contratado con:</strong> {{ formatMoneda(montoContratado) }}</p>
									<p><strong>Descuento:</strong> {{ formatMoneda(descuento) }}</p>									
								</div>
								<div class="col-12 col-md-6">
									<p><strong>Adelanto:</strong> {{ formatMoneda(adelanto) }}</p>
									<p><strong>Saldo pendiente:</strong> {{ formatMoneda(saldoPendiente) }}</p>
								</div>
							</div>
						</div>
					</div>
					<p class="text-muted">Detalles:</p>
					<div class="table-responsive">
						<table class="table table-hover">
							<thead>
								<tr>
									<th>#</th>
									<th>N° Comprobante</th>
									<th>Fecha de Pago</th>
									<th>Monto (S/)</th>
									<th>Saldo pendiente (S/)</th>
									<th>Estado</th>
									<th>Método de Pago</th>
									<th>Observaciones</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(pago, index) in pagos" :key="pago.id">
									<td>{{ index + 1 }}</td>
									<td>{{ pago.codigo_referencia || '-' }}</td>
									<td>{{ pago.fecha ? fechaLatamSimple(pago.fecha) : '-' }}</td>
									<td>{{ formatMoneda(Number(pago.monto_abonado || 0)) }}</td>
									<td>{{ formatMoneda(Number(pago.saldo_pendiente || 0)) }}</td>
									<td>
										<span
											class="badge text-bg-light border"
											:class="badgeEstadoClass(pago.estado_pago)">
											{{ capitalize(pago.estado_pago || '-') }}
										</span>
									</td>
									<td>{{ capitalize(pago.metodo_pago || '-') }}</td>
									<td>{{ pago.observaciones || (pago.fecha_compromiso ? `Compromiso: ${fechaLatamSimple(pago.fecha_compromiso)}` : '-') }}</td>
									<td>
										<div v-if="pago.activo == 1">
											<button class="btn btn-sm btn-outline-primary me-1" title="Editar pago"
												data-bs-toggle="modal" data-bs-target="#modalAddPago" @click="prepararEditarPago(pago)"><i
													class="bi bi-pencil-square"></i></button>
											<button class="btn btn-sm btn-outline-danger me-1 btnAnular" title="Anular pago"
												@click="anularPago(pago)"><i
													class="bi bi-capslock"></i></button>
										</div>
										<p v-else><span class="text-danger">Anulado</span></p>
									</td>
								</tr>
								<tr v-if="!pagos.length">
									<td colspan="9" class="text-muted py-3">No hay pagos registrados</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Pestaña Facturación -->
		<div v-if="activeTab === 'facturacion'">
			<div class="row my-3 p-2">
				<div class="col-12">
					<div v-if="!puedeFacturar" class="alert alert-warning">
						<i class="bi bi-exclamation-triangle-fill"></i> El cliente tiene deuda pendiente todavía.
					</div>
					<button class="btn btn-primary" :disabled="!puedeFacturar">
						<i class="bi bi-file-earmark-text"></i> Generar factura/Boleta
					</button>
				</div>
			</div>
		</div>

		<!-- Pestaña Recursos -->
		<div v-if="activeTab === 'recursos'" class="recursos-tab">
			<div class="row my-3 p-2">
				<div class="col-12">
					<h5 class="card-title fw-bold mb-3">Programación de recursos</h5>
					<div v-if="serviciosVenta.length" class="accordion" id="accordionRecursos">
						<div v-for="(item, index) in serviciosVenta" :key="item.id" class="accordion-item">
							<h2 class="accordion-header" :id="`recursoHeading${item.id || index}`">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									:data-bs-target="`#recursoCollapse${item.id || index}`"
									aria-expanded="false"
									:aria-controls="`recursoCollapse${item.id || index}`"
								>
									<div class="d-flex align-items-center gap-2">
										<span class="fw-semibold">{{ index + 1 }}.</span>
										<span class="badge border" :class="servicioBadgeClass(item.tipo)">
											<i class="bi me-1" :class="servicioIcono(item.tipo)"></i>{{ servicioNombre(item.tipo) }}
										</span>
										<span class="text-muted">{{ item.descripcion || '-' }}</span>
									</div>
								</button>
							</h2>
							<div
								:id="`recursoCollapse${item.id || index}`"
								class="accordion-collapse collapse"
								:aria-labelledby="`recursoHeading${item.id || index}`"
								data-bs-parent="#accordionRecursos"
							>
								<div class="accordion-body">
									<div class="row g-3">
										<div class="col-12 col-md-6">
											<h6 class="fw-bold">Requerimientos</h6>
											<template v-if="normalizarTipoServicio(tipoServicioItem(item)) === 'restaurant'">
												<p><strong>Número personas:</strong> {{ item.detalle?.numero_personas ?? 0 }}</p>
												<p><strong>Fecha confirmación:</strong> {{ item.detalle?.fecha_confirmacion ? fechaLatamSimple(item.detalle?.fecha_confirmacion) : '-' }}</p>
												<p><strong>Turno:</strong> <span class="text-capitalize">{{ item.detalle?.turno || '-' }}</span></p>
												<p><strong>Tipo servicio:</strong> <span class="text-capitalize">{{ item.detalle?.tipo_servicio || '-' }}</span></p>
												<p><strong>Espacio:</strong> <span class="text-capitalize">{{ item.detalle?.espacio || '-' }}</span></p>
												<p><strong>Precio:</strong> {{ formatMoneda(Number(item.detalle?.precio || 0)) }}</p>
												<p><strong>Fecha reserva:</strong> {{ item.detalle?.fecha_reserva ? fechaLatamSimple(item.detalle?.fecha_reserva) : '-' }}</p>
												<p><strong>Hora reserva:</strong> {{ item.detalle?.hora_reserva || '-' }}</p>
												<p><strong>Pedido especial:</strong> {{ item.detalle?.pedido_especial || '-' }}</p>
											</template>

											<template v-else-if="normalizarTipoServicio(tipoServicioItem(item)) === 'hospedaje'">
												<p><strong>Cantidad noches:</strong> {{ item.detalle?.cantidad_noches ?? 0 }}</p>
												<p><strong>N° habitaciones:</strong> {{ item.detalle?.num_habitaciones ?? 0 }}</p>
												<p><strong>Tipo habitación:</strong> {{ item.detalle?.tipo_habitacion || '-' }}</p>
												<p><strong>Fecha ingreso:</strong> {{ item.detalle?.fecha_ingreso ? fechaLatamSimple(item.detalle?.fecha_ingreso) : '-' }}</p>
												<p><strong>Fecha salida:</strong> {{ item.detalle?.fecha_salida ? fechaLatamSimple(item.detalle?.fecha_salida) : '-' }}</p>
												<p><strong>Hora checkin:</strong> {{ item.detalle?.hora_checkin || '-' }}</p>
												<p><strong>Hora checkout:</strong> {{ item.detalle?.hora_checkout || '-' }}</p>
												<p><strong>Adultos:</strong> {{ item.detalle?.cantidad_adultos ?? 0 }} · <strong>Niños:</strong> {{ item.detalle?.cantidad_ninos ?? 0 }}</p>
												<p><strong>Precio por noche:</strong> {{ formatMoneda(Number(item.detalle?.precio_por_noche || 0)) }}</p>
												<p><strong>Precio:</strong> {{ formatMoneda(Number(item.detalle?.precio || 0)) }}</p>
												<p><strong>Requiere cuna:</strong> {{ boolLabel(item.detalle?.requiere_cuna) }}</p>
												<p><strong>Habitación fumador:</strong> {{ boolLabel(item.detalle?.habitacion_fumador) }}</p>
												<p><strong>Preferencias especiales:</strong> {{ item.detalle?.preferencias_especiales || '-' }}</p>
											</template>

											<template v-else-if="normalizarTipoServicio(tipoServicioItem(item)) === 'vuelo'">
												<p><strong>Origen:</strong> {{ item.detalle?.origen || '-' }}</p>
												<p><strong>Destino:</strong> {{ item.detalle?.destino || '-' }}</p>
												<p><strong>Pasajeros:</strong> {{ item.detalle?.pasajeros ?? item.detalle?.nro_clientes ?? 0 }}</p>
												<p><strong>Lleva equipaje:</strong> {{ item.detalle?.lleva_equipaje === 'si' ? 'Sí' : 'No' }}</p>
												<p><strong>Kilos:</strong> {{ parseInt(item.detalle?.kilos || 0) }} kg</p>
												<p><strong>Equipaje:</strong> {{ item.detalle?.que_equipaje || '-' }}</p>
												<p><strong>Precio ticket:</strong> {{ formatMoneda(Number(item.detalle?.precio_ticket || 0)) }}</p>
												<p><strong>Precio soles:</strong> {{ formatMoneda(Number(item.detalle?.precio_soles || 0)) }}</p>
												<p><strong>Precio dólares:</strong> {{ Number(item.detalle?.precio_dolares || 0) }}</p>
												<p><strong>Fecha salida:</strong> {{ item.detalle?.fecha_salida ? fechaLatamSimple(item.detalle?.fecha_salida) : '-' }} · {{ convertirHora(item.detalle?.hora_salida) || '-' }}</p>
												<p><strong>Fecha llegada:</strong> {{ item.detalle?.fecha_llegada ? fechaLatamSimple(item.detalle?.fecha_llegada) : '-' }} · {{ convertirHora(item.detalle?.horario_llegada) || '-' }}</p>
												<p><strong>Observaciones:</strong> {{ item.detalle?.observaciones || '-' }}</p>
											</template>

											<template v-else-if="normalizarTipoServicio(tipoServicioItem(item)) === 'transporte'">
												<p><strong>Origen:</strong> {{ item.detalle.origen || '-' }}</p>
												<p><strong>Destino:</strong> {{ item.detalle.destino || '-' }}</p>
												<p><strong>Fecha inicio:</strong> {{ item.detalle.fecha_inicio ? fechaLatamSimple(item.detalle.fecha_inicio) : '-' }}</p>
												<p><strong>Fecha fin:</strong> {{ item.detalle.fecha_fin ? fechaLatamSimple(item.detalle.fecha_fin) : '-' }}</p>
												<p><strong>Hora recogida:</strong> {{ convertirHora(item.detalle.hora_recogida) || '-' }}</p>
												<p><strong>Hora devolución:</strong> {{ convertirHora(item.detalle.hora_devolucion) || '-' }}</p>
												<p><strong>Precio:</strong> {{ formatMoneda(Number(item.detalle.precio || 0)) }}</p>
												<p><strong>Pasajeros:</strong> {{ item.detalle.pasajeros ?? item.detalle.nro_clientes ?? 0 }}</p>
												<p><strong>Observaciones:</strong> {{ item.detalle.observaciones || '-' }}</p>
											</template>
										</div>

										<div class="col-12 col-md-6">
											<h6 class="fw-bold">Asignado</h6>
											<template v-if="normalizarTipoServicio(tipoServicioItem(item)) === 'restaurant'">
												<p>
													<strong>Estado:</strong>
													<span class="ms-2" :class="estadoSolicitudClass(item.detalle?.estado)">
														<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
														{{ estadoSolicitudLabel(item.detalle?.estado) }}
													</span>
												</p>
												<p><strong>Restaurant asignado:</strong> {{ item.detalle?.restaurante?.nombre || '-' }}</p>
												<p><strong>Contacto:</strong> {{ item.detalle?.restaurante?.contacto || 'sin contacto' }}</p>
												<p><strong>Comprobante:</strong> {{ item.detalle?.comprobante || '-' }}</p>
												<p v-if="(item.detalle?.restaurante?.estado || item.estado || '').toLowerCase() === 'cancelado'"><strong>Motivo cancelación:</strong> {{ item.detalle?.restaurante?.motivo_cancelacion || '-' }}</p>
											</template>

											<template v-else-if="normalizarTipoServicio(tipoServicioItem(item)) === 'hospedaje'">
												<p>
													<strong>Estado:</strong>
													<span class="ms-2" :class="estadoSolicitudClass(item.estado)">
														<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
														{{ estadoSolicitudLabel(item.estado) }}
													</span>
												</p>
												<p><strong>Hospedaje asignado:</strong> {{ item.detalle?.hospedaje?.hospedaje || '-' }}</p>
												<p><strong>Contacto hospedaje:</strong> {{ `${item.detalle?.hospedaje?.contacto || '-'} - ${item.detalle?.hospedaje?.celular || '-'}` }}</p>
												<p><strong>Número habitación:</strong> {{ item.numero_habitacion || '-' }}</p>
												<p><strong>Estado pago:</strong> {{ item.estado_pago || '-' }}</p>
												<p><strong>Motivo cancelación:</strong> {{ item.motivo_cancelacion || '-' }}</p>
												<p><strong>Nombre titular:</strong> {{ item.nombre_titular || '-' }}</p>
												<p><strong>Documento titular:</strong> {{ item.documento_titular || '-' }}</p>
												<p><strong>Datos contacto:</strong> {{ item.datos_contacto || '-' }}</p>
											</template>

											<template v-else-if="normalizarTipoServicio(tipoServicioItem(item)) === 'vuelo'">
												<p>
													<strong>Estado:</strong>
													<span class="ms-2" :class="estadoSolicitudClass(item.detalle?.estado_tramo)">
														<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
														{{ estadoSolicitudLabel(item.detalle?.estado_tramo) }}
													</span>
												</p>
												<p><strong>Aerolínea:</strong> {{ item.detalle?.aerolinea || '-' }}</p>
												<p><strong>Código vuelo:</strong> {{ item.detalle?.codigo_vuelo || '-' }}</p>
												<p><strong>Número vuelo:</strong> {{ item.detalle?.numero_vuelo || '-' }}</p>
												<p><strong>Aeronave:</strong> {{ item.detalle?.aeronave || '-' }}</p>
												<p><strong>Clase vuelo:</strong> <span class="text-capitalize">{{ item.detalle?.clase_vuelo || item.clase_vuelo || '-' }}</span></p>
												<p><strong>Escala:</strong> {{ boolLabel(item.detalle?.escala ?? item.escala) }}</p>
												<p><strong>Terminal salida:</strong> {{ item.detalle?.terminal_salida || '-' }}</p>
												<p><strong>Puerta embarque:</strong> {{ item.detalle?.puerta_embarque || '-' }}</p>
												<p><strong>Terminal llegada:</strong> {{ item.detalle?.terminal_llegada || '-' }}</p>
												
												<p><strong>Asientos asignados:</strong> {{ item.detalle?.asientos_asignados || '-' }}</p>
												<p><strong>Duración minutos:</strong> {{ item.detalle?.duracion_minutos ?? '-' }}</p>
												<p><strong>Costo soles:</strong> {{ formatMoneda(Number(item.detalle?.costo_soles || 0)) }}</p>
												<p><strong>Costo dólares:</strong> $ {{ parseFloat(Number(item.detalle?.costo_dolares || 0)).toFixed(2) }}</p>
											</template>

											<template v-else-if="normalizarTipoServicio(tipoServicioItem(item)) === 'transporte'">
												<p>
													<strong>Estado alquiler:</strong>
													<span class="ms-2" :class="estadoSolicitudClass(item.detalle?.estado_alquiler)">
														<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
														{{ estadoSolicitudLabel(item.detalle?.estado_alquiler) }}
													</span>
												</p>
												<p><strong>Conductor:</strong> {{ item.detalle?.vehiculo?.nombre_conductor || '-' }}</p>
												<p><strong>Placa:</strong> {{ item.detalle?.vehiculo?.placa || '-' }}</p>
												<p><strong>Tipo combustible:</strong> {{ item.detalle?.vehiculo?.tipo_combustible || '-' }}</p>
												<p><strong>Costo:</strong> {{ formatMoneda(Number(item.detalle.costo || 0)) }}</p>

											</template>

											<template v-else-if="normalizarTipoServicio(tipoServicioItem(item)) === 'tour'">
												<p>
													<strong>Estado:</strong>
													<span class="ms-2" :class="estadoSolicitudClass(item.detalle?.estado)">
														<i class="bi bi-circle-fill me-1" style="font-size: 0.55rem; vertical-align: middle;"></i>
														{{ estadoSolicitudLabel(item.detalle?.estado) }}
													</span>
												</p>
											</template>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-else class="text-muted">No hay servicios registrados para asignar recursos.</div>
				</div>
			</div>
		</div>

		<!-- Pestaña Seguimiento de Operatividad -->
		<div v-if="activeTab === 'seguimiento'">
			<div class="row my-3 p-2">
				<div class="col-12 col-lg-10">
					<h5 class="card-title fw-bold mb-3">Línea de tiempo</h5>
					<div class="timeline-card">
						<div class="timeline-list">
							<div class="timeline-item">
								<div class="timeline-dot bg-primary"><i class="bi bi-check-circle-fill"></i></div>
								<div class="timeline-content">
									<p class="timeline-date">10/05/2026</p>
									<p class="timeline-text">Reserva confirmada</p>
								</div>
							</div>
							<div class="timeline-item">
								<div class="timeline-dot bg-primary"><i class="bi bi-plus-circle-fill"></i></div>
								<div class="timeline-content">
									<p class="timeline-date">12/05/2026</p>
									<p class="timeline-text">Servicio "Vuelo Lima - Tingo María" agregado</p>
								</div>
							</div>
							<div class="timeline-item">
								<div class="timeline-dot bg-success"><i class="bi bi-person-check-fill"></i></div>
								<div class="timeline-content">
									<p class="timeline-date">14/05/2026</p>
									<p class="timeline-text">Recurso asignado: Proveedor de hospedaje</p>
								</div>
							</div>
							<div class="timeline-item">
								<div class="timeline-dot bg-success"><i class="bi bi-check2-circle"></i></div>
								<div class="timeline-content">
									<p class="timeline-date">14/05/2026</p>
									<p class="timeline-text">Recurso confirmado: Proveedor de hospedaje</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<ModalNuevoPago :pago-editar="pagoEditar" :saldo-pendiente-base="saldoPendiente" @guardar="guardarPago"></ModalNuevoPago>
	<div class="modal fade" id="modalCambiarProgreso" tabindex="-1" aria-labelledby="modalCambiarProgresoLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="modalCambiarProgresoLabel">Cambiar progreso de la venta</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<label for="sltProgresoVenta" class="form-label">Estado de progreso</label>
					<select id="sltProgresoVenta" class="form-select" v-model="progresoSeleccionado">
						<option value="cotización">Cotización</option>
						<option value="venta">Venta</option>
						<option value="facturada">Facturada</option>
						<option value="en seguimiento">En seguimiento</option>
						<option value="finalizado">Finalizado</option>
					</select>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="actualizarProgresoVenta">
						Guardar cambio
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
@keyframes shineMove {
	0% {
		left: -50%;
	}

	100% {
		left: 150%;
	}
}

.btnAnular i {
	transform: rotate(-180deg);
	display: inline-block;
}

.timeline-card {
	background: #f8fbff;
	border: 1px solid #dbe9ff;
	border-radius: 12px;
	padding: 18px 16px;
}

.timeline-list {
	position: relative;
	padding-left: 48px;
}

.timeline-list::before {
	content: "";
	position: absolute;
	left: 18px;
	top: 8px;
	bottom: 8px;
	width: 2px;
	background: linear-gradient(180deg, #7aa9ff 0%, #c8dcff 100%);
}

.timeline-item {
	position: relative;
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding-bottom: 18px;
}

.timeline-item:last-child {
	padding-bottom: 0;
}

.timeline-dot {
	position: absolute;
	left: -48px;
	width: 36px;
	height: 36px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
}

.timeline-content {
	background: #fff;
	border: 1px solid #e8eef8;
	border-radius: 10px;
	padding: 10px 12px;
	width: 100%;
}

.timeline-date {
	margin: 0;
	font-size: 0.8rem;
	color: #5f6f85;
	font-weight: 600;
}

.timeline-text {
	margin: 4px 0 0;
	color: #23364d;
}

.recursos-tab p strong {
	color: var(--bs-secondary-color);
	font-weight: 500;
}
</style>
