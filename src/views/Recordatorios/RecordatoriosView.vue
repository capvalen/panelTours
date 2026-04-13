<script setup>
import { useRecordatoriosStore } from '@/stores/recordatoriosStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed, watch } from 'vue';
import { useFormat } from '@/composables/formatos'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

//para convertir horas UTC
dayjs.extend(utc);

const recordatoriosStore = useRecordatoriosStore();
const { recordatorios } = storeToRefs(recordatoriosStore);
const { formatRelative, capitalize, usuarioActual } = useFormat()

const search = ref('');
const typeFilter = ref('todos'); // 'todos' or one of tipo_evento
const statusFilter = ref('todos'); // 'todos' or one of estado
const priorityFilter = ref('todos'); // 'todos' or one of prioridad

// Modal
const modalVisible = ref(false);
const modalTitle = ref('');
const editingRecord = ref(null);
const formData = ref({
	tipo_evento: '',
	fecha: '',
	hora: '',
	estado: '',
	titulo: '',
	prioridad: '',
	comentario: '',
	activo: true
});



const abrirModal = (recordatorio) => {
	console.log('el ', recordatorio.fecha_hora)
	editingRecord.value = recordatorio;
	modalTitle.value = 'Editar Recordatorio';

	formData.value = {
		tipo_evento: recordatorio.tipo_evento || '',
		fecha: dayjs(recordatorio.fecha_hora).format("YYYY-MM-DD"),
		hora: dayjs(recordatorio.fecha_hora).format("HH:mm"),
		estado: recordatorio.estado || 'pendiente',
		titulo: recordatorio.titulo || '',
		prioridad: recordatorio.prioridad || 'normal',
		comentario: recordatorio.comentario || '',
		activo: recordatorio.activo !== false
	};
	modalVisible.value = true;
};

const nuevoRecordatorio = () => {
	editingRecord.value = null;
	modalTitle.value = 'Nuevo Recordatorio';
	formData.value = {
		tipo_evento: 'tarea',
		fecha: '',
		hora: '',
		estado: 'pendiente',
		titulo: '',
		prioridad: 'normal',
		comentario: '',
		activo: true
	};
	modalVisible.value = true;
};

const guardarCambios = async () => {
	console.log('userd', usuarioActual() )
	const payload = {
		...formData.value,
		fecha_hora: dayjs(`${formData.value.fecha} ${formData.value.hora}`).utc().format(),
		usuario_id: parseInt(usuarioActual().id)
	};
	delete payload.fecha;
	delete payload.hora;

	if (editingRecord.value?.id) {
		await recordatoriosStore.actualizar(editingRecord.value.id, payload);
	} else {
		await recordatoriosStore.guardar(payload);
	}
	modalVisible.value = false;
	await recordatoriosStore.listar();
};

onMounted(() => {
	recordatoriosStore.listar()
})

const totalPendientes = computed(() => {
	return (recordatorios.value || []).filter(r => 
		(r.estado || '').toString().toLowerCase() === 'pendiente'
	).length;
});

const totalVencidos = computed(() => {
	return (recordatorios.value || []).filter(r => {
		if (!r.fecha_hora) return false;
		return dayjs(r.fecha_hora).isBefore(dayjs());
	}).length;
});

const filteredRecordatorios = computed(() => {
	return (recordatorios.value || []).filter(r => {
		// búsqueda por título
		if (search.value) {
			const titulo = (r.titulo || '').toString().toLowerCase();
			if (!titulo.includes(search.value.toLowerCase())) return false;
		}

		// filtro por estado (campo: tipo 'estado')
		if (statusFilter.value !== 'todos') {
			if ((r.estado || '').toString().toLowerCase() !== statusFilter.value) return false;
		}

		// filtro por tipo_evento (campo: tipo_evento)
		if (typeFilter.value !== 'todos') {
			if ((r.tipo_evento || '').toString().toLowerCase() !== typeFilter.value) return false;
		}

		// filtro por prioridad (campo: prioridad)
		if (priorityFilter.value !== 'todos') {
			if ((r.prioridad || '').toString().toLowerCase() !== priorityFilter.value) return false;
		}

		return true;
	})
})

