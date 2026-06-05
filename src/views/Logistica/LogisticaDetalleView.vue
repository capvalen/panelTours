<template>
	<div class="container-fluid">
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
				<li class="breadcrumb-item"><router-link to="/logistica">Logística</router-link></li>
				<li class="breadcrumb-item active" v-if="logistica"> {{ logistica.titulo }}</li>
			</ol>
		</nav>

		<div v-if="cargando" class="text-center py-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Cargando...</span>
			</div>
		</div>

		<div v-else-if="logistica">
			<div class="card mb-3">
				<div class="card-body">
					<div class="d-flex justify-content-between align-items-start">
						<div>
							<h3 class="mb-1">{{ logistica.titulo }}</h3>
							<p class="text-muted mb-1"><strong>Salida programada: </strong>{{ formatFechaDestino(logistica.fecha) }}</p>
							<p class="mb-1">
								<strong>Hora de salida:</strong>
								<span class="ms-2" v-if="!editandoHora">
									{{ convertirHora(logistica.hora) || 'No asignado' }}
									<button class="btn btn-sm btn-link p-0 ms-1" @click="iniciarEdicionHora" title="Editar">
										<i class="bi bi-pencil"></i>
									</button>
								</span>
								<span v-else class="d-inline-flex align-items-center gap-1">
									<input type="time" class="form-control form-control-sm d-inline-block" style="width: 160px;" v-model="horaEdit">
									<button class="btn btn-sm btn-success" @click="guardarHora" title="Guardar"><i class="bi bi-check-lg"></i></button>
									<button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionHora" title="Cancelar"><i class="bi bi-x-lg"></i></button>
								</span>
							</p>
							<p class="mb-1">
								<strong>Lugar de salida:</strong>
								<span class="ms-2" v-if="!editandoLugar">
									{{ logistica.lugar || 'No asignado' }}
									<button class="btn btn-sm btn-link p-0 ms-1" @click="iniciarEdicionLugar" title="Editar">
										<i class="bi bi-pencil"></i>
									</button>
								</span>
								<span v-else class="d-inline-flex align-items-center gap-1">
									<input type="text" class="form-control form-control-sm d-inline-block" style="width: 200px;" v-model="lugarEdit" placeholder="Ingrese lugar de salida">
									<button class="btn btn-sm btn-success" @click="guardarLugar" title="Guardar"><i class="bi bi-check-lg"></i></button>
									<button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionLugar" title="Cancelar"><i class="bi bi-x-lg"></i></button>
								</span>
							</p>
							<p class="mb-0"><strong>Vendedor:</strong> {{ logistica.usuario?.nombre || logistica.usuario?.usuario || 'Desconocido' }}</p>
						</div>
						<div class="d-flex align-items-center gap-2">
							<span class="d-inline-block rounded-circle" :style="{ width: '14px', height: '14px', backgroundColor: colorEstado(logistica.estado) }"></span>
							<select class="form-select form-select-sm" style="width: auto;" :value="logistica.estado" @change="cambiarEstado($event.target.value)">
								<option value="pendiente">Pendiente</option>
								<option value="en curso">En curso</option>
								<option value="finalizado">Finalizado</option>
								<option value="anulado">Anulado</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<div class="card mb-3">
				<div class="card-body">
					<div class="row g-2">
						<div class="col-md-4 d-flex flex-column">
							<strong class="small">Guía</strong>
							<div v-if="logistica.guia" class="small text-muted mt-1">
								<div><span class="fw-semibold">DNI:</span> {{ logistica.guia.dni || '-' }}</div>
								<div><span class="fw-semibold">Nombre:</span> {{ logistica.guia.nombre || '-' }}</div>
								<div><span class="fw-semibold">Celular:</span> {{ logistica.guia.celular || '-' }}</div>
								<div><span class="fw-semibold">Especialidad:</span> {{ logistica.guia.especialidad || '-' }}</div>
								<div class="mt-1 d-flex gap-1">
									<button v-if="logistica.guia?.celular" class="btn btn-sm btn-outline-success" @click="compartirGuia">
										<i class="bi bi-whatsapp"></i> Compartir link
									</button>
									<button class="btn btn-sm btn-outline-danger" @click="quitarGuia">
										<i class="bi bi-arrow-bar-left"></i> Retirar
									</button>
								</div>
							</div>
							<button v-else class="btn btn-sm btn-outline-secondary mt-1 align-self-start" @click="abrirModalGuia">
								<i class="bi bi-person-plus"></i> Asignar guía
							</button>
						</div>
						<div class="col-md-4 d-flex flex-column">
							<strong class="small">Vehículo</strong>
							<div v-if="logistica.vehiculo" class="small text-muted mt-1">
								<div><span class="fw-semibold">Tipo:</span> {{ logistica.vehiculo.tipo_vehiculo || '-' }}</div>
								<div><span class="fw-semibold">Placa:</span> {{ logistica.vehiculo.placa || '-' }}</div>
								<div><span class="fw-semibold">Combustible:</span> {{ logistica.vehiculo.tipo_combustible || '-' }}</div>
								<hr class="my-1">
								<div><span class="fw-semibold">Conductor:</span> {{ logistica.vehiculo.nombre_conductor || '-' }}</div>
								<div><span class="fw-semibold">DNI conductor:</span> {{ logistica.vehiculo.dni_conductor || '-' }}</div>
								<div><span class="fw-semibold">Celular:</span> {{ logistica.vehiculo.celular || '-' }}</div>
								<div class="mt-1">
									<button class="btn btn-sm btn-outline-danger" @click="quitarVehiculo">
										<i class="bi bi-arrow-bar-left"></i> Retirar
									</button>
								</div>
							</div>
							<button v-else class="btn btn-sm btn-outline-secondary mt-1 align-self-start" @click="abrirModalVehiculo">
								<i class="bi bi-truck"></i> Asignar vehículo
							</button>
						</div>
						<div class="col-md-4 d-flex flex-column">
							<strong class="small">Compartir</strong>
							<button class="btn btn-sm btn-outline-primary mt-1 align-self-start" @click="copiarLinkManifiesto">
								<i class="bi bi-share"></i> Compartir link de Manifiesto
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="d-flex justify-content-between align-items-center mb-2">
				<h6 class="fw-bold mb-0">Lista de pasajeros</h6>
				<div class="text-muted small">
					Pasajeros inscritos: {{ totalPasajeros }}/{{ totalPersonas }}
					<span v-if="faltanCheckin > 0" class="text-danger ms-2">Faltan check-in: {{ faltanCheckin }}</span>
					<span v-else class="text-success ms-2">Check-ins completos</span>
				</div>
			</div>
					<div v-if="totalPasajeros === 0" class="text-muted text-center py-4">
						<i class="bi bi-inbox" style="font-size: 1.5rem;"></i>
						<p class="mt-1 mb-0">No hay pasajeros registrados</p>
					</div>
					<div v-else class="table-responsive">
						<table class="table table-bordered align-middle mb-0">
							<thead class="table-light">
								<tr>
									<th class="text-center" style="width: 40px;">N°</th>
									<th>Nombre</th>
									<th>DNI</th>
									<th>Edad</th>
									<th>Enfermedades</th>
									<th>Alergias</th>
									<th>Pedido especial</th>
									<th class="text-end">Saldo a cobrar</th>
								</tr>
							</thead>
							<tbody>
								<tr class="table-secondary">
									<td colspan="8"><strong>Vendedor:</strong> {{ logistica.usuario?.nombre || logistica.usuario?.usuario || 'Desconocido' }} · <strong>Punto de recojo:</strong> {{ logistica.ventas?.[0]?.punto_recojo || '-' }}</td>
								</tr>
								<template v-for="venta in logistica.ventas" :key="venta.id">
									<tr v-for="(persona, pIdx) in venta.personas" :key="persona.id">
										<td class="text-center text-muted">{{ indexGlobal(venta, pIdx) }}</td>
										<td>
											{{ persona.nombre }}
											<span v-if="persona.es_titular" class="badge bg-primary ms-1">Titular</span>
										</td>
										<td>{{ persona.dni || '-' }}</td>
										<td>{{ calcularEdad(persona.fecha_nacimiento) !== null ? calcularEdad(persona.fecha_nacimiento) + ' años' : '-' }}</td>
										<td>
											<span v-if="persona.enfermedades === 'si'" class="text-danger">Sí</span>
											<span v-else class="text-muted">No</span>
											<span v-if="persona.enfermedades === 'si' && persona.detalle_enfermedades" class="small text-muted ms-1">({{ persona.detalle_enfermedades }})</span>
										</td>
										<td>
											<span v-if="persona.alergia === 'si'" class="text-danger">Sí</span>
											<span v-else class="text-muted">No</span>
											<span v-if="persona.alergia === 'si' && persona.detalle_alergia" class="small text-muted ms-1">({{ persona.detalle_alergia }})</span>
										</td>
										<td>{{ persona.pedido_especial || '-' }}</td>
										<td class="text-end fw-semibold">
											<span v-if="pIdx === 0" :class="saldoColor(venta)">{{ formatSaldo(venta) }}</span>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
					<div v-if="totalPasajeros > 0" class="border-top fw-bold px-3 py-3 d-flex justify-content-between">
						<span>Total de pasajeros: {{ totalPasajeros }}</span>
						<span>Total a cobrar en ruta: S/ {{ formatNum(totalCobrar) }}</span>
					</div>
				</div>
		
	</div>

	<div class="modal fade" id="modalGuia" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog modal-sm modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Asignar guía</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label small">Buscar guía</label>
						<input type="text" class="form-control form-control-sm" v-model="guiaSearch" @input="buscarGuiasDebounce" placeholder="Nombre, DNI o celular">
					</div>
					<div v-if="guias.length === 0" class="text-muted text-center py-3">
						<small>No se encontraron guías</small>
					</div>
					<div v-else class="list-group">
						<button
							v-for="g in guias"
							:key="g.id"
							class="list-group-item list-group-item-action text-start"
							@click="asignarGuia(g)"
						>
							<div class="fw-semibold">{{ g.nombre }}</div>
							<small class="text-muted">DNI: {{ g.dni || '-' }} · Cel: {{ g.celular || '-' }}</small>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="modalVehiculo" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
		<div class="modal-dialog modal-sm modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Asignar vehículo</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label small">Buscar vehículo</label>
						<input type="text" class="form-control form-control-sm" v-model="vehiculoSearch" @input="buscarVehiculosDebounce" placeholder="Placa, tipo o conductor">
					</div>
					<div v-if="vehiculos.length === 0" class="text-muted text-center py-3">
						<small>No se encontraron vehículos</small>
					</div>
					<div v-else class="list-group">
						<button
							v-for="v in vehiculos"
							:key="v.id"
							class="list-group-item list-group-item-action text-start"
							@click="asignarVehiculo(v)"
						>
							<div class="fw-semibold">{{ v.placa }} - {{ v.tipo_vehiculo }}</div>
							<small class="text-muted">Conductor: {{ v.nombre_conductor || '-' }} · Cel: {{ v.celular || '-' }}</small>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from 'bootstrap';
