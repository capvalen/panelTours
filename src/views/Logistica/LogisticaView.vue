<template>
	<div class="container-fluid">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item active">Logística</li>
			</ol>
		</nav>

		<h2><i class="bi bi-truck"></i> Logística</h2>
		<p class="text-muted">Salidas programadas</p>

		<div class="card mb-3">
			<div class="card-body">
				<div class="row g-2">
					<div class="col-md-4">
						<label class="form-label small">Fecha</label>
						<div class="d-flex gap-1">
							<button class="btn btn-sm btn-outline-secondary" @click="setFecha(-1)">Ayer</button>
							<button class="btn btn-sm btn-outline-secondary" @click="setFecha(0)">Hoy</button>
							<button class="btn btn-sm btn-outline-secondary" @click="setFecha(1)">Mañana</button>
							<input type="date" class="form-control form-control-sm" v-model="filtros.fecha" style="width: auto; min-width: 140px;">
						</div>
					</div>
					<div class="col-md-4">
						<label class="form-label small">Buscar</label>
						<input type="text" class="form-control form-control-sm" v-model="filtros.cliente" placeholder="Título o ciudad">
					</div>
					<div class="col-md-2 d-flex align-items-end">
						<button class="btn btn-sm btn-primary w-100" @click="cargarLogistica">
							<i class="bi bi-search"></i> Buscar
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="cargando" class="text-center py-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
		</div>

		<div v-else-if="logisticasFiltradas.length === 0" class="text-muted text-center py-5">
			<i class="bi bi-inbox" style="font-size: 2rem;"></i>
			<p class="mt-2">No hay salidas registradas</p>
		</div>

		<div v-else class="row g-3">
			<div v-for="item in logisticasFiltradas" :key="item.id" class="col-12">
				<div class="card">
					<div class="card-body">
						<div class="d-flex justify-content-between align-items-center">
							<div>
								<h5 class="card-title mb-1">
									{{ item.titulo }} | {{ formatFechaDestino(item.fecha) }}
									<span v-if="primeraCiudad(item)" class="badge bg-light text-dark ms-2">{{ primeraCiudad(item) }}</span>
									<span class="d-inline-block rounded-circle ms-2" :style="{ width: '10px', height: '10px', backgroundColor: colorEstado(item.estado) }"></span>
									<span class="text-capitalize small ms-1 fw-semibold" :style="{ color: colorEstado(item.estado) }"><small>{{ item.estado }}</small></span>
								</h5>
								<p class="card-text text-muted mb-0">
									{{ totalPasajeros(item) }}/{{ totalPersonas(item) }} pasajeros <span>·</span>
									<span v-if="faltanCheckin(item) > 0" class="text-danger ms-1"> Faltan {{ faltanCheckin(item) }} check-ins</span>
									<span v-else class="text-success ms-1"> Check-ins completos</span>
									<span class="ms-2">· {{ item.destino || '-' }}</span>
								</p>
							</div>
							<button class="btn btn-outline-primary" @click="entrarManifiesto(item.id)">
								<i class="bi bi-person-lines-fill"></i> Entrar al manifiesto
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import api from '@/services/axios';

const logisticas = ref([]);
const cargando = ref(true);

const obtenerFechaLocal = () => {
	const hoy = new Date();
	const año = hoy.getFullYear();
	const mes = String(hoy.getMonth() + 1).padStart(2, '0');
	const dia = String(hoy.getDate()).padStart(2, '0');
	return `${año}-${mes}-${dia}`;
};

const filtros = reactive({
	fecha: '',
	cliente: '',
});

const setFecha = (offset) => {
	const d = new Date();
	d.setDate(d.getDate() + offset);
	const año = d.getFullYear();
	const mes = String(d.getMonth() + 1).padStart(2, '0');
	const dia = String(d.getDate()).padStart(2, '0');
	filtros.fecha = `${año}-${mes}-${dia}`;
};

const formatFechaDestino = (fecha) => {
	if (!fecha) return '-';
	const d = new Date(fecha);
	return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });
};

const colorEstado = (estado) => {
	const map = {
		'pendiente': '#ffc107',
		'en curso': '#0d6efd',
		'finalizado': '#198754',
		'anulado': '#dc3545',
	};
	return map[estado] || '#6c757d';
};

const totalPasajeros = (item) => {
	return (item.ventas || []).reduce((sum, v) => sum + (v.personas ? v.personas.length : 0), 0);
};

const totalPersonas = (item) => {
	return (item.ventas || []).reduce((sum, v) => sum + Number(v.cuantas_personas || 0), 0);
};

const primeraCiudad = (item) => {
	const venta = (item.ventas || []).find(v => v.personas && v.personas.length > 0);
	return venta ? venta.ciudad : '';
};

const faltanCheckin = (item) => {
	return Math.max(0, totalPersonas(item) - totalPasajeros(item));
};

const entrarManifiesto = (id) => {
	window.location.href = `/logistica/${id}`;
};

const logisticasFiltradas = computed(() => {
	let resultados = [...logisticas.value];

	if (filtros.cliente.trim()) {
		const t = filtros.cliente.toLowerCase().trim();
		resultados = resultados.filter(item => {
			const titulo = (item.titulo || '').toLowerCase();
			const destino = (item.destino || '').toLowerCase();
			return titulo.includes(t) || destino.includes(t);
		});
	}

	resultados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

	return resultados;
});

const cargarLogistica = async () => {
	cargando.value = true;
	try {
		const params = {};
		if (filtros.fecha) {
			params.fecha = filtros.fecha;
		} else {
			params.desde = obtenerFechaLocal();
		}
		const res = await api.get('/logistica', { params });
		logisticas.value = res.data;
	} catch (err) {
		console.error('Error al cargar logística:', err);
	} finally {
		cargando.value = false;
	}
};

watch(() => filtros.fecha, () => {
	cargarLogistica();
});

onMounted(() => {
	cargarLogistica();
});
</script>
