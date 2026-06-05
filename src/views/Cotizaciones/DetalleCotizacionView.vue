<template>
	<div class="container-fluid">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item"><router-link to="/cotizaciones">Cotizaciones</router-link></li>
				<li class="breadcrumb-item active">Cotización {{ cotizacionIdFormateado }}</li>
			</ol>
		</nav>

		<div v-if="cargando" class="text-center py-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
			<p class="mt-2 text-muted">Cargando cotización...</p>
		</div>

		<div v-else-if="error" class="alert alert-danger">
			<i class="bi bi-exclamation-triangle"></i> {{ error }}
		</div>

		<template v-else-if="cotizacion">
			<div class="d-flex justify-content-between align-items-start mb-3">
				<div>
					<h2 class="mb-1">Cotización {{ cotizacionIdFormateado }}</h2>
					<p class="text-muted mb-0">
						<i class="bi bi-calendar"></i> {{ formatFecha(cotizacion.fecha) }} &middot;
						<span :class="'badge bg-' + (cotizacion.estado === 'activo' ? 'success' : 'secondary')">
							{{ capitalize(cotizacion.estado) }}
						</span>
					</p>
				</div>
				<div class="d-flex gap-2">
					<router-link :to="'/cotizacion/nueva'" class="btn btn-outline-primary">
						<i class="bi bi-plus-lg"></i> Nueva cotización
					</router-link>
				</div>
			</div>

			<div class="row g-3">
				<!-- Datos del cliente -->
				<div class="col-md-4">
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
									<td>{{ cotizacion.cliente?.dni || cotizacion.cliente?.ruc || '-' }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Celular</td>
									<td>{{ cotizacion.cliente?.celular || '-' }}</td>
								</tr>
								<tr>
									<td class="text-muted small">Nacionalidad</td>
									<td>{{ capitalize(cotizacion.nacionalidad || 'peruana') }}</td>
								</tr>
							</table>
						</div>
					</div>
				</div>

				<!-- Datos del viaje -->
				<div class="col-md-8">
					<div class="card h-100">
						<div class="card-body">
							<h6 class="card-title"><i class="bi bi-geo-alt"></i> Datos del viaje</h6>
							<div class="row row-cols-3">
								<div class="col-md">
									<table class="table table-sm table-borderless mb-0">
										<tr>
											<td class="text-muted small" style="width: 100px;">Destino</td>
											<td class="fw-semibold">{{ cotizacion.departamento?.departamento || '-' }}</td>
										</tr>
										<tr v-if="cotizacion.fecha_inicio">
											<td class="text-muted small">Fecha inicio</td>
											<td class="fw-semibold">{{ formatFechaLarga(cotizacion.fecha_inicio) }}</td>
										</tr>
										<tr v-if="cotizacion.fecha_fin">
											<td class="text-muted small">Fecha fin</td>
											<td class="fw-semibold">{{ formatFechaLarga(cotizacion.fecha_fin) }}</td>
										</tr>
										<tr>
											<td class="text-muted small">Adultos</td>
											<td>{{ cotizacion.adults || 0 }}</td>
										</tr>
										<tr>
											<td class="text-muted small">Niños</td>
											<td>{{ cotizacion.kids || 0 }}</td>
										</tr>
										<tr>
											<td class="text-muted small">Total personas</td>
											<td>{{ cotizacion.cuantas_personas || (cotizacion.adults + cotizacion.kids) || 0 }}</td>
										</tr>
										<tr v-if="cotizacion.ciudad">
											<td class="text-muted small">Ciudad</td>
											<td>{{ cotizacion.ciudad }}</td>
										</tr>
									</table>
								</div>
								<div class="col-md">
									<div class="mb-2">
										<strong class="text-muted small">Ruta</strong>
										<span v-if="!editandoRuta">
											<span class="ms-1" v-if="cotizacion.ruta">{{ cotizacion.ruta }}</span>
											<small class="text-muted ms-1" v-else>Sin asignar</small>
											<button class="btn btn-sm btn-link p-0 ms-1" @click="iniciarEdicionRuta" title="Editar">
												<i class="bi bi-pencil"></i>
											</button>
										</span>
										<div v-else class="d-flex align-items-start gap-1 mt-1">
											<textarea class="form-control form-control-sm" v-model="rutaEdit" rows="2" style="flex:1; min-width:200px;" placeholder="Ingrese la ruta..."></textarea>
											<button class="btn btn-sm btn-success" @click="guardarRuta" title="Guardar"><i class="bi bi-check-lg"></i></button>
											<button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionRuta" title="Cancelar"><i class="bi bi-x-lg"></i></button>
										</div>
									</div>
									<div class="mb-2">
										<strong class="text-muted small">Servicios</strong>
										<button class="btn btn-sm btn-outline-primary ms-1 rounded-circle p-0" style="width:20px;height:20px;font-size:14px;line-height:1" @click="agregarServicio" title="Agregar servicio">+</button>
										<div class="mt-1">
											<div v-for="(item, index) in cotizacion.servicios || []" :key="'srv-'+index" class="d-flex align-items-center gap-1 mb-1">
												<span class="small">{{ item }}</span>
												<button class="btn btn-sm btn-outline-danger rounded-circle p-0" style="width:20px;height:20px;font-size:10px;line-height:1" @click="eliminarServicio(index)" title="Eliminar"><i class="bi bi-x"></i></button>
											</div>
										</div>
									</div>
									
								</div>
								<div class="col-md">
									<div class="mb-2">
										<strong class="text-muted small">Incluye</strong>
										<button class="btn btn-sm btn-outline-primary ms-1 rounded-circle p-0"
											style="width:20px;height:20px;font-size:14px;line-height:1" @click="agregarIncluye"
											title="Agregar">+</button>
										<div class="mt-1">
											<div v-for="(item, index) in cotizacion.incluye || []" :key="'inc-' + index"
												class="d-flex align-items-center gap-1 mb-1">
												<span class="small">{{ item }}</span>
												<button class="btn btn-sm btn-outline-danger rounded-circle p-0"
													style="width:20px;height:20px;font-size:10px;line-height:1" @click="eliminarIncluye(index)"
													title="Eliminar"><i class="bi bi-x"></i></button>
											</div>
										</div>
									</div>
									<div class="mb-2">
										<strong class="text-muted small">No incluye</strong>
										<button class="btn btn-sm btn-outline-primary ms-1 rounded-circle p-0"
											style="width:20px;height:20px;font-size:14px;line-height:1" @click="agregarNoIncluye"
											title="Agregar">+</button>
										<div class="mt-1">
											<div v-for="(item, index) in cotizacion.no_incluye || []" :key="'noinc-' + index"
												class="d-flex align-items-center gap-1 mb-1">
												<span class="small">{{ item }}</span>
												<button class="btn btn-sm btn-outline-danger rounded-circle p-0"
													style="width:20px;height:20px;font-size:10px;line-height:1" @click="eliminarNoIncluye(index)"
													title="Eliminar"><i class="bi bi-x"></i></button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Servicios -->
				<div class="col-12">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title"><i class="bi bi-list-check"></i> Servicios cotizados</h6>
							<div v-if="cotizacion.items && cotizacion.items.length > 0" class="table-responsive">
								<table class="table table-bordered table-hover align-middle mb-0">
									<thead class="table-light">
										<tr>
											<th class="text-center" style="width: 40px;">N°</th>
											<th>Tipo</th>
											<th>Servicio</th>
											<th>Destino</th>
											<th class="text-end">P. Adulto</th>
											<th class="text-end">P. Niño</th>
											<th class="text-end">Descuento</th>
											<th>Motivo descuento</th>
											<th class="text-end">Subtotal</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(item, index) in cotizacion.items" :key="item.id">
											<td class="text-center text-muted">{{ index + 1 }}</td>
											<td>{{ getIcono(item.tipo) }} {{ capitalize(item.tipo) }}</td>
											<td>{{ item.descripcion || '-' }}</td>
											<td>{{ item.destino || '-' }}</td>
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

				<!-- Totales -->
				<div class="col-12">
					<div class="card">
						<div class="card-body">
							<div class="row justify-content-end">
								<div class="col-md-4">
									<table class="table table-sm table-borderless mb-0">
										<tbody>
											<tr>
												<td class="text-muted">Subtotal servicios</td>
												<td class="text-end">S/ {{ formatPrecio(totalFinal) }}</td>
											</tr>
											<tr class="border-top">
												<td class="fw-bold fs-5">Total a cobrar</td>
												<td class="text-end fw-bold fs-5 text-primary">S/ {{ formatPrecio(totalFinal) }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Acciones -->
				<div class="col-12 mb-4">
					<div class="d-flex justify-content-between">
						<div>
							<router-link to="/cotizaciones" class="btn btn-outline-secondary">
								<i class="bi bi-arrow-left"></i> Volver
							</router-link>
						</div>
						<div class="d-flex gap-2" v-if="cotizacion.estado !== 'convertido'">
									<button class="btn btn-success" @click="generarPDF">
								<i class="bi bi-file-pdf"></i>
								Generar PDF para el viajero
							</button>
							<button class="btn btn-primary" @click="convertirReserva" :disabled="convirtiendo">
								<i class="bi bi-arrow-right-circle"></i>
								{{ convirtiendo ? 'Convirtiendo...' : 'Convertir en reserva' }}
							</button>
						</div>
						<div v-else class="d-flex align-items-center">
							<i class="bi bi-check-circle-fill text-success fs-4 me-2"></i>
							<span class="fw-semibold text-success">Cotización convertida</span>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/axios';
import { useRouter } from 'vue-router';
import { useCotizacionStore } from '@/stores/cotizacionStore';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

const props = defineProps({
	id: [String, Number],
});

const router = useRouter();
const cotizacionStore = useCotizacionStore();
const authStore = useAuthStore();

const cotizacion = ref(null);
const cargando = ref(true);
const error = ref('');
const convirtiendo = ref(false);

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

const parseLocalDate = (fecha) => {
	if (!fecha) return null;
	const [y, m, d] = fecha.slice(0, 10).split('-');
	return new Date(Number(y), Number(m) - 1, Number(d));
};

const formatFecha = (fecha) => {
	if (!fecha) return '-';
	const d = parseLocalDate(fecha);
	if (!d) return '-';
	return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatFechaLarga = (fecha) => {
	if (!fecha) return '-';
	const d = parseLocalDate(fecha);
	if (!d) return '-';
	return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
};

const clienteNombre = computed(() => {
	if (!cotizacion.value?.cliente) return '-';
	const c = cotizacion.value.cliente;
	return c.razon_social || (c.apellidos + ' ' + c.nombres) || '-';
});

const cotizacionIdFormateado = computed(() => {
	const num = Number(props.id);
	return 'COT-' + String(num).padStart(3, '0');
});

const totalFinal = computed(() => {
	if (!cotizacion.value?.items) return Number(cotizacion.value?.precio || 0);
	return cotizacion.value.items.reduce((sum, item) => sum + Number(item.precio || 0), 0);
});

onMounted(async () => {
	try {
		const data = await cotizacionStore.obtenerPorId(props.id);
		cotizacion.value = data;
	} catch (err) {
		console.error('Error al cargar cotización:', err);
		error.value = 'No se pudo cargar la cotización. Verifica que exista o intente nuevamente.';
	} finally {
		cargando.value = false;
	}
});

// ── Edición de campos ──
const editandoRuta = ref(false);
const rutaEdit = ref('');

const iniciarEdicionRuta = () => {
	rutaEdit.value = cotizacion.value?.ruta || '';
	editandoRuta.value = true;
};

const guardarRuta = async () => {
	try {
		await cotizacionStore.actualizar(props.id, { venta: { ruta: rutaEdit.value } });
		cotizacion.value.ruta = rutaEdit.value;
		editandoRuta.value = false;
	} catch (err) {
		console.error('Error al guardar ruta:', err);
		Swal.fire('Error', 'No se pudo guardar la ruta', 'error');
	}
};

const cancelarEdicionRuta = () => {
	editandoRuta.value = false;
};

const guardarArrays = async (campo, valor) => {
	try {
		await cotizacionStore.actualizar(props.id, { venta: { [campo]: valor } });
		cotizacion.value[campo] = [...valor];
	} catch (err) {
		console.error(`Error al guardar ${campo}:`, err);
		Swal.fire('Error', `No se pudo guardar ${campo}`, 'error');
	}
};

const agregarServicio = async () => {
	const { value: val } = await Swal.fire({
		title: 'Agregar servicio',
		input: 'text',
		inputPlaceholder: 'Nombre del servicio...',
		showCancelButton: true,
		confirmButtonText: 'Agregar',
		cancelButtonText: 'Cancelar',
	});
	if (!val || !val.trim()) return;
	const arr = [...(cotizacion.value.servicios || [])];
	arr.push(val.trim());
	guardarArrays('servicios', arr);
};

const eliminarServicio = (index) => {
	const arr = [...(cotizacion.value.servicios || [])];
	arr.splice(index, 1);
	guardarArrays('servicios', arr);
};

const agregarIncluye = async () => {
	const { value: val } = await Swal.fire({
		title: 'Agregar incluido',
		input: 'text',
		inputPlaceholder: 'Qué incluye...',
		showCancelButton: true,
		confirmButtonText: 'Agregar',
		cancelButtonText: 'Cancelar',
	});
	if (!val || !val.trim()) return;
	const arr = [...(cotizacion.value.incluye || [])];
	arr.push(val.trim());
	guardarArrays('incluye', arr);
};

const eliminarIncluye = (index) => {
	const arr = [...(cotizacion.value.incluye || [])];
	arr.splice(index, 1);
	guardarArrays('incluye', arr);
};

const agregarNoIncluye = async () => {
	const { value: val } = await Swal.fire({
		title: 'Agregar no incluido',
		input: 'text',
		inputPlaceholder: 'Qué no incluye...',
		showCancelButton: true,
		confirmButtonText: 'Agregar',
		cancelButtonText: 'Cancelar',
	});
	if (!val || !val.trim()) return;
	const arr = [...(cotizacion.value.no_incluye || [])];
	arr.push(val.trim());
	guardarArrays('no_incluye', arr);
};

const eliminarNoIncluye = (index) => {
	const arr = [...(cotizacion.value.no_incluye || [])];
	arr.splice(index, 1);
	guardarArrays('no_incluye', arr);
};

// ── Acciones ──

const generarPDF = () => {
	const baseUrl = import.meta.env.MODE === 'production'
		? 'https://apipanel.grupoeuroandino.com/api'
		: 'http://127.0.0.1:8000/api';
	const url = `${baseUrl}/cotizacion/${props.id}/pdf`;
	window.open(url, '_blank');
};

const convertirReserva = async () => {
		const result = await Swal.fire({
			title: '¿Convertir en reserva?',
			text: 'Se creará una venta a partir de esta cotización y se marcará como convertida.',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sí, convertir',
			cancelButtonText: 'Cancelar',
		});

	if (!result.isConfirmed) return;

	convirtiendo.value = true;
	try {
		const data = await cotizacionStore.convertirReserva(props.id, {
			usuario_id: authStore.user?.id
		});

		const c = cotizacion.value?.cliente;
		if (c) {
			const nombreCompleto = [c.apellidos, c.nombres].filter(Boolean).join(' ');
			try {
				await api.post('/personas', {
					venta_id: data.venta_id,
					nombre: nombreCompleto || c.razon_social || 'Sin nombre',
					dni: c.dni || '',
					es_titular: true,
					parentesco: 'titular',
				});
			} catch (e) {
				console.error('Error al crear persona titular:', e);
			}
		}
		
		await Swal.fire({
			icon: 'success',
			title: 'Cotización convertida',
			timer: 5000,
			timerProgressBar: true,
			showConfirmButton: false,
		});

		router.push(`/venta/detalle/${data.venta_id}`);
	} catch (err) {
		console.error('Error al convertir:', err);
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: err?.response?.data?.message || 'No se pudo convertir la cotización.',
		});
	} finally {
		convirtiendo.value = false;
	}
};
</script>