import api from '@/services/axios';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2';

const route = useRoute();
const logistica = ref(null);
const cargando = ref(true);
const { convertirHora, encodeForUrl } = useFormat();

const guiaSearch = ref('');
const guias = ref([]);
const vehiculoSearch = ref('');
const vehiculos = ref([]);
let modalGuiaInstance = null;
let modalVehiculoInstance = null;
let debounceTimer = null;

const abrirModalGuia = () => {
	guiaSearch.value = '';
	guias.value = [];
	if (!modalGuiaInstance) {
		modalGuiaInstance = new Modal(document.getElementById('modalGuia'));
	}
	modalGuiaInstance.show();
	buscarGuias();
};

const abrirModalVehiculo = () => {
	vehiculoSearch.value = '';
	vehiculos.value = [];
	if (!modalVehiculoInstance) {
		modalVehiculoInstance = new Modal(document.getElementById('modalVehiculo'));
	}
	modalVehiculoInstance.show();
	buscarVehiculos();
};

const buscarGuiasDebounce = () => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(buscarGuias, 300);
};

const buscarVehiculosDebounce = () => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(buscarVehiculos, 300);
};

const buscarGuias = async () => {
	try {
		const params = { limite: 10 };
		if (guiaSearch.value.trim()) params.buscar = guiaSearch.value;
		const res = await api.get('/guias', { params });
		guias.value = res.data;
	} catch (err) {
		console.error('Error al buscar guías:', err);
	}
};