// Colores para badges de estado
const estadoBadgeClass = (estado) => {
	const map = {
		'pendiente': 'border-warning text-warning-emphasis',
		'finalizado': 'border-success text-success-emphasis',
		'anulado': 'border-secondary text-secondary-emphasis',
	};
	return map[estado?.toLowerCase()] || 'bg-light text-dark';
};

// Colores para badges de prioridad
const prioridadBadgeClass = (prioridad) => {
	const map = {
		'alta': 'border-danger text-danger-emphasis',
		'media': 'border-warning text-warning-emphasis',
		'normal': 'border-info text-info-emphasis',
		'baja': 'border-dark text-dark-emphasis',
	};
	return map[prioridad?.toLowerCase()] || 'bg-light text-dark';
};

// Truncar comentario
const truncarComentario = (texto, max = 100) => {
	if (!texto) return '';
	if (texto.length <= max) return texto;
	return texto.substring(0, max) + '...';
};

// Emojis para tipo de evento
const tipoEventoEmoji = (tipo) => {
	const map = {
		'pagos': '💰',
		'boletos': '🎫',
		'reunion': '🤝',
		'tarea': '📋',
		'llamada': '📞',
		'otro': '📌',
		'personal': '👤',
	};
	return map[tipo?.toLowerCase()] || '📌';
};
</script>
<template>
	<h1>Recordatorios</h1>
	
	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="row mb-2">
							<div class="col">
								<div class="input-group">
									<input type="text" class="form-control" placeholder="Buscar título..." v-model="search">
									<button class="btn btn-outline-secondary" type="button"
										@click="recordatoriosStore.buscar(search)">Buscar</button>
								</div>
							</div>
						</div>
						<div class="row mb-3">
							<div class="col-md-4">
								<label class="form-label">Tipo de evento</label>
								<select class="form-select" v-model="typeFilter">
									<option value="todos">Todos</option>
									<option value="pagos">Pagos</option>
									<option value="boletos">Boletos</option>
									<option value="reunion">Reunión</option>
									<option value="tarea">Tarea</option>
									<option value="llamada">Llamada</option>
									<option value="otro">Otro</option>
									<option value="personal">Personal</option>
								</select>
							</div>
							<div class="col-md-4">
								<label class="form-label">Estado</label>
								<select class="form-select" v-model="statusFilter">
									<option value="todos">Todos</option>
									<option value="pendiente">Pendiente</option>
									<option value="finalizado">Finalizado</option>
									<option value="anulado">Anulado</option>
								</select>
							</div>
							<div class="col-md-4">
								<label class="form-label">Prioridad</label>
								<select class="form-select" v-model="priorityFilter">
									<option value="todos">Todos</option>
									<option value="normal">Normal</option>
									<option value="media">Media</option>
									<option value="alta">Alta</option>
									<option value="baja">Baja</option>
								</select>
							</div>
						</div>

					</div>

				</div>
			</div>
		</div>
	</div>
	<div class="d-flex justify-content-between align-items-center mb-2">
		<p class="mb-0">{{ totalPendientes }} pendientes · <span class="text-danger">{{ totalVencidos }} vencido</span></p>
		<button class="btn btn-primary" @click="nuevoRecordatorio">
			<i class="bi bi-plus-lg"></i> Nuevo Recordatorio
		</button>
	</div>
	<div class="row my-3 row-cols-1 row-cols-md-2">
		<div v-if="filteredRecordatorios.length === 0" class="col text-muted">No hay recordatorios que coincidan.</div>
		<template v-else>
			<div v-for="recordatorio in filteredRecordatorios" :key="recordatorio.id" class="col mb-4">
				<div class="card shadow-sm card-hover" style="cursor: pointer;" @click="abrirModal(recordatorio)">
					<div class="card-body">
						<div class="d-flex justify-content-between align-items-start mb-2">
							<h4 class="card-title fw-bold mb-0">{{ capitalize(recordatorio.titulo) }}</h4>
						</div>

						<div class="mb-2">
							<span class="badge fw-semibold border border-dark text-dark mx-1">
								{{ tipoEventoEmoji(recordatorio.tipo_evento) }} {{ capitalize(recordatorio.tipo_evento || 'Sin tipo') }}
							</span>
							<span class="badge border fw-semibold me-1 text-capitalize" :class="estadoBadgeClass(recordatorio.estado)">
								{{ recordatorio.estado || 'Sin estado' }}
							</span>
							<span class="badge border fw-semibold text-capitalize" :class="prioridadBadgeClass(recordatorio.prioridad)">
								{{ recordatorio.prioridad || 'Sin prioridad' }}
							</span>

						</div>
						<p v-if="recordatorio.comentario" class="text-muted mb-2">
							<small>{{ truncarComentario(recordatorio.comentario) }}</small>
						</p>
						<p class="mb-0 text-muted text-capitalize">
							<small><i class="bi bi-clock"></i> {{ formatRelative(recordatorio.fecha_hora) }}</small>
						</p>
					</div>
				</div>
			</div>
		</template>
	</div>

	<!-- Modal Editar Recordatorio -->
	<div class="modal fade" tabindex="-1" :class="{ 'show d-block': modalVisible }" style="background-color: rgba(0,0,0,0.5);" v-if="modalVisible">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{ modalTitle }}</h5>
					<button type="button" class="btn-close" @click="modalVisible = false"></button>
				</div>
				<div class="modal-body">
					<form @submit.prevent="guardarCambios">
						<div class="mb-3">
							<label class="form-label">Título</label>
							<input type="text" class="form-control" v-model="formData.titulo" required>
						</div>
						<div class="mb-3">
							<label class="form-label">Tipo de evento</label>
							<select class="form-select" v-model="formData.tipo_evento" required>
								<option value="boletos">Boletos</option>
								<option value="llamada">Llamada</option>
								<option value="otro">Otro</option>
								<option value="pagos">Pagos</option>
								<option value="personal">Personal</option>
								<option value="reunion">Reunión</option>
								<option value="tarea">Tarea</option>
							</select>
						</div>
						<div class="row mb-3">
							<div class="col-md-6">
								<label class="form-label">Fecha</label>
								<input type="date" class="form-control" v-model="formData.fecha" required>
							</div>
							<div class="col-md-6">
								<label class="form-label">Hora</label>
								<input type="time" class="form-control" v-model="formData.hora" required>
							</div>
						</div>
						<div class="mb-3">
							<label class="form-label">Estado</label>
							<select class="form-select" v-model="formData.estado" required>
								<option value="pendiente">Pendiente</option>
								<option value="finalizado">Finalizado</option>
								<option value="anulado">Anulado</option>
							</select>
						</div>
						<div class="mb-3">
							<label class="form-label">Prioridad</label>
							<select class="form-select" v-model="formData.prioridad" required>
								<option value="normal">Normal</option>
								<option value="media">Media</option>
								<option value="alta">Alta</option>
								<option value="baja">Baja</option>
							</select>
						</div>
						<div class="mb-3">
							<label class="form-label">Comentario</label>
							<textarea class="form-control" rows="3" v-model="formData.comentario"></textarea>
						</div>
						<div class="form-check form-switch mb-3" v-if="editingRecord?.id">
							<input class="form-check-input" type="checkbox" v-model="formData.activo" id="activoSwitch">
							<label class="form-check-label" for="activoSwitch">Activo</label>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancelar</button>
					<button type="button" class="btn btn-primary" @click="guardarCambios">Guardar cambios</button>
				</div>
			</div>
		</div>
	</div>
</template>