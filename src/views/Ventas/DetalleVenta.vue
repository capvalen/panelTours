<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useVentasStore } from '@/stores/ventaStore';
import { usePagosStore } from '@/stores/pagoStore';
import { useHospedajesStore } from '@/stores/hospedajeStore';
import { userestaurantestore } from '@/stores/restaurantStore';
import { useVehiculosStore } from '@/stores/vehiculoStore';
import { useGuiasStore } from '@/stores/guiaStore';
import { useAerolineasStore } from '@/stores/aerolineaStore';
import { useFormat } from '@/composables/formatos';
import ModalNuevoPago from '@/components/ModalNuevoPago.vue';
import ModalEditarConfirmaciones from './components/ModalEditarConfirmaciones.vue';
import ModalEditarAsignaciones from './components/ModalEditarAsignaciones.vue';
import RecursoRequerimientos from './components/RecursoRequerimientos.vue';
import RecursoAsignado from './components/RecursoAsignado.vue';
import Swal from 'sweetalert2';
import api from '@/services/axios';

const activeTab = ref('resumen');
const route = useRoute();
const ventaStore = useVentasStore();
const pagosStore = usePagosStore();
const hospedajesStore = useHospedajesStore();
const restaurantesStore = userestaurantestore();
const vehiculosStore = useVehiculosStore();
const guiasStore = useGuiasStore();
const aerolineasStore = useAerolineasStore();
const { fechaLatamSimple, formatMoneda, capitalize, convertirHora, encodeForUrl } = useFormat();
const pagoEditar = ref(null);