const buscarVehiculos = async () => {
	try {
		const params = { limite: 10 };
		if (vehiculoSearch.value.trim()) params.buscar = vehiculoSearch.value;
		const res = await api.get('/vehiculos', { params });
		vehiculos.value = res.data;
	} catch (err) {
		console.error('Error al buscar vehículos:', err);
	}
};

const asignarGuia = async (guia) => {
	try {
		await api.put(`/logistica/${route.params.id}`, { guia_id: guia.id });
		logistica.value.guia = guia;
		modalGuiaInstance?.hide();
	} catch (err) {
		console.error('Error al asignar guía:', err);
	}
};

const asignarVehiculo = async (vehiculo) => {
	try {
		await api.put(`/logistica/${route.params.id}`, { vehiculo_id: vehiculo.id });
		logistica.value.vehiculo = vehiculo;
		modalVehiculoInstance?.hide();
	} catch (err) {
		console.error('Error al asignar vehículo:', err);
	}
};

const quitarGuia = async () => {
	try {
		await api.put(`/logistica/${route.params.id}`, { guia_id: null });
		logistica.value.guia = null;
	} catch (err) {
		console.error('Error al quitar guía:', err);
	}
};

const quitarVehiculo = async () => {
	try {
		await api.put(`/logistica/${route.params.id}`, { vehiculo_id: null });
		logistica.value.vehiculo = null;
	} catch (err) {
		console.error('Error al quitar vehículo:', err);
	}
};

