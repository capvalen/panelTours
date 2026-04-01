<script setup>
import { useRecordatoriosStore } from '@/stores/recordatoriosStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';

const recordatoriosStore = useRecordatoriosStore();
const { recordatorios } = storeToRefs(recordatoriosStore);

const search = ref('');
const typeFilter = ref('todos'); // 'todos' or one of tipo_evento
const statusFilter = ref('todos'); // 'todos' or one of estado
const priorityFilter = ref('todos'); // 'todos' or one of prioridad

onMounted(() => {
	recordatoriosStore.listar()
})

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
</script>
<template>
	<h1>Recordatorios</h1>
	<p>2 pendientes · <span class="text-danger">1 vencido</span></p>
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
									<button class="btn btn-outline-secondary" type="button" @click="recordatoriosStore.buscar(search)">Buscar</button>
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
	<div class="row my-3">
		<div class="col-12">
			<div v-if="filteredRecordatorios.length === 0" class="text-muted">No hay recordatorios que coincidan.</div>
			<div v-else>
				<div v-for="recordatorio in filteredRecordatorios" :key="recordatorio.id" class="card mb-2">
					<div class="card-body">
						<p class="card-title fw-medium text-capitalize">{{ recordatorio.titulo }}</p>
						<p class="fw-normal text-capitalize text-muted"><small>{{ recordatorio.comentario }}</small></p>
						<p class="mb-0">Tipo: <strong>{{ recordatorio.tipo || recordatorio.estado_tipo || '-' }}</strong></p>
						<p class="mb-0">Prioridad: <strong>{{ recordatorio.prioridad || '-' }}</strong></p>
						<p class="mb-0">Estado: <strong>{{ recordatorio.estado || '-' }}</strong></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>