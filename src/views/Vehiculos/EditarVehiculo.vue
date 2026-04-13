<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useVehiculosStore } from '@/stores/vehiculoStore'
import Swal from 'sweetalert2'

const route = useRoute()
const vehiculoStore = useVehiculosStore()
const nuevo = reactive({})

const cargarDatos = async () => {
	await vehiculoStore.obtenerPorId(route.params.id)
	Object.assign(nuevo, vehiculoStore.vehiculoActual)
}

onMounted(() => {
	cargarDatos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	},
	{ immediate: true }
)

function guardar() {
	if (nuevo.placa == '' || nuevo.nombre_conductor == '') {
		Swal.fire('Error', 'Por favor complete los campos obligatorios (placa y nombre del conductor)', 'error')
		return
	}

	vehiculoStore.actualizar(nuevo.id, nuevo)
		.then(resp => {
			if (parseInt(resp.id) > 0)
				Swal.fire('Vehículo actualizado', `El vehículo con placa ${nuevo.placa} ha sido actualizado`, 'success')
					.then(() => {
						window.location.href = '/vehiculo/perfil/' + resp.id
					})
			else
				Swal.fire('Error', 'Error al actualizar vehículo', 'error')
		})
		.catch(error => {
			console.error(error)
			Swal.fire('Error', 'Error al actualizar vehículo', 'error')
		})
}
</script>
<template>
	<h1>Editar Vehículo</h1>

	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/vehiculos">Vehículos</a></li>
			<li class="breadcrumb-item active" aria-current="page">Editar</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos del vehículo</strong></h5>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="tipoVehiculo" class="form-label">Tipo de vehículo <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="tipoVehiculo" v-model="nuevo.tipo_vehiculo">
						</div>
						<div class="col-md-6">
							<label for="placa" class="form-label">Placa <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="placa" v-model="nuevo.placa">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-4">
							<label for="tipoCombustible" class="form-label">Tipo de combustible</label>
							<select class="form-select" id="tipoCombustible" v-model="nuevo.tipo_combustible">
								<option value="gasolina">Gasolina</option>
								<option value="diesel">Diésel</option>
								<option value="electrico">Eléctrico</option>
								<option value="hibrido">Híbrido</option>
							</select>
						</div>
						<div class="col-md-4">
							<div class="form-check form-switch mt-4">
								<input class="form-check-input" type="checkbox" id="incluyeSeguro" v-model="nuevo.incluye_seguro">
								<label class="form-check-label" for="incluyeSeguro">Incluye seguro</label>
							</div>
						</div>
						<div class="col-md-4">
							<label for="seguro" class="form-label">Seguro</label>
							<input type="text" class="form-control" id="seguro" v-model="nuevo.seguro">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos del conductor</strong></h5>
					<div class="row mb-3">
						<div class="col-md-4">
							<label for="dniConductor" class="form-label">DNI conductor</label>
							<input type="text" class="form-control" id="dniConductor" v-model="nuevo.dni_conductor">
						</div>
						<div class="col-md-4">
							<label for="nombreConductor" class="form-label">Nombre del conductor <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="nombreConductor" v-model="nuevo.nombre_conductor">
						</div>
						<div class="col-md-4">
							<label for="licenciaConductor" class="form-label">Licencia conductor</label>
							<input type="text" class="form-control" id="licenciaConductor" v-model="nuevo.licencia_conductor">
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-md-4">
							<label for="edadConductor" class="form-label">Edad del conductor</label>
							<input type="number" class="form-control" id="edadConductor" v-model="nuevo.edad_conductor">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Adicionales</strong></h5>
					<div class="row mb-3">
						<div class="col-md-4">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="incluyeGps" v-model="nuevo.incluye_gps">
								<label class="form-check-label" for="incluyeGps">Incluye GPS</label>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="incluyeSillaBebe" v-model="nuevo.incluye_silla_bebe">
								<label class="form-check-label" for="incluyeSillaBebe">Incluye silla de bebé</label>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="aceptaMascotas" v-model="nuevo.acepta_mascotas">
								<label class="form-check-label" for="aceptaMascotas">Acepta mascotas</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary" @click="guardar()">Actualizar vehículo</button>
			</div>
		</div>
	</div>
</template>