const editandoLugar = ref(false);
const lugarEdit = ref('');

const iniciarEdicionLugar = () => {
	lugarEdit.value = logistica.value.lugar || '';
	editandoLugar.value = true;
};

const guardarLugar = async () => {
	try {
		await api.put(`/logistica/${route.params.id}`, { lugar: lugarEdit.value });
		logistica.value.lugar = lugarEdit.value;
		editandoLugar.value = false;
		Swal.fire({ title: 'Lugar actualizado', icon: 'success', timer: 2000, showConfirmButton: false });
	} catch (err) {
		console.error('Error al guardar lugar:', err);
		Swal.fire('Error', 'No se pudo guardar el lugar', 'error');
	}
};

const cancelarEdicionLugar = () => {
	editandoLugar.value = false;
};

const editandoHora = ref(false);
const horaEdit = ref('');

const iniciarEdicionHora = () => {
	horaEdit.value = logistica.value.hora || '';
	editandoHora.value = true;
};

const guardarHora = async () => {
	try {
		await api.put(`/logistica/${route.params.id}`, { hora: horaEdit.value });
		logistica.value.hora = horaEdit.value;
		editandoHora.value = false;
		Swal.fire({ title: 'Hora actualizada', icon: 'success', timer: 2000, showConfirmButton: false });
	} catch (err) {
		console.error('Error al guardar hora:', err);
		Swal.fire('Error', 'No se pudo guardar la hora', 'error');
	}
};

const cancelarEdicionHora = () => {
	editandoHora.value = false;
};

