<script setup>
import { useProveedoresStore } from '@/stores/proveedorStore';
import { useDepartamentosStore } from '@/stores/departamentoStore';
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2'
/* import { storeToRefs } from 'pinia'; */

const proveedorStore = useProveedoresStore();
const departamentosStore = useDepartamentosStore();
/* const { clientes } = storeToRefs(clienteStore); */
const texto = ref('');
const departamentoId = ref('');
const nombreDepartamento = (departamento_id) => {
	const depto = departamentosStore.departamentos.find(d => Number(d.id) === Number(departamento_id));
	return depto ? depto.departamento : '-';
};

function eliminarProveedor(id, razonSocial, apellidos) {
	if( confirm(`¿Confirma que desea eliminar al proveedor ${razonSocial ? razonSocial : apellidos}?`) ){
		proveedorStore.eliminar(id)
			.then( resp => {
				if(resp)
					Swal.fire('Proveedor eliminado', `El proveedor ${razonSocial ? razonSocial : apellidos} ha sido eliminado`, 'success')
				else
					Swal.fire('Error', 'Error al eliminar proveedor', 'error')
			})
			.catch( error => {
				console.error(error)
				Swal.fire('Error', 'Error al eliminar proveedor', 'error')
			})
	}
}
function buscar() {
	const filtros = {};
	if (departamentoId.value) filtros.departamento_id = departamentoId.value;

	if(texto.value.trim() == ''){
		proveedorStore.listar(filtros)
	}else{
		proveedorStore.buscar(texto.value, filtros)
	}
}

onMounted(() => {
	departamentosStore.listar();
	proveedorStore.listar();
})
</script>
<template>
	<h1>Panel de proveedores</h1>

	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col-12 col-md my-1">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="Ruc, Razón social o celular" v-model="texto">
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
						<div class="col-5 col-md">
							<div><button class="btn btn-outline-secondary" @click="buscar"><i class="bi bi-search"></i> Buscar</button></div>
						</div>
						<div class="col d-flex justify-content-center">
							<div>
								<router-link to="/proveedor/nuevo" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo proveedor</router-link>
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
							<th scope="col">Razón Social</th>
							<th scope="col">Contacto</th>
							<th scope="col">Celular</th>
							<th scope="col">Categoría</th>
							<th scope="col">Departamento</th>
							<th>@</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(proveedor, index ) in proveedorStore.proveedores">
							<td>{{ index + 1 }}</td>
							<td>
								<router-link :to="{ name: 'perfilProveedor', params: { id: proveedor.id } }">
									{{ proveedor.ruc }}
								</router-link>
							</td>
							<td>{{ proveedor.razon_social }}</td>
							<td>{{ proveedor.contacto }}</td>
							<td>{{ proveedor.celular }}</td>
							<td class="text-capitalize">{{ proveedor.categoria }}</td>
							<td>{{ nombreDepartamento(proveedor.departamento_id) }}</td>
							<td class="d-flex gap-2" v-if="proveedor.id != 1">
								<router-link :to="{ name: 'editarProveedor', params: { id: proveedor.id } }" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></router-link>
								<button class="btn btn-sm btn-outline-danger" @click="eliminarProveedor(proveedor.id, proveedor.razon_social, proveedor.apellidos)"><i class="bi bi-x-lg"></i></button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
