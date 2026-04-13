<script setup>
import { reactive, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHospedajesStore } from '@/stores/hospedajeStore'
import Swal from 'sweetalert2'
import { useFormat } from '@/composables/formatos'

const route = useRoute()
const hospedajeStore = useHospedajesStore()
const nuevo = reactive({})
const { listaDepartamentos } = useFormat();
const departamentos = ref([])

const cargarDatos = async () => {
	await hospedajeStore.obtenerPorId(route.params.id)
	Object.assign(nuevo, hospedajeStore.hospedajeActual)
}

onMounted(async () => {
	cargarDatos()
	departamentos.value = await listaDepartamentos()
})

watch(
	route.params.id, (newId) => {
		cargarDatos()
	},
	{ immediate: true }
)

function guardar() {
	if (nuevo.ruc == '' || nuevo.hospedaje == '') {
		Swal.fire('Error', 'Por favor complete los campos obligatorios (RUC y nombre del hospedaje)', 'error')
		return
	}

	hospedajeStore.actualizar(nuevo.id, nuevo)
		.then(resp => {
			if (parseInt(resp.id) > 0)
				Swal.fire('Hospedaje actualizado', `El hospedaje "${nuevo.hospedaje}" ha sido actualizado`, 'success')
					.then(() => {
						window.location.href = '/hospedaje/perfil/' + resp.id
					})
			else
				Swal.fire('Error', 'Error al actualizar hospedaje', 'error')
		})
		.catch(error => {
			console.error(error)
			Swal.fire('Error', 'Error al actualizar hospedaje', 'error')
		})
}
</script>
<template>
	<h1>Editar Hospedaje</h1>

	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/hospedajes">Hospedajes</a></li>
			<li class="breadcrumb-item active" aria-current="page">Editar</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos del hospedaje</strong></h5>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="ruc" class="form-label">R.U.C. <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="ruc" v-model="nuevo.ruc">
						</div>
						<div class="col-md-6">
							<label for="hospedaje" class="form-label">Nombre del hospedaje <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="hospedaje" v-model="nuevo.hospedaje">
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-6">
							<label for="direccion" class="form-label">Dirección</label>
							<input type="text" class="form-control" id="direccion" v-model="nuevo.direccion">
						</div>
						<div class="col-md-6">
							<label for="departamento" class="form-label">Departamento</label>
							<select class="form-select" id="departamento" v-model="nuevo.departamento_id">
								<option value="">Seleccionar...</option>
								<option v-for="depto in departamentos" :key="depto.id" :value="depto.id">
									{{ depto.departamento }}
								</option>
							</select>
						</div>
					</div>

					<div class="row mb-3">
						<div class="col-md-4">
							<label for="contacto" class="form-label">Contacto</label>
							<input type="text" class="form-control" id="contacto" v-model="nuevo.contacto">
						</div>
						<div class="col-md-4">
							<label for="celular" class="form-label">Celular</label>
							<input type="tel" class="form-control" id="celular" v-model="nuevo.celular">
						</div>
						<div class="col-md-4">
							<label for="correo" class="form-label">Correo</label>
							<input type="email" class="form-control" id="correo" v-model="nuevo.correo">
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
					<h5 class="mb-4"><strong>Servicios incluidos</strong></h5>
					<div class="row mb-3">
						<div class="col-md-4">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="incluyeDesayuno" v-model="nuevo.incluye_desayuno">
								<label class="form-check-label" for="incluyeDesayuno">Incluye desayuno</label>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="incluyeEstacionamiento" v-model="nuevo.incluye_estacionamiento">
								<label class="form-check-label" for="incluyeEstacionamiento">Incluye estacionamiento</label>
							</div>
						</div>
						<div class="col-md-4">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="incluyeWifi" v-model="nuevo.incluye_wifi">
								<label class="form-check-label" for="incluyeWifi">Incluye WiFi</label>
							</div>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-12">
							<label for="serviciosExtra" class="form-label">Servicios extra</label>
							<textarea class="form-control" id="serviciosExtra" rows="3" v-model="nuevo.servicios_extra"></textarea>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary" @click="guardar()">Actualizar hospedaje</button>
			</div>
		</div>
	</div>
</template>