const obtenerUrlManifiesto = () => {
	const apiBaseUrl = import.meta.env.MODE === 'production'
		? 'https://apipanel.grupoeuroandino.com/api'
		: 'http://127.0.0.1:8000/api';
	const encoded = encodeForUrl({ id: Number(route.params.id) });
	return `${apiBaseUrl}/manifiesto-pdf/${encoded}`;
};

const compartirGuia = () => {
	const url = obtenerUrlManifiesto();
	const mensaje = `Te comparto el manifiesto del ${logistica.value.titulo}, ingresa a este link: ${url}`;
	window.open(`https://api.whatsapp.com/send/?phone=${logistica.value.guia.celular}&text=${encodeURIComponent(mensaje)}`, '_blank');
};

const copiarLinkManifiesto = () => {
	const url = obtenerUrlManifiesto();
	navigator.clipboard.writeText(url);
	Swal.fire({
		title: 'Link copiado',
		text: 'Link del manifiesto PDF copiado al portapapeles',
		icon: 'success',
		showCancelButton: true,
		confirmButtonText: 'Abrir link',
		cancelButtonText: 'Cerrar',
	}).then(result => {
		if (result.isConfirmed) {
			window.open(url, '_blank');
		}
	});
};

const formatFechaDestino = (fecha) => {
	if (!fecha) return '-';
	const d = new Date(fecha);
	return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
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

const cambiarEstado = async (nuevoEstado) => {
	try {
		await api.put(`/logistica/${route.params.id}`, { estado: nuevoEstado });
		logistica.value.estado = nuevoEstado;
		Swal.fire({ title: 'Estado actualizado', icon: 'success', timer: 2000, showConfirmButton: false });
	} catch (err) {
		console.error(err);
		Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
	}
};

const ventasConPersonas = computed(() => {
	return (logistica.value?.ventas || []).filter(v => v.personas && v.personas.length > 0);
});

const totalPasajeros = computed(() => {
	return ventasConPersonas.value.reduce((sum, v) => sum + v.personas.length, 0);
});

const totalPersonas = computed(() => {
	return (logistica.value?.ventas || []).reduce((sum, v) => sum + Number(v.cuantas_personas || 0), 0);
});

const faltanCheckin = computed(() => {
	return Math.max(0, totalPersonas.value - totalPasajeros.value);
});

const totalCobrar = computed(() => {
	return ventasConPersonas.value.reduce((sum, v) => {
		const saldo = Number(v.precio || 0) - Number(v.adelanto || 0);
		return sum + Math.max(0, saldo);
	}, 0);
});

const saldoColor = (venta) => {
	const saldo = Number(venta.precio || 0) - Number(venta.adelanto || 0);
	return saldo <= 0 ? 'text-success' : 'text-danger';
};

const formatSaldo = (venta) => {
	const saldo = Number(venta.precio || 0) - Number(venta.adelanto || 0);
	if (saldo <= 0) return '100% Pagado';
	return `Debe S/ ${formatNum(saldo)}`;
};

const calcularEdad = (fecha) => {
	if (!fecha) return null;
	const d = new Date(fecha.slice(0, 10));
	if (isNaN(d.getTime())) return null;
	const hoy = new Date();
	let edad = hoy.getFullYear() - d.getFullYear();
	const mes = hoy.getMonth() - d.getMonth();
	if (mes < 0 || (mes === 0 && hoy.getDate() < d.getDate())) edad--;
	return edad;
};

const formatNum = (val) => {
	return Number(val || 0).toFixed(2);
};

const indexGlobal = (currentVenta, pIdx) => {
	let idx = 0;
	for (const v of (logistica.value?.ventas || [])) {
		if (v.id === currentVenta.id) {
			return idx + pIdx + 1;
		}
		idx += (v.personas || []).length;
	}
	return 0;
};

onMounted(async () => {
	try {
		const res = await api.get(`/logistica/${route.params.id}`);
		logistica.value = res.data;
	} catch (err) {
		console.error('Error al cargar logística:', err);
	} finally {
		cargando.value = false;
	}
});
</script>
