<script setup>
import { useGuiasStore } from '@/stores/guiaStore';
import { onMounted, reactive } from 'vue';
import { useFormat } from '@/composables/formatos';
import Swal from 'sweetalert2'

const { capitalize } = useFormat()
const guiaStore = useGuiasStore();
const texto = reactive('')

function eliminarGuia(id, nombre) {
	if( confirm(`¿Confirma que desea eliminar al guía "${nombre}"?`) ){
		guiaStore.eliminar(id)
			.then( resp => {
				if(resp)
					Swal.fire('Guía eliminado', `El guía "${nombre}" ha sido eliminado`, 'success')
				else
					Swal.fire('Error', 'Error al eliminar guía', 'error')
			})
			.catch( error => {
				console.error(error)
				Swal.fire('Error', 'Error al eliminar guía', 'error')
			})
	}
}
function buscar() {
	if(texto.trim() == ''){
		guiaStore.listar()
	}else{
		guiaStore.buscar(texto)
	}
}

onMounted(() => {
	guiaStore.listar()
})
</script>
<template>
	<h1>Panel de guías</h1>

	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col-12 col-md my-1">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="DNI, nombre o especialidad" v-model="texto" @keypress.enter="buscar">
							</div>
						</div>
						<div class="col-6 col-md-2">
							<button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col-6 col-md d-flex justify-content-center">
							<div>
								<router-link to="/guia/nuevo" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo guía</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col">
			<p>Últimos registrados</p>
			<div class="table-responsive">
				<table class="table-hover table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">DNI</th>
						<th scope="col">Nombre</th>
						<th scope="col">Departamento</th>
						<th scope="col">Celular</th>
						<th scope="col">Especialidad</th>
						<th scope="col">Idiomas</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(guia, index ) in guiaStore.guias">
						<td>{{ index + 1 }}</td>
						<td>
							<router-link :to="{ name: 'perfilGuia', params: { id: guia.id } }">
								{{ guia.dni ?? 'Sin documento' }}
							</router-link>
						</td>
						<td>{{ guia.nombre }}</td>
						<td>{{ guia.departamento?.departamento }}</td>
						<td>{{ guia.celular }}</td>
						<td>{{ capitalize(guia.especialidad )}}</td>
						<td class="text-capitalize">{{ guia.idiomas }}</td>
						<td class="d-flex gap-2">
							<router-link :to="{ name: 'editarGuia', params: { id: guia.id } }" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></router-link>
							<button class="btn btn-sm btn-outline-danger" @click="eliminarGuia(guia.id, guia.nombre)"><i class="bi bi-folder-x"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
</template>
