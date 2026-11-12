<template>
	<div class="container-fluid">
		<div class="mb-3">
			<h2>Cotizaciones</h2>
			<p class="text-muted mb-0">Panel de cotizaciones.</p>
		</div>

		<!-- Filtros -->
		<div class="card mb-3">
			<div class="card-body">
				<div class="row g-2 align-items-end">
					<!-- Filtro por fecha -->
					<div class="col-md-3">
						<label class="form-label small">Fecha</label>
						<div class="input-group input-group-sm">
							<input type="date" class="form-control" v-model="filtros.fecha" @keyup.enter="buscarPorFecha">
							<button class="btn btn-outline-primary" @click="buscarPorFecha" title="Filtrar por fecha">
								<i class="bi bi-calendar-check"></i>
							</button>
						</div>
					</div>
					<div class="col-md-2">
						<label class="form-label small">Estado</label>
						<select class="form-select form-select-sm" v-model="filtros.estado">
							<option value="">Todos</option>
							<option value="activo">Activo</option>
							<option value="convertido">Convertido</option>
						</select>
					</div>
					<!-- Búsqueda por nombre / DNI / celular / COT- -->
					<div class="col-md-4">
						<label class="form-label small">Buscar por nombre, DNI o celular</label>
						<div class="input-group input-group-sm">
							<input
								type="text"
								class="form-control"
								v-model="filtros.search"
								placeholder="Nombre, DNI, celular o COT-001"
								@keyup.enter="buscarPorNombre"
							>
							<button class="btn btn-primary" @click="buscarPorNombre">
								<i class="bi bi-search"></i> Buscar
							</button>
						</div>
					</div>
					<div class="col-md-3 d-flex justify-content-end">
						<router-link to="/cotizacion/nueva" class="btn btn-sm btn-outline-primary text-nowrap">
							<i class="bi bi-star"></i> Nueva cotización
						</router-link>
					</div>
				</div>
			</div>
		</div>

		<!-- Resultados -->
		<div class="card">
			<div class="card-body">
				<div v-if="cargando" class="text-center py-4">
					<div class="spinner-border text-primary" role="status">
						<span class="visually-hidden">Cargando...</span>
					</div>
					<p class="mt-2 text-muted small">Cargando cotizaciones...</p>
				</div>
				<div v-else-if="cotizaciones.length === 0" class="text-center py-5 text-muted">
					<i class="bi bi-inbox" style="font-size: 2.5rem;"></i>
					<p class="mt-2">No se encontraron cotizaciones</p>
				</div>
				<div v-else class="table-responsive">
					<table class="table table-bordered table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th>Código</th>
								<th>Cliente</th>
								<th>Destino</th>
								<th class="text-center">Adultos</th>
								<th class="text-center">Niños</th>
								<th class="text-end">Total</th>
								<th class="text-center">Estado</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="cot in cotizaciones"
								:key="cot.id"
								@click="irADetalle(cot.id)"
								style="cursor: pointer;"
								class="align-middle"
							>
								<td class="fw-semibold">COT-{{ String(cot.id).padStart(3, '0') }}</td>
								<td>{{ cot.cliente?.razon_social || [cot.cliente?.apellidos, cot.cliente?.nombres].filter(Boolean).join(' ') || '-' }}</td>
								<td>{{ cot.departamento?.departamento || '-' }}</td>
								<td class="text-center">{{ cot.adults || 0 }}</td>
								<td class="text-center">{{ cot.kids || 0 }}</td>
								<td class="text-end fw-semibold">S/ {{ formatPrecio(cot.precio) }}</td>
								<td class="text-center">
									<span :class="'badge bg-' + (cot.estado === 'activo' ? 'success' : 'secondary')">
										{{ capitalize(cot.estado || 'activo') }}
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCotizacionStore } from '@/stores/cotizacionStore';

const router = useRouter();
const cotizacionStore = useCotizacionStore();

const cotizaciones = ref([]);
const cargando = ref(false);

const obtenerFechaLocal = () => {
	const hoy = new Date();
	const año = hoy.getFullYear();
	const mes = String(hoy.getMonth() + 1).padStart(2, '0');
	const dia = String(hoy.getDate()).padStart(2, '0');
	return `${año}-${mes}-${dia}`;
};

const filtros = reactive({
	fecha: obtenerFechaLocal(),
	search: '',
	estado: '',
});

const capitalize = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatPrecio = (val) => {
	if (val === null || val === undefined || val === '') return '0.00';
	const num = Number(val);
	return isNaN(num) ? '0.00' : num.toFixed(2);
};

const cargarCotizaciones = async ({ fecha = '', search = '', estado = '' } = {}) => {
	cargando.value = true;
	try {
		const data = await cotizacionStore.listarConFiltros(fecha, search, estado);
		cotizaciones.value = data;
	} catch (error) {
		console.error('Error al cargar cotizaciones:', error);
		cotizaciones.value = [];
	} finally {
		cargando.value = false;
	}
};

const irADetalle = (id) => {
	router.push(`/cotizacion/detalle/${id}`);
};

// Filtro por fecha (independiente de la búsqueda por nombre)
const buscarPorFecha = () => {
	cargarCotizaciones({ fecha: filtros.fecha, estado: filtros.estado });
};

// Búsqueda por nombre / DNI / celular (independiente del filtro de fecha)
const buscarPorNombre = () => {
	const search = filtros.search.trim();

	// Solo ir al detalle cuando el término tenga el prefijo COT-
	if (/^COT-/i.test(search)) {
		const id = parseInt(search.replace(/\D/g, ''), 10);
		if (!isNaN(id)) {
			irADetalle(id);
			return;
		}
	}

	cargarCotizaciones({ search, estado: filtros.estado });
};

onMounted(() => {
	buscarPorFecha();
});
</script>
