<script setup>
import { useHospedajesStore } from '@/stores/hospedajeStore';
import { onMounted, reactive } from 'vue';
import Swal from 'sweetalert2'

const hospedajeStore = useHospedajesStore();
const texto = reactive('')

function eliminarHospedaje(id, nombre) {
	if( confirm(`¿Confirma que desea eliminar el hospedaje "${nombre}"?`) ){
		hospedajeStore.eliminar(id)
			.then( resp => {
				if(resp)
					Swal.fire('Hospedaje eliminado', `El hospedaje "${nombre}" ha sido eliminado`, 'success')
				else
					Swal.fire('Error', 'Error al eliminar hospedaje', 'error')
			})
			.catch( error => {
				console.error(error)
				Swal.fire('Error', 'Error al eliminar hospedaje', 'error')
			})
	}
}
function buscar() {
	if(texto.trim() == ''){
		hospedajeStore.listar()
	}else{
		hospedajeStore.buscar(texto)
	}
}

onMounted(() => {
	hospedajeStore.listar()
})
</script>
<template>
	<h1>Panel de hospedajes</h1>

	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col-12 col-md my-1">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="RUC, nombre o contacto" v-model="texto">
							</div>
						</div>
						<div class="col-6 col-md">
							<button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col-6 col-md d-flex justify-content-center">
							<div>
								<router-link to="/hospedaje/nuevo" class="btn btn-outline-primary "><i class="bi bi-star"></i> Nuevo hospedaje</router-link>
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
						<th scope="col">RUC</th>
						<th scope="col">Hospedaje</th>
						<th scope="col">Departamento</th>
						<th scope="col">Contacto</th>
						<th scope="col">Celular</th>
						<th scope="col">Correo</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(hospedaje, index ) in hospedajeStore.hospedajes">
						<td>{{ index + 1 }}</td>
						<td>
							<router-link :to="{ name: 'perfilHospedaje', params: { id: hospedaje.id } }">
								{{ hospedaje.ruc ?? 'Sin documento' }}
							</router-link>
						</td>
						<td>{{ hospedaje.hospedaje }}</td>
						<td>{{ hospedaje.departamento?.departamento }}</td>
						<td>{{ hospedaje.contacto }}</td>
						<td>{{ hospedaje.celular }}</td>
						<td>{{ hospedaje.correo }}</td>
						<td class="d-flex gap-2">
							<router-link :to="{ name: 'editarHospedaje', params: { id: hospedaje.id } }" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></router-link>
							<button class="btn btn-sm btn-outline-danger" @click="eliminarHospedaje(hospedaje.id, hospedaje.hospedaje)"><i class="bi bi-folder-x"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
</template>
