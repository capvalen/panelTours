<template>
	<div class="container-fluid">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item"><router-link to="/cotizaciones">Cotizaciones</router-link></li>
				<li class="breadcrumb-item active">Nueva cotización</li>
			</ol>
		</nav>

		<h2 >Nueva Cotización</h2>
		<p class="mb-3 text-muted"><small>Armado de presupuestos</small></p>
		<!-- Filtro de cliente -->
		<div class="card">
			<div class="card-body">
				<h6 class="card-title"><i class="bi bi-caret-right"></i> Seleccionar cliente</h6>
				<div class="row g-3">
					<!-- Columna 1: Buscar cliente -->
					<div class="col-md-6">
						<label class="form-label">Buscar cliente</label>
						<div class="input-group">
							<input
								type="text"
								class="form-control"
								v-model="terminoBusqueda"
								placeholder="Buscar por nombre, DNI o celular..."
								@keyup.enter="buscarCliente"
							>
							<button class="btn btn-primary" @click="buscarCliente" :disabled="cargando">
								<i v-if="cargando" class="bi bi-arrow-repeat spinner"></i>
								<i v-else class="bi bi-search"></i>
							</button>
						</div>
						<!-- Resultados -->
						<div v-if="resultados.length > 0" class="list-group mt-2">
							<button
								v-for="cliente in resultados"
								:key="cliente.id"
								class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
								@click="seleccionarCliente(cliente)"
							>
								<span>
									<strong>{{ cliente.razon_social || (cliente.apellidos + ' ' + cliente.nombres) }}</strong>
									<br>
									<small class="text-muted">{{ cliente.dni || cliente.ruc || 'Sin DNI/RUC' }} {{ cliente.celular ? '| ' + cliente.celular : '' }}</small>
								</span>
								<i class="bi bi-chevron-right text-muted"></i>
							</button>
						</div>
						<div v-if="sinResultados" class="alert alert-warning mt-2 py-2 small">
							<i class="bi bi-exclamation-triangle"></i> No se encontraron clientes con ese término.
						</div>
					</div>
					<!-- Columna 2: Crear cliente nuevo -->
					<div class="col-md-6 d-flex flex-column align-items-center justify-content-end">
						<p class="text-muted mb-2"><small>¿El cliente no está registrado?</small></p>
						<a href="/cliente/nuevo" target="_blank" rel="noopener noreferrer" class="btn btn-outline-success">
							<i class="bi bi-person-plus"></i> Crear cliente nuevo
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Datos del cliente seleccionado -->
		<div class="card mt-3">
			<div class="card-body">
				<h6 class="card-title"><i class="bi bi-caret-right"></i> Datos del cliente</h6>
				<div class="row row-cols-2 row-cols-md-5 g-3">
					<div class="col">
						<label class="form-label text-muted small mb-0">Nombre / Razón Social</label>
						<p class="fw-semibold mb-0 fs-6">{{ clienteSeleccionado.razon_social || (clienteSeleccionado.apellidos + ' ' + clienteSeleccionado.nombres) || 'cliente sin especificar' }}</p>
					</div>
					<div class="col">
						<label class="form-label text-muted small mb-0">DNI / RUC</label>
						<p class="fw-semibold mb-0 fs-6">{{ clienteSeleccionado.dni || clienteSeleccionado.ruc || '-' }}</p>
					</div>
					<div class="col">
						<label class="form-label text-muted small mb-0">Nacionalidad</label>
						<p class="fw-semibold mb-0 fs-6">{{ clienteSeleccionado.nacionalidad || 'peruano' }}</p>
					</div>
					<div class="col">
						<label class="form-label text-muted small mb-0">Celular</label>
						<p class="fw-semibold mb-0 fs-6">{{ clienteSeleccionado.celular || '-' }}</p>
					</div>
					<div class="col">
						<label class="form-label text-muted small mb-0">Correo</label>
						<p class="fw-semibold mb-0 fs-6">{{ clienteSeleccionado.correo || '-' }}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Filtro de viaje: departamento, fechas, pasajeros -->
		<div class="card mt-3">
			<div class="card-body">
				<h6 class="card-title"><i class="bi bi-caret-right"></i> Datos del viaje</h6>
				<div class="row g-3">
					<div class="col-md-3">
						<label class="form-label">Departamento destino</label>
						<select class="form-select" v-model="filtros.departamento">
							<option value="">Seleccionar...</option>
							<option v-for="dep in departamentosLista" :key="dep" :value="dep">{{ dep }}</option>
						</select>
					</div>
					<div class="col-md-3">
						<label class="form-label">Fecha inicio</label>
						<input type="date" class="form-control" v-model="filtros.fechaInicio">
					</div>
					<div class="col-md-3">
						<label class="form-label">Fecha fin</label>
						<input type="date" class="form-control" v-model="filtros.fechaFin">
					</div>
					<div class="col-md-1">
						<label class="form-label">Adultos</label>
						<input type="number" class="form-control" v-model.number="filtros.adultos" min="1" value="1">
					</div>
					<div class="col-md-1">
						<label class="form-label">Niños</label>
						<input type="number" class="form-control" v-model.number="filtros.ninos" min="0" value="0">
					</div>
				</div>
			</div>
		</div>

		<!-- Botones de servicio -->
		<div class="d-flex flex-wrap gap-2 mt-3 mb-3">
			<button class="btn btn-outline-primary" @click="abrirModalExtraer">
				<i class="bi bi-globe"></i> Extraer Tour desde la web
			</button>
			<button class="btn btn-outline-secondary" @click="agregarServicio('tour')">
				<i class="bi bi-suitcase-lg"></i> Tour privado
			</button>
			<button class="btn btn-outline-secondary" @click="agregarServicio('hospedaje')">
				<i class="bi bi-buildings"></i> Hospedaje
			</button>
			<button class="btn btn-outline-secondary" @click="agregarServicio('vuelo')">
				<i class="bi bi-airplane"></i> Avión
			</button>
			<button class="btn btn-outline-secondary" @click="agregarServicio('restaurante')">
				<i class="bi bi-shop"></i> Restaurante
			</button>
		</div>

		<!-- Lista de servicios agregados (tabla) -->
		<div v-if="servicios.length > 0" class="mt-3">
			<h6 class="card-title mb-3"><i class="bi bi-caret-right"></i> Servicios agregados</h6>
			<div class="table-responsive">
				<table class="table table-bordered table-hover align-middle mb-0">
					<thead class="table-light">
						<tr>
							<th class="text-center" style="width: 40px;">N°</th>
							<th>Tipo servicio</th>
							<th>Servicio</th>
							<th>Destino</th>
							<th class="text-end" style="width: 100px;">P. Adulto</th>
							<th class="text-end" style="width: 100px;">P. Niño</th>
							<th style="width: 90px;">Descuento</th>
							<th style="width: 140px;">Motivo descuento</th>
							<th class="text-end" style="width: 110px;">Subtotal</th>
							<th class="text-center" style="width: 40px;"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(servicio, index) in servicios" :key="index">
							<td class="text-center text-muted">{{ index + 1 }}</td>
							<td>{{ getIcono(servicio.tipo) }} {{ capitalize(servicio.tipo) }}</td>
							
							<td>
								<input
									type="text"
									class="form-control form-control-sm"
									v-model="servicio.descripcion"
									placeholder="Describir servicio..."
								>
							</td>
							<td>
								<input type="text" class="form-control form-control-sm" v-model="servicio.destino" placeholder="">
							</td>
							<td>
								<input
									type="number"
									class="form-control form-control-sm text-end"
									v-model.number="servicio.precio_adulto"
									min="0"
									style="width: 100px;"
								>
							</td>
							<td>
								<input
									type="number"
									class="form-control form-control-sm text-end"
									v-model.number="servicio.precio_kids"
									min="0"
									style="width: 100px;"
								>
							</td>
							<td>
								<input
									type="number"
									class="form-control form-control-sm"
									v-model.number="servicio.descuento"
									min="0"
									style="width: 80px;"
								>
							</td>
							<td>
								<input
									type="text"
									class="form-control form-control-sm"
									v-model="servicio.motivo_descuento"
									placeholder=""
								>
							</td>
							<td class="text-end fw-semibold">S/ {{ formatPrecio(calcularSubtotal(servicio)) }}</td>
							<td class="text-center">
								<button class="btn btn-sm btn-outline-danger" @click="eliminarServicio(index)">
									<i class="bi bi-x-lg"></i>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="d-flex justify-content-end mt-3">
				<div class="bg-light p-3 rounded border">
					<strong class="fs-5">Total a cobrar: <span class="text-primary">S/ {{ formatPrecio(totalAPagar) }}</span></strong>
				</div>
			</div>
			<div class="d-flex justify-content-end mt-3">
				<button
					class="btn btn-lg btn-success"
					@click="guardarCotizacion"
					:disabled="guardando"
				>
					<i v-if="guardando" class="bi bi-arrow-repeat spinner"></i>
					<i v-else class="bi bi-check2-circle"></i>
					{{ guardando ? 'Guardando...' : 'Guardar cotización' }}
				</button>
			</div>
		</div>

		<!-- Modal: Extraer Tour desde la web -->
		<div class="modal fade" id="modalExtraerTour" tabindex="-1" aria-labelledby="modalExtraerTourLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg modal-dialog-scrollable">
				<div class="modal-content">
					<div class="modal-header border-0">
						<h5 class="modal-title" id="modalExtraerTourLabel">
							<i class="bi bi-globe"></i> Tours desde la web
						</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
					</div>
					<div class="modal-body">
						<div class="text-muted small mb-3" v-if="filtros.departamento">
							<i class="bi bi-geo-alt"></i> {{ filtros.departamento }}
						</div>
						<!-- Loading -->
						<div v-if="cargandoTours" class="text-center py-4">
							<div class="spinner-border text-primary" role="status">
								<span class="visually-hidden">Cargando...</span>
							</div>
							<p class="mt-2 text-muted">Buscando tours...</p>
						</div>
						<!-- Error -->
						<div v-else-if="errorTours" class="alert alert-danger">
							<i class="bi bi-exclamation-triangle"></i> {{ errorTours }}
						</div>
						<!-- Sin resultados -->
						<div v-else-if="toursWeb.length === 0 && !cargandoTours" class="text-center py-4 text-muted">
							<i class="bi bi-search" style="font-size: 2rem;"></i>
							<p class="mt-2">Selecciona un departamento y haz clic en "Buscar tours"</p>
						</div>
						<!-- Lista de tours -->
						<div v-else class="list-group">
							<button
								v-for="tour in toursWeb"
								:key="tour.id"									class="list-group-item list-group-item-action text-start"
									data-bs-dismiss="modal"
									@click="agregarTourWeb(tour)"
							>
								<div class="d-flex justify-content-between align-items-start">
									<div>
										<strong class="fs-6">{{ tour.contenido.nombre }}</strong>
										<div class="d-flex gap-2 align-items-end">
											<p class="mb-0 text-muted small"><span class="badge text-bg-secondary">{{ tour.contenido.tipo == 1 ? 'Tour' : 'Paquete' }}</span></p>
											<div class="mt-1">
												<template v-if="esPeruano">
													<span class="badge bg-white border border-success text-success me-1">S/ {{ formatPrecio(tour.contenido.peruanos?.adultos) }} x Adulto</span>
													<span class="badge bg-white border border-success text-success">S/ {{ formatPrecio(tour.contenido.peruanos?.kids) }} x Niño</span>
												</template>
												<template v-else>
													<span class="badge bg-white border border-warning text-warning text-dark me-1">S/ {{ formatPrecio(tour.contenido.extranjeros?.adultos) }} x Adulto</span>
													<span class="badge bg-white border border-warning text-warning text-dark">S/ {{ formatPrecio(tour.contenido.extranjeros?.kids) }} x Niño</span>
												</template>
											</div>
										</div>
									</div>
									<div class="text-end ms-3">
										<small class="text-success"><i class="bi bi-plus-circle"></i> Agregar</small>
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClienteStore } from '@/stores/clienteStore';
import { useAuthStore } from '@/stores/auth';
import { useDepartamentosStore } from '@/stores/departamentoStore';
import { useCotizacionStore } from '@/stores/cotizacionStore';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const router = useRouter();
const clienteStore = useClienteStore();
const authStore = useAuthStore();
const departamentoStore = useDepartamentosStore();
const cotizacionStore = useCotizacionStore();