const ventaActual = computed(() => ventaStore.ventaActual || {});
const clienteActual = computed(() => ventaActual.value.cliente || {});
const pagos = computed(() => pagosStore.pagos || []);
const serviciosVenta = computed(() => ventaActual.value.items || []);
const progresoSeleccionado = ref('venta');
const confirmacionEditar = ref({
	itemId: null,
	tipo: '',
	detalleId: null,
	payload: {}
});
const asignacionEditar = ref({
	itemId: null,
	tipo: '',
	detalleId: null,
	payload: {}
});
const ventaGuiasByItemId = ref({});

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
const endpointPorTipo = (tipo) => {
	switch (normalizarTipoServicio(tipo)) {
		case 'restaurant': return 'venta_restaurantes';
		case 'hospedaje': return 'venta_hospedajes';
		case 'vuelo': return 'venta_vuelos';
		case 'tour': return 'venta_turismo';
		case 'transporte': return 'venta_autos';
		default: return null;
	}
};
const cargarVentaGuias = async () => {
	const ventaGuias = await api.get('/venta_guias');
	const mapa = {};
	(ventaGuias.data || []).forEach((g) => {
		mapa[Number(g.venta_item_id)] = g;
	});
	ventaGuiasByItemId.value = mapa;
};
const abrirModalConfirmaciones = (item) => {
	const tipo = normalizarTipoServicio(tipoServicioItem(item));
	const d = item?.detalle || {};
	const payloadBase = { ...d };
	if (tipo === 'restaurant') {
		confirmacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				estado: d.estado || 'pendiente',
				fecha_reserva: d.fecha_reserva || null,
				fecha_confirmacion: d.fecha_confirmacion || null,
				hora_reserva: d.hora_reserva || null,
				pedido_especial: d.pedido_especial || '',
				precio: Number(d.precio || 0),
			}
		};
		return;
	}
	if (tipo === 'hospedaje') {
		confirmacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				fecha_ingreso: d.fecha_ingreso || null,
				fecha_salida: d.fecha_salida || null,
				hora_checkin: d.hora_checkin || null,
				hora_checkout: d.hora_checkout || null,
				preferencias_especiales: d.preferencias_especiales || '',
				requiere_cuna: Boolean(d.requiere_cuna),
				habitacion_fumador: Boolean(d.habitacion_fumador),
				precio_por_noche: Number(d.precio_por_noche || 0),
				precio: Number(d.precio || 0),
			}
		};
		return;
	}
	if (tipo === 'vuelo') {
		confirmacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				estado_tramo: d.estado_tramo || 'pendiente',
				lleva_equipaje: d.lleva_equipaje || 'no',
				kilos: Number(d.kilos || 0),
				que_equipaje: d.que_equipaje || '',
				fecha_salida: d.fecha_salida || null,
				fecha_llegada: d.fecha_llegada || null,
				hora_salida: d.hora_salida || null,
				horario_llegada: d.horario_llegada || null,
				observaciones: d.observaciones || '',
			}
		};
		return;
	}
	if (tipo === 'tour') {
		confirmacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				estado: d.estado || 'pendiente',
				fecha_salida: d.fecha_salida || null,
				fecha_retorno: d.fecha_retorno || null,
				costo: Number(d.costo || 0),
				punto_partida: d.punto_partida || '',
				punto_llegada: d.punto_llegada || '',
				hora_salida: d.hora_salida || null,
				hora_retorno: d.hora_retorno || null,
				observaciones: d.observaciones || '',
			}
		};
		return;
	}
	if (tipo === 'transporte') {
		confirmacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				estado_alquiler: d.estado_alquiler || 'pendiente',
				fecha_inicio: d.fecha_inicio || null,
				fecha_fin: d.fecha_fin || null,
				hora_recogida: d.hora_recogida || null,
				hora_devolucion: d.hora_devolucion || null,
				observaciones: d.observaciones || '',
				costo: Number(d.costo || 0),
				precio: Number(d.precio || 0),
			}
		};
		return;
	}
	confirmacionEditar.value = {
		itemId: item.id,
		tipo,
		detalleId: d.id,
		payload: payloadBase
	};
};
const abrirModalAsignaciones = async (item) => {
	const tipo = normalizarTipoServicio(tipoServicioItem(item));
	const d = item?.detalle || {};
	if (tipo === 'restaurant') {
		asignacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				restaurante_id: d.restaurante_id || d.restaurante?.id || null,
				comprobante: d.comprobante || '',
			}
		};
		return;
	}
	if (tipo === 'hospedaje') {
		asignacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				hospedaje_id: d.hospedaje_id || d.hospedaje?.id || null,
				numero_habitacion: d.numero_habitacion || item.numero_habitacion || '',
				estado_pago: d.estado_pago || item.estado_pago || '',
				motivo_cancelacion: d.motivo_cancelacion || item.motivo_cancelacion || '',
				nombre_titular: d.nombre_titular || item.nombre_titular || '',
				documento_titular: d.documento_titular || item.documento_titular || '',
				datos_contacto: d.datos_contacto || item.datos_contacto || '',
			}
		};
		return;
	}
	if (tipo === 'vuelo') {
		asignacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				aerolinea: d.aerolinea || '',
				codigo_vuelo: d.codigo_vuelo || '',
				numero_vuelo: d.numero_vuelo || '',
				aeronave: d.aeronave || '',
				clase_vuelo: d.clase_vuelo || item.clase_vuelo || '',
				escala: Boolean(d.escala ?? item.escala),
				terminal_salida: d.terminal_salida || '',
				puerta_embarque: d.puerta_embarque || '',
				terminal_llegada: d.terminal_llegada || '',
				asientos_asignados: d.asientos_asignados || '',
				duracion_minutos: Number(d.duracion_minutos || 0),
				costo_soles: Number(d.costo_soles || 0),
				costo_dolares: Number(d.costo_dolares || 0),
			}
		};
		return;
	}
	if (tipo === 'transporte') {
		asignacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				vehiculo_id: d.vehiculo_id || d.vehiculo?.id || null,
				costo: Number(d.costo || 0),
			}
		};
		return;
	}
	if (tipo === 'tour') {
		const listadoGuias = await api.get('/venta_guias');
		const guiaActual = (listadoGuias.data || []).find(g => Number(g.venta_item_id) === Number(item.id)) || {};
		asignacionEditar.value = {
			itemId: item.id,
			tipo,
			detalleId: d.id,
			payload: {
				venta_guia_id: guiaActual.id || null,
				guia_id: guiaActual.guia_id || null,
				fecha: guiaActual.fecha || null,
				hora: guiaActual.hora || null,
				lugar_encuentro: guiaActual.lugar_encuentro || '',
				costo: Number(guiaActual.costo || 0),
				tipo_servicio: guiaActual.tipo_servicio || 'grupal',
			}
		};
		return;
	}
	asignacionEditar.value = {
		itemId: item.id,
		tipo,
		detalleId: d.id,
		payload: {}
	};
};
const guardarConfirmaciones = async () => {
	try {
		const { tipo, payload, itemId } = confirmacionEditar.value;
		const endpoint = endpointPorTipo(tipo);
		if (!endpoint) {
			await Swal.fire('Error', 'No se encontró el detalle del recurso para actualizar', 'error');
			return;
		}
		let detalleId = confirmacionEditar.value.detalleId;
		if (!detalleId && itemId) {
			const listado = await api.get(`/${endpoint}`);
			const detalle = (listado.data || []).find(d => Number(d.venta_item_id) === Number(itemId));
			detalleId = detalle?.id || null;
			confirmacionEditar.value.detalleId = detalleId;
		}
		if (!detalleId) {
			await Swal.fire('Error', 'No se encontró el detalle del recurso para actualizar', 'error');
			return;
		}
		await api.put(`/${endpoint}/${detalleId}`, payload);
		await ventaStore.obtenerPorId(route.params.id);
		await Swal.fire('Éxito', 'Confirmaciones actualizadas', 'success');
	} catch (error) {
		await Swal.fire('Error', 'No se pudieron actualizar las confirmaciones', 'error');
	}
};
const guardarAsignaciones = async () => {
	try {
		const { tipo, payload, itemId } = asignacionEditar.value;
		if (tipo === 'tour') {
			const payloadGuia = {
				venta_item_id: itemId,
				guia_id: payload.guia_id || null,
				fecha: payload.fecha || null,
				hora: payload.hora || null,
				lugar_encuentro: payload.lugar_encuentro || null,
				costo: Number(payload.costo || 0),
				tipo_servicio: payload.tipo_servicio || 'grupal',
			};
			const lista = await api.get('/venta_guias');
			const existente = (lista.data || []).find(g => Number(g.venta_item_id) === Number(itemId));
			if (existente?.id) {
				await api.put(`/venta_guias/${existente.id}`, payloadGuia);
			} else {
				await api.post('/venta_guias', payloadGuia);
			}
			await ventaStore.obtenerPorId(route.params.id);
			await cargarVentaGuias();
			await Swal.fire('Éxito', 'Asignaciones actualizadas', 'success');
			return;
		}
		const endpoint = endpointPorTipo(tipo);
		if (!endpoint) {
			await Swal.fire('Error', 'No se encontró el detalle del recurso para actualizar', 'error');
			return;
		}
		let detalleId = asignacionEditar.value.detalleId;
		if (!detalleId && itemId) {
			const listado = await api.get(`/${endpoint}`);
			const detalle = (listado.data || []).find(d => Number(d.venta_item_id) === Number(itemId));
			detalleId = detalle?.id || null;
			asignacionEditar.value.detalleId = detalleId;
		}
		if (!detalleId) {
			await Swal.fire('Error', 'No se encontró el detalle del recurso para actualizar', 'error');
			return;
		}
		await api.put(`/${endpoint}/${detalleId}`, payload);
		await ventaStore.obtenerPorId(route.params.id);
		await cargarVentaGuias();
		await Swal.fire('Éxito', 'Asignaciones actualizadas', 'success');
	} catch (error) {
		await Swal.fire('Error', 'No se pudieron actualizar las asignaciones', 'error');
	}
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
	} else {
		await pagosStore.guardar(route.params.id, payload);
	}

	await pagosStore.listar(route.params.id);
	await ventaStore.obtenerPorId(route.params.id);
};

