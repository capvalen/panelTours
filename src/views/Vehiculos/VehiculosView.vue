<script setup>
import { useVehiculosStore } from '@/stores/vehiculoStore';
import { onMounted, reactive } from 'vue';
import Swal from 'sweetalert2'

const vehiculoStore = useVehiculosStore();
const texto = reactive('')

function eliminarVehiculo(id, placa, nombreConductor) {
	if( confirm(`¿Confirma que desea eliminar el vehículo ${placa}${nombreConductor ? ' - ' + nombreConductor : ''}?`) ){
		vehiculoStore.eliminar(id)
			.then( resp => {
				if(resp)
					Swal.fire('Vehículo eliminado', `El vehículo con placa ${placa} ha sido eliminado`, 'success')
				else
					Swal.fire('Error', 'Error al eliminar vehículo', 'error')
			})
			.catch( error => {
				console.error(error)
				Swal.fire('Error', 'Error al eliminar vehículo', 'error')
			})
	}
}
function buscar() {
	if(texto.trim() == ''){
		vehiculoStore.listar()
	}else{
		vehiculoStore.buscar(texto)
	}
}

onMounted(() => {
	vehiculoStore.listar()
})
</script>
<template>
	<h1>Panel de vehículos</h1>

	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="search" class="form-control" placeholder="Placa, conductor o tipo vehículo" v-model="texto" @keyup.enter="buscar">
							</div>
						</div>
						<div class="col-2">
							<button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col d-flex justify-content-center">
							<router-link to="/vehiculo/nuevo" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo vehículo</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col">
			<p>Últimos registrados</p>
			<table class="table-hover table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Tipo</th>
						<th scope="col">Placa</th>
						<th scope="col">Conductor</th>
						<th scope="col">Licencia</th>
						<th scope="col">Combustible</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(vehiculo, index ) in vehiculoStore.vehiculos">
						<td>{{ index + 1 }}</td>
						<td class="text-capitalize">{{ vehiculo.tipo_vehiculo }}</td>
						<td>
							<router-link :to="{ name: 'perfilVehiculo', params: { id: vehiculo.id } }">
								{{ vehiculo.placa }}
							</router-link>
						</td>
						<td>{{ vehiculo.nombre_conductor }}</td>
						<td>{{ vehiculo.licencia_conductor }}</td>
						<td class="text-capitalize">{{ vehiculo.tipo_combustible }}</td>
						<td class="d-flex gap-2">
							<router-link :to="{ name: 'editarVehiculo', params: { id: vehiculo.id } }" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></router-link>
							<button class="btn btn-sm btn-outline-danger" @click="eliminarVehiculo(vehiculo.id, vehiculo.placa, vehiculo.nombre_conductor)"><i class="bi bi-trash"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
