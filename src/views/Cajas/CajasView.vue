<template>
	<h1>Panel de caja chica</h1>

	<div class="row">
		<div class="col-md-10">
			<div class="card">
				<div class="card-body">
					<label for=""><i class="bi bi-funnel"></i> Búsqueda</label>
					<div class="row">
						<div class="col">
							<input type="date" class="form-control" v-model="dia" @change="cambiarDias()">
						</div>
						<div class="col">
							<select name="" id="sltUsuarios" class="form-select">
								<option value="-1">Todos los usuarios</option>
								<option value="-1">Administrador</option>
								<option value="-1">Roberto</option>
								<option value="-1">Úrsula</option>
							</select>
						</div>
						<div class="col-2">
							<button class="btn btn-outline-secondary"><i class="bi bi-search"></i> Buscar</button>
						</div>
						<div class="col d-flex justify-content-center">
							<router-link to="/caja/nueva" class="btn btn-outline-primary"><i class="bi bi-star"></i> Aperturar nueva caja</router-link>
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
						<th scope="col">Fecha apertura</th>
						<th scope="col">Fecha cierre</th>
						<th scope="col">Apertura</th>
						<th scope="col">Cierre</th>
						<th scope="col">Estado</th>
						<th scope="col">Obs</th>
						<th scope="col">Usuario</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(caja,index) in cajaStore.cajas" :key="caja.id">
						<td>{{index+1}}</td>
						<td>
							<router-link :to="{ name: 'detalleCaja', params: { id: caja.id } }">
								{{formatDate(caja.fecha_apertura)}}
							</router-link>
						</td>
						<td>{{formatDate(caja.fecha_cierre)}}</td>
						<td>{{ formatMoneda(caja.monto_inicial) }}</td>
						<td>{{ formatMoneda(caja.monto_final) }}</td>
						<td class="text-capitalize">{{caja.estado}}</td>
						<td>{{ caja.observaciones }}</td>
						<td class="text-capitalize">{{caja.usuario.nombre}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useCajaStore } from '@/stores/cajaStore';
import { useFormat } from '@/composables/formatos'
const { formatDate, formatMoneda, formatHoy } = useFormat()

const cajaStore = useCajaStore()
const dia = ref(formatHoy())

const cambiarDias = ()=>{
	cajaStore.obtenerCajasPorDia(dia.value)
}

onMounted(() => {
	cajaStore.obtenerCajas()
});


</script>