const enviarEncuesta = () => {
	const parametro = encodeForUrl({
		id: route.params.id
	})
	window.open('http://localhost:5173/recopilacion-datos.html?p='+parametro, '_blank');
};

const anularPago = async (pago) => {
	if (!pago?.id) return;
	const confirmar = window.confirm(`¿Anular el pago ${pago.codigo_referencia || `#${pago.id}`}?`);
	if (!confirmar) return;
	await pagosStore.eliminar(route.params.id, pago.id);
	await pagosStore.listar(route.params.id);
	await ventaStore.obtenerPorId(route.params.id);
};

const seguimientosOrdenados = computed(() => {
	const segs = [...(ventaActual.value.seguimientos || [])];
	return segs.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
});

const getTimelineDotClass = (nombreAccion) => {
	const n = (nombreAccion || '').toLowerCase();
	if (n.includes('pago realizado')) return 'bg-success';
	if (n.includes('anulado') || n.includes('rechazado') || n.includes('eliminada')) return 'bg-danger';
	if (n.includes('cambio de estado')) return 'bg-info';
	return 'bg-primary';
};

const getTimelineIconClass = (nombreAccion) => {
	const n = (nombreAccion || '').toLowerCase();
	if (n.includes('pago realizado')) return 'bi-wallet2';
	if (n.includes('anulado') || n.includes('rechazado')) return 'bi-x-lg-circle-fill';
	if (n.includes('eliminada')) return 'bi-trash-fill';
	if (n.includes('cambio de estado') || n.includes('progreso')) return 'bi-arrow-repeat';
	if (n.includes('generada')) return 'bi-file-earmark-plus';
	return 'bi-check-circle-fill';
};

onMounted(async () => {
	if (route.params.id) {
		await Promise.all([
			ventaStore.obtenerPorId(route.params.id),
			pagosStore.listar(route.params.id),
			hospedajesStore.listar(),
			restaurantesStore.listar(),
			vehiculosStore.listar(),
			guiasStore.listar(),
			aerolineasStore.listar(),
		]);
		await cargarVentaGuias();
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
			<router-link :to="{ name: 'editarVenta', params: { id: route.params.id } }" class="btn btn-outline-secondary">
				<i class="bi bi-pencil-square"></i> Editar venta
			</router-link>
			<button class="btn btn-outline-secondary">
				<i class="bi bi-printer"></i> Imprimir A4
			</button>
			<button class="btn btn-outline-secondary" @click="enviarEncuesta"><i class="bi bi-send"></i> Enviar encuesta</button>
		</div>
	</div>

	<!-- Pestañas -->
	<ul class="nav nav-tabs mb-3">
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'resumen' }" @click="activeTab = 'resumen'">
				Resumen
			</button>
		</li>
		<li class="nav-item d-none">
			<button class="nav-link" :class="{ active: activeTab === 'servicios' }" @click="activeTab = 'servicios'">
				Servicios
			</button>
		</li>
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'recursos' }" @click="activeTab = 'recursos'">
				Recursos
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
			<button class="nav-link" :class="{ active: activeTab === 'seguimiento' }" @click="activeTab = 'seguimiento'">
				Seguimiento de Operatividad
			</button>
		</li>
		<li class="nav-item">
			<button class="nav-link" :class="{ active: activeTab === 'personas' }" @click="activeTab = 'personas'">
				Personas
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
						<div class="d-flex flex-column align-items-center gap-2">
							<span v-if="ventaActual.estado === 'anulado'" class="badge bg-danger">
								<i class="bi bi-x-lg-circle"></i> Venta Anulada
							</span>
							<button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalCambiarProgreso"
								@click="abrirModalProgreso" :disabled="ventaActual.estado === 'anulado'">
								<i class="bi bi-arrow-repeat"></i> Cambiar progreso
							</button>
						</div>
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
							<p><strong>N° de pasajeros:</strong> {{ ventaActual.cuantas_personas ?? 0 }}</p>
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
													class="bi bi-x-lg"></i></button>
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
									class="accordion-button"
									:class="{ collapsed: serviciosVenta.length > 1 }"
									type="button"
									data-bs-toggle="collapse"
									:data-bs-target="`#recursoCollapse${item.id || index}`"
									:aria-expanded="serviciosVenta.length === 1 ? 'true' : 'false'"
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
								:class="{ show: serviciosVenta.length === 1 }"
								:aria-labelledby="`recursoHeading${item.id || index}`"
								data-bs-parent="#accordionRecursos"
							>
								<div class="accordion-body">
									<div class="row mb-3">
										<div class="col">
											<button class="btn btn-sm btn-outline-primary ms-2" type="button" data-bs-toggle="modal"
												data-bs-target="#modalEditarConfirmaciones" @click.stop="abrirModalConfirmaciones(item)">
												<i class="bi bi-pencil-square"></i> Editar confirmaciones
											</button>
										</div>
										<div class="col">
									<button class="btn btn-sm btn-outline-primary ms-2" type="button" data-bs-toggle="modal"
										data-bs-target="#modalEditarAsignaciones" @click.stop="abrirModalAsignaciones(item)">
										<i class="bi bi-pencil-square"></i> Editar asignaciones
									</button>
										</div>
									</div>
									<div class="row g-3">
										<div class="col-12 col-md-6">
											<RecursoRequerimientos
												:item="item"
												:tipo-normalizado="normalizarTipoServicio(tipoServicioItem(item))"
												:nacionalidad-venta="ventaActual?.nacionalidad || ''"
												:fecha-latam-simple="fechaLatamSimple"
												:format-moneda="formatMoneda"
												:convertir-hora="convertirHora"
												:bool-label="boolLabel"
											/>
										</div>

										<div class="col-12 col-md-6">
											<RecursoAsignado
												:item="item"
												:tipo-normalizado="normalizarTipoServicio(tipoServicioItem(item))"
												:estado-solicitud-class="estadoSolicitudClass"
												:estado-solicitud-label="estadoSolicitudLabel"
												:bool-label="boolLabel"
												:format-moneda="formatMoneda"
												:convertir-hora="convertirHora"
												:fecha-latam-simple="fechaLatamSimple"
												:venta-guia="ventaGuiasByItemId[Number(item.id)] || null"
											/>
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

		<!-- Pestaña Personas -->
		<div v-if="activeTab === 'personas'">
			<div class="row my-3 p-2">
				<div class="col-12">
					<h5 class="card-title fw-bold mb-3">Personas</h5>

					<!-- Autorizaciones -->
					<div class="card mb-4">
						<div class="card-header">
							<h6 class="mb-0 fw-bold">Autorizaciones</h6>
						</div>
						<div class="card-body">
							<div class="row">
								<div class="col-6 col-md-3 mb-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" :checked="ventaActual.autorizaciones?.politica_privacidad" disabled>
										<label class="form-check-label">Política de privacidad</label>
									</div>
								</div>
								<div class="col-6 col-md-3 mb-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" :checked="ventaActual.autorizaciones?.terminos_condiciones" disabled>
										<label class="form-check-label">Términos y condiciones</label>
									</div>
								</div>
								<div class="col-6 col-md-3 mb-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" :checked="ventaActual.autorizaciones?.politica_cancelacion" disabled>
										<label class="form-check-label">Política de cancelación</label>
									</div>
								</div>
								<div class="col-6 col-md-3 mb-2">
									<div class="form-check">
										<input class="form-check-input" type="checkbox" :checked="ventaActual.autorizaciones?.uso_imagen" disabled>
										<label class="form-check-label">Uso de imagen</label>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Lista de personas -->
					<div class="d-flex justify-content-between align-items-center mb-3">
						<h6 class="mb-0 fw-bold">Lista de personas ({{ ventaActual.personas?.length || 0 }})</h6>
						<a href="/recopilacion-datos.html" class="btn btn-primary btn-sm">
							<i class="bi bi-send"></i> Enviar formulario
						</a>
					</div>
					<div v-if="ventaActual.personas?.length" class="accordion" id="accordionPersonas">
						<div v-for="persona in ventaActual.personas" :key="persona.indice" class="accordion-item">
							<h2 class="accordion-header" :id="`personaHeading${persona.indice}`">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									:data-bs-target="`#personaCollapse${persona.indice}`"
									aria-expanded="false"
									:aria-controls="`personaCollapse${persona.indice}`"
								>
									<div class="d-flex align-items-center gap-2">
										<span class="fw-semibold">{{ persona.indice }}.</span>
										<span>{{ persona.nombre || 'Sin nombre' }}</span>
										<span v-if="persona.es_titular" class="badge bg-primary ms-1">Titular</span>
										<span class="badge bg-secondary ms-1">{{ capitalize(persona.parentesco || '-') }}</span>
									</div>
								</button>
							</h2>
							<div
								:id="`personaCollapse${persona.indice}`"
								class="accordion-collapse collapse"
								:aria-labelledby="`personaHeading${persona.indice}`"
								data-bs-parent="#accordionPersonas"
							>
								<div class="accordion-body">
									<div class="row g-3">
										<div class="col-12 col-md-6">
											<p><strong>DNI:</strong> {{ persona.dni || '-' }}</p>
											<p><strong>Fecha de nacimiento:</strong> {{ persona.fecha_nacimiento ? fechaLatamSimple(persona.fecha_nacimiento) : '-' }}</p>
											<p><strong>Parentesco:</strong> {{ capitalize(persona.parentesco || '-') }}</p>
											<p><strong>Enfermedades:</strong> {{ persona.enfermedades === 'si' ? 'Sí' : 'No' }}</p>
											<p v-if="persona.enfermedades === 'si'"><strong>Detalle enfermedades:</strong> {{ persona.detalle_enfermedades || '-' }}</p>
										</div>
										<div class="col-12 col-md-6">
											<p><strong>Pasaporte:</strong> {{ persona.pasaporte || '-' }}</p>
											<p><strong>Fecha caducidad pasaporte:</strong> {{ persona.fecha_caducidad_pasaporte ? fechaLatamSimple(persona.fecha_caducidad_pasaporte) : '-' }}</p>
											<p><strong>País emisión:</strong> {{ capitalize(persona.pais_emision || '-') }}</p>
											<p><strong>Vacunas:</strong> {{ persona.vacunas === 'si' ? 'Sí' : 'No' }}</p>
											<p v-if="persona.vacunas === 'si'"><strong>Detalle vacunas:</strong> {{ persona.detalle_vacunas || '-' }}</p>
										</div>
										<div class="col-12">
											<p><strong>Observaciones:</strong> {{ persona.observaciones || '-' }}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-else class="text-muted">No hay personas registradas.</div>
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
	<ModalEditarConfirmaciones :confirmacion-editar="confirmacionEditar" @guardar="guardarConfirmaciones" />
	<ModalEditarAsignaciones
		:asignacion-editar="asignacionEditar"
		:hospedajes="hospedajesStore.hospedajes"
		:restaurantes="restaurantesStore.restaurantes"
		:vehiculos="vehiculosStore.vehiculos"
		:guias="guiasStore.guias"
		:aerolineas="aerolineasStore.aerolineas"
		@guardar="guardarAsignaciones"
	/>
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
