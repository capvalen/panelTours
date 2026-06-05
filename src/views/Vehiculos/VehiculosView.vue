<script setup>
import { useVehiculosStore } from '@/stores/vehiculoStore';
import { useDepartamentosStore } from '@/stores/departamentoStore';
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2'

const vehiculoStore = useVehiculosStore();
const departamentosStore = useDepartamentosStore();
const texto = ref('');
const departamentoId = ref('');

const nombreDepartamento = (departamento_id) => {
	const depto = departamentosStore.departamentos.find(d => Number(d.id) === Number(departamento_id));
	return depto ? depto.departamento : '-';
};

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
	const filtros = {};
	if (departamentoId.value) filtros.departamento_id = departamentoId.value;

	if(texto.value.trim() == ''){
		vehiculoStore.listar(filtros)
	}else{
		vehiculoStore.buscar(texto.value, filtros)
	}
}

onMounted(() => {
	departamentosStore.listar();
	vehiculoStore.listar();
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
						<div class="col-12 col-md my-1">
							<div class="input-group">
								<input type="search" class="form-control" placeholder="Placa, conductor o tipo vehículo" v-model="texto" @keyup.enter="buscar">
							</div>
						</div>
						<div class="col-12 col-md my-1">
							<select id="sltDepartamento" class="form-select" v-model="departamentoId">
								<option value="">Todos los departamentos</option>
								<option v-for="dep in departamentosStore.departamentos" :key="dep.id" :value="dep.id">
									{{ dep.departamento }}
								</option>
							</select>
						</div>
						<div class="col-6 col-md col-md-2">
							<button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col-6 col-md d-flex justify-content-center">
							<div>
								<router-link to="/vehiculo/nuevo" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo vehículo</router-link>
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
						<th scope="col">Tipo</th>
						<th scope="col">Placa</th>
						<th scope="col">Conductor</th>
						<th scope="col">Licencia</th>
						<th scope="col">Combustible</th>
						<th scope="col">Departamento</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(vehiculo, index ) in vehiculoStore.vehiculos" @click="$router.push({ name: 'perfilVehiculo', params: { id: vehiculo.id } })" style="cursor: pointer;">
						<td>{{ index + 1 }}</td>
						<td class="text-capitalize">{{ vehiculo.tipo_vehiculo }}</td>
						<td>{{ vehiculo.placa }}</td>
						<td>{{ vehiculo.nombre_conductor }}</td>
						<td>{{ vehiculo.licencia_conductor }}</td>
						<td class="text-capitalize">{{ vehiculo.tipo_combustible }}</td>
						<td>{{ vehiculo.departamento?.departamento }}</td>
						<td class="d-flex gap-2" v-if="vehiculo.id !== 1" @click.stop>
							<router-link :to="{ name: 'editarVehiculo', params: { id: vehiculo.id } }" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></router-link>
							<button class="btn btn-sm btn-outline-danger" @click.stop="eliminarVehiculo(vehiculo.id, vehiculo.placa, vehiculo.nombre_conductor)"><i class="bi bi-x-lg"></i></button>
						</td>
						<td v-else @click.stop></td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
</template>
