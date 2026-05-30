<template>
	<div class="container-fluid">
		<div class="mb-3">
			<h2>Cotizaciones</h2>
			<p class="text-muted mb-0">Panel de cotizaciones.</p>
		</div>

		<!-- Filtros -->
		<div class="card mb-3">
			<div class="card-body">
				<div class="row g-2">
					<div class="col-md-2">
						<label class="form-label small">Fecha</label>
						<input type="date" class="form-control form-control-sm" v-model="filtros.fecha">
					</div>
					<div class="col-md-2">
						<label class="form-label small">Estado</label>
						<select class="form-select form-select-sm" v-model="filtros.estado">
							<option value="">Todos</option>
							<option value="activo">Activo</option>
							<option value="convertido">Convertido</option>
						</select>
					</div>
					<div class="col-md-4">
						<label class="form-label small">Buscar</label>
						<input
							type="text"
							class="form-control form-control-sm"
							v-model="filtros.search"
							placeholder="Nombre, DNI, celular o COT-001..."
							@keyup.enter="handleSearch"
						>
					</div>
					<div class="col-md-2 d-flex align-items-end">
						<button class="btn btn-sm btn-primary w-100" @click="handleSearch">
							<i class="bi bi-search"></i> Buscar
						</button>
					</div>
					<div class="col-md-2 d-flex align-items-end justify-content-end">
						<router-link to="/cotizacion/nueva" class="btn btn-sm btn-outline-primary w-100">
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
					<table class="table table-hover align-middle mb-0">
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
								<td>{{ cot.cliente?.razon_social || (cot.cliente?.apellidos + ' ' + cot.cliente?.nombres) || '-' }}</td>
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

const cargarCotizaciones = async () => {
	cargando.value = true;
	try {
		const data = await cotizacionStore.listarConFiltros(filtros.fecha, filtros.search, filtros.estado);
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

const handleSearch = () => {
	const search = filtros.search.trim();
	// Detectar formato COT-00{id}
	const match = search.match(/^COT-00(\d+)$/i);
	if (match) {
		const id = parseInt(match[1], 10);
		irADetalle(id);
		return;
	}
	// Si es numérico, ir directo al ID
	if (/^\d+$/.test(search)) {
		irADetalle(parseInt(search, 10));
		return;
	}
	// Sino, buscar con filtros
	cargarCotizaciones();
};

onMounted(() => {
	cargarCotizaciones();
});
</script>