// ── Cliente ──
const terminoBusqueda = ref('');
const resultados = ref([]);
const sinResultados = ref(false);
const cargando = ref(false);

const clienteSeleccionado = ref({
	id: 1,
	nombres: 'cliente sin especificar',
	apellidos: '',
	razon_social: '',
	dni: '-',
	ruc: '',
	celular: '-',
	correo: '-',
	nacionalidad: 'peruano',
});

const buscarCliente = async () => {
	const termino = terminoBusqueda.value.trim();
	if (!termino) return;
	cargando.value = true;
	sinResultados.value = false;
	resultados.value = [];
	try {
		await clienteStore.buscarClientes(termino);
		resultados.value = clienteStore.clientes;
		sinResultados.value = resultados.value.length === 0;
	} catch (error) {
		console.error('Error al buscar clientes:', error);
		sinResultados.value = true;
	} finally {
		cargando.value = false;
	}
};

const seleccionarCliente = (cliente) => {
	clienteSeleccionado.value = { ...cliente };
	resultados.value = [];
	terminoBusqueda.value = '';
};

// ── Filtros de viaje ──
const departamentosLista = [
	'Amazonas', 'Ancash', 'Apurimac', 'Arequipa', 'Ayacucho', 'Cajamarca',
	'Cusco',	'El Callao', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
	'Chanchamayo', 'Chupaca', 'Concepción', 'Huancayo', 'Jauja',
	'Satipo', 'Tarma', 'Yauli', 'La Libertad', 'Lambayeque', 'Lima',
	'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno',
	'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

const filtros = reactive({
	departamento: '',
	fechaInicio: '',
	fechaFin: '',
	adultos: 1,
	ninos: 0,
});

// ── Servicios agregados a la cotización ──
const servicios = ref([]);

const capitalize = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const getIcono = (tipo) => {
	const iconos = {
			web: '🌐',
			tour: '🧳',
			hospedaje: '🏨',
			vuelo: '✈️',
			restaurante: '🍽️',
	};
	return iconos[tipo] || '📦';
};

const agregarServicio = (tipo) => {
	if (!filtros.departamento) {
		Swal.fire('Selecciona un departamento', 'Debes seleccionar un departamento antes de agregar un servicio.', 'warning');
		return;
	}
	const nombreMap = {
		tour: 'Tour privado',
		hospedaje: 'Hospedaje',
		vuelo: 'Avión',
		restaurante: 'Restaurante',
	};
	servicios.value.push({
		tipo,
		destino: filtros.departamento,
		descripcion: nombreMap[tipo] || tipo,
		precio_adulto: 0,
		precio_kids: 0,
		descuento: 0,
		motivo_descuento: '',
	});
};

const eliminarServicio = (index) => {
	servicios.value.splice(index, 1);
};

const calcularSubtotal = (servicio) => {
	const base = (Number(servicio.precio_adulto || 0) * filtros.adultos) + (Number(servicio.precio_kids || 0) * filtros.ninos);
	const desc = Number(servicio.descuento || 0);
	return Math.max(0, base - desc);
};

const totalAPagar = computed(() => {
	return servicios.value.reduce((sum, s) => sum + calcularSubtotal(s), 0);
});

// ── Precios según nacionalidad ──
const esPeruano = computed(() => {
	const nac = (clienteSeleccionado.value.nacionalidad || 'peruano').toLowerCase();
	return nac === 'peruano' || nac === 'peruana';
});

const formatPrecio = (val) => {
	if (val === null || val === undefined || val === '') return '-';
	const num = Number(val);
	return isNaN(num) ? val : num.toFixed(2);
};

// ── Modal: Extraer Tour desde la web ──
const toursWeb = ref([]);
const cargandoTours = ref(false);
const errorTours = ref('');

const buscarToursWeb = async () => {
	if (!filtros.departamento) return;
	cargandoTours.value = true;
	errorTours.value = '';
	toursWeb.value = [];

	try {
		const formData = new FormData();
		formData.append('idPais', '140');
		formData.append('idDepartamento', String(departamentosLista.indexOf(filtros.departamento)));
		formData.append('idTour', '-1');
		formData.append('idActividad', '-1');
		formData.append('texto', '');
		formData.append('idCategoria', '-1');
		formData.append('idTransporte', '-1');
		formData.append('idDia', '-1');
		formData.append('idHospedaje', '-1');
		formData.append('idPrecio', '-1');

		const response = await fetch(`${API_URL}buscarFiltroTienda.php`, {
			method: 'POST',
			body: formData,
		});
		const data = await response.json();
		const rawData = Array.isArray(data) ? data : (data.tours || data.datos || []);
		toursWeb.value = rawData.map(item => ({
			id: item.id,
			contenido: JSON.parse(item.contenido),
			_data: item,
		}));
	} catch (error) {
		console.error('Error al buscar tours:', error);
		errorTours.value = 'No se pudieron cargar los tours. Intente nuevamente.';
	} finally {
		cargandoTours.value = false;
	}
};

const abrirModalExtraer = () => {
	if (!filtros.departamento) {
		Swal.fire('Selecciona un destino', 'Debes seleccionar un departamento de destino antes de buscar tours.', 'warning');
		return;
	}
	const modalEl = document.getElementById('modalExtraerTour');
	if (modalEl) {
		const modal = new Modal(modalEl);
		modal.show();
		// Disparar búsqueda automática al abrir
		buscarToursWeb();
	}
};

const agregarTourWeb = (tour) => {
	const precio_adulto = Number(esPeruano.value
		? tour.contenido.peruanos?.adultos
		: tour.contenido.extranjeros?.adultos) || 0;
	const precio_kids = Number(esPeruano.value
		? tour.contenido.peruanos?.kids
		: tour.contenido.extranjeros?.kids) || 0;

	servicios.value.push({
		tipo: 'web',
		destino: filtros.departamento,
		descuento: 0,
		motivo_descuento: '',
		precio_adulto,
		precio_kids,
		descripcion: tour.contenido.nombre || 'Tour web',
	});
};

// ── Inicialización ──
onMounted(async () => {
	// Fecha por defecto: hoy (hora local)
	filtros.fechaInicio = generarFechaHoy();
	filtros.fechaFin = generarFechaHoy();

	try {
		await departamentoStore.listar();
	} catch (e) {
		console.warn('No se pudieron cargar departamentos', e);
	}
	const clienteId = route.query.clienteId || 1;
	try {
		const cliente = await clienteStore.obtenerClienteId(clienteId);
		if (cliente) {
			clienteSeleccionado.value = { ...cliente };
		}
	} catch (error) {
		console.warn('No se pudo cargar el cliente, usando valores predeterminados');
	}
});

// ── Guardar cotización ──
const guardando = ref(false);

const obtenerDepartamentoId = (nombreDepartamento) => {
	if (!nombreDepartamento) return null;
	// Mapeo manual para sub-regiones que no existen en la tabla departamentos
	const departamentoIdMap = {
		'Chanchamayo': 12, 'Chupaca': 12, 'Concepción': 12, 'Huancayo': 12,
		'Jauja': 12, 'Satipo': 12, 'Tarma': 12, 'Yauli': 12,
		'El Callao': 7,
	};
	if (departamentoIdMap[nombreDepartamento]) return departamentoIdMap[nombreDepartamento];

	// Normalizar: quitar acentos para comparación
	const normalizar = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	const nombreNorm = normalizar(nombreDepartamento);

	// Primero buscar match exacto (normalizado)
	const exacto = departamentoStore.departamentos.find(d =>
		normalizar(d.departamento) === nombreNorm
	);
	if (exacto) return exacto.id;

	// Fallback: buscar por inclusión (de la BD hacia el input, no al revés)
	const porInclusion = departamentoStore.departamentos.find(d =>
		normalizar(nombreDepartamento).includes(normalizar(d.departamento))
	);
	return porInclusion?.id || null;
};

const generarFechaHoy = () => {
	const hoy = new Date();
	const year = hoy.getFullYear();
	const month = String(hoy.getMonth() + 1).padStart(2, '0');
	const day = String(hoy.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const guardarCotizacion = async () => {
	// Validaciones
	if (!clienteSeleccionado.value?.id) {
		Swal.fire('Selecciona un cliente', 'Debes seleccionar un cliente antes de guardar.', 'warning');
		return;
	}
	if (!filtros.departamento) {
		Swal.fire('Selecciona un destino', 'Debes seleccionar un departamento de destino.', 'warning');
		return;
	}
	if (servicios.value.length === 0) {
		Swal.fire('Agrega servicios', 'Debes agregar al menos un servicio a la cotización.', 'warning');
		return;
	}

	const servicioConCero = servicios.value.find(s => calcularSubtotal(s) <= 0);
	if (servicioConCero) {
		const idx = servicios.value.indexOf(servicioConCero) + 1;
		Swal.fire({
			title: 'Servicio con subtotal en cero',
			html: `El servicio <strong>#${idx}</strong> (${capitalize(servicioConCero.tipo)}: ${servicioConCero.descripcion || 'sin descripción'}) tiene un subtotal de <strong>S/ 0.00</strong>.<br><br>Asigna un precio antes de guardar la cotización.`,
			icon: 'warning',
		});
		return;
	}

	guardando.value = true;

	try {
		const departamentoId = obtenerDepartamentoId(filtros.departamento);
		const hoy = filtros.fechaInicio || generarFechaHoy();
		const totalAdultos = servicios.value.reduce((sum, s) => sum + (Number(s.precio_adulto || 0) * filtros.adultos), 0);
		const totalKids = servicios.value.reduce((sum, s) => sum + (Number(s.precio_kids || 0) * filtros.ninos), 0);
		const totalGlobal = totalAPagar.value;

		// Preparar canasta: agregar precio (subtotal) a cada item
		const canasta = servicios.value.map(s => ({
			tipo: s.tipo,
			descripcion: s.descripcion || '',
			destino: s.destino || '',
			precio_adulto: Number(s.precio_adulto || 0),
			precio_kids: Number(s.precio_kids || 0),
			descuento: Number(s.descuento || 0),
			motivo_descuento: s.motivo_descuento || '',
			precio: calcularSubtotal(s),
		}));

		const payload = {
			venta: {
				usuario_id: authStore.user?.id || 1,
				cliente_id: clienteSeleccionado.value.id,
				fecha: hoy,
				fecha_inicio: filtros.fechaInicio || null,
				fecha_fin: filtros.fechaFin || null,
				adults: filtros.adultos,
				kids: filtros.ninos,
				cuantas_personas: filtros.adultos + filtros.ninos,
				departamento_id: departamentoId,
				precio_adultos: totalAdultos,
				precio_kids: totalKids,
				precio: totalGlobal,
				nacionalidad: esPeruano.value ? 'peruana' : 'extranjera',
				estado: 'activo',
			},
			canasta,
		};

		const resultado = await cotizacionStore.guardar(payload);

		await Swal.fire({
			title: 'Cotización guardada',
			text: `Cotización #${resultado.id} creada correctamente.`,
			icon: 'success',
			timer: 3000,
			timerProgressBar: true,
		});

		router.push(`/cotizacion/detalle/${resultado.id}`);
	} catch (error) {
		console.error('Error al guardar cotización:', error);
		Swal.fire('Error', 'No se pudo guardar la cotización. Intente nuevamente.', 'error');
	} finally {
		guardando.value = false;
	}
};
</script>
