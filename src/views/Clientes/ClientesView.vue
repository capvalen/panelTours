<script setup>
import { useClienteStore } from '@/stores/clienteStore';
import { onMounted, reactive } from 'vue';
import Swal from 'sweetalert2'
/* import { storeToRefs } from 'pinia'; */

const clienteStore = useClienteStore();
/* const { clientes } = storeToRefs(clienteStore); */
const texto =reactive('')

function eliminarCliente(id, razonSocial, apellidos) {
	if( confirm(`¿Confirma que desea eliminar al cliente ${razonSocial ? razonSocial : apellidos}?`) ){
		clienteStore.eliminarCliente(id)
			.then( resp => {
				if(resp.message == 'Cliente eliminado')
					Swal.fire('Cliente eliminado', `El cliente ${razonSocial ? razonSocial : apellidos} ha sido eliminado`, 'success')
				else
					Swal.fire('Error', 'Error al eliminar cliente', 'error')
			})
			.catch( error => {
				console.error(error)
				Swal.fire('Error', 'Error al eliminar cliente', 'error')
			})
	}
}
function buscar() {
	if(texto.trim() == ''){
		clienteStore.listarClientes()
	}else{
		clienteStore.buscarClientes(texto)
	}
}

onMounted(() => {
	clienteStore.listarClientes()
})
</script>

<template>
	<h1>Panel de clientes</h1>

	<div class="row">
		<div class="col-md-9">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<div class="input-group">
								<input type="text" class="form-control" placeholder="Apellidos, nombres, dni o celular" v-model="texto">
								<button class="btn btn-outline-secondary" @click="buscar()"><i class="bi bi-search"></i> Buscar</button>
							</div>
						</div>
						<div class="col-3 d-flex justify-content-center">
							<router-link to="/cliente/nuevo" class="btn btn-outline-primary"><i class="bi bi-star"></i> Nuevo cliente</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col">
			<p>Últimos registrados</p>
			<pre>{{clientes}}</pre>
			<table class="table-hover table">
				<thead>
					<tr>
						<th>#</th>
						<th>Nombres / Razón social</th>
						<th>DNI / RUC</th>
						<th>Celular</th>
						<th>Teléfono</th>
						<th>Nacionalidad</th>
						<th>@</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(cliente, index ) in clienteStore.clientes" :key="cliente.id">
						<td>{{index+1}}</td>
						<td>
							<router-link :to="{ name: 'perfilCliente', params: { id: cliente.id } }">
								<span v-if="cliente.razon_social">{{ cliente.razon_social }}</span>
								<span v-else>{{ cliente.apellidos }} {{ cliente.nombres }}</span>
							</router-link>
						</td>
						<td>
							<span v-if="cliente.ruc">{{ cliente.ruc }}</span>
							<span v-else>{{ cliente.dni }}</span>
						</td>
						<td>{{cliente.celular}}</td>
						<td>{{cliente.telefono}}</td>
						<td class="text-capitalize">{{cliente.nacionalidad}} <span v-if="cliente.pais_origen">({{ cliente.pais_origen }})</span></td>
						<td class="d-flex gap-2" v-if="cliente.id>1">
							<router-link :to="{ name: 'editarCliente', params: { id: cliente.id } }" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></router-link>
							<button class="btn btn-sm btn-outline-danger" @click="eliminarCliente(cliente.id, cliente.razon_social, cliente.apellidos)"><i class="bi bi-folder-x"></i></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

</template>