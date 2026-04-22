<script setup>
import { useVuelosStore } from '@/stores/vueloStore';
import { onMounted, ref, reactive } from 'vue';
import Swal from 'sweetalert2'

const vueloStore = useVuelosStore();
const search = ref('');
const filterActivo = ref('todos'); // 'todos', 'activo', 'inactivo'

// Modal editar
const modalEditar = ref(false);
const editForm = reactive({ id: null, vuelo: '', observaciones: '', activo: true });

// Datos para nuevo vuelo
const nuevoForm = reactive({ vuelo: '', observaciones: '', activo: true });
const modalNuevo = ref(false);

onMounted(() => {
	vueloStore.listar();
});

const filteredVuelos = ref([]);

const aplicarFiltros = () => {
	let resultados = [...vueloStore.vuelos];

	if (search.value.trim()) {
		const t = search.value.toLowerCase();
		resultados = resultados.filter(v =>
			(v.vuelo || '').toLowerCase().includes(t) ||
			(v.observaciones || '').toLowerCase().includes(t)
		);
	}

	if (filterActivo.value !== 'todos') {
		const esActivo = filterActivo.value === 'activo';
		resultados = resultados.filter(v => !!v.activo === esActivo);
	}

	filteredVuelos.value = resultados;
};

const abrirModalEditar = (vuelo) => {
	editForm.id = vuelo.id;
	editForm.vuelo = vuelo.vuelo || '';
	editForm.observaciones = vuelo.observaciones || '';
	editForm.activo = vuelo.activo !== false;
	modalEditar.value = true;
};

const guardarEdicion = async () => {
	if (!editForm.vuelo) {
		Swal.fire('Error', 'El campo vuelo es obligatorio', 'error');
		return;
	}
	await vueloStore.actualizar(editForm.id, { ...editForm });
	modalEditar.value = false;
	Swal.fire('Actualizado', 'Vuelo actualizado correctamente', 'success');
	aplicarFiltros();
};

const guardarNuevo = async () => {
	if (!nuevoForm.vuelo) {
		Swal.fire('Error', 'El campo vuelo es obligatorio', 'error');
		return;
	}
	await vueloStore.guardar({ ...nuevoForm });
	nuevoForm.vuelo = '';
	nuevoForm.observaciones = '';
	nuevoForm.activo = true;
	modalNuevo.value = false;
	Swal.fire('Creado', 'Vuelo creado correctamente', 'success');
	aplicarFiltros();
};

const eliminarVuelo = async (id, vuelo) => {
	const result = await Swal.fire({
		title: '¿Eliminar vuelo?',
		text: `Se eliminará el vuelo "${vuelo}"`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar'
	});
	if (result.isConfirmed) {
		await vueloStore.eliminar(id);
		Swal.fire('Eliminado', 'Vuelo eliminado correctamente', 'success');
		aplicarFiltros();
	}
};
</script>

<template>
	<h1>Vuelos</h1>

	<!-- Filtros -->
	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label><i class="bi bi-funnel"></i> Filtros</label>
					<div class="row">
						<div class="col-md-6 mb-2">
							<input type="text" class="form-control" placeholder="Buscar vuelo u observaciones..." v-model="search" @input="aplicarFiltros">
						</div>
						<div class="col-md-4 mb-2">
							<select class="form-select" v-model="filterActivo" @change="aplicarFiltros">
								<option value="todos">Todos</option>
								<option value="activo">Activos</option>
								<option value="inactivo">Inactivos</option>
							</select>
						</div>
						<div class="col-md-2 mb-2">
							<button class="btn btn-primary w-100" @click="modalNuevo = true">
								<i class="bi bi-plus-lg"></i> Nuevo
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Tabla -->
	<div class="row mt-3">
		<div class="col">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>Vuelo</th>
						<th>Observaciones</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(vuelo, index) in (filteredVuelos.length ? filteredVuelos : vueloStore.vuelos)" :key="vuelo.id">
						<td>{{ index + 1 }}</td>
						<td><span>{{ vuelo.vuelo }}</span></td>
						<td>{{ vuelo.observaciones || '-' }}</td>
						
						<td class="d-flex gap-2">
							<button class="btn btn-sm btn-outline-primary" @click="abrirModalEditar(vuelo)">
								<i class="bi bi-pencil"></i>
							</button>
							<button class="btn btn-sm btn-outline-danger" @click="eliminarVuelo(vuelo.id, vuelo.vuelo)">
								<i class="bi bi-folder-x"></i>
							</button>
						</td>
					</tr>
					<tr v-if="vueloStore.vuelos.length === 0">
						<td colspan="5" class="text-muted">No hay vuelos registrados</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<!-- Modal Nuevo -->
	<div class="modal fade" :class="{ 'show d-block': modalNuevo }" style="background: rgba(0,0,0,0.5);" v-if="modalNuevo" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Nuevo Vuelo</h5>
					<button type="button" class="btn-close" @click="modalNuevo = false"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label">Vuelo <span class="text-danger">*</span></label>
						<input type="text" class="form-control" v-model="nuevoForm.vuelo">
					</div>
					<div class="mb-3">
						<label class="form-label">Observaciones</label>
						<textarea class="form-control" rows="3" v-model="nuevoForm.observaciones"></textarea>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-secondary" @click="modalNuevo = false">Cancelar</button>
					<button class="btn btn-primary" @click="guardarNuevo">Guardar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Editar -->
	<div class="modal fade" :class="{ 'show d-block': modalEditar }" style="background: rgba(0,0,0,0.5);" v-if="modalEditar" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Editar Vuelo</h5>
					<button type="button" class="btn-close" @click="modalEditar = false"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label">Vuelo <span class="text-danger">*</span></label>
						<input type="text" class="form-control" v-model="editForm.vuelo">
					</div>
					<div class="mb-3">
						<label class="form-label">Observaciones</label>
						<textarea class="form-control" rows="3" v-model="editForm.observaciones"></textarea>
					</div>
					<div class="form-check form-switch d-none">
						<input class="form-check-input" type="checkbox" v-model="editForm.activo" id="editActivo">
						<label class="form-check-label" for="editActivo">Activo</label>
					</div>
				</div>
				<div class="modal-footer border-0">
					<button class="btn btn-secondary" @click="modalEditar = false">Cancelar</button>
					<button class="btn btn-primary" @click="guardarEdicion">Guardar cambios</button>
				</div>
			</div>
		</div>
	</div>
</template>
