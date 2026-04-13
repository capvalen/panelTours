<script setup>
import { reactive, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGuiasStore } from '@/stores/guiaStore'
import Swal from 'sweetalert2'
import { useFormat } from '@/composables/formatos'

const route = useRoute()
const guiaStore = useGuiasStore()
const { listaDepartamentos } = useFormat()
const departamentos = ref([])
const nuevo = reactive({})

const cargarDatos = async () => {
	await guiaStore.obtenerPorId(route.params.id)
	Object.assign(nuevo, guiaStore.guiaActual)
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
	if (nuevo.dni == '' || nuevo.nombre == '') {
		Swal.fire('Error', 'Por favor complete los campos obligatorios (DNI y nombre)', 'error')
		return
	}

	guiaStore.actualizar(nuevo.id, nuevo)
		.then(resp => {
			if (parseInt(resp.id) > 0)
				Swal.fire('Guía actualizado', `El guía "${nuevo.nombre}" ha sido actualizado`, 'success')
					.then(() => {
						window.location.href = '/guia/perfil/' + resp.id
					})
			else
				Swal.fire('Error', 'Error al actualizar guía', 'error')
		})
		.catch(error => {
			console.error(error)
			Swal.fire('Error', 'Error al actualizar guía', 'error')
		})
}
</script>
<template>
	<h1>Editar Guía</h1>

	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="/"><i class="bi bi-house"></i></a></li>
			<li class="breadcrumb-item"><a href="/guias">Guías</a></li>
			<li class="breadcrumb-item active" aria-current="page">Editar</li>
		</ol>
	</nav>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Datos personales</strong></h5>
					<div class="row mb-3">
						<div class="col-md-4">
							<label for="dni" class="form-label">DNI <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="dni" v-model="nuevo.dni">
						</div>
						<div class="col-md-4">
							<label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
							<input type="text" class="form-control" id="nombre" v-model="nuevo.nombre">
						</div>
						<div class="col-md-4">
							<label for="celular" class="form-label">Celular</label>
							<input type="tel" class="form-control" id="celular" v-model="nuevo.celular">
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="contactoEmergencia" class="form-label">Contacto de emergencia</label>
							<input type="text" class="form-control" id="contactoEmergencia" v-model="nuevo.contacto_emergencia">
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
				</div>
			</div>
		</div>
	</div>

	<div class="row my-2">
		<div class="col-8 mx-auto">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4"><strong>Información profesional</strong></h5>
					<div class="row mb-3">
						<div class="col-md-6">
							<label for="especialidad" class="form-label">Especialidad</label>
							<input type="text" class="form-control" id="especialidad" v-model="nuevo.especialidad">
						</div>
						<div class="col-md-6">
							<label for="idiomas" class="form-label">Idiomas</label>
							<input type="text" class="form-control" id="idiomas" v-model="nuevo.idiomas">
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-8 mx-auto">
			<div class="d-grid">
				<button type="submit" class="btn btn-primary" @click="guardar()">Actualizar guía</button>
			</div>
		</div>
	</div>
</template>